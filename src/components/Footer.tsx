import { Link } from "@tanstack/react-router";
import wordmarkDark from "@/assets/brand/akm-wordmark-dark.svg";

export function Footer() {
  return (
    <footer className="akm-footer">
      <div className="f-inner">
        <Link to="/" className="f-wordmark-link">
          <img src={wordmarkDark} alt="Arqués – Kassem & Molinero Arquitectura" className="f-wordmark" />
        </Link>

        <nav className="f-nav">
          <a href="/#estudio">Estudio</a>
          <a href="/#portfolio">Portfolio</a>
          <Link to="/hoteles">Hoteles</Link>
          <Link to="/residencial">Residencial</Link>
          <Link to="/equipo">Equipo</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="f-socials">
          <a
            href="https://www.instagram.com/akm_arquitectura/"
            target="_blank"
            rel="noreferrer"
            className="f-soc"
            aria-label="Instagram de AKM Arquitectura"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
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
            className="f-soc"
            aria-label="LinkedIn de AKM Arquitectura"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </a>
        </div>

        <p className="f-contact">
          C/ Bailén 176, entresuelo 2a · 08037 Barcelona
          {" · "}
          <a href="tel:+34932453032">+34 932 453 032</a>
          {" · "}
          <a href="mailto:info@akmarquitectura.com">info@akmarquitectura.com</a>
        </p>
      </div>

      <div className="f-bottom">
        <span className="f-copy">© 2025 Arqués–Kassem–Molinero Associats, SLP</span>
        <div className="f-legal">
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/aviso-legal">Aviso Legal</Link>
        </div>
        <span className="f-est">Barcelona · Est.&nbsp;1980</span>
      </div>
    </footer>
  );
}
