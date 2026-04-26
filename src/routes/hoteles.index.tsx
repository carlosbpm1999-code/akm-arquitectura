import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";
import { hotelProjects } from "@/data/hotelProjects";

export const Route = createFileRoute("/hoteles/")({
  component: HotelesPage,
  head: () => ({
    meta: [
      { title: "Hoteles — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Casos de éxito de AKM Arquitectura en hoteles, restauración y rehabilitación hotelera para Catalonia Hotels y otros espacios singulares.",
      },
      { property: "og:title", content: "Hoteles — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Selección de casos de éxito hoteleros desarrollados por AKM Arquitectura.",
      },
      {
        property: "og:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
      {
        name: "twitter:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp",
      },
    ],
  }),
});

function HotelesPage() {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle("up", window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);

    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          setTimeout(() => el.classList.add("on"), index * 45);
          ob.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      ob.disconnect();
    };
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
      </nav>

      <main className="hotels-page">
        <section className="hotels-hero">
          <div className="hotels-hero-copy">
            <span className="eyebrow rv">Casos de éxito</span>
            <h1 className="hotels-title rv">Hoteles</h1>
            <p className="hotels-intro rv">
              Experiencia consolidada en rehabilitación, reforma interior y transformación de activos hoteleros con intervención sobre edificios históricos, espacios gastronómicos y entornos urbanos singulares.
            </p>
          </div>
          <div className="hotels-hero-media rv">
            <img
              src="https://www.akmarquitectura.com/wp-content/uploads/2025/10/01.webp"
              alt="Hotel Catalonia Plaza España"
            />
          </div>
        </section>

        <section className="hotels-cases" aria-labelledby="hoteles-casos">
          <div className="hotels-cases-head">
            <span className="eyebrow rv">Portfolio hotelero</span>
            <h2 className="heading rv" id="hoteles-casos">
              Selección de <em>proyectos</em>
            </h2>
          </div>
          <div className="hotels-list">
            {hotelProjects.map((project) => (
              <Link className="hotel-case rv" to="/hoteles/$slug" params={{ slug: project.slug }} key={project.name}>
                <div className="hotel-case-media">
                  <img src={project.images[0]} alt={project.name} loading="lazy" />
                </div>
                <h3>{project.name}</h3>
              </Link>
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