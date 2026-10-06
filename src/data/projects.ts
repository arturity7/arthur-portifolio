import type { Localized } from "@/i18n/dictionary";

export type Project = {
  slug: string;
  title: string;
  /* "AAAA-MM": define a ordem da linha do tempo (mais antigo → mais recente) */
  date: string;
  description: Localized;
  stack: string[];
  /* link do repositório (opcional); sem ele, o botão não aparece */
  repo?: string;
  /* GIF do projeto rodando, em /public/projects (null → aviso de "em breve") */
  gif: string | null;
  /* miniatura do anel (opcional); sem ela, o próprio GIF roda no anel */
  thumb?: string;
};

const projects: Project[] = [
  {
    slug: "portfolio",
    title: "Portfólio",
    date: "2026-10",
    description: {
      pt: "Este site. Um portfólio em Next.js com os projetos girando num anel, páginas em português e inglês trocadas sem recarregar e um formulário de contato que envia e-mail por uma rota de API própria.",
      en: "This website. A Next.js portfolio with projects spinning in a ring, pages in Portuguese and English switched without reloading, and a contact form that sends e-mail through its own API route.",
    },
    stack: ["Next.js", "TypeScript", "React", "CSS", "Resend", "Vercel"],
    gif: null,
  },
];

/* sempre em ordem cronológica */
export const PROJECTS = [...projects].sort((a, b) => a.date.localeCompare(b.date));
