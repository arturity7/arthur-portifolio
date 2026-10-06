import { Resend } from "resend";
import { validateContact } from "@/lib/contact";

/* POST /api/contact — recebe { name, email, message } e envia por e-mail via Resend. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  // campo-armadilha: humanos não veem, robôs preenchem
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return Response.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return Response.json({ error: "invalid", errors: result.errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados");
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const { name, email, message } = result.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Portfólio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Portfólio — mensagem de ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] falha no Resend:", error);
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
