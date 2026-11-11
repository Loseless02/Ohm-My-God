import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { CATEGORIES, TOPICS } from "./data";
import { LANGS, useI18n } from "./i18n";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t, tx } = useI18n();
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2 text-sm transition md:py-1.5 ${
      isActive ? "bg-volt/15 text-volt" : "text-mut hover:bg-panel2 hover:text-ink"
    }`;
  const headCls = "mb-2 px-3 font-disp text-xs uppercase tracking-widest text-mut/70";
  return (
    <nav className="space-y-6 pb-10">
      <div>
        <p className={headCls}>{t("nav.interactive")}</p>
        <NavLink to="/playground" className={linkCls} onClick={onNavigate}>
          <span className="mr-2 inline-block w-5 text-center">🎛️</span>
          Playground
        </NavLink>
        <NavLink to="/schaltung" className={linkCls} onClick={onNavigate}>
          <span className="mr-2 inline-block w-5 text-center">🧮</span>
          {t("nav.solver")}
        </NavLink>
        <NavLink to="/pruefung" className={linkCls} onClick={onNavigate}>
          <span className="mr-2 inline-block w-5 text-center">📝</span>
          {t("nav.exam")}
          <span className="ml-1.5 rounded-full bg-spark/15 px-1.5 text-[10px] text-spark">
            {t("nav.soon")}
          </span>
        </NavLink>
      </div>
      <div>
        <p className={headCls}>{t("nav.formulas")}</p>
        {CATEGORIES.map((c) => (
          <NavLink key={c.id} to={`/kategori/${c.id}`} className={linkCls} onClick={onNavigate}>
            <span className="mr-2 inline-block w-5 text-center">{c.icon}</span>
            {tx(c.title)}
          </NavLink>
        ))}
      </div>
      <div>
        <p className={headCls}>{t("nav.topics")}</p>
        {TOPICS.map((tp) => (
          <NavLink key={tp.id} to={`/konu/${tp.id}`} className={linkCls} onClick={onNavigate}>
            <span className="mr-2 inline-block w-5 text-center">{tp.icon}</span>
            {tx(tp.title)}
            {tp.stub && <span className="ml-1.5 text-[10px]">🚧</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2 px-3">
      <span className="text-xl transition group-hover:rotate-12">⚡</span>
      <span className="whitespace-nowrap font-disp text-lg font-bold tracking-tight text-ink">
        OHM <span className="text-volt">MY</span> GOD
      </span>
    </Link>
  );
}

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="flex shrink-0 rounded-lg border border-line bg-panel p-0.5"
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-md px-2 py-1 font-disp text-xs font-semibold uppercase transition ${
            lang === l ? "bg-volt text-black" : "text-mut hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  // geniş çalışma alanı isteyen sayfalar tam genişliği kullansın
  const wide = location.pathname === "/playground" || location.pathname === "/schaltung";

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  // menü açıkken arkadaki sayfa kaymasın
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-line bg-panel/40 px-3 py-5 md:block">
        <div className="mb-6">
          <Logo />
          <p className="mt-1 px-3 text-[11px] text-mut/70">{t("app.sub")}</p>
          <div className="mt-3 px-3">
            <LangSwitch />
          </div>
        </div>
        <NavList />
      </aside>

      {/* Mobil üst bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-line bg-bg/90 px-2 py-2 backdrop-blur md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <LangSwitch />
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("menu.close") : t("menu.open")}
            className="h-9 w-10 rounded-lg border border-line text-base text-mut"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-20 overflow-y-auto overscroll-contain bg-bg/95 px-3 pb-8 pt-16 backdrop-blur md:hidden">
          <NavList onNavigate={() => setMenuOpen(false)} />
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-col">
        <main
          className={`mx-auto w-full flex-1 px-4 md:px-8 ${
            wide ? "max-w-[1800px] py-5" : "max-w-5xl py-8"
          }`}
        >
          <Outlet />
        </main>
        <footer className="border-t border-line px-4 py-6 text-center text-xs text-mut/70">
          {t("footer")} ⚡ 2026
          <p className="mt-3">
            made and owned by Atherion also known as Loseless, for more{" "}
            <a href="https://github.com/loseless02" className="text-mut underline-offset-2 hover:text-volt hover:underline">
              github.com/loseless02
            </a>
            , to contact{" "}
            <a href="mailto:vet-physic0l@icloud.com" className="text-mut underline-offset-2 hover:text-volt hover:underline">
              vet-physic0l@icloud.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
