import type { Localized } from "@/i18n/dictionary";

export type ExperienceKind = "job" | "internship" | "freelance" | "opensource" | "event" | "academic";

export type Experience = {
  org: string;
  role: Localized;
  kind: ExperienceKind;
  /* "AAAA-MM"; end null = atual */
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
    start: "", // TODO: mês/ano de início
    end: null,
    description: {
      pt: "Desenvolvimento de robôs de automação (RPA) para processos internos que antes eram feitos manualmente.",
      en: "Building automation bots (RPA) for internal processes that used to be done by hand.",
    },
  },
];

/* mais recente primeiro */
export const EXPERIENCES = [...experiences].sort((a, b) =>
  (b.end ?? "9999").localeCompare(a.end ?? "9999") || b.start.localeCompare(a.start),
);
