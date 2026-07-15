import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { FormulaDef } from "../data/types";
import { Equation } from "./Equation";

interface Props {
  f: FormulaDef;
  badge?: string; // hangi büyüklük üzerinden eşleşti (arama sonuçları için)
  className?: string;
  style?: CSSProperties;
}

export function FormulaCard({ f, badge, className = "", style }: Props) {
  return (
    <Link
      to={`/formul/${f.id}`}
      style={style}
      className={`card group block p-5 transition hover:border-volt/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)] ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-disp text-lg font-semibold text-ink transition group-hover:text-volt">
          {f.title}
        </h2>
        {badge && (
          <span className="shrink-0 rounded-full border border-spark/40 bg-spark/10 px-2 py-0.5 text-xs text-spark">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm italic text-mut">{f.tagline}</p>
      <div className="mt-4 flex justify-center overflow-x-auto rounded-xl border border-line/60 bg-bg/50 px-4 py-4 text-xl">
        <Equation formula={f} solveFor={f.base} />
      </div>
      <p className="mt-3 text-right text-xs text-mut opacity-0 transition group-hover:opacity-100">
        kurcalamak için tıkla →
      </p>
    </Link>
  );
}
