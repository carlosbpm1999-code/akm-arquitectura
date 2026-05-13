import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { residentialProjects } from "@/data/residentialProjects";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/residencial/")({
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
            {residentialProjects.map((project) => (
              <Link
                className="hotel-case rv"
                to="/residencial/$slug"
                params={{ slug: project.slug }}
                key={project.slug}
              >
                <div className="hotel-case-media">
                  <img src={project.images[0]} alt={project.name} loading="lazy" />
                </div>
                <h3>{project.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}