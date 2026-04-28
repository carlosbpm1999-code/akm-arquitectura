import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
  head: () => ({
    meta: [
      { title: "Política de Cookies — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Política de cookies de AKM Kassem & Molinero Arquitectura: tipos de cookies utilizadas, finalidad, consentimiento y gestión.",
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
          <li><Link to="/equipo">Equipo</Link></li>
          <li><a href="/#contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </nav>

      <main className="cookies-page">
        <section className="cookies-hero">
          <span className="eyebrow">Información legal</span>
          <h1 className="hotels-title">Política de Cookies (UE)</h1>
          <p className="hotels-intro">
            Esta política de cookies fue actualizada por última vez el 19/01/2026 y se aplica a los ciudadanos y residentes legales permanentes del Espacio Económico Europeo y Suiza.
          </p>
        </section>

        <section className="cookies-body">
          <article className="cookies-block">
            <h2>1. Introducción</h2>
            <p>
              Nuestra web, akmarquitectura.com (en adelante: «la web») utiliza cookies y otras tecnologías relacionadas (para mayor comodidad, todas las tecnologías se denominan «cookies»). Las cookies también son colocadas por terceros a los que hemos contratado. En este documento te informamos sobre el uso de cookies en nuestra web.
            </p>
          </article>

          <article className="cookies-block">
            <h2>2. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un pequeño archivo que se envía junto con las páginas de esta web y que tu navegador almacena en el disco duro de tu ordenador u otro dispositivo. La información almacenada puede ser devuelta a nuestros servidores o a los servidores de terceros apropiados durante una visita posterior.
            </p>
          </article>

          <article className="cookies-block">
            <h2>3. ¿Qué son los scripts?</h2>
            <p>
              Un script es un fragmento de código de programa que se utiliza para hacer que nuestra web funcione correctamente y de forma interactiva. Este código se ejecuta en nuestro servidor o en tu dispositivo.
            </p>
          </article>

          <article className="cookies-block">
            <h2>4. ¿Qué es una baliza web?</h2>
            <p>
              Una baliza web (o etiqueta de píxel) es una pequeña e invisible pieza de texto o imagen en una web que se utiliza para monitorear el tráfico. Para ello, se almacenan varios datos sobre ti mediante estas balizas.
            </p>
          </article>

          <article className="cookies-block">
            <h2>5. Cookies utilizadas</h2>
            <ul>
              <li>
                <strong>5.1 Técnicas o funcionales:</strong> aseguran que ciertas partes de la web funcionen correctamente y que tus preferencias de usuario se recuerden. Pueden colocarse sin tu consentimiento.
              </li>
              <li>
                <strong>5.2 Estadísticas:</strong> nos permiten optimizar la experiencia obteniendo información sobre el uso de la web. Te pedimos permiso para colocarlas.
              </li>
              <li>
                <strong>5.3 Marketing / seguimiento:</strong> usadas para crear perfiles de usuario con el fin de mostrar publicidad o hacer seguimiento del usuario en una o varias webs con fines de marketing.
              </li>
              <li>
                <strong>5.4 Redes sociales:</strong> hemos incluido contenido de Instagram para promover páginas o compartir en redes sociales. Este contenido está incrustado con código derivado de Instagram y guarda cookies. Consulta su política de privacidad para conocer el tratamiento de tus datos. Instagram está ubicado en los Estados Unidos.
              </li>
            </ul>
          </article>

          <article className="cookies-block">
            <h2>6. Cookies y servicios</h2>
            <ul>
              <li><strong>Elementor</strong> — Estadísticas (anónimas)</li>
              <li><strong>WordPress</strong> — Funcional</li>
              <li><strong>Google reCAPTCHA</strong> — Marketing</li>
              <li><strong>Google Maps</strong> — Marketing</li>
              <li><strong>Complianz</strong> — Funcional</li>
              <li><strong>Varios</strong> — Propósito pendiente de investigación</li>
            </ul>
          </article>

          <article className="cookies-block">
            <h2>7. Consentimiento</h2>
            <p>
              Cuando visites nuestra web por primera vez, te mostraremos una ventana emergente con una explicación sobre las cookies. Tan pronto como hagas clic en «Aceptar», aceptas que usemos las categorías de cookies y plugins descritos en esta política. Puedes desactivar el uso de cookies a través de tu navegador, pero ten en cuenta que la web puede dejar de funcionar correctamente.
            </p>
            <button type="button" className="cookie-btn cookie-btn-primary" onClick={resetConsent}>
              Restablecer preferencias de cookies
            </button>
          </article>

          <article className="cookies-block">
            <h2>8. Activación, desactivación y borrado de cookies</h2>
            <p>
              Puedes utilizar tu navegador para eliminar las cookies de forma automática o manual. También puedes especificar que ciertas cookies no se coloquen, o cambiar los ajustes para recibir un mensaje cada vez que se coloque una cookie. Consulta la sección «Ayuda» de tu navegador para más información.
            </p>
            <p>
              Si borras las cookies de tu navegador, se volverán a colocar tras tu consentimiento al visitar la web nuevamente.
            </p>
          </article>

          <article className="cookies-block">
            <h2>9. Tus derechos respecto a los datos personales</h2>
            <ul>
              <li>Saber por qué se necesitan tus datos, qué se hará con ellos y durante cuánto tiempo se conservarán.</li>
              <li>Derecho de acceso a tus datos personales.</li>
              <li>Derecho de rectificación, completar, borrar o bloquear tus datos.</li>
              <li>Revocar el consentimiento y solicitar la eliminación de tus datos.</li>
              <li>Derecho de cesión y portabilidad de tus datos.</li>
              <li>Derecho de oposición al tratamiento de tus datos.</li>
            </ul>
            <p>
              Para ejercer estos derechos, contacta con nosotros mediante los datos de la sección siguiente. También puedes presentar una reclamación ante la autoridad de protección de datos.
            </p>
          </article>

          <article className="cookies-block">
            <h2>10. Datos de contacto</h2>
            <p>
              Arqués-Kassem-Molinero Associats, SLP<br />
              c/ Bailén 176, entresuelo 2a, 08037 Barcelona, España<br />
              Web: <a href="https://www.akmarquitectura.com" target="_blank" rel="noreferrer">akmarquitectura.com</a><br />
              Email: <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a><br />
              Teléfono: +34 932 453 032
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
              <Link to="/equipo">Equipo</Link>
              <a href="/#contacto">Contacto</a>
              <Link to="/privacidad">Privacidad</Link>
              <Link to="/cookies">Cookies</Link>
              <Link to="/aviso-legal">Aviso Legal</Link>
            </nav>
          </div>
          <div className="f-right">
            <div className="f-social">
              <a href="https://www.instagram.com/akm_arquitectura/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/akm-arquitectura/" target="_blank" rel="noreferrer">LinkedIn</a>
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
