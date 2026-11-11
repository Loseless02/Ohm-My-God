import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { CATEGORY_BY_ID, FORMULA_BY_ID, formulasOfCategory } from "../data";
import type { FormulaDef } from "../data/types";
import { Equation } from "../components/Equation";
import { Calculator } from "../components/Calculator";
import { useI18n } from "../i18n";

function Play({ f }: { f: FormulaDef }) {
  const { t, tx, deTerm } = useI18n();
  const [infoId, setInfoId] = useState(f.base);
  const [solveFor, setSolveFor] = useState(f.base);

  const select = (id: string) => {
    setInfoId(id);
    if (f.forms[id]) setSolveFor(id);
  };

  const infoVar = f.vars.find((v) => v.id === infoId)!;
  const solvable = Boolean(f.forms[infoId]);

  return (
    <>
      {/* ── Sahne: formül ─────────────────────────────────────────────── */}
      <div className="card relative overflow-hidden p-4 sm:p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.07),transparent_60%)]" />
        {/* uzun formüller dar ekranda taşmasın: yatay kaydırılabilir sahne */}
        <div className="relative overflow-x-auto overflow-y-hidden">
          <div className="mx-auto flex min-h-32 w-max items-center justify-center px-1 py-4 text-2xl sm:min-h-36 sm:text-3xl md:text-4xl">
            <Equation
              formula={f}
              solveFor={solveFor}
              selected={infoId}
              onSelect={select}
              interactive
            />
          </div>
        </div>
        <p className="relative text-center text-xs text-mut">👆 {t("formula.hint")}</p>
        <div className="relative mt-5 flex flex-wrap justify-center gap-2">
          {f.vars.map((vd) => (
            <button
              key={vd.id}
              type="button"
              onClick={() => select(vd.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                infoId === vd.id
                  ? "border-volt/70 bg-volt/15 text-volt"
                  : "border-line bg-panel text-mut hover:border-volt/40 hover:text-ink"
              }`}
            >
              <span className="eq-v eq-v-static">
                {vd.sym}
                {vd.sub && <sub className="eq-sub">{vd.sub}</sub>}
              </span>{" "}
              {tx(vd.name)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bilgi + hesap ─────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          key={infoId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="card p-4 sm:p-5"
        >
          <h3 className="font-disp text-sm uppercase tracking-widest text-mut">🔎 {t("formula.what")}</h3>
          <p className="mt-3 text-2xl">
            <span className="eq-v eq-v-static text-volt">
              {infoVar.sym}
              {infoVar.sub && <sub className="eq-sub">{infoVar.sub}</sub>}
            </span>
            <span className="ml-3 font-disp text-lg font-semibold text-ink">{tx(infoVar.name)}</span>
            {deTerm(infoVar.de) && <span className="ml-2 text-sm text-mut">· {infoVar.de}</span>}
          </p>
          <p className="mt-1 text-sm text-spark">
            {t("formula.unit")}:{" "}
            {infoVar.units?.map((u) => u.label).join(" / ") ||
              (infoVar.unitNote ? tx(infoVar.unitNote) : t("formula.unitless"))}
            {infoVar.integer ? ` · ${t("formula.integer")}` : ""}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/90">{tx(infoVar.desc)}</p>
          <p className="mt-3 rounded-xl border border-line bg-bg/50 p-3 text-sm leading-relaxed text-mut">
            <span className="font-semibold text-ink">📍 {t("formula.where")}</span> {tx(infoVar.find)}
          </p>
          {!solvable && (
            <p className="mt-3 rounded-xl border border-volt/30 bg-volt/10 p-3 text-sm text-volt">
              {t("formula.noSolve", { sym: infoVar.sym })}
            </p>
          )}
        </motion.div>

        <Calculator key={`${f.id}-${solveFor}`} formula={f} solveFor={solveFor} />
      </div>

      {/* ── Açıklama ─────────────────────────────────────────────────── */}
      <div className="card mt-6 p-4 sm:p-5">
        <h3 className="font-disp text-sm uppercase tracking-widest text-mut">🧠 {t("formula.tells")}</h3>
        <p className="mt-3 leading-relaxed text-ink/90">{tx(f.desc)}</p>
        {f.note && (
          <p className="mt-4 rounded-xl border border-volt/30 bg-volt/10 p-3 text-sm leading-relaxed text-volt">
            ⚠️ {tx(f.note)}
          </p>
        )}
      </div>
    </>
  );
}

export default function FormulaPage() {
  const { id } = useParams();
  const { t, tx } = useI18n();
  const f = id ? FORMULA_BY_ID[id] : undefined;
  if (!f) {
    return (
      <p className="text-mut">
        {t("formula.notFound")}{" "}
        <Link to="/" className="text-volt underline">
          {t("common.backHome")}
        </Link>
      </p>
    );
  }
  const cat = CATEGORY_BY_ID[f.cat];
  const siblings = formulasOfCategory(f.cat);
  const idx = siblings.findIndex((s) => s.id === f.id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  return (
    <div>
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          {t("common.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/kategori/${cat.id}`} className="hover:text-ink">
          {cat.icon} {tx(cat.title)}
        </Link>
      </nav>
      <h1 className="font-disp text-2xl font-bold text-ink sm:text-3xl">{tx(f.title)}</h1>
      <p className="mb-6 mt-1 text-mut italic">{tx(f.tagline)}</p>

      <Play key={f.id} f={f} />

      <div className="mt-8 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link to={`/formul/${prev.id}`} className="py-1 text-mut transition hover:text-volt">
            ← {tx(prev.title)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/formul/${next.id}`} className="py-1 text-right text-mut transition hover:text-volt">
            {tx(next.title)} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
