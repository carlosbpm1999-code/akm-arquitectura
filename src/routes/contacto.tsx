import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/contacto")({
  component: ContactoPage,
  head: () => ({
    meta: [
      { title: "Contacto — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Hablemos de tu proyecto. Estudio AKM Arquitectura en Barcelona: C/ Bailén 176, 932 453 032, info@akmarquitectura.com.",
      },
      { property: "og:title", content: "Contacto — AKM Arquitectura" },
      {
        property: "og:description",
        content: "Estudio de arquitectura en Barcelona. Contacta con AKM Kassem & Molinero.",
      },
    ],
  }),
});

function ContactoPage() {

  useEffect(() => {
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            setTimeout(() => el.classList.add("on"), i * 55);
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));
    return () => {
      ob.disconnect();
    };
  }, []);

  return (
    <>
      <Nav />

      <main className="team-page">
        <section className="contact" id="contacto" style={{ paddingTop: "8rem" }}>
          <span className="eyebrow rv">Contacto</span>
          <h1 className="heading rv">
            Tu proyecto <em>empieza aquí</em>
          </h1>
          <div className="contact-grid">
            <div>
              <div className="citem rv">
                <div>
                  <p className="ck">Teléfono</p>
                  <a href="tel:932453032" className="cv">932 453 032</a>
                </div>
              </div>
              <div className="citem rv">
                <div>
                  <p className="ck">Email</p>
                  <a href="mailto:info@akmarquitectura.com" className="cv">
                    info@akmarquitectura.com
                  </a>
                </div>
              </div>
              <div className="citem rv">
                <div>
                  <p className="ck">Estudio</p>
                  <span className="cv">
                    C/ Bailén 176, entresuelo 2a<br />08037 Barcelona
                  </span>
                </div>
              </div>
              <div className="socials rv">
                <a
                  href="https://www.instagram.com/akm_arquitectura/"
                  target="_blank"
                  rel="noreferrer"
                  className="soc"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/akm-arquitectura/"
                  target="_blank"
                  rel="noreferrer"
                  className="soc"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="rv">
              <p className="map-label">Ubicación del estudio</p>
              <div className="map-wrap">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.065!2d2.172694!3d41.403578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2ef49f83f47%3A0x3b5c5e7e2b5c5e5e!2sCarrer%20de%20Bail%C3%A9n%2C%20176%2C%20L%27Eixample%2C%2008037%20Barcelona!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AKM Arquitectura"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
