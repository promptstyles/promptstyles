#!/usr/bin/env node
// Turns a "Sign the manifesto" issue into manifesto/signatories/<login>.yaml.
// Runs in .github/workflows/sign.yml. It has no dependencies so the workflow stays fast.
//
// The issue body is untrusted input: it is parsed here, never interpolated into a shell.
// The author's GitHub login (from the event payload) is the verified identity.
//
// Outputs (to $GITHUB_OUTPUT): status = signed | updated | review | invalid, and file.
// It also writes the reply for the issue to $COMMENT_FILE.
//
// Local dry run:
//   GITHUB_EVENT_PATH=event.json ACCOUNT_CREATED_AT=2020-01-01 node scripts/sign.mjs

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SIGNATORIES_DIR = join(ROOT, 'manifesto', 'signatories');
export const MIN_ACCOUNT_AGE_DAYS = 30;
export const APPROVED_LABEL = 'approved';

const LOGIN_RE = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;

/** Issue form labels start with these words (see .github/ISSUE_TEMPLATE/sign.yml). */
export const FIELDS = {
  name: 'Name',
  role: 'Role',
  title: 'Job title',
  company: 'Company',
  location: 'Location',
  link: 'Link',
  agreement: 'Agreement',
};

const LIMITS = { name: 80, title: 80, company: 80, location: 60, link: 200 };

/** Splits an issue form body into { "Heading": "value" }. */
export function parseIssueForm(body = '') {
  const out = {};
  const parts = String(body).replace(/\r\n/g, '\n').split(/^### +/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const value = nl === -1 ? '' : part.slice(nl + 1).trim();
    out[heading] = value === '_No response_' ? '' : value;
  }
  return out;
}

/** Removes control and bidi characters, collapses whitespace and trims to `max` characters. */
export function clean(value, max = 80) {
  if (!value) return '';
  return String(value)
    .normalize('NFC')
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
    .trim();
}

function field(form, prefix) {
  const key = Object.keys(form).find((k) => k.toLowerCase().startsWith(prefix.toLowerCase()));
  return key === undefined ? '' : form[key];
}

export function parseRole(value) {
  const v = String(value).toLowerCase();
  if (v.startsWith('engineering')) return 'engineering';
  if (v.startsWith('people')) return 'people';
  return 'other';
}

export function parseLink(value) {
  const v = clean(value, LIMITS.link);
  if (!v) return { link: '' };
  try {
    const url = new URL(v);
    if (url.protocol !== 'https:' || !url.hostname.includes('.')) throw new Error('not https');
    return { link: url.href };
  } catch {
    return { link: '', ignored: v };
  }
}

/** Reads the form fields. Returns { fields, errors, notes }. */
export function readForm(body) {
  const form = parseIssueForm(body);
  const errors = [];
  const notes = [];

  const name = clean(field(form, FIELDS.name), LIMITS.name);
  if (!name) errors.push('The name is missing. / O nome está vazio.');
  else if (/https?:\/\/|www\./i.test(name)) errors.push('The name cannot be a link. / O nome não pode ser um link.');

  const agreement = field(form, FIELDS.agreement);
  if (!/-\s*\[x\]/i.test(agreement)) errors.push('The agreement box is not checked. / A caixa de concordância não foi marcada.');

  const { link, ignored } = parseLink(field(form, FIELDS.link));
  if (ignored) notes.push('The link was ignored because it does not start with https://. / O link foi ignorado porque não começa com https://.');

  const fields = {
    name,
    role: parseRole(field(form, FIELDS.role)),
    title: clean(field(form, FIELDS.title), LIMITS.title),
    company: clean(field(form, FIELDS.company), LIMITS.company),
    location: clean(field(form, FIELDS.location), LIMITS.location),
    link,
  };
  return { fields, errors, notes };
}

/** Serializes a flat object as YAML. JSON strings are valid YAML scalars, so values are always safely quoted. */
export function toYaml(obj) {
  return (
    Object.entries(obj)
      .filter(([, v]) => v !== '' && v !== undefined && v !== null)
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : JSON.stringify(String(v))}`)
      .join('\n') + '\n'
  );
}

function readExisting(file) {
  if (!existsSync(file)) return undefined;
  const text = readFileSync(file, 'utf8');
  const get = (k) => text.match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'))?.[1];
  return { signed_at: get('signed_at'), issue: Number(get('issue')) || undefined };
}

/**
 * Decides what to do with an issue. Pure apart from reading an existing signature file.
 * `accountCreatedAt` is the ISO date the GitHub account was created.
 */
export function decide({ issue, accountCreatedAt, now = new Date(), dir = SIGNATORIES_DIR }) {
  const login = issue?.user?.login ?? '';
  const mention = `@${login}`;

  if (!LOGIN_RE.test(login) || issue.user.type !== 'User') {
    return { status: 'invalid', comment: 'Only personal GitHub accounts can sign. / Só contas pessoais do GitHub podem assinar.' };
  }

  const { fields, errors, notes } = readForm(issue.body);
  if (errors.length) {
    return {
      status: 'invalid',
      comment: [
        `Thanks ${mention}, but the signature could not be recorded: / Obrigado ${mention}, mas a assinatura não pôde ser registrada:`,
        '',
        ...errors.map((e) => `- ${e}`),
        '',
        'Please open a new signature issue. / Por favor, abra uma nova issue de assinatura.',
      ].join('\n'),
    };
  }

  const approved = (issue.labels ?? []).some((l) => (typeof l === 'string' ? l : l.name) === APPROVED_LABEL);
  const ageDays = accountCreatedAt ? (now - new Date(accountCreatedAt)) / 86_400_000 : 0;
  if (!approved && !(ageDays >= MIN_ACCOUNT_AGE_DAYS)) {
    return {
      status: 'review',
      comment: [
        `Thanks ${mention}! Your GitHub account is less than ${MIN_ACCOUNT_AGE_DAYS} days old, so a maintainer will review this signature before adding it. They will add the \`${APPROVED_LABEL}\` label when it is ready.`,
        '',
        `Obrigado ${mention}! Sua conta do GitHub tem menos de ${MIN_ACCOUNT_AGE_DAYS} dias, então um mantenedor vai revisar a assinatura antes de adicioná-la, aplicando a label \`${APPROVED_LABEL}\`.`,
      ].join('\n'),
    };
  }

  const file = join(dir, `${login.toLowerCase()}.yaml`);
  const existing = readExisting(file);
  const signatory = {
    github: login,
    name: fields.name,
    role: fields.role,
    title: fields.title,
    company: fields.company,
    location: fields.location,
    link: fields.link,
    signed_at: existing?.signed_at || now.toISOString().slice(0, 10),
    issue: existing?.issue || issue.number,
  };

  const status = existing ? 'updated' : 'signed';
  const comment = [
    status === 'signed'
      ? `Thank you ${mention}, your signature was recorded. It will appear on the site in a few minutes. / Obrigado ${mention}, sua assinatura foi registrada. Ela aparece no site em alguns minutos.`
      : `Thanks ${mention}, your signature was updated. / Obrigado ${mention}, sua assinatura foi atualizada.`,
    ...notes.map((n) => `\n> ${n}`),
  ].join('\n');

  return { status, comment, file, content: toYaml(signatory) };
}

async function fetchAccountCreatedAt(login, token) {
  if (process.env.ACCOUNT_CREATED_AT) return process.env.ACCOUNT_CREATED_AT;
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'promptstyles-sign',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status} for user ${login}`);
  return (await res.json()).created_at;
}

function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  else console.log(`${key}=${value}`);
}

async function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is not set');
  const { issue } = JSON.parse(readFileSync(eventPath, 'utf8'));
  if (!issue) throw new Error('The event has no issue');

  const login = issue.user?.login ?? '';
  const createdAt = LOGIN_RE.test(login) ? await fetchAccountCreatedAt(login, process.env.GITHUB_TOKEN) : undefined;
  const result = decide({ issue, accountCreatedAt: createdAt });

  if (result.file) {
    mkdirSync(dirname(result.file), { recursive: true });
    writeFileSync(result.file, result.content);
    setOutput('file', result.file.slice(ROOT.length + 1));
  }
  setOutput('status', result.status);

  const commentFile = process.env.COMMENT_FILE;
  if (commentFile) writeFileSync(commentFile, result.comment + '\n');
  else console.log(`\n${result.comment}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
