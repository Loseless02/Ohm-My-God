import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { CATEGORIES, TOPICS } from "./data";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-1.5 text-sm transition ${
      isActive ? "bg-volt/15 text-volt" : "text-mut hover:bg-panel2 hover:text-ink"
    }`;
  return (
    <nav className="space-y-6 pb-10">
      <div>
        <p className="mb-2 px-3 font-disp text-xs uppercase tracking-widest text-mut/70">
          İnteraktif
        </p>
        <NavLink to="/playground" className={linkCls} onClick={onNavigate}>
          <span className="mr-2 inline-block w-5 text-center">🎛️</span>
          Playground
          <span className="ml-1.5 rounded-full bg-spark/15 px-1.5 text-[10px] text-spark">yeni</span>
        </NavLink>
      </div>
      <div>
        <p className="mb-2 px-3 font-disp text-xs uppercase tracking-widest text-mut/70">
          Formüller
        </p>
        {CATEGORIES.map((c) => (
          <NavLink key={c.id} to={`/kategori/${c.id}`} className={linkCls} onClick={onNavigate}>
            <span className="mr-2 inline-block w-5 text-center">{c.icon}</span>
            {c.title}
          </NavLink>
        ))}
      </div>
      <div>
        <p className="mb-2 px-3 font-disp text-xs uppercase tracking-widest text-mut/70">
          Konular
        </p>
        {TOPICS.map((t) => (
          <NavLink key={t.id} to={`/konu/${t.id}`} className={linkCls} onClick={onNavigate}>
            <span className="mr-2 inline-block w-5 text-center">{t.icon}</span>
            {t.title}
            {t.stub && <span className="ml-1.5 text-[10px]">🚧</span>}
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
      <span className="font-disp text-lg font-bold tracking-tight text-ink">
        OHM <span className="text-volt">MY</span> GOD
      </span>
    </Link>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-line bg-panel/40 px-3 py-5 md:block">
        <div className="mb-6">
          <Logo />
          <p className="mt-1 px-3 text-[11px] text-mut/70">elektrik el kitabı · v0.1 · TR</p>
        </div>
        <NavList />
      </aside>

      {/* Mobil üst bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/90 px-2 py-2 backdrop-blur md:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMenuOpen((s) => !s)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-mut"
        >
          {menuOpen ? "✕ Kapat" : "☰ Menü"}
        </button>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 z-20 overflow-y-auto bg-bg/95 px-3 pb-8 pt-16 backdrop-blur md:hidden">
          <NavList onNavigate={() => setMenuOpen(false)} />
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
          <Outlet />
        </main>
        <footer className="border-t border-line px-4 py-6 text-center text-xs text-mut/70">
          Ohm kanunu her yerde geçerlidir; itirazlar Kirchhoff'a iletilir. · Bu site bir hobi/öğrenme
          projesidir, bağlayıcı teknik doküman değildir — gerçek tesisatta normlar (VDE) ve ustan
          konuşur. ⚡ 2026
        </footer>
      </div>
    </div>
  );
}
