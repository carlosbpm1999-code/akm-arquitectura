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
