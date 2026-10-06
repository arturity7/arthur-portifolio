/* Validação do formulário de contato.
   Compartilhada entre o front (feedback imediato) e a API (fonte da verdade). */

export type ContactInput = { name: string; email: string; message: string };
export type ContactField = keyof ContactInput;
export type ContactErrorCode = "required" | "short" | "long" | "invalid";
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(raw: unknown):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors } {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const data: ContactInput = {
    name: str(src.name),
    email: str(src.email),
    message: str(src.message),
  };
  const errors: ContactErrors = {};

  if (!data.name) errors.name = "required";
  else if (data.name.length < LIMITS.name.min) errors.name = "short";
  else if (data.name.length > LIMITS.name.max) errors.name = "long";

  if (!data.email) errors.email = "required";
  else if (data.email.length > LIMITS.email.max || !EMAIL_RE.test(data.email)) errors.email = "invalid";

  if (!data.message) errors.message = "required";
  else if (data.message.length < LIMITS.message.min) errors.message = "short";
  else if (data.message.length > LIMITS.message.max) errors.message = "long";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
