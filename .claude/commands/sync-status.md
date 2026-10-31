---
description: Update STATUS.md with what changed and sync the project row in the Notion project hub
---

Update STATUS.md with what changed since its last update, then sync this project's row in Notion. Reply to Marcus in Portuguese (pt-BR).

## 1. Find what changed

1. Read STATUS.md and take the date on the "Último update" line. That is the starting point.
2. Collect what happened since then:
   - `git log --since=<date> --pretty='%ad %h %s' --date=short`, plus `git status --short` for uncommitted work;
   - `gh issue list --repo promptstyles/promptstyles --state all --search "updated:>=<date>"` and `gh pr list --repo promptstyles/promptstyles --state all --search "updated:>=<date>"`;
   - the signature count, from `ls manifesto/signatories | wc -l`, and any issue labelled `needs-review` that still waits for `approved`;
   - the last deploy, from `gh run list --repo promptstyles/promptstyles --workflow deploy.yml --limit 1`;
   - the taxonomy version in `taxonomy/taxonomy.yaml` and the latest entry in `taxonomy/CHANGELOG.md`;
   - changes to `.github/workflows/` or `automation/n8n/`.
3. `notes/` is private and gitignored. You may read it for context, but never copy names of people or conversations from it.

## 2. Update STATUS.md

Keep the existing sections and their order: Resumo, Status, Feito recentemente, Pendências, Próximos passos, Links, Automações.

- Set "Último update" to today (YYYY-MM-DD).
- Add new items at the top of "Feito recentemente", each with its date. Keep about the last 30 days and drop older ones.
- Remove pendências that are now done. Add new ones found in step 1.
- Rewrite "Próximos passos" so it reflects the current plan.
- Update the status line: version, signature count, last deploy.
- If workflows changed, update the tables under "Automações".
- If nothing changed, only move "Último update" and say so.

This repo is public, so STATUS.md never contains tokens, private links or names from `notes/`.

## 3. Sync Notion

1. Fetch `collection://3cf482fe-5b74-4aa5-98a4-d5420c7f077f` (Projetos) to confirm the exact property names.
2. Update the existing row `Prompt Styles (manifesto)` (page `409e43a8afc581a9bce3cfe280b5d6c6`). Never create a new row. If the row is missing, stop and ask Marcus.
3. Set these properties from STATUS.md:
   - Status;
   - Último update = today, as a date without time;
   - Feito recentemente, Pendências and Próximos passos, as plain text with one `- ` line per item;
   - Repo = `https://github.com/promptstyles/promptstyles`;
   - Site = `https://promptstyles.org`.
4. Leave Canais and Conteúdos alone. They are Marcus's choice.

## 4. Report

Tell Marcus, in Portuguese:

- what changed in STATUS.md;
- what went to Notion;
- anything that needs his decision.

Do not commit STATUS.md unless he asks.
