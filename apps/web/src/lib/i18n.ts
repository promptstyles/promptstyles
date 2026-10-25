import type { Lang, Localized } from '@promptstyles/taxonomy';

export type { Lang, Localized };
export const LANGS: Lang[] = ['en', 'pt'];
export const HTML_LANG: Record<Lang, string> = { en: 'en', pt: 'pt-BR' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', pt: 'pt_BR' };

export function l<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}

const en = {
  langName: 'English',
  switchTo: 'Português',
  skip: 'Skip to content',
  nav: {
    manifesto: 'Manifesto',
    styles: 'Styles',
    rubric: 'Rubric',
    signatories: 'Signatories',
    github: 'GitHub',
  },
  meta: {
    title: 'Prompt Styles: a manifesto for AI-assisted engineering',
    description:
      'An open manifesto, taxonomy and rubric for building software with AI, and for evaluating the people who do it.',
  },
  hero: {
    eyebrow: 'The Prompt Styles Manifesto',
    title: 'The craft didn’t disappear.',
    titleEmphasis: 'It moved.',
    lead: 'An open manifesto, taxonomy and rubric for building software with AI, and for evaluating the people who do it.',
  },
  cta: {
    sign: 'Sign with GitHub',
    styles: 'Explore the styles',
    rubric: 'See the rubric',
    allSignatories: 'See all signatories',
  },
  count: (n: number) =>
    n === 0 ? 'No signatures yet. Be the first.' : n === 1 ? '1 person has signed' : `${n.toLocaleString('en')} people have signed`,
  roles: {
    engineering: 'Engineering',
    people: 'People & HR',
    other: 'Other',
  } as Record<string, string>,
  home: {
    stylesTitle: (n: number) => `${n} prompt styles, one shared vocabulary`,
    rubricTitle: 'A rubric you can use tomorrow',
    rubricBody: (levels: number, dims: number, minutes: number) =>
      `${levels} levels, ${dims} dimensions and a ${minutes}-minute interview script. Built to be shared with candidates before the interview, not hidden from them.`,
    signTitle: 'Sign the manifesto',
    signBody:
      'Signing takes a minute. You open a short form on GitHub while logged in, a bot checks it and adds your name. Every signature is tied to a real GitHub account and kept in the git history.',
    recent: 'Latest signatures',
  },
  styles: {
    title: 'Prompt styles',
    mapTitle: 'Style map',
    mapAlt: 'Each style placed by how much it dictates the implementation (horizontal) and how much it verifies the output (vertical).',
    open: 'Read more',
    draft: 'Draft',
    draftNote: 'Draft: open for discussion',
    definition: 'Definition',
    example: 'Example prompt',
    reveals: 'What it reveals',
    useWhen: 'Use it when',
    watchOut: 'Watch out for',
    interview: 'In an interview',
    lookFor: 'Look for',
    ask: 'Ask',
    origin: 'Origin',
    sources: 'Sources',
    related: 'Related styles',
    aka: 'Also known as',
    edit: 'Edit this style on GitHub',
    prev: 'Previous',
    next: 'Next',
    all: 'All styles',
    json: 'Taxonomy as JSON',
  },
  rubric: {
    title: 'Evaluation rubric',
    levels: 'Levels',
    matrix: 'Dimensions',
    dimension: 'Dimension',
    level: 'Level',
    scoring: 'Scoring',
    green: 'Green flags',
    red: 'Red flags',
    minutes: 'min',
    total: (m: number) => `${m} minutes in total`,
    edit: 'Edit the rubric on GitHub',
  },
  signatories: {
    title: 'Signatories',
    lead: 'Engineers and people who hire engineers who agree with the manifesto. Each name is tied to a GitHub account.',
    how: 'How signing works',
    steps: [
      'Click “Sign with GitHub”. A short form opens on GitHub.',
      'Fill in your name and, if you want, your title and company. Submit the issue.',
      'A GitHub Action records your signature and closes the issue. Your name appears here after the next deploy, usually within a few minutes.',
    ],
    review: 'GitHub accounts created less than 30 days ago are reviewed by a maintainer before the signature is added.',
    pr: 'Prefer a pull request? Add a file to manifesto/signatories/ following the schema.',
    remove: 'To remove your signature, open a pull request deleting your file, or an issue asking us to.',
    filterAll: 'All',
    founding: 'Founding signatory',
    empty: 'No signatures yet. The first names on this page will be the founding signatories.',
  },
  footer: {
    license: 'Content under CC BY 4.0. Code under MIT.',
    version: (v: string) => `Taxonomy v${v}`,
    propose: 'Propose a change',
    source: 'Source on GitHub',
  },
  notFound: {
    title: 'Page not found',
    body: 'This page does not exist, or it moved.',
    home: 'Go to the manifesto',
  },
};

type Dict = typeof en;

const pt: Dict = {
  langName: 'Português',
  switchTo: 'English',
  skip: 'Pular para o conteúdo',
  nav: {
    manifesto: 'Manifesto',
    styles: 'Estilos',
    rubric: 'Rubrica',
    signatories: 'Signatários',
    github: 'GitHub',
  },
  meta: {
    title: 'Prompt Styles: um manifesto para engenharia com IA',
    description:
      'Um manifesto, uma taxonomia e uma rubrica abertos para construir software com IA, e para avaliar quem faz isso.',
  },
  hero: {
    eyebrow: 'Manifesto Prompt Styles',
    title: 'O ofício não desapareceu.',
    titleEmphasis: 'Ele mudou de lugar.',
    lead: 'Um manifesto, uma taxonomia e uma rubrica abertos para construir software com IA, e para avaliar quem faz isso.',
  },
  cta: {
    sign: 'Assinar com GitHub',
    styles: 'Conhecer os estilos',
    rubric: 'Ver a rubrica',
    allSignatories: 'Ver todos os signatários',
  },
  count: (n: number) =>
    n === 0 ? 'Nenhuma assinatura ainda. Seja a primeira.' : n === 1 ? '1 pessoa assinou' : `${n.toLocaleString('pt-BR')} pessoas assinaram`,
  roles: {
    engineering: 'Engenharia',
    people: 'People & RH',
    other: 'Outros',
  },
  home: {
    stylesTitle: (n: number) => `${n} estilos de prompt, um vocabulário comum`,
    rubricTitle: 'Uma rubrica para usar amanhã',
    rubricBody: (levels: number, dims: number, minutes: number) =>
      `${levels} níveis, ${dims} dimensões e um roteiro de entrevista de ${minutes} minutos. Feita para ser compartilhada com o candidato antes da entrevista, não escondida dele.`,
    signTitle: 'Assine o manifesto',
    signBody:
      'Assinar leva um minuto. Você abre um formulário curto no GitHub já logado, um bot confere e adiciona seu nome. Cada assinatura fica ligada a uma conta real do GitHub e registrada no histórico do git.',
    recent: 'Últimas assinaturas',
  },
  styles: {
    title: 'Estilos de prompt',
    mapTitle: 'Mapa dos estilos',
    mapAlt: 'Cada estilo posicionado pelo quanto dita a implementação (horizontal) e pelo quanto verifica o output (vertical).',
    open: 'Ler mais',
    draft: 'Rascunho',
    draftNote: 'Rascunho: aberto para discussão',
    definition: 'Definição',
    example: 'Exemplo de prompt',
    reveals: 'O que revela',
    useWhen: 'Use quando',
    watchOut: 'Cuidado com',
    interview: 'Na entrevista',
    lookFor: 'Observe',
    ask: 'Pergunte',
    origin: 'Origem',
    sources: 'Fontes',
    related: 'Estilos relacionados',
    aka: 'Também chamado de',
    edit: 'Editar este estilo no GitHub',
    prev: 'Anterior',
    next: 'Próximo',
    all: 'Todos os estilos',
    json: 'Taxonomia em JSON',
  },
  rubric: {
    title: 'Rubrica de avaliação',
    levels: 'Níveis',
    matrix: 'Dimensões',
    dimension: 'Dimensão',
    level: 'Nível',
    scoring: 'Como pontuar',
    green: 'Sinais positivos',
    red: 'Sinais de alerta',
    minutes: 'min',
    total: (m: number) => `${m} minutos no total`,
    edit: 'Editar a rubrica no GitHub',
  },
  signatories: {
    title: 'Signatários',
    lead: 'Engenheiros e pessoas que contratam engenheiros que concordam com o manifesto. Cada nome está ligado a uma conta do GitHub.',
    how: 'Como funciona a assinatura',
    steps: [
      'Clique em “Assinar com GitHub”. Um formulário curto abre no GitHub.',
      'Preencha seu nome e, se quiser, cargo e empresa. Envie a issue.',
      'Uma GitHub Action registra sua assinatura e fecha a issue. Seu nome aparece aqui depois do próximo deploy, normalmente em poucos minutos.',
    ],
    review: 'Contas do GitHub criadas há menos de 30 dias passam pela revisão de um mantenedor antes de a assinatura entrar.',
    pr: 'Prefere um pull request? Adicione um arquivo em manifesto/signatories/ seguindo o schema.',
    remove: 'Para remover sua assinatura, abra um pull request apagando seu arquivo, ou uma issue pedindo a remoção.',
    filterAll: 'Todos',
    founding: 'Signatário fundador',
    empty: 'Nenhuma assinatura ainda. Os primeiros nomes desta página serão os signatários fundadores.',
  },
  footer: {
    license: 'Conteúdo sob CC BY 4.0. Código sob MIT.',
    version: (v: string) => `Taxonomia v${v}`,
    propose: 'Propor uma mudança',
    source: 'Código no GitHub',
  },
  notFound: {
    title: 'Página não encontrada',
    body: 'Esta página não existe, ou mudou de lugar.',
    home: 'Ir para o manifesto',
  },
};

export const ui: Record<Lang, Dict> = { en, pt };
