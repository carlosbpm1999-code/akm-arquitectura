import { Link } from "@tanstack/react-router";

export function ProjectCta() {
  return (
    <section className="pcta" aria-labelledby="pcta-title">
      <div className="pcta-copy">
        <span className="eyebrow">¿Tienes un proyecto en mente?</span>
        <h2 className="pcta-title" id="pcta-title">
          Cuéntanos más acerca de <em>tu proyecto</em>
        </h2>
        <p className="pcta-text">
          Escríbenos y te responderemos lo antes posible para estudiar contigo cada detalle.
        </p>
      </div>
      <Link to="/contacto" hash="formulario" className="pcta-btn">
        Escríbenos
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
