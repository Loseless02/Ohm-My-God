import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, FORMULAS, TOPICS, formulasOfCategory } from "../data";
import type { FormulaDef } from "../data/types";
import { FormulaCard } from "../components/FormulaCard";
import { rich, useI18n, type Lang } from "../i18n";

// birim adı → temel birim sembolü ("volt" yazana V birimli her şeyi bul)
const UNIT_WORDS: Record<string, string> = {
  volt: "V",
  amper: "A",
  ampere: "A",
  amp: "A",
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
  newtonmeter: "Nm",
};

// "Hangi büyüklüğü arıyorsun?" tablosu
const QUANTS: { q: string; sym: string; name: Record<Lang, string> }[] = [
  { q: "U", sym: "U", name: { tr: "Gerilim", en: "Voltage", de: "Spannung" } },
  { q: "I", sym: "I", name: { tr: "Akım", en: "Current", de: "Strom" } },
  { q: "R", sym: "R", name: { tr: "Direnç", en: "Resistance", de: "Widerstand" } },
  { q: "P", sym: "P", name: { tr: "Güç", en: "Power", de: "Leistung" } },
  { q: "W", sym: "W", name: { tr: "İş / Enerji", en: "Work / Energy", de: "Arbeit / Energie" } },
  { q: "f", sym: "f", name: { tr: "Frekans", en: "Frequency", de: "Frequenz" } },
  { q: "T", sym: "T", name: { tr: "Periyot", en: "Period", de: "Periodendauer" } },
  { q: "C", sym: "C", name: { tr: "Kapasite", en: "Capacitance", de: "Kapazität" } },
  { q: "L", sym: "L", name: { tr: "İndüktans", en: "Inductance", de: "Induktivität" } },
  { q: "XL", sym: "X_L", name: { tr: "İnd. reaktans", en: "Ind. reactance", de: "Ind. Blindwiderstand" } },
  { q: "XC", sym: "X_C", name: { tr: "Kap. reaktans", en: "Cap. reactance", de: "Kap. Blindwiderstand" } },
  { q: "cos φ", sym: "cos φ", name: { tr: "Güç faktörü", en: "Power factor", de: "Leistungsfaktor" } },
  { q: "η", sym: "η", name: { tr: "Verim", en: "Efficiency", de: "Wirkungsgrad" } },
  { q: "S", sym: "S", name: { tr: "Görünür güç", en: "Apparent power", de: "Scheinleistung" } },
  { q: "M", sym: "M", name: { tr: "Moment", en: "Torque", de: "Drehmoment" } },
  { q: "n", sym: "n", name: { tr: "Devir", en: "Speed", de: "Drehzahl" } },
  { q: "Δu", sym: "Δu", name: { tr: "Gerilim düşümü", en: "Voltage drop", de: "Spannungsfall" } },
  { q: "A", sym: "A", name: { tr: "Kesit", en: "Cross-section", de: "Querschnitt" } },
];

interface Hit {
  f: FormulaDef;
  via?: string; // hangi büyüklük üzerinden eşleşti
}

function searchFormulas(qRaw: string, lang: Lang, tx: (s: string) => string): Hit[] {
  // Türkçe'de I/ı ve İ/i ayrımı var; başka dillerde "Inductance" → "ınductance" olmasın
  const low = (s: string) => s.toLocaleLowerCase(lang);
  const q = low(qRaw.trim());
  if (!q) return [];
  const qc = q.replace(/\s+/g, "");
  const unitTarget = UNIT_WORDS[q];
  const hits: Hit[] = [];
  for (const f of FORMULAS) {
    let via: string | undefined;
    let ok = false;
    for (const vd of f.vars) {
      const symFull = low(vd.sym + (vd.sub ?? "")).replace(/\s+/g, "");
      const exact = symFull === qc || low(vd.id) === qc;
      const byName =
        q.length >= 2 &&
        (low(tx(vd.name)).includes(q) || low(vd.name).includes(q) || low(vd.de ?? "").includes(q));
      const byUnit = (vd.units ?? []).some(
        (u) => low(u.label) === q || (unitTarget !== undefined && u.label.includes(unitTarget)),
      );
      if (exact || byName || byUnit) {
        ok = true;
        via = `${vd.sym}${vd.sub ? vd.sub : ""} · ${tx(vd.name)}`;
        break;
      }
    }
    if (!ok && q.length >= 2) {
      const hay = low(
        [tx(f.title), tx(f.tagline), tx(f.desc), f.title, ...(f.keywords ?? [])].join(" "),
      );
      if (hay.includes(q)) ok = true;
    }
    if (ok) hits.push({ f, via });
  }
  return hits.slice(0, 12);
}

function Search() {
  const { t, tx, lang } = useI18n();
  const [q, setQ] = useState("");
  const results = useMemo(() => searchFormulas(q, lang, tx), [q, lang, tx]);
  const active = q.trim().length > 0;

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("home.search")}
        aria-label={t("home.search")}
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className="mx-auto block w-full max-w-xl rounded-2xl border border-line bg-panel/80 px-5 py-3.5 text-ink shadow-lg outline-none backdrop-blur transition focus:border-volt/60 focus:ring-2 focus:ring-volt/20"
      />

      {/* büyüklük tablosu: yazmak istemeyenler için */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {QUANTS.map((c) => (
          <button
            key={c.q}
            type="button"
            onClick={() => setQ(q === c.q ? "" : c.q)}
            className={`rounded-full border px-3 py-1.5 text-xs transition sm:px-2.5 sm:py-1 ${
              q === c.q
                ? "border-volt/70 bg-volt/15 text-volt"
                : "border-line bg-panel/60 text-mut hover:border-spark/50 hover:text-ink"
            }`}
          >
            {c.sym} · {c.name[lang]}
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
          {t("home.noResult")}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const { t, tx, deTerm } = useI18n();
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative py-8 text-center md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_55%)]" />
        <h1 className="font-disp text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
          OHM MY GOD <span className="inline-block">⚡</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-mut sm:text-lg">
          {rich(t("home.lead"), "text-ink")}
        </p>
        <Search />
        <p className="mt-6 text-xs text-mut">
          {t("home.stats", { f: FORMULAS.length, c: CATEGORIES.length, t: TOPICS.length })}
        </p>
      </section>

      {/* ── Playground & Çözücü ──────────────────────────────────────── */}
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Link
          to="/playground"
          className="card group relative block overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-spark/60 hover:shadow-[0_8px_50px_rgba(34,211,238,0.12)] sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08),transparent_55%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-disp text-2xl font-bold text-ink">🎛️ Playground</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mut">
                {rich(t("home.pg.desc"), "text-ink")}
              </p>
            </div>
            <span className="rounded-xl bg-spark/10 px-4 py-2 font-disp text-sm font-semibold text-spark transition group-hover:bg-spark/20">
              {t("home.pg.cta")} →
            </span>
          </div>
        </Link>
        <Link
          to="/schaltung"
          className="card group relative block overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-volt/60 hover:shadow-[0_8px_50px_rgba(251,191,36,0.12)] sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.08),transparent_55%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-disp text-2xl font-bold text-ink">🧮 {t("nav.solver")}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-mut">
                {rich(t("home.solver.desc"), "text-ink")}
              </p>
            </div>
            <span className="rounded-xl bg-volt/10 px-4 py-2 font-disp text-sm font-semibold text-volt transition group-hover:bg-volt/20">
              {t("home.solver.cta")} →
            </span>
          </div>
        </Link>
      </section>

      {/* ── Prüfungsvorbereitung ─────────────────────────────────────── */}
      <section className="mt-4">
        <Link
          to="/pruefung"
          className="card group relative block overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-spark/60 sm:p-6"
        >
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-disp text-2xl font-bold text-ink">
                📝 {t("nav.exam")}{" "}
                <span className="ml-1 rounded-full bg-spark/15 px-2 py-0.5 align-middle text-xs font-medium text-spark">
                  {t("nav.soon")}
                </span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mut">{t("home.exam.desc")}</p>
            </div>
            <span className="rounded-xl bg-spark/10 px-4 py-2 font-disp text-sm font-semibold text-spark transition group-hover:bg-spark/20">
              {t("home.exam.cta")} →
            </span>
          </div>
        </Link>
      </section>

      {/* ── Kategoriler ──────────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 font-disp text-xl font-semibold text-ink">📚 {t("home.cats")}</h2>
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
                    {count > 1
                      ? t("home.nFormulas", { n: count })
                      : count === 1
                        ? t("home.oneFormula")
                        : t("home.guide")}
                  </span>
                </div>
                <h3 className="mt-3 font-disp font-semibold text-ink transition group-hover:text-volt">
                  {tx(c.title)}
                </h3>
                {deTerm(c.de) && <p className="text-xs text-mut">{c.de}</p>}
                <p className="mt-2 text-sm leading-relaxed text-mut">{tx(c.blurb)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Konular ──────────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="mb-1 font-disp text-xl font-semibold text-ink">🎓 {t("nav.topics")}</h2>
        <p className="mb-4 text-sm text-mut">{t("home.topics.sub")}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((tp) => (
            <Link
              key={tp.id}
              to={`/konu/${tp.id}`}
              className="card group p-5 transition hover:-translate-y-0.5 hover:border-spark/50 hover:shadow-[0_8px_40px_rgba(34,211,238,0.08)]"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{tp.icon}</span>
                {tp.stub && (
                  <span className="rounded-full border border-volt/40 bg-volt/10 px-2 py-0.5 text-xs text-volt">
                    🚧
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-disp font-semibold text-ink transition group-hover:text-spark">
                {tx(tp.title)}
              </h3>
              {deTerm(tp.de) && <p className="text-xs text-mut">{tp.de}</p>}
              <p className="mt-2 text-sm leading-relaxed text-mut">{tx(tp.tagline)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Yol haritası ─────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="mb-4 font-disp text-xl font-semibold text-ink">🗺️ {t("home.roadmap")}</h2>
        <div className="card flex flex-wrap gap-2 p-4 text-sm text-mut sm:gap-3 sm:p-5">
          {t("home.roadmap.items")
            .split("|")
            .map((item) => (
              <span key={item} className="rounded-full border border-line bg-bg/50 px-3 py-1.5">
                {item}
              </span>
            ))}
        </div>
      </section>
    </div>
  );
}
