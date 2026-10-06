import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

// FormSubmit reenvía cada envío por email a esta dirección (sin backend propio).
// El primer envío dispara un correo de activación a info@ que hay que confirmar una vez.
const FORM_ENDPOINT = "https://formsubmit.co/ajax/info@akmarquitectura.com";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: los bots rellenan el campo oculto
    if (data._honey) return;

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Nuevo mensaje web — ${data.nombre}`,
          _template: "table",
          _captcha: "false",
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono || "—",
          tipo: data.tipo || "—",
          mensaje: data.mensaje,
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || (json && String(json.success) === "false")) throw new Error();
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="cf-done" role="status">
        <div className="cf-done-bar" />
        <p className="cf-done-title">Mensaje enviado</p>
        <p className="cf-done-text">
          Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible.
        </p>
        <button type="button" className="cf-link" onClick={() => setStatus("idle")}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit}>
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="cf-honey" aria-hidden="true" />

      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">Nombre *</span>
          <input name="nombre" type="text" required autoComplete="name" maxLength={120} />
        </label>
        <label className="cf-field">
          <span className="cf-label">Email *</span>
          <input name="email" type="email" required autoComplete="email" maxLength={160} />
        </label>
      </div>

      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">Teléfono</span>
          <input name="telefono" type="tel" autoComplete="tel" maxLength={30} />
        </label>
        <label className="cf-field">
          <span className="cf-label">Tipo de proyecto</span>
          <select name="tipo" defaultValue="">
            <option value="">Selecciona una opción</option>
            <option>Hotel</option>
            <option>Residencial</option>
            <option>Rehabilitación</option>
            <option>Obra nueva</option>
            <option>Otro</option>
          </select>
        </label>
      </div>

      <label className="cf-field">
        <span className="cf-label">Mensaje *</span>
        <textarea name="mensaje" required rows={6} maxLength={4000} />
      </label>

      <label className="cf-check">
        <input type="checkbox" required />
        <span>
          He leído y acepto la <Link to="/privacidad">política de privacidad</Link>.
        </span>
      </label>

      <div className="cf-actions">
        <button type="submit" className="cf-submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar mensaje"}
        </button>
        {status === "error" && (
          <p className="cf-error" role="alert">
            No se ha podido enviar el mensaje. Inténtalo de nuevo o escríbenos a{" "}
            <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>.
          </p>
        )}
      </div>
    </form>
  );
}
