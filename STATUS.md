# Status: Prompt Styles (manifesto)

Último update: 2026-10-30

## Resumo

Manifesto aberto, taxonomia de 8 estilos de prompt e rubrica de entrevista para avaliar engenheiros que programam com IA. O site bilíngue (inglês e português) está no ar em promptstyles.org, e qualquer pessoa assina com a conta do GitHub.

## Status

**No ar.** Taxonomia e rubrica na v0.2.0, 7 assinaturas, último deploy em 2026-10-27 (sucesso).

## Feito recentemente

- 2026-10-30: proposta de workflow n8n que publica no LinkedIn o conteúdo aprovado na Central (`automation/n8n/publicar-conteudo.json`). Ainda não foi importada nem ativada.
- 2026-10-30: projeto ligado à Central de Projetos no Notion (este arquivo, seção no CLAUDE.md e os comandos `/sync-status` e `/draft-posts`).
- 2026-10-27: assinaturas #6 a #9. Total de 7 signatários.
- 2026-10-26 a 2026-10-27: três lotes de convites diretos no LinkedIn para desenvolvedores da rede do Marcus.
- 2026-10-26: taxonomia v0.2.0. A rubrica passou a dar duas leituras, o nível de maturidade com IA e o foco no eixo business ↔ tech. Também ganhou uma dimensão de produto e uma calculadora no site.
- 2026-10-26: domínio promptstyles.org no ar com HTTPS, e docs e links apontando pra ele.
- 2026-10-25: v0.1 publicada, com:
  - manifesto em inglês e português, taxonomia e rubrica;
  - site em Astro no GitHub Pages;
  - assinatura por issue do GitHub com GitHub Action;
  - org `promptstyles`, política de segurança e Dependabot.

## Pendências

- O post de lançamento pro feed do LinkedIn está escrito, mas não foi publicado.
- Algumas respostas aos convites no LinkedIn ainda esperam retorno.
- O workflow n8n de publicação está só proposto. Falta importar, criar a credencial do LinkedIn e testar.
- O `taxonomy/CHANGELOG.md` ainda chama os próximos estilos de "Candidates for 0.2", mas a v0.2 já saiu.

## Próximos passos

- Lote 4 de convites pra devs no LinkedIn.
- Publicar o post no feed quando houver mais assinaturas de nomes conhecidos.
- Ampliar a divulgação: comunidade brasileira de devs, devs conhecidos e depois Hacker News.
- Taxonomia v0.3: avaliar os estilos plan-first e agentic delegation.
- Importar e testar o workflow n8n de publicação, e ativar depois do teste.

## Links

- Site: https://promptstyles.org
- Repo: https://github.com/promptstyles/promptstyles
- Deploy: GitHub Pages via GitHub Actions. Roda a cada push na `main` e depois de cada assinatura. Execuções: https://github.com/promptstyles/promptstyles/actions/workflows/deploy.yml
- Dados abertos: https://promptstyles.org/taxonomy.json e https://promptstyles.org/signatories.json

## Automações

### GitHub Actions (neste repo)

| Workflow | O que faz | Gatilho |
| --- | --- | --- |
| Sign | Transforma a issue de assinatura num arquivo em `manifesto/signatories/`, faz commit, responde e fecha a issue, e dispara o Deploy | Issue aberta ou com label adicionada |
| Deploy | Build do site e publicação no GitHub Pages | Push na `main` ou disparo manual |
| Validate | Valida os YAML contra os schemas, roda os testes, `astro check` e build | Pull request e push fora da `main` |
| Labels | Cria as labels do fluxo de assinatura | Mudança no próprio workflow ou disparo manual |
| Dependabot | PRs de atualização de npm e GitHub Actions | Mensal |

### n8n

Nenhum workflow ativo pro projeto (verificado em 2026-10-30). A divulgação no LinkedIn até agora foi manual.

| Workflow | O que faz | Gatilho | Estado |
| --- | --- | --- | --- |
| [Publicar conteúdo aprovado](automation/n8n/publicar-conteudo.json) | Lê em Conteúdo os itens deste projeto com Status Aprovado e data vencida, publica no LinkedIn e marca Publicado com o link, ou Erro. Grava cada item em Log de execuções. | A cada 15 minutos | Proposta, ainda não importada |

Credenciais no n8n: `Notion Central` (Notion API, já criada) e `LinkedIn` (OAuth2, falta criar). Detalhes em [automation/n8n/README.md](automation/n8n/README.md).
