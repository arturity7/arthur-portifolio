import type { Localized } from "@/i18n/dictionary";

export type Project = {
  slug: string;
  title: string;
  description: Localized;
  stack: string[];
  /* link do repositório no GitHub; null = código privado (projeto de cliente) */
  repo: string | null;
  /*
    Demonstração em /public/projects/<slug>/ (gerada a partir do GIF):
    poster  — quadro parado mostrado no anel
    preview — vídeo leve que roda no anel só no hover
    video   — vídeo em boa resolução da página do projeto
  */
  media: { poster: string; preview: string; video: string } | null;
};

const mediaOf = (slug: string) => ({
  poster: `/projects/${slug}/poster.jpg`,
  preview: `/projects/${slug}/ring.mp4`,
  video: `/projects/${slug}/demo.mp4`,
});

const projects: Project[] = [
  {
    slug: "joca-gomes",
    title: "Joca Gomes",
    description: {
      pt: "Landing page do nutricionista esportivo Joca Gomes, especializado em atletas de alta performance. A visita começa com uma animação de entrada da marca e um hero com retrato e chamada direta para agendar a consulta gratuita. O destaque é a seção “Atletas que confiam no método”: conforme a página rola, uma trilha animada vai ligando os atletas acompanhados, cada um com suas conquistas, até chegar em “Você”, convidando o visitante a ser o próximo. A página fecha com um passo a passo de como começar e um contato direto pelo WhatsApp, numa identidade escura em azul-petróleo pensada para transmitir foco e performance.",
      en: "Landing page for sports nutritionist Joca Gomes, who specializes in high-performance athletes. The visit opens with an animated brand intro and a hero with a portrait and a direct call to book a free consultation. The highlight is the “Athletes who trust the method” section: as the page scrolls, an animated path connects the athletes he works with, each with their achievements, until it reaches “You”, inviting the visitor to be next. The page closes with a step-by-step on how to get started and direct contact through WhatsApp, in a dark teal identity designed to convey focus and performance.",
    },
    stack: ["HTML", "CSS", "JavaScript"],
    repo: null,
    media: mediaOf("joca-gomes"),
  },
  {
    slug: "imperio-do-bolo",
    title: "Império do Bolo",
    description: {
      pt: "Site do Império do Bolo, confeitaria e padaria que trabalha com encomendas. Além da vitrine “Nossas Delícias” com os destaques da casa, o site traz um cardápio completo com fotos, preços e opções por produto, e um carrinho flutuante sempre à mão, onde o cliente monta o pedido sem sair da página; bolos personalizados seguem pelo fluxo de encomenda sob consulta. A seção “Nossa História” apresenta a loja física, e a identidade em verde e branco, com bordas onduladas que lembram um toldo, traduz o clima acolhedor de padaria de bairro.",
      en: "Website for Império do Bolo, a bakery and cake shop that works with custom orders. Besides the “Our Delights” showcase with the house favorites, the site has a full menu with photos, prices and options per product, plus a floating cart always at hand, where customers build their order without leaving the page; custom cakes go through an on-request ordering flow. The “Our Story” section introduces the physical shop, and the green-and-white identity, with wavy edges that recall an awning, captures the welcoming feel of a neighborhood bakery.",
    },
    stack: ["HTML"],
    repo: null,
    media: mediaOf("imperio-do-bolo"),
  },
  {
    slug: "harvsystem",
    title: "HarvSystem",
    description: {
      pt: "Site institucional da HarvSystem, empresa que desenvolve sites, sistemas e automações sob medida. A proposta aparece logo de cara, com o título “Construído sob medida” sobre um fundo de linhas em movimento, e o visitante é conduzido por Sobre, Serviços (sites e landing pages, sistemas e plataformas sob medida, automações), um passo a passo do processo — diagnóstico, construção, lançamento e evolução contínua — e perguntas frequentes em acordeão. Todo o percurso leva a chamadas diretas para o WhatsApp, e a identidade escura, com tipografia condensada e acentos em laranja, reforça o tom técnico e exclusivo da marca.",
      en: "Corporate website for HarvSystem, a company that builds custom websites, systems and automations. The pitch shows up right away, with the headline “Built to measure” over a background of moving lines, and visitors are guided through About, Services (websites and landing pages, custom systems and platforms, automations), a step-by-step of the process — diagnosis, build, launch and continuous evolution — and an accordion FAQ. The whole journey leads to direct WhatsApp calls to action, and the dark identity, with condensed typography and orange accents, reinforces the brand's technical, tailor-made tone.",
    },
    stack: ["HTML", "TypeScript", "Python", "JavaScript", "CSS", "Shell"],
    repo: null,
    media: mediaOf("harvsystem"),
  },
];

/* a ordem do anel e da navegação é a ordem desta lista */
export const PROJECTS = projects;
