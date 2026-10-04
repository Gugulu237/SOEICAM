"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "@/lib/i18n";
import type { SiteCopy, SiteLanguage } from "@/lib/i18n";

type LanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  copy: SiteCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside SiteShell");
  return context;
}

const links = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/about", key: "about" },
  { href: "/dairy", key: "dairy" },
  { href: "/contact", key: "contact" },
] as const;

function Header() {
  const { language, setLanguage, copy } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="header-inner page-container">
        <Link href="/" className="brand-lockup" aria-label="SOEICAM home">
          <Image src="/brand/logos/soeicam.png" alt="SOEICAM" width={150} height={61} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href || (link.href === "/products" && pathname.startsWith("/products/")) ? "nav-link active" : "nav-link"}>
              {copy.nav[link.key]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label="Language / Langue">
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" aria-pressed={language === "fr"} onClick={() => setLanguage("fr")}>FR</button>
          </div>
          <Link className="header-contact" href="/contact">{copy.nav.contact}<ArrowUpRight size={15} strokeWidth={2} /></Link>
          <button className="menu-toggle icon-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{copy.nav[link.key]}</Link>)}
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const { copy } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="page-container footer-main">
        <div className="footer-brand">
          <Image src="/brand/logos/soeicam.png" alt="SOEICAM" width={178} height={73} />
          <p>{copy.footer.tagline}</p>
        </div>
        <div>
          <h2>{copy.footer.explore}</h2>
          <nav className="footer-links" aria-label="Footer navigation">
            {links.slice(1, 4).map((link) => <Link key={link.href} href={link.href}>{copy.nav[link.key]}</Link>)}
          </nav>
        </div>
        <div>
          <h2>{copy.footer.getInTouch}</h2>
          <div className="footer-links">
            <a href="tel:+237681218946"><Phone size={15} /> +237 681 21 89 46</a>
            <a href="mailto:info@soeicam.com"><Mail size={15} /> info@soeicam.com</a>
            <span>Rue Sion 1, Yaoundé</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom page-container"><span>© {new Date().getFullYear()} SOEICAM. {copy.footer.rights}</span><span>Cameroon · Cameroun</span></div>
    </footer>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("soeicam-language");
    if (saved === "en" || saved === "fr") setLanguageState(saved);
  }, []);

  function setLanguage(next: SiteLanguage) {
    setLanguageState(next);
    document.documentElement.lang = next;
    window.localStorage.setItem("soeicam-language", next);
  }

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, copy: translations[language] }}>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </LanguageContext.Provider>
  );
}
