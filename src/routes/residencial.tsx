import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import logo from "@/assets/akm-logo.png";

const residentialCases = [
  { name: "Ausiàs March 35", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2-1024x1024.jpg" },
  { name: "Reforma Interior C104", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/C-104-1024x1024.jpg" },
  { name: "Ronda Universitat 35", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/RU-35-1024x1024.jpg" },
  { name: "Vallcorba 6", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/06/08_Vallcorba-6-3.jpg" },
  { name: "Casa Cristo", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/06/04_Casa-Cristo-1-1024x1024.jpg" },
  { name: "Casa Olmeda", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/00-PORTADA-8-1024x1024.jpg" },
  { name: "Casa CC2A", img: "https://www.akmarquitectura.com/wp-content/uploads/2026/01/CC2A_1-1024x689.webp" },
  { name: "Granja del Pas", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/04-16-1024x746.jpg" },
  { name: "Casa Ocaña", img: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/00-PORTADA-11-1024x1024.jpg" },
];

export const Route = createFileRoute("/residencial")({
  component: ResidencialPage,
  head: () => ({
    meta: [
      { title: "Residencial — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Casos de éxito residenciales de AKM Arquitectura: rehabilitación, reforma interior, obra nueva y viviendas singulares.",
      },
      { property: "og:title", content: "Residencial — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Selección de proyectos residenciales desarrollados por AKM Arquitectura.",
      },
      {
        property: "og:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
      },
      {
        name: "twitter:image",
        content: "https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg",
      },
    ],
  }),
});

function ResidencialPage() {
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
            <h1 className="hotels-title rv">Residencial</h1>
            <p className="hotels-intro rv">
              Proyectos de rehabilitación, reforma interior y vivienda singular donde precisión técnica, habitabilidad y contexto urbano definen cada intervención.
            </p>
          </div>
          <div className="hotels-hero-media rv">
            <img
              src="https://www.akmarquitectura.com/wp-content/uploads/2023/07/Barcelona-2004-Superficie-3.410m2.jpg"
              alt="Ausiàs March 35"
            />
          </div>
        </section>

        <section className="hotels-cases" aria-labelledby="residencial-casos">
          <div className="hotels-cases-head">
            <span className="eyebrow rv">Portfolio residencial</span>
            <h2 className="heading rv" id="residencial-casos">
              Selección de <em>proyectos</em>
            </h2>
          </div>
          <div className="hotels-list">
            {residentialCases.map((project) => (
              <article className="hotel-case rv" key={project.name}>
                <div className="hotel-case-media">
                  <img src={project.img} alt={project.name} loading="lazy" />
                </div>
                <h3>{project.name}</h3>
              </article>
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