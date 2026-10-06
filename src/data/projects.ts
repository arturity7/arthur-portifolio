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
  // os projetos entram aqui (ver "Como adicionar projetos" no README)
];

/* sempre em ordem cronológica */
export const PROJECTS = [...projects].sort((a, b) => a.date.localeCompare(b.date));
