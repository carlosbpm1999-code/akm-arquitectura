import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ContactForm } from "@/components/ContactForm";
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
            setTimeout(() => el.classList.add("on"), i * 60);
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px 350px 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => ob.observe(el));
    if (window.location.hash === "#formulario") {
      document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
    }
    return () => ob.disconnect();
  }, []);

  return (
    <>
      <Nav />

      <main className="cp-page">
        <section className="cp-split">

          {/* ── Left panel ── */}
          <div className="cp-left">
            <span className="eyebrow rv">Contacto</span>
            <h1 className="cp-title rv">
              Hablemos de tu<br />
              <em>próximo proyecto</em>
            </h1>
            <p className="cp-intro rv">
              Cuéntanos tu idea. Llevamos más de cuatro décadas transformando edificios y ciudades, y cada encargo merece toda nuestra atención, sea cual sea su escala.
            </p>

            <a href="#formulario" className="cp-cta rv">
              Envíanos un mensaje
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>

            <div className="cp-items">
              <a href="tel:+34932453032" className="cp-item rv">
                <span className="cp-item-label">Teléfono</span>
                <span className="cp-item-value">+34 932 453 032</span>
              </a>
              <a href="mailto:info@akmarquitectura.com" className="cp-item rv">
                <span className="cp-item-label">Email</span>
                <span className="cp-item-value">info@akmarquitectura.com</span>
              </a>
              <div className="cp-item rv">
                <span className="cp-item-label">Estudio</span>
                <span className="cp-item-value">
                  C/ Bailén 176, entresuelo 2a<br />
                  08037 Barcelona
                </span>
              </div>
              <div className="cp-item rv">
                <span className="cp-item-label">Horario</span>
                <span className="cp-item-value">Lun–Vie · 9:00 – 18:00</span>
              </div>
            </div>

            <div className="cp-socials rv">
              <a
                href="https://www.instagram.com/akm_arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="cp-soc cp-soc--instagram"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/akm-arquitectura/"
                target="_blank"
                rel="noreferrer"
                className="cp-soc cp-soc--linkedin"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <line x1="8" y1="10" x2="8" y2="17" />
                  <circle cx="8" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
                  <path d="M12 17v-4.3a2.4 2.4 0 014.8 0V17" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* ── Right panel: full-height map ── */}
          <div className="cp-right">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.065!2d2.172694!3d41.403578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2ef49f83f47%3A0x3b5c5e7e2b5c5e5e!2sCarrer%20de%20Bail%C3%A9n%2C%20176%2C%20L%27Eixample%2C%2008037%20Barcelona!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AKM Arquitectura — C/ Bailén 176, Barcelona"
            />
            <div className="cp-map-tag">
              <span className="cp-map-tag-name">AKM Arquitectura</span>
              <span className="cp-map-tag-addr">C/ Bailén 176 · Barcelona</span>
            </div>
          </div>

        </section>

        {/* ── Formulario ── */}
        <section className="cp-form" id="formulario">
          <div className="cp-form-head">
            <span className="eyebrow rv">Escríbenos</span>
            <h2 className="heading rv">
              Envíanos un <em>mensaje</em>
            </h2>
            <p className="cp-form-intro rv">
              Cuéntanos qué necesitas y te responderemos por correo lo antes posible.
            </p>
          </div>
          <div className="cp-form-card rv">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
