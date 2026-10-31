---
description: Draft posts in the Notion content queue from recent changes, only for the project's channels
argument-hint: "[optional focus, e.g. 'taxonomy v0.3' or 'first 10 signatures']"
---

Turn recent changes in this project into post drafts in the Notion Conteúdo queue. Write drafts only: never approve, schedule or publish. Reply to Marcus in Portuguese (pt-BR).

Focus requested by Marcus (may be empty): $ARGUMENTS

## 1. Read the project row

1. Fetch `collection://3cf482fe-5b74-4aa5-98a4-d5420c7f077f` (Projetos) and read the row `Prompt Styles (manifesto)` (page `409e43a8afc581a9bce3cfe280b5d6c6`).
2. Take its Canais. Draft only for those channels. If Canais is empty, stop and ask Marcus which channels to use.

## 2. Find what is worth posting

1. Read STATUS.md ("Feito recentemente" and the status line). If `$ARGUMENTS` names a focus, use it.
2. Fetch `collection://e29ca6f1-7215-49f2-91d8-4df0ef126a08` (Conteúdo) for the exact property names and options.
3. Query existing Conteúdo rows whose Projeto is this project. Skip topics that already have a draft, an approved post or a published post.
4. Pick one to three topics with substance, for example:
   - a new taxonomy or rubric version;
   - a signature milestone;
   - a new site feature;
   - something learned from feedback.

   Skip routine commits such as dependency bumps or typo fixes.
5. If nothing new is worth a post, say so and create nothing.

## 3. Write one draft per channel and topic

Write in Marcus's voice, in the first person, with plain words and no hype. Every claim must match the repo. Link to https://promptstyles.org (or https://promptstyles.org/pt/ for Portuguese). Write in English unless Marcus asks for Portuguese.

Tone by platform (Plataforma value in parentheses):

- **LinkedIn** (`LinkedIn`, Formato `Post`):
  - open with a concrete hook from a real interview or engineering situation;
  - 4 to 8 short paragraphs;
  - end with one clear ask: read, sign or give feedback;
  - at most 3 hashtags.
- **X** (`X`): one post of at most 280 characters (Formato `Post`), or a thread of 3 to 6 posts (Formato `Thread`) with the posts separated by a blank line and numbered `1/`. Direct, one link.
- **Blog** (`Blog`, Formato `Artigo`):
  - a title and a short intro;
  - sections with headings;
  - examples taken from the taxonomy files;
  - a closing that points to the manifesto.
- **YouTube** (`YouTube`, Formato `Vídeo`; or `YouTube Shorts`, Formato `Short`): a script with a hook in the first 5 seconds, the beats in order, and a call to action.
- **Instagram** (`Instagram`, Formato `Reel` or `Post`) and **TikTok** (`TikTok`, Formato `Short`): a short script or caption, written for spoken delivery.
- **Showroom**: there is no Plataforma option for it in Conteúdo. Skip it and tell Marcus.

Never include:

- names of people from the private outreach notes in `notes/`;
- quotes from private conversations;
- signatories' names, unless they are already public on the site and Marcus asked for them.

## 4. Create the rows

For each draft, create a page in `collection://e29ca6f1-7215-49f2-91d8-4df0ef126a08` with:

- **Título**: a short internal title;
- **Projeto**: the project row (`409e43a8afc581a9bce3cfe280b5d6c6`);
- **Plataforma** and **Formato**: as listed above;
- **Texto**: the full post;
- **Mídia**: empty, unless there is a fitting public image on the site, such as an Open Graph image;
- **Data agendada**: empty;
- **Status**: `Rascunho`.

Never set Status to `Aprovado` or `Publicado`, and never fill "Link publicado".

## 5. Report

List each draft for Marcus:

- platform;
- title;
- the first lines of the text;
- the Notion link.

Remind him that he approves (Status = Aprovado plus Data agendada) before anything gets published.
