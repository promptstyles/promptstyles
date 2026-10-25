# Contributing

Thanks for helping. This project only works if it is shaped by the people who use it: engineers, interviewers and people who hire.

## Ways to help

- **Sign the manifesto** at [promptstyles.org/sign](https://promptstyles.org/sign).
- **Propose a new style** or a change to an existing one with the [proposal form](../../issues/new?template=propose-style.yml). Discuss it there first, then open a pull request.
- **Improve a definition, an example or a translation.** Small fixes can go straight to a pull request.
- **Fix or add sources** in the `origin` of a style. Primary sources beat secondary ones.
- **Improve the site or the scripts.** The code is in `apps/web` and `scripts`.

## Rules for the taxonomy

Each style lives in `taxonomy/styles/<id>.yaml` and is checked by `taxonomy/schemas/style.schema.json`.

- The file name must match the `id`.
- Every text exists in English (`en`) and Portuguese (`pt`). Lists must have the same number of items in both languages.
- The example prompt uses the shared scenario from `taxonomy/taxonomy.yaml` (the home page carousel), so styles can be compared side by side.
- In example prompts, lines starting with `> ` are the instruction sent to the model, and lines starting with `#` or `//` are context or comments. The site styles them differently.
- `origin` says who coined or popularized the term, when, and links to sources. Use "popularized by" unless the person clearly coined it. If nobody is credited, say so.
- `map` places the style on two axes from 0 to 100: `how` (describes the outcome → dictates the implementation) and `verification` (trusts the output → verifies against a contract). Positions are a judgment call: explain yours in the pull request.
- New styles start with `status: draft`. Maintainers move a style to `stable` after review.

The rubric lives in `taxonomy/rubric.yaml`. Every dimension needs one descriptor per level.

## Rules for the manifesto

People sign the manifesto text, so it changes rarely. Wording fixes are fine. Changes to the values or principles need an issue, a discussion and a new major version, and existing signatories should be told.

## Versioning

The taxonomy follows semantic versioning (`version` in `taxonomy/taxonomy.yaml`, history in [taxonomy/CHANGELOG.md](taxonomy/CHANGELOG.md)):

- **Patch**: typos, wording, translations, sources.
- **Minor**: a new style, a new rubric dimension, map changes.
- **Major**: changes that break consumers, such as renamed ids or schema changes, or a new manifesto text.

## Before you open a pull request

```bash
npm install
npm run validate
npm test
npm run build
```

The [Validate workflow](.github/workflows/validate.yml) runs the same checks on every pull request.

## Signatures by pull request

You can also sign by adding `manifesto/signatories/<your-github-login-in-lowercase>.yaml` yourself. It must follow `manifesto/signatory.schema.json`, and the pull request must come from the same GitHub account.

```yaml
github: "your-login"
name: "Your Name"
role: "engineering" # engineering | people | other
title: "Staff Engineer" # optional
company: "Acme" # optional, for identification only
location: "São Paulo, Brazil" # optional
link: "https://www.linkedin.com/in/you" # optional, https only
signed_at: "2026-10-25"
```

To remove your signature, open a pull request deleting your file, or an issue asking for it.

## Be kind

Disagree with ideas, not people. Assume good intent. Maintainers may close or lock threads that turn hostile.
