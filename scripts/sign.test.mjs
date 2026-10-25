import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';
import { FIELDS, clean, decide, parseIssueForm, readForm, toYaml } from './sign.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOW = new Date('2026-10-25T12:00:00Z');
const OLD_ACCOUNT = '2019-03-01T00:00:00Z';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateSignatory = ajv.compile(JSON.parse(readFileSync(join(ROOT, 'manifesto', 'signatory.schema.json'), 'utf8')));

function body({
  name = 'Ada Lovelace',
  role = 'Engineering / Engenharia',
  title = 'Staff Engineer',
  company = '_No response_',
  location = 'London',
  link = '_No response_',
  agreed = true,
} = {}) {
  return [
    '### Name / Nome',
    '',
    name,
    '',
    '### Role / Área',
    '',
    role,
    '',
    '### Job title / Cargo (optional)',
    '',
    title,
    '',
    '### Company / Empresa (optional)',
    '',
    company,
    '',
    '### Location / Localização (optional)',
    '',
    location,
    '',
    '### Link (optional)',
    '',
    link,
    '',
    '### Agreement / Concordância',
    '',
    `- [${agreed ? 'X' : ' '}] I have read the manifesto and I sign it as an individual. / Li o manifesto e assino como pessoa física.`,
  ].join('\n');
}

function issue(overrides = {}) {
  return {
    number: 7,
    body: body(),
    user: { login: 'ada-l', type: 'User' },
    labels: [{ name: 'signature' }],
    ...overrides,
  };
}

const tmp = () => mkdtempSync(join(tmpdir(), 'sign-'));

test('every field in the issue template is recognized by the script', () => {
  const template = parse(readFileSync(join(ROOT, '.github', 'ISSUE_TEMPLATE', 'sign.yml'), 'utf8'));
  const labels = template.body.filter((b) => b.type !== 'markdown').map((b) => b.attributes.label);
  for (const prefix of Object.values(FIELDS)) {
    assert.ok(
      labels.some((l) => l.startsWith(prefix)),
      `no template label starts with "${prefix}"`,
    );
  }
  assert.equal(labels.length, Object.keys(FIELDS).length);
});

test('parses an issue form body', () => {
  const form = parseIssueForm(body());
  assert.equal(form['Name / Nome'], 'Ada Lovelace');
  assert.equal(form['Company / Empresa (optional)'], '');
  const { fields, errors } = readForm(body());
  assert.deepEqual(errors, []);
  assert.equal(fields.role, 'engineering');
  assert.equal(fields.title, 'Staff Engineer');
});

test('maps roles', () => {
  assert.equal(readForm(body({ role: 'People, HR or recruiting / People, RH ou recrutamento' })).fields.role, 'people');
  assert.equal(readForm(body({ role: 'Other / Outra' })).fields.role, 'other');
});

test('a valid issue from an established account is signed', () => {
  const dir = tmp();
  const r = decide({ issue: issue(), accountCreatedAt: OLD_ACCOUNT, now: NOW, dir });
  assert.equal(r.status, 'signed');
  assert.equal(r.file, join(dir, 'ada-l.yaml'));
  const data = parse(r.content);
  assert.ok(validateSignatory(data), JSON.stringify(validateSignatory.errors));
  assert.deepEqual(data, {
    github: 'ada-l',
    name: 'Ada Lovelace',
    role: 'engineering',
    title: 'Staff Engineer',
    location: 'London',
    signed_at: '2026-10-25',
    issue: 7,
  });
});

test('the file name is the lowercase login', () => {
  const r = decide({ issue: issue({ user: { login: 'Ada-L', type: 'User' } }), accountCreatedAt: OLD_ACCOUNT, now: NOW, dir: tmp() });
  assert.match(r.file, /ada-l\.yaml$/);
  assert.equal(parse(r.content).github, 'Ada-L');
});

test('new accounts go to review unless approved', () => {
  const recent = '2026-10-10T00:00:00Z';
  const review = decide({ issue: issue(), accountCreatedAt: recent, now: NOW, dir: tmp() });
  assert.equal(review.status, 'review');
  assert.equal(review.file, undefined);

  const approved = decide({
    issue: issue({ labels: [{ name: 'signature' }, { name: 'approved' }] }),
    accountCreatedAt: recent,
    now: NOW,
    dir: tmp(),
  });
  assert.equal(approved.status, 'signed');
});

test('an unknown account age goes to review', () => {
  assert.equal(decide({ issue: issue(), accountCreatedAt: undefined, now: NOW, dir: tmp() }).status, 'review');
});

test('rejects missing agreement, missing name, links as names and bots', () => {
  const opts = { accountCreatedAt: OLD_ACCOUNT, now: NOW, dir: tmp() };
  assert.equal(decide({ issue: issue({ body: body({ agreed: false }) }), ...opts }).status, 'invalid');
  assert.equal(decide({ issue: issue({ body: body({ name: '_No response_' }) }), ...opts }).status, 'invalid');
  assert.equal(decide({ issue: issue({ body: body({ name: 'https://spam.example' }) }), ...opts }).status, 'invalid');
  assert.equal(decide({ issue: issue({ user: { login: 'dependabot[bot]', type: 'Bot' } }), ...opts }).status, 'invalid');
  assert.equal(decide({ issue: issue({ body: 'random text' }), ...opts }).status, 'invalid');
});

test('updating keeps the original date and issue', () => {
  const dir = tmp();
  writeFileSync(join(dir, 'ada-l.yaml'), 'github: "ada-l"\nname: "Ada"\nrole: "engineering"\nsigned_at: "2026-01-02"\nissue: 3\n');
  const r = decide({ issue: issue({ number: 42 }), accountCreatedAt: OLD_ACCOUNT, now: NOW, dir });
  assert.equal(r.status, 'updated');
  const data = parse(r.content);
  assert.equal(data.signed_at, '2026-01-02');
  assert.equal(data.issue, 3);
  assert.equal(data.name, 'Ada Lovelace');
});

test('hostile input is neutralized', () => {
  const nasty = 'Eve "\u202Eevil\u202C"\nrole: admin\u0000 ' + 'x'.repeat(200);
  const r = decide({
    issue: issue({ body: body({ name: nasty, company: 'Acme: "Inc"\n- injected' }) }),
    accountCreatedAt: OLD_ACCOUNT,
    now: NOW,
    dir: tmp(),
  });
  assert.equal(r.status, 'signed');
  const data = parse(r.content);
  assert.ok(validateSignatory(data), JSON.stringify(validateSignatory.errors));
  assert.equal(data.role, 'engineering');
  assert.ok(data.name.length <= 80);
  assert.ok(!/[\u202E\u0000\n]/.test(data.name));
  assert.equal(Object.keys(data).length, 8);
});

test('only https links are kept', () => {
  const opts = { accountCreatedAt: OLD_ACCOUNT, now: NOW, dir: tmp() };
  const ok = decide({ issue: issue({ body: body({ link: 'https://www.linkedin.com/in/ada' }) }), ...opts });
  assert.equal(parse(ok.content).link, 'https://www.linkedin.com/in/ada');
  for (const bad of ['javascript:alert(1)', 'http://example.com', 'example.com', 'https://localhost']) {
    const r = decide({ issue: issue({ body: body({ link: bad }) }), ...opts });
    assert.equal(r.status, 'signed');
    assert.equal(parse(r.content).link, undefined, bad);
    assert.match(r.comment, /link was ignored/);
  }
});

test('clean and toYaml helpers', () => {
  assert.equal(clean('  a\t\tb\u200B c  '), 'a b c');
  assert.equal(clean('abcdef', 3), 'abc');
  assert.equal(toYaml({ a: 'x"y', b: '', c: 2 }), 'a: "x\\"y"\nc: 2\n');
});
