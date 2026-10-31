# Workflows n8n (propostas)

Estes arquivos são propostas: nada aqui está importado nem ativo no n8n. Importe e ative só depois de revisar.

Nenhum arquivo guarda token ou segredo. Os nós usam credenciais do próprio n8n, referenciadas pelo nome.

## publicar-conteudo.json

Publica o conteúdo aprovado do Prompt Styles que está na Central de Projetos.

### Como funciona

1. **A cada 15 minutos**, consulta a fila **Conteúdo** no Notion e pega os itens com:
   - Projeto = Prompt Styles (manifesto);
   - Status = Aprovado;
   - Data agendada até agora.
2. **Pode publicar?** Barra o item e manda pro caminho de erro quando:
   - a plataforma ainda não tem publicador (hoje só existe o do LinkedIn);
   - o texto está vazio;
   - o texto passa de 3000 caracteres;
   - o item já foi publicado numa execução anterior.
3. **Publicar no LinkedIn** posta o texto no seu perfil.
4. **Deu certo:** o item vira Status = Publicado, com o link do post em Link publicado.
5. **Deu errado:** o item vira Status = Erro.
6. **Log:** cada item processado, com sucesso ou com erro, ganha uma linha em **Log de execuções**, com Workflow, Projeto, Plataforma, Data, Resultado e Mensagem de erro. Se a própria consulta ao Notion falhar, isso também vira uma linha de Erro no log.

### Proteções contra post duplicado

- O nó do LinkedIn não tem retry. Repetir uma chamada que talvez tenha funcionado poderia publicar duas vezes.
- Depois de cada post, o workflow guarda o ID da página nos dados estáticos do próprio workflow. Se o Notion falhar ao marcar Publicado, a próxima execução não republica: ela marca o item como Erro e explica o que aconteceu. Esses dados estáticos só persistem com o workflow ativo, não nas execuções manuais de teste.

### Credenciais

| Nós | Credencial | Tipo |
| --- | --- | --- |
| Buscar aprovados, Marcar Publicado, Marcar Erro, Gravar log | `Notion Central` | Notion API |
| Publicar no LinkedIn | `LinkedIn`, que ainda precisa ser criada | LinkedIn OAuth2 |

A integração do Notion por trás de `Notion Central` precisa ter acesso à página da Central. Os bancos Conteúdo, Log de execuções e Projetos herdam esse acesso.

Os IDs do projeto e dos bancos estão no nó **Config**. Eles não são segredo, só endereços.

### Para ativar

1. No n8n, use **Import from file** e escolha este arquivo.
2. Nos quatro nós HTTP do Notion, confira se a credencial é `Notion Central`. Se o import não ligar sozinho, selecione.
3. No nó **Publicar no LinkedIn**:
   - crie ou selecione a credencial do LinkedIn;
   - escolha o seu perfil em *Person*.
4. Teste:
   - crie em Conteúdo um item de teste com Projeto = Prompt Styles, Plataforma = LinkedIn, Status = Aprovado e Data agendada no passado;
   - rode o workflow manualmente (**Execute workflow**);
   - confira o post, o Status, o Link publicado e a linha no log.
5. Só então ative o workflow.

### Limites conhecidos

- **Só texto:** Mídia é ignorada por enquanto, e o post sai sem imagem.
- **Só LinkedIn:** itens de outras plataformas vão para Erro com a mensagem "ainda não publica em ...".
- **Execuções vazias não geram log.** Quando não há nada aprovado, nada é registrado, pra não encher o Log com uma linha a cada 15 minutos.
- **Link do post:** o link sai do URN que o nó do LinkedIn devolve. Confira na primeira execução real.
