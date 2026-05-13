import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { hotelProjects } from "@/data/hotelProjects";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

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

  useEffect(() => {

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
      <Nav />

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
                <h3>{project.name.replace("Catalonia ", "")}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}