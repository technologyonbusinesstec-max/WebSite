// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"ES" | "EN">("ES");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync initial language from localStorage and listen to global language changes
  useEffect(() => {
    const saved = localStorage.getItem("tob_lang");
    if (saved === "en" || saved === "EN") {
      setLang("EN");
    }

    const handleLangChanged = (e: any) => {
      const l = e.detail?.lang;
      if (l) {
        setLang(l.toUpperCase() === "EN" ? "EN" : "ES");
      }
    };

    window.addEventListener("languageChanged", handleLangChanged);
    return () => window.removeEventListener("languageChanged", handleLangChanged);
  }, []);

  // Add scroll listener to toggle .scrolled class
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLanguage = (next: "ES" | "EN") => {
    setLang(next);
    const langKey = next.toLowerCase();
    localStorage.setItem("tob_lang", langKey);

    if (typeof (window as any).applyTranslations === "function") {
      (window as any).applyTranslations(langKey);
    }
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang: langKey } }));
  };

  const toggleLang = () => {
    const next = lang === "ES" ? "EN" : "ES";
    changeLanguage(next);
  };

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const t = (es: string, en: string) => (lang === "ES" ? es : en);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={"navbar " + (scrolled ? "scrolled" : "")} id="navbar">
        {/* Left – Logo */}
        <div className="navbar-left">
          <a href="/#hero" className="logo-link">
            <img src="/imagenes/LogoTob.webp" alt="Logo ToB" className="logo-img" />
          </a>
        </div>

        {/* Center – Nav items with dropdowns */}
        <div className="navbar-center">
          <div className="nav-item">
            <a href="/programa" className="nav-link">{t("Programa del evento", "Event Program")}</a>
            <div className="dropdown-duna">
              <div className="dropdown-content">
                <h4 data-i18n="nav_prog_title">Agenda completa</h4>
                <p data-i18n="nav_prog_desc">Descubre todas las charlas y talleres del ToB.</p>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <a href="/speakers" className="nav-link">{t("Speakers", "Speakers")}</a>
            <div className="dropdown-duna">
              <div className="dropdown-content">
                <h4 data-i18n="nav_speak_title">Nuestros Ponentes</h4>
                <p data-i18n="nav_speak_desc">Conoce a los expertos que liderarán el evento.</p>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <a href="/sponsors" className="nav-link">{t("Sponsors", "Sponsors")}</a>
            <div className="dropdown-duna">
              <div className="dropdown-content">
                <h4 data-i18n="nav_spon_title">Nuestros Aliados</h4>
                <p data-i18n="nav_spon_desc">Empresas que hacen posible este evento.</p>
              </div>
            </div>
          </div>
          <div className="nav-item">
            {/* Galería: visible pero todavía sin acceso */}
            <span className="nav-link nav-link--disabled" aria-disabled="true">{t("Galería ToB", "ToB Gallery")}</span>
            <div className="dropdown-duna">
              <div className="dropdown-content">
                <h4 data-i18n="nav_gallery_title">Muy pronto...</h4>
                <p data-i18n="nav_gallery_desc">Revive los mejores momentos.</p>
              </div>
            </div>
          </div>
          <div className="nav-item">
            <a href="/hackatob" className="nav-link highlight-link">{t("HackaToB", "HackaToB")}</a>
            <div className="dropdown-duna">
              <div className="dropdown-content">
                <h4 data-i18n="nav_hack_title">Hackathon ToB</h4>
                <p data-i18n="nav_hack_desc">Muy pronto nuevas noticias.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right – language selector, coordinators button, attending button, hamburger */}
        <div className="navbar-right">
          <div className="lang-selector" id="langToggle" data-lang={lang} onClick={toggleLang} role="button" aria-label="Cambiar idioma">
            <span className={"lang-text " + (lang === "ES" ? "active" : "")}>ES</span>
            <span className={"lang-text " + (lang === "EN" ? "active" : "")}>EN</span>
            <div className="lang-slider" style={{ transform: lang === "EN" ? "translateX(100%)" : "translateX(0)" }} />
          </div>
          <a href="/coordinacion" className="coordinators-btn" aria-label={t("Coordinadores", "Coordinators")}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div className="tooltip-text">
              <strong>{t("Coordinadores del evento", "Event Coordinators")}</strong><br />
              {t("Conoce las personas que están detrás del ToB 2026", "Meet the people behind ToB 2026")}
            </div>
          </a>
          <a href="https://luma.com/technologyonbusiness" target="_blank" className="btn btn-primary" data-i18n="nav_asistir">
            {t("Asistir", "Attend")}
          </a>
          <button className={"menu-toggle " + (mobileOpen ? "active" : "")} id="menuToggle" aria-label={t("Menú", "Menu")} onClick={toggleMobile}>
            <span className="hamburger" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className={"mobile-nav " + (mobileOpen ? "open" : "")} id="mobileNav">
        <a href="/programa" className="mobile-link">{t("Programa del evento", "Event Program")}</a>
        <a href="/speakers" className="mobile-link">{t("Speakers", "Speakers")}</a>
        <a href="/sponsors" className="mobile-link">{t("Sponsors", "Sponsors")}</a>
        <span className="mobile-link nav-link--disabled" aria-disabled="true">{t("Galería ToB", "ToB Gallery")}</span>
        <a href="/hackatob" className="mobile-link highlight-link">{t("HackaToB", "HackaToB")}</a>
        <div className="mobile-actions">
          <div className="lang-selector" id="langToggleMobile" data-lang={lang} onClick={toggleLang} role="button" aria-label="Cambiar idioma">
            <span className={"lang-text " + (lang === "ES" ? "active" : "")}>ES</span>
            <span className={"lang-text " + (lang === "EN" ? "active" : "")}>EN</span>
            <div className="lang-slider" style={{ transform: lang === "EN" ? "translateX(100%)" : "translateX(0)" }} />
          </div>
          <a href="/coordinacion" className="coordinators-btn" aria-label={t("Coordinadores", "Coordinators")}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {t("Coordinadores", "Coordinators")}
          </a>
          <a href="https://luma.com/technologyonbusiness" target="_blank" className="btn btn-primary" data-i18n="nav_asistir">
            {t("Asistir", "Attend")}
          </a>
        </div>
      </nav>
    </>
  );
};
