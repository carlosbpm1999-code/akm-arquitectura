import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { MobileNavToggle } from "@/components/MobileNavToggle";
import { teamMembers } from "@/data/team";

export const Route = createFileRoute("/equipo")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Equipo — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Conoce al equipo de socios de AKM Arquitectura: arquitectos con más de cuatro décadas de experiencia en rehabilitación, hoteles, residencial y patrimonio en Barcelona.",
      },
      { property: "og:title", content: "Equipo — AKM Arquitectura" },
      {
        property: "og:description",
        content:
          "Socios y arquitectos del estudio AKM Kassem & Molinero, Barcelona.",
      },
    ],
  }),
});

function TeamPage() {
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
          <li><Link to="/equipo">Equipo</Link></li>
          <li><a href="/#contacto">Contacto</a></li>
        </ul>
        <MobileNavToggle />
      </nav>

      <main className="team-page">
        <section className="team-hero">
          <span className="eyebrow">Nuestros socios</span>
          <h1 className="hotels-title">
            El equipo <em>detrás</em>
            <br />
            de cada proyecto
          </h1>
          <p className="hotels-intro">
            Cinco arquitectos socios lideran el estudio desde Barcelona, sumando una trayectoria que arranca en 1980. Compartimos una misma manera de entender el oficio: rigor técnico, escucha al cliente y respeto por el lugar.
          </p>
        </section>

        <section className="team-grid-section">
          <div className="tgrid">
            {teamMembers.map((m) => (
              <div className="tm" key={m.name}>
                <img
                  src={m.img}
                  srcSet={m.srcSet}
                  sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  alt={m.name}
                  width={640}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
                <div className="tm-label">
                  <span className="tm-label-name">{m.name}</span>
                </div>
                <div className="tm-over">
                  <div className="tm-over-bar"></div>
                  <h3 className="tm-name">{m.name}</h3>
                  <p className="tm-role">{m.role}</p>
                  <p className="tm-spec" style={{ whiteSpace: "pre-line" }}>
                    {m.spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
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