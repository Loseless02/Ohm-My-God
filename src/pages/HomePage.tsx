import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, FORMULAS, TOPICS, formulasOfCategory } from "../data";
import type { FormulaDef } from "../data/types";
import { FormulaCard } from "../components/FormulaCard";

// birim adı → temel birim sembolü ("volt" yazana V birimli her şeyi bul)
const UNIT_WORDS: Record<string, string> = {
  volt: "V",
  amper: "A",
  ampere: "A",
  ohm: "Ω",
  watt: "W",
  hertz: "Hz",
  herz: "Hz",
  farad: "F",
  henry: "H",
  siemens: "S",
  coulomb: "C",
  joule: "J",
  newtonmetre: "Nm",
};

// "Hangi büyüklüğü arıyorsun?" tablosu
const QUANTS: { q: string; label: string }[] = [
  { q: "U", label: "U · Gerilim" },
  { q: "I", label: "I · Akım" },
  { q: "R", label: "R · Direnç" },
  { q: "P", label: "P · Güç" },
  { q: "W", label: "W · İş / Enerji" },
  { q: "f", label: "f · Frekans" },
  { q: "T", label: "T · Periyot" },
  { q: "C", label: "C · Kapasite" },
  { q: "L", label: "L · İndüktans" },
  { q: "XL", label: "X_L · İnd. reaktans" },
  { q: "XC", label: "X_C · Kap. reaktans" },
  { q: "cos φ", label: "cos φ · Güç faktörü" },
  { q: "η", label: "η · Verim" },
  { q: "S", label: "S · Görünür güç" },
  { q: "M", label: "M · Moment" },
  { q: "n", label: "n · Devir" },
  { q: "Δu", label: "Δu · Gerilim düşümü" },
  { q: "A", label: "A · Kesit" },
];

interface Hit {
  f: FormulaDef;
  via?: string; // hangi büyüklük üzerinden eşleşti
}

function searchFormulas(qRaw: string): Hit[] {
  const q = qRaw.trim().toLocaleLowerCase("tr");
  if (!q) return [];
  const qc = q.replace(/\s+/g, "");
  const unitTarget = UNIT_WORDS[q];
  const hits: Hit[] = [];
  for (const f of FORMULAS) {
    let via: string | undefined;
    let ok = false;
    for (const vd of f.vars) {
      const symFull = (vd.sym + (vd.sub ?? "")).toLocaleLowerCase("tr").replace(/\s+/g, "");
      const exact = symFull === qc || vd.id.toLocaleLowerCase("tr") === qc;
      const byName =
        q.length >= 2 &&
        (vd.name.toLocaleLowerCase("tr").includes(q) ||
          (vd.de ?? "").toLocaleLowerCase("tr").includes(q));
      const byUnit = (vd.units ?? []).some(
        (u) =>
          u.label.toLocaleLowerCase("tr") === q ||
          (unitTarget !== undefined && u.label.includes(unitTarget)),
      );
      if (exact || byName || byUnit) {
        ok = true;
        via = `${vd.sym}${vd.sub ? vd.sub : ""} · ${vd.name}`;
        break;
      }
    }
    if (!ok && q.length >= 2) {
      const hay = [f.title, f.tagline, f.desc, ...(f.keywords ?? [])]
        .join(" ")
        .toLocaleLowerCase("tr");
      if (hay.includes(q)) ok = true;
    }
    if (ok) hits.push({ f, via });
  }
  return hits.slice(0, 12);
}

function Search() {
  const [q, setQ] = useState("");
  const results = useMemo(() => searchFormulas(q), [q]);
  const active = q.trim().length > 0;

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Hangi değeri arıyorsun? (ör. Frequenz, U, Hz, kesit, cos φ…)"
        className="mx-auto block w-full max-w-xl rounded-2xl border border-line bg-panel/80 px-5 py-3.5 text-ink shadow-lg outline-none backdrop-blur transition focus:border-volt/60 focus:ring-2 focus:ring-volt/20"
      />

      {/* büyüklük tablosu: yazmak istemeyenler için */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {QUANTS.map((c) => (
          <button
            key={c.q}
            type="button"
            onClick={() => setQ(q === c.q ? "" : c.q)}
            className={`rounded-full border px-2.5 py-1 text-xs transition ${
              q === c.q
                ? "border-volt/70 bg-volt/15 text-volt"
                : "border-line bg-panel/60 text-mut hover:border-spark/50 hover:text-ink"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* sonuç feed'i */}
      {active && results.length > 0 && (
        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          {results.map(({ f, via }, i) => (
            <FormulaCard
              key={f.id}
              f={f}
              badge={via}
              className="card-pop"
              style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
            />
          ))}
        </div>
      )}
      {active && results.length === 0 && (
        <p className="card-pop mx-auto mt-6 max-w-xl rounded-2xl border border-line bg-panel/70 px-5 py-4 text-sm text-mut">
          Hmm, bir şey bulamadım. Bahsettiğin formül ya gerçekte yok ya da bizde henüz yok 🤷 —
          ikincisiyse, eklenecekler listesine az önce girdi say. 📝
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-10 text-center md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_55%)]" />
        <h1 className="font-disp text-5xl font-bold tracking-tight text-ink md:text-6xl">
          OHM MY GOD <span className="inline-block">⚡</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-mut">
          Elektrik Ausbildung'unun formül ve bilgi üssü. Formüle tıkla, istediğin büyüklük için
          kendini yeniden yazsın; değerleri gir, sonucu al.{" "}
          <span className="text-ink">Ezber yok, anlamak var</span> — espriler dahildir, sigorta
          değildir.
        </p>
        <Search />
        <p className="mt-6 text-xs text-mut">
          {FORMULAS.length} interaktif formül · {CATEGORIES.length} kategori · {TOPICS.length} konu
          — ve daha gelecek çok şey var 🚀
        </p>
      </section>

      {/* ── Playground ───────────────────────────────────────────────── */}
      <section className="mt-4">
        <Link
          to="/playground"
          className="card group relative block overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-spark/60 hover:shadow-[0_8px_50px_rgba(34,211,238,0.12)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_55%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-disp text-2xl font-bold text-ink">
                🎛️ Playground{" "}
                <span className="ml-1 rounded-full bg-spark/15 px-2 py-0.5 align-middle text-xs font-medium text-spark">
                  yeni
                </span>
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mut">
                Kendi devreni kur: şalterler, butonlar, lambalar, motorlar,{" "}
                <span className="text-ink">kontaktörler ve zaman röleleri</span>. Simülasyonu
                başlat, akımın nereden geçtiğini izle, Selbsthaltung kur — ya da kısa devre yap,
                burada sigorta yerine espri atıyor.
              </p>
            </div>
            <span className="rounded-xl bg-spark/10 px-4 py-2 font-disp text-sm font-semibold text-spark transition group-hover:bg-spark/20">
              Devre kurmaya başla →
            </span>
          </div>
        </Link>
      </section>

      {/* ── Kategoriler ──────────────────────────────────────────────── */}
      <section className="mt-4">
        <h2 className="mb-4 font-disp text-xl font-semibold text-ink">📚 Formül Kategorileri</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const count = formulasOfCategory(c.id).length;
            return (
              <Link
                key={c.id}
                to={`/kategori/${c.id}`}
                className="card group p-5 transition hover:-translate-y-0.5 hover:border-volt/50 hover:shadow-[0_8px_40px_rgba(251,191,36,0.10)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{c.icon}</span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs text-mut">
                    {count > 0 ? `${count} formül` : "rehber"}
                  </span>
                </div>
                <h3 className="mt-3 font-disp font-semibold text-ink transition group-hover:text-volt">
                  {c.title}
                </h3>
                <p className="text-xs text-mut">{c.de}</p>
                <p className="mt-2 text-sm leading-relaxed text-mut">{c.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Konular ──────────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="mb-1 font-disp text-xl font-semibold text-ink">🎓 Konular</h2>
        <p className="mb-4 text-sm text-mut">
          Formülün ötesi: sistemler, koruma, pratik bilgi. Bazıları hâlâ şantiyede 🚧
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Link
              key={t.id}
              to={`/konu/${t.id}`}
              className="card group p-5 transition hover:-translate-y-0.5 hover:border-spark/50 hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{t.icon}</span>
                {t.stub && (
                  <span className="rounded-full border border-volt/40 bg-volt/10 px-2 py-0.5 text-xs text-volt">
                    🚧
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-disp font-semibold text-ink transition group-hover:text-spark">
                {t.title}
              </h3>
              {t.de && <p className="text-xs text-mut">{t.de}</p>}
              <p className="mt-2 text-sm leading-relaxed text-mut">{t.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Yol haritası ─────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="mb-4 font-disp text-xl font-semibold text-ink">🗺️ Yol Haritası</h2>
        <div className="card flex flex-wrap gap-3 p-5 text-sm text-mut">
          {[
            "🇩🇪 Almanca & 🇬🇧 İngilizce çeviri",
            "🤖 AI asistan",
            "🌐 Netzwerk konuları",
            "✍️ İnteraktif sembol kütüphanesi",
            "📊 Verlegearten tabloları",
            "🧪 Quiz & sınav modu",
            "🤝 Katkıda bulunan sistemi",
          ].map((item) => (
            <span key={item} className="rounded-full border border-line bg-bg/50 px-3 py-1.5">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
