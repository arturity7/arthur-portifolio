import type { Localized } from "@/i18n/dictionary";

export type ExperienceKind =
  | "job"
  | "internship"
  | "freelance"
  | "opensource"
  | "event"
  | "academic"
  | "venture"
  | "nonprofit";

export type Experience = {
  org: string | Localized;
  role: Localized;
  kind: ExperienceKind;
  /* "AAAA-MM" ou "AAAA"; end null = atual */
  start: string;
  end: string | null;
  description: Localized;
  link?: string;
};

const experiences: Experience[] = [
  {
    org: "DW LAW",
    role: { pt: "Desenvolvedor RPA", en: "RPA Developer" },
    kind: "job",
    start: "2026-09",
    end: null,
    description: {
      pt: "Atuo na sustentação do ambiente de automação: monitoro as máquinas virtuais (VMs) em que as rotinas são executadas, acompanhando disponibilidade e estabilidade para que os processos não parem, e faço a manutenção dos bancos de dados pelo DBeaver, com consultas, correções e ajustes que mantêm as informações íntegras.",
      en: "I support the automation environment: I monitor the virtual machines (VMs) where routines run, keeping an eye on availability and stability so processes don't stop, and I maintain the databases through DBeaver, with queries, fixes and adjustments that keep the data consistent.",
    },
  },
  {
    org: "Instituto Gil Nogueira",
    role: { pt: "Monitor de avaliações", en: "Assessment Monitor" },
    kind: "nonprofit",
    start: "2024",
    end: "2025",
    description: {
      pt: "Atuei como monitor de avaliações no Instituto Gil Nogueira, organização sem fins lucrativos dedicada a levar o acesso à leitura a escolas públicas, acompanhando as avaliações aplicadas aos alunos e ajudando o projeto a chegar com qualidade às salas de aula.",
      en: "I worked as an assessment monitor at Instituto Gil Nogueira, a nonprofit dedicated to bringing access to reading to public schools, following the assessments given to students and helping the project reach classrooms with quality.",
    },
  },
  {
    org: "Shigat",
    role: { pt: "Fundador", en: "Founder" },
    kind: "venture",
    start: "2022",
    end: "2024",
    description: {
      pt: "Fundei e conduzi a Shigat, uma marca de roupas autoral, da criação da identidade às coleções e às vendas. Foi onde aprendi, na prática, a tirar uma ideia do papel e sustentá-la com planejamento e constância.",
      en: "I founded and ran Shigat, an independent clothing brand, from its identity to its collections and sales. That's where I learned, in practice, how to take an idea off paper and sustain it with planning and consistency.",
    },
  },
];

/* mais recente primeiro */
export const EXPERIENCES = [...experiences].sort((a, b) =>
  (b.end ?? "9999").localeCompare(a.end ?? "9999") || b.start.localeCompare(a.start),
);
