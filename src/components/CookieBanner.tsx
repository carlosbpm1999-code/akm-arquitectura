import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "akm-cookies-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, date: new Date().toISOString() }),
      );
    } catch {
      /* noop */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-copy">
          <p className="cookie-banner-title">Uso de cookies</p>
          <p className="cookie-banner-text">
            Utilizamos cookies propias y de terceros para analizar la navegación y mejorar nuestros servicios.
            Puedes aceptarlas o rechazarlas. Más información en nuestra{" "}
            <Link to="/cookies">Política de Cookies</Link>.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button type="button" className="cookie-btn cookie-btn-ghost" onClick={() => handleChoice("declined")}>
            Rechazar
          </button>
          <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => handleChoice("accepted")}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}