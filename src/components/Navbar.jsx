import React, { useEffect, useState } from "react";
import "./navbar.css";
import { useThemeToggle } from "./dashboard/ThemeToggleProvider"; // <- ruta corregida

export default function Navbar({
  isAuthenticated,
  onLogin,
  onRegister,
  onLogout,
}) {
  // si quieres usar el switch de tema:
  const { toggleTheme } = useThemeToggle() || { toggleTheme: () => {} };

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`ss-nav ${scrolled ? "ss-nav--scrolled" : ""}`}>
      <div className="ss-nav__container">
        {/* Brand */}
        <a href="#inicio" className="ss-brand">
          <span className="ss-brand__logo" aria-hidden />
          <span className="ss-brand__name">StockSavvy</span>
        </a>

        {/* Links center (desktop) */}
        <nav className="ss-links" aria-label="Primary">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#funciones">Funciones</a></li>
            <li><a href="#precios">Precios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>

        {/* CTA right */}
        <div className="ss-cta">
          {!isAuthenticated ? (
            <>
              <button className="ss-btn ss-btn--ghost" onClick={onLogin}>
                Login
              </button>
              <button className="ss-btn ss-btn--ghost" onClick={onRegister}>
                Register
              </button>
              <button className="ss-btn ss-btn--primary">Prueba Gratis</button>
            </>
          ) : (
            <button className="ss-btn ss-btn--danger" onClick={onLogout}>
              Cerrar sesión
            </button>
          )}

          {/* opcional: switch de tema */}
          <button
            className="ss-theme"
            title="Cambiar tema"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          />
        </div>

        {/* Burger (mobile) */}
        <button
          className={`ss-burger ${open ? "is-open" : ""}`}
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Panel móvil */}
      <div className={`ss-mobile ${open ? "is-open" : ""}`}>
        <nav aria-label="Mobile">
          <a href="#inicio" onClick={() => setOpen(false)}>Inicio</a>
          <a href="#funciones" onClick={() => setOpen(false)}>Funciones</a>
          <a href="#precios" onClick={() => setOpen(false)}>Precios</a>
          <a href="#contacto" onClick={() => setOpen(false)}>Contacto</a>

          <div className="ss-mobile__cta">
            {!isAuthenticated ? (
              <>
                <button className="ss-btn ss-btn--ghost" onClick={() => { setOpen(false); onLogin?.(); }}>
                  Login
                </button>
                <button className="ss-btn ss-btn--ghost" onClick={() => { setOpen(false); onRegister?.(); }}>
                  Register
                </button>
                <button className="ss-btn ss-btn--primary">Prueba Gratis</button>
              </>
            ) : (
              <button className="ss-btn ss-btn--danger" onClick={() => { setOpen(false); onLogout?.(); }}>
                Cerrar sesión
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

