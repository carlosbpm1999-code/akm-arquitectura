import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";

export const Route = createFileRoute("/privacidad")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Política de Privacidad — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Política de privacidad de AKM Kassem & Molinero Arquitectura: tratamiento de datos personales, finalidad, legitimación y derechos del usuario.",
      },
      { property: "og:title", content: "Política de Privacidad — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Información sobre el tratamiento de datos personales en akmarquitectura.com.",
      },
    ],
  }),
});

function PrivacyPage() {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <MobileNavToggle />
      </nav>

      <main className="cookies-page">
        <section className="cookies-hero">
          <span className="eyebrow">Información legal</span>
          <h1 className="hotels-title">Política de Privacidad</h1>
          <p className="hotels-intro">
            Información sobre el tratamiento de datos personales en akmarquitectura.com, las finalidades, la legitimación y los derechos del usuario.
          </p>
        </section>

        <section className="cookies-body">
          <article className="cookies-block">
            <p>
              akmarquitectura.com, para proteger los derechos individuales —especialmente en relación con los tratamientos automatizados— y con voluntad de ser transparentes con el Usuario, ha establecido una política que recoge el conjunto de dichos tratamientos, los fines perseguidos, su legitimidad y los instrumentos a disposición del Usuario para ejercer sus derechos.
            </p>
            <p>
              La navegación en este sitio web implica la total aceptación de las siguientes disposiciones y condiciones de utilización, así como del uso de cookies. En caso de no estar de acuerdo, envía un correo electrónico a <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>.
            </p>
            <p>
              La versión actualizada de esta política de privacidad es la única aplicable durante la duración del uso del sitio web hasta que sea sustituida por otra.
            </p>
            <p>
              Para más información sobre la protección de datos personales puedes consultar la web de la AEPD: <a href="https://www.aepd.es" target="_blank" rel="noreferrer">www.aepd.es</a>.
            </p>
          </article>

          <article className="cookies-block">
            <h2>Recogida de datos</h2>
            <p>
              Tus datos son recogidos por el Titular. Un dato de carácter personal se refiere a toda información referida a una persona física identificada o identificable, directa o indirectamente, a través de un nombre, un número de identificación (DNI, NIF, NIE, pasaporte) o uno o varios elementos propios de su identidad física, fisiológica, genética, psíquica, económica, cultural o social.
            </p>
            <p>
              Los datos que con carácter general se recopilan son: nombre y apellidos, dirección, correo electrónico, número de teléfono, fecha de nacimiento y datos relacionados con medios de pago. Podrán recopilarse otros datos, informando previamente al Usuario.
            </p>
          </article>

          <article className="cookies-block">
            <h2>¿Con qué finalidad se tratan tus datos personales?</h2>
            <p>
              La finalidad principal del tratamiento es la gestión de la relación con el Usuario, ofrecer productos y servicios acordes a sus intereses, mejorar la experiencia de usuario y, en su caso, atender solicitudes, peticiones o pedidos. Podrá elaborarse un perfil comercial en base a la información facilitada. No se realizarán decisiones automatizadas en base a dicho perfil.
            </p>
            <p>
              Los datos proporcionados se conservarán mientras se mantenga la relación comercial, salvo solicitud de supresión por parte del interesado, o durante los años necesarios para cumplir las obligaciones legales.
            </p>
          </article>

          <article className="cookies-block">
            <h2>¿Cuál es la legitimación para el tratamiento de tus datos?</h2>
            <ul>
              <li>La correcta ejecución o cumplimiento del contrato.</li>
              <li>El interés legítimo del Titular.</li>
              <li>El consentimiento del usuario o cliente para el tratamiento de sus datos.</li>
            </ul>
          </article>

          <article className="cookies-block">
            <h2>¿A qué destinatarios se comunicarán los datos?</h2>
            <p>
              Los datos personales podrán ser comunicados a terceros vinculados al Titular por contrato para la realización de tareas necesarias para la gestión de la cuenta como cliente, sin necesidad de autorización adicional. También podrán comunicarse a las autoridades en caso de incumplimiento legal o del aviso legal, así como a otras empresas del grupo, si las hubiera, para fines administrativos internos.
            </p>
            <p>
              En caso de transferencia internacional de datos, se informará al Usuario de las condiciones y del destinatario.
            </p>
          </article>

          <article className="cookies-block">
            <h2>Cookies</h2>
            <p>
              Durante la primera navegación aparece un banner explicativo sobre el uso de cookies, con la posibilidad de aceptar todas o solo las técnicas, esenciales para el funcionamiento del sitio. Para más información consulta nuestra <Link to="/cookies">Política de Cookies</Link>.
            </p>
          </article>

          <article className="cookies-block">
            <h2>Derechos del usuario</h2>
            <p>
              El Usuario puede ejercer los derechos de acceso, rectificación, cancelación, oposición, limitación del tratamiento, supresión y portabilidad de sus datos. Asimismo, puede presentar una reclamación ante la AEPD u organismo competente cuando no haya obtenido una solución satisfactoria.
            </p>
            <p>
              Salvo oposición expresa enviada a <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>, los datos podrán utilizarse para el envío de información comercial de Arqués-Kassem-Molinero i Associats, SLP.
            </p>
            <p>
              El Usuario es responsable de la veracidad de los datos facilitados y de mantenerlos actualizados. La información se gestionará con la debida confidencialidad, aplicando las medidas de seguridad necesarias. No obstante, la seguridad de los sistemas informáticos nunca es absoluta.
            </p>
            <p>
              Para ejercer estos derechos puede enviarse solicitud por escrito y firmada a c/ Bailén 176, entresuelo 2a, 08037 Barcelona, adjuntando copia del DNI o documento equivalente, o al correo <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>. Estos derechos serán atendidos en el plazo de 1 mes, ampliable a 2 si la complejidad lo requiere.
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