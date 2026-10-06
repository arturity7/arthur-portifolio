"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedinIn, FaRegEnvelope, FaWhatsapp } from "react-icons/fa6";
import { PROFILE } from "@/data/profile";
import { useLang } from "@/i18n/LanguageProvider";
import { validateContact, type ContactErrors, type ContactField, type ContactInput } from "@/lib/contact";
import PageFoot from "./PageFoot";

type Status = "idle" | "sending" | "sent" | "failed" | "notConfigured";

const CHANNELS: { label: string; handle: string; href: string; icon: IconType }[] = [
  { label: "E-mail", handle: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: FaRegEnvelope },
  { label: "WhatsApp", handle: PROFILE.whatsapp.display, href: PROFILE.whatsapp.url, icon: FaWhatsapp },
  { label: "LinkedIn", handle: "in/arthur-gabriel", href: PROFILE.linkedin, icon: FaLinkedinIn },
  { label: "GitHub", handle: "@arturity7", href: PROFILE.github, icon: FaGithub },
  { label: "Instagram", handle: "@_arturity", href: PROFILE.instagram, icon: FaInstagram },
];

/* hora local de BH, atualizada a cada 20s */
function useBhTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function ContactPage() {
  const { t } = useLang();
  const c = t.contact;
  const time = useBhTime();

  const [form, setForm] = useState<ContactInput>({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: ContactField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    if (status !== "sending") setStatus("idle");
    /* depois da 1ª tentativa, os erros acompanham a digitação */
    if (tried) {
      const r = validateContact(next);
      setErrors(r.ok ? {} : r.errors);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    const r = validateContact(form);
    if (!r.ok) {
      setErrors(r.errors);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...r.data, website: honeypot }),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
        setTried(false);
      } else {
        const body = await res.json().catch(() => ({}));
        if (res.status === 422 && body.errors) {
          setErrors(body.errors);
          setStatus("idle");
        } else setStatus(res.status === 503 ? "notConfigured" : "failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  const err = (f: ContactField) =>
    errors[f] ? (
      <span className="ct-err" id={`ct-${f}-err`}>
        {c.errors[f][errors[f]!]}
      </span>
    ) : null;
  const aria = (f: ContactField) => ({
    "aria-invalid": !!errors[f],
    "aria-describedby": errors[f] ? `ct-${f}-err` : undefined,
  });

  /* o campo cresce com o que é digitado, como uma lacuna preenchida à mão */
  const fit = (value: string, placeholder: string) => ({
    width: `calc(${Math.max(value.length, placeholder.length) + 1}ch + 0.2em)`,
  });

  const statusMsg =
    status === "sent" ? c.sent : status === "failed" ? c.failed : status === "notConfigured" ? c.notConfigured : "";

  return (
    <div className="pg-inner ct">
      <div className="pg-bar">
        <span>{c.section}</span>
        <span>
          {c.localTime} <time className="ct-clock">{time ?? "--:--"}</time>
        </span>
      </div>

      <div className="ct-grid">
        <form className="ct-letter" noValidate onSubmit={submit}>
          <h1 className="ct-greet">{c.greeting}</h1>

          <p className="ct-line">
            {c.nameBefore}{" "}
            <span className="ct-field">
              <label className="sr-only" htmlFor="ct-name">
                {c.namePh}
              </label>
              <input
                id="ct-name"
                name="name"
                autoComplete="name"
                placeholder={c.namePh}
                value={form.name}
                onChange={update("name")}
                maxLength={80}
                style={fit(form.name, c.namePh)}
                {...aria("name")}
              />
              {err("name")}
            </span>
            , {c.emailBefore}{" "}
            <span className="ct-field">
              <label className="sr-only" htmlFor="ct-email">
                {c.emailPh}
              </label>
              <input
                id="ct-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={c.emailPh}
                value={form.email}
                onChange={update("email")}
                maxLength={120}
                style={fit(form.email, c.emailPh)}
                {...aria("email")}
              />
              {err("email")}
            </span>
            .
          </p>

          <div className="ct-msg">
            <label className="sr-only" htmlFor="ct-message">
              {c.messagePh}
            </label>
            <textarea
              id="ct-message"
              name="message"
              rows={6}
              placeholder={c.messagePh}
              value={form.message}
              onChange={update("message")}
              maxLength={2000}
              {...aria("message")}
            />
            <div className="ct-msg-foot">
              {err("message") ?? <span />}
              <span className="ct-count">{form.message.length}/2000</span>
            </div>
          </div>

          {/* armadilha para robôs */}
          <input
            className="ct-hp"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          <div className="ct-actions">
            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? c.sending : c.send} <span aria-hidden="true">→</span>
            </button>
            <p className={`ct-status ${status}`} role="status" aria-live="polite">
              {statusMsg}
            </p>
          </div>
        </form>

        <aside className="ct-channels">
          <h2>{c.channels}</h2>
          <ul>
            {CHANNELS.map(({ label, handle, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer">
                  <Icon aria-hidden="true" className="ct-ico" />
                  <span className="ct-ch-label">{label}</span>
                  <span className="ct-ch-handle">{handle}</span>
                  <span className="ct-ch-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <PageFoot />
    </div>
  );
}
