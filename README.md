# Prompt Styles

**An open manifesto, taxonomy and rubric for building software with AI, and for evaluating the people who do it.**

[promptstyles.org](https://promptstyles.org) · [Manifesto](manifesto/MANIFESTO.md) · [Manifesto em português](manifesto/MANIFESTO.pt-BR.md) · [Sign it](https://promptstyles.org/sign)

> 🇧🇷 Um manifesto, uma taxonomia e uma rubrica abertos para padronizar como engenheiros trabalham com IA e como empresas avaliam isso em entrevistas. O site é bilíngue (inglês e português) e qualquer pessoa com conta no GitHub pode assinar.

---

## Why

AI changed how software gets written, and technical interviews did not keep up. Some companies ban AI in interviews, others allow it with no criteria, and candidates rarely know what is being evaluated. This project gives everyone a shared vocabulary and a rubric they can use tomorrow:

- **The manifesto**: six short principles that engineers and people who hire engineers can sign.
- **The taxonomy**: eight prompt styles (declarative, imperative, vibe coding, spec-driven, test-driven, example-based, iterative, context engineering), each with a definition, an example prompt, what it reveals about the person using it, interview questions and the origin of the term with sources.
- **The rubric**: two readings for every candidate, the level (AI User, AI-Assisted, AI-Native, AI Leader) and the focus on a business ↔ tech axis (Business Operator, Business Builder, Product Engineer, Software Engineer, Architect). Six dimensions, a 65-minute interview script, a scoring calculator and a preparation guide for candidates.

## What is in this repo

```
.
├── apps/web/               The site (Astro, fully static, deployed to GitHub Pages)
├── taxonomy/               The taxonomy, as data (package @promptstyles/taxonomy)
│   ├── taxonomy.yaml       Version, map axes and the shared example scenario
│   ├── styles/*.yaml       One file per prompt style
│   ├── rubric.yaml         Levels, dimensions, interview script, preparation guide
│   └── schemas/            JSON Schemas for all of the above
├── manifesto/
│   ├── MANIFESTO.md        The manifesto (English)
│   ├── MANIFESTO.pt-BR.md  The manifesto (Portuguese)
│   ├── signatories/        One YAML file per person who signed
│   └── signatory.schema.json
├── scripts/
│   ├── validate.mjs        Validates every YAML file against its schema
│   ├── sign.mjs            Turns a signature issue into a signatory file (+ tests)
│   └── og/                 Template for the social share images
└── .github/
    ├── ISSUE_TEMPLATE/     Signature form and proposal form
    └── workflows/          validate, deploy, sign, labels
```

The site reads the YAML and Markdown at build time, so it is never out of sync with the data.

## How signing works

No backend, no OAuth app. The GitHub account that opens the issue is the proof of identity.

1. The "Sign with GitHub" button (or [promptstyles.org/sign](https://promptstyles.org/sign)) opens a pre-filled issue form.
2. The [Sign workflow](.github/workflows/sign.yml) parses the issue with [scripts/sign.mjs](scripts/sign.mjs), writes `manifesto/signatories/<login>.yaml`, commits it, replies and closes the issue.
3. It then triggers the [Deploy workflow](.github/workflows/deploy.yml), which rebuilds the site with the new count and name.

Anti-abuse rules:

- One signature per GitHub account. Signing again updates the existing entry.
- Accounts younger than 30 days get the `needs-review` label. A maintainer adds `approved` to accept them.
- Bots cannot sign. Links must be `https://`. The issue text is treated as untrusted input and is never run in a shell.
- Every signature is a commit, so the list is public and auditable.

Signatures are personal. Company names are shown for identification only.

## Use the taxonomy

- Read it on [promptstyles.org/styles](https://promptstyles.org/styles/).
- Fetch it as JSON: [`/taxonomy.json`](https://promptstyles.org/taxonomy.json) (styles and rubric) and [`/signatories.json`](https://promptstyles.org/signatories.json).
- Use the YAML files in [`taxonomy/`](taxonomy/) directly. They are validated by the schemas in [`taxonomy/schemas/`](taxonomy/schemas/).

## Develop

Requires Node.js 22.23 or newer (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # check the taxonomy, rubric and signatories
npm test           # tests for the signing script
npm run build      # validate and build the site into apps/web/dist
npm run og         # regenerate the share images (needs Google Chrome)
```

## Deploy

1. Push this repository to GitHub. The default branch must be `main`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The [Labels workflow](.github/workflows/labels.yml) creates the `signature`, `needs-review`, `approved` and `taxonomy` labels on the first push. If it did not run, start it from the **Actions** tab. The signature form only works once the `signature` label exists.
4. Every push to `main` deploys the site. Until a custom domain is set it lives at `https://<owner>.github.io/<repo>/`.
5. Custom domain: `promptstyles.org` is registered at GoDaddy. The apex has GitHub Pages A and AAAA records, `www` is a CNAME to `promptstyles.github.io`, and the domain is verified in the organization settings. See the [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

The sign button links to the repository the site was built from (`GITHUB_REPOSITORY` in CI). For local development it falls back to the value in [`apps/web/astro.config.mjs`](apps/web/astro.config.mjs).

## Contribute

Proposals for new styles, better definitions, translations and sources are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

- Manifesto, taxonomy and rubric: [CC BY 4.0](LICENSE-CONTENT.md). Use and adapt them freely, with credit.
- Code: [MIT](LICENSE).
