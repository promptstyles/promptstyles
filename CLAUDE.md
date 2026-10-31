# Prompt Styles

Open manifesto, taxonomy and interview rubric for building software with AI. See README.md for the layout and STATUS.md for where the project stands.

## Central de Projetos

This repo reports to Marcus's project hub in Notion.

- PROJETO: `Prompt Styles (manifesto)`
- Página central: https://app.notion.com/p/409e43a8afc5814cac1dc70e6979f39b
- Linha do projeto em Projetos: https://app.notion.com/409e43a8afc581a9bce3cfe280b5d6c6
- Projetos: `collection://3cf482fe-5b74-4aa5-98a4-d5420c7f077f`. Fields: Nome, Status (Ideia | Em construção | No ar), Último update, Feito recentemente, Pendências, Próximos passos, Repo, Site, Canais.
- Conteúdo: `collection://e29ca6f1-7215-49f2-91d8-4df0ef126a08`. Fields: Título, Projeto (relation), Plataforma, Formato, Texto, Mídia, Data agendada, Status (Rascunho | Aprovado | Publicado | Erro), Link publicado.
- Log de execuções: `collection://0be40404-2398-4806-8168-fe8fedfb658e`. Fields: Execução, Workflow, Projeto (relation), Plataforma, Data, Resultado (Sucesso | Erro), Mensagem de erro.

Rules:

- After finishing a relevant task (a release, a deploy, a new feature, a change in the taxonomy or the manifesto, an outreach milestone), run `/sync-status`.
- `/draft-posts` only creates drafts (Status = Rascunho). Never set a content row to Aprovado or Publicado: Marcus approves.
- Never create a second row for this project in Projetos. If the row is missing, ask first.
- This repo is public. STATUS.md and anything committed must not contain tokens, private links or names from the private outreach notes in `notes/`.
- Do not change or activate anything in n8n without Marcus's explicit confirmation. Proposed workflows go to `automation/n8n/*.json` and use n8n credentials or environment variables, never inline secrets.
- In n8n, Notion calls use the credential `Notion Central` (type Notion API), referenced by name. The publishing proposal is `automation/n8n/publicar-conteudo.json`, documented in `automation/n8n/README.md`.
