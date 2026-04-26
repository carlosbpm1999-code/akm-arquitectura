import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Política de Cookies — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Información sobre el uso de cookies en el sitio web de AKM Kassem & Molinero Arquitectura: tipos, finalidad y cómo gestionarlas.",
      },
      { property: "og:title", content: "Política de Cookies — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Detalle del uso de cookies en akmarquitectura.com.",
      },
    ],
  }),
});

function CookiesPage() {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resetConsent = () => {
    try {
      localStorage.removeItem("akm-cookies-consent");
      window.location.reload();
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <nav className="akm-nav" ref={navRef}>
        <Link to="/" className="nav-logo">
          <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
        </Link>
        <ul className="nav-links">
          <li><a href="/#estudio">Estudio</a></li>
          <li><a href="/#portfolio">Portfolio</a></li>
          <li><Link to="/hoteles">Hoteles</Link></li>
          <li><Link to="/residencial">Residencial</Link></li>
          <li><a href="/#equipo">Equipo</a></li>
          <li><a href="/#contacto">Contacto</a></li>
        </ul>
      </nav>

      <main className="cookies-page">
        <section className="cookies-hero">
          <span className="eyebrow">Información legal</span>
          <h1 className="hotels-title">Política de Cookies</h1>
          <p className="hotels-intro">
            Esta política describe qué son las cookies, qué tipos utilizamos en este sitio web y cómo puedes gestionarlas o revocar tu consentimiento en cualquier momento.
          </p>
        </section>

        <section className="cookies-body">
          <article className="cookies-block">
            <h2>¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten reconocer al usuario, recordar preferencias y obtener información sobre el uso del sitio para mejorar la experiencia de navegación.
            </p>
          </article>

          <article className="cookies-block">
            <h2>Tipos de cookies utilizadas</h2>
            <ul>
              <li>
                <strong>Técnicas / necesarias:</strong> imprescindibles para el funcionamiento del sitio (sesión, navegación básica, preferencia de consentimiento). No requieren consentimiento previo.
              </li>
              <li>
                <strong>Analíticas:</strong> permiten medir la actividad de los visitantes y elaborar estadísticas agregadas sobre el uso de la web. Solo se activan tras tu consentimiento.
              </li>
              <li>
                <strong>De terceros:</strong> servicios externos integrados (por ejemplo, mapas embebidos) pueden establecer sus propias cookies con sus respectivas políticas.
              </li>
            </ul>
          </article>

          <article className="cookies-block">
            <h2>Gestión del consentimiento</h2>
            <p>
              La primera vez que accedes al sitio se muestra un aviso para aceptar o rechazar el uso de cookies no esenciales. Tu elección queda registrada localmente en tu navegador. Puedes revocarla cuando quieras desde el botón inferior.
            </p>
            <button type="button" className="cookie-btn cookie-btn-primary" onClick={resetConsent}>
              Restablecer preferencias de cookies
            </button>
          </article>

          <article className="cookies-block">
            <h2>Cómo desactivar cookies en tu navegador</h2>
            <p>
              Puedes configurar o eliminar las cookies a través de los ajustes de tu navegador (Chrome, Firefox, Safari, Edge…). Ten en cuenta que la desactivación de algunas cookies puede afectar al correcto funcionamiento del sitio.
            </p>
          </article>

          <article className="cookies-block">
            <h2>Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política, puedes escribirnos a{" "}
              <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>.
            </p>
          </article>
        </section>
      </main>

      <footer className="akm-footer">
        <div className="f-top">
          <Link to="/" className="f-logo">
            <img src={logo} alt="AKM Kassem & Molinero Arquitectura" />
          </Link>
          <div className="f-center">
            <nav className="f-nav">
              <a href="/#estudio">Estudio</a>
              <a href="/#portfolio">Portfolio</a>
              <Link to="/hoteles">Hoteles</Link>
              <Link to="/residencial">Residencial</Link>
              <a href="/#equipo">Equipo</a>
              <a href="/#contacto">Contacto</a>
              <Link to="/cookies">Cookies</Link>
            </nav>
          </div>
          <div className="f-right">
            <div className="f-social">
              <a href="https://www.instagram.com/akm_arquitectura/" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/akm-arquitectura/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="f-bottom">
          <span className="f-copy">
            © 2025 Arqués–Kassem–Molinero Associats, SLP &nbsp;·&nbsp; C/ Bailén 176, entresuelo 2a, 08037 Barcelona &nbsp;·&nbsp; info@akmarquitectura.com
          </span>
        </div>
      </footer>
    </>
  );
}