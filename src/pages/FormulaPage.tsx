import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { CATEGORY_BY_ID, FORMULA_BY_ID, formulasOfCategory } from "../data";
import type { FormulaDef } from "../data/types";
import { Equation } from "../components/Equation";
import { Calculator } from "../components/Calculator";

function Play({ f }: { f: FormulaDef }) {
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
      <div className="card relative overflow-hidden p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.07),transparent_60%)]" />
        <div className="relative flex min-h-36 items-center justify-center py-4 text-3xl md:text-4xl">
          <Equation
            formula={f}
            solveFor={solveFor}
            selected={infoId}
            onSelect={select}
            interactive
          />
        </div>
        <p className="relative text-center text-xs text-mut">
          👆 Bir büyüklüğe tıkla — formül onun için çözülsün (Umstellen), açıklaması aşağıda belirsin.
        </p>
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
              {vd.name}
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
          className="card p-5"
        >
            <h3 className="font-disp text-sm uppercase tracking-widest text-mut">🔎 Bu ne?</h3>
            <p className="mt-3 text-2xl">
              <span className="eq-v eq-v-static text-volt">
                {infoVar.sym}
                {infoVar.sub && <sub className="eq-sub">{infoVar.sub}</sub>}
              </span>
              <span className="ml-3 font-disp text-lg font-semibold text-ink">{infoVar.name}</span>
              {infoVar.de && <span className="ml-2 text-sm text-mut">· {infoVar.de}</span>}
            </p>
            <p className="mt-1 text-sm text-spark">
              Birim: {infoVar.units?.map((u) => u.label).join(" / ") || infoVar.unitNote || "birimsiz"}
              {infoVar.integer ? " · tam sayı" : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/90">{infoVar.desc}</p>
            <p className="mt-3 rounded-xl border border-line bg-bg/50 p-3 text-sm leading-relaxed text-mut">
              <span className="font-semibold text-ink">📍 Nereden bulurum?</span> {infoVar.find}
            </p>
            {!solvable && (
              <p className="mt-3 rounded-xl border border-volt/30 bg-volt/10 p-3 text-sm text-volt">
                Bu kart {infoVar.sym} için otomatik çözüm sunmuyor — açıklamadaki taktiğe göz at. 😉
              </p>
            )}
        </motion.div>

        <Calculator key={`${f.id}-${solveFor}`} formula={f} solveFor={solveFor} />
      </div>

      {/* ── Açıklama ─────────────────────────────────────────────────── */}
      <div className="card mt-6 p-5">
        <h3 className="font-disp text-sm uppercase tracking-widest text-mut">🧠 Bu formül ne anlatıyor?</h3>
        <p className="mt-3 leading-relaxed text-ink/90">{f.desc}</p>
        {f.note && (
          <p className="mt-4 rounded-xl border border-volt/30 bg-volt/10 p-3 text-sm leading-relaxed text-volt">
            ⚠️ {f.note}
          </p>
        )}
      </div>
    </>
  );
}

export default function FormulaPage() {
  const { id } = useParams();
  const f = id ? FORMULA_BY_ID[id] : undefined;
  if (!f) {
    return (
      <p className="text-mut">
        Bu formül bulunamadı. Belki henüz icat edilmedi?{" "}
        <Link to="/" className="text-volt underline">
          Ana sayfaya dön
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
          Ana sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/kategori/${cat.id}`} className="hover:text-ink">
          {cat.icon} {cat.title}
        </Link>
      </nav>
      <h1 className="font-disp text-3xl font-bold text-ink">{f.title}</h1>
      <p className="mb-6 mt-1 text-mut italic">{f.tagline}</p>

      <Play key={f.id} f={f} />

      <div className="mt-8 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link to={`/formul/${prev.id}`} className="text-mut transition hover:text-volt">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/formul/${next.id}`} className="text-right text-mut transition hover:text-volt">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
