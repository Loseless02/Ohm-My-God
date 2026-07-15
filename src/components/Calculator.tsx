import { useMemo, useState } from "react";
import type { FormulaDef, UnitOption } from "../data/types";
import { collectVars, evalExpr } from "../lib/expr";
import { bestUnit, fmt, parseNum } from "../lib/format";

const NO_UNIT: UnitOption[] = [{ label: "", mult: 1 }];

interface Props {
  formula: FormulaDef;
  solveFor: string;
}

export function Calculator({ formula, solveFor }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [unitSel, setUnitSel] = useState<Record<string, number>>({});
  const [resUnit, setResUnit] = useState<number | "auto">("auto");

  const rhs = formula.forms[solveFor];
  const solveVar = formula.vars.find((v) => v.id === solveFor)!;
  const inputIds = useMemo(() => {
    const used = collectVars(rhs);
    return formula.vars.filter((v) => used.includes(v.id) && v.id !== solveFor).map((v) => v.id);
  }, [formula, rhs, solveFor]);

  const vals: Record<string, number> = {};
  let filled = 0;
  for (const id of inputIds) {
    const vd = formula.vars.find((v) => v.id === id)!;
    const units = vd.units ?? NO_UNIT;
    const raw = parseNum(values[id] ?? "");
    if (!Number.isNaN(raw)) {
      vals[id] = raw * units[unitSel[id] ?? 0].mult;
      filled++;
    }
  }
  const allFilled = filled === inputIds.length;
  const result = allFilled ? evalExpr(rhs, vals) : null;

  const resUnits = solveVar.units ?? NO_UNIT;
  const resIdx =
    resUnit === "auto" ? (result !== null ? bestUnit(result, resUnits) : 0) : resUnit;
  const shown = result !== null ? result / resUnits[resIdx].mult : null;

  const verdict = !allFilled
    ? { cls: "text-mut", text: "Değerleri gir, gerisini Ohm halletsin ⚡" }
    : result !== null && Number.isNaN(result)
      ? {
          cls: "text-rose-400",
          text: "Bu değerler matematiği kızdırdı — negatif kök ya da tutarsız girdi olabilir 🤔",
        }
      : result !== null && !Number.isFinite(result)
        ? {
            cls: "text-rose-400",
            text: "Sıfıra bölme tespit edildi. Evren çökmeden değerleri gözden geçir 🕳️",
          }
        : null;

  return (
    <div className="card p-5">
      <h3 className="font-disp text-sm uppercase tracking-widest text-mut mb-4">
        🧮 Hesapla — aranan:{" "}
        <span className="text-volt font-semibold normal-case text-base">
          {solveVar.sym}
          {solveVar.sub && <sub>{solveVar.sub}</sub>}
        </span>
      </h3>
      <div className="space-y-3">
        {inputIds.map((id) => {
          const vd = formula.vars.find((v) => v.id === id)!;
          const units = vd.units ?? NO_UNIT;
          return (
            <label key={id} className="flex items-center gap-3">
              <span className="eq-v eq-v-static w-14 shrink-0 text-right text-lg" title={vd.name}>
                {vd.sym}
                {vd.sub && <sub className="eq-sub">{vd.sub}</sub>}
              </span>
              <input
                inputMode="decimal"
                placeholder={vd.name}
                value={values[id] ?? ""}
                onChange={(e) => setValues((s) => ({ ...s, [id]: e.target.value }))}
                className="w-full min-w-0 rounded-xl border border-line bg-bg/60 px-3 py-2 text-ink outline-none transition focus:border-volt/60 focus:ring-2 focus:ring-volt/20"
              />
              {units.length > 1 ? (
                <select
                  value={unitSel[id] ?? 0}
                  onChange={(e) => setUnitSel((s) => ({ ...s, [id]: Number(e.target.value) }))}
                  className="shrink-0 rounded-xl border border-line bg-bg/60 px-2 py-2 text-sm text-mut outline-none focus:border-volt/60"
                >
                  {units.map((u, i) => (
                    <option key={i} value={i}>
                      {u.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="w-20 shrink-0 text-sm text-mut">
                  {units[0].label || vd.unitNote || ""}
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-line bg-bg/50 p-4">
        {verdict ? (
          <p className={`text-sm ${verdict.cls}`}>{verdict.text}</p>
        ) : (
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="eq-v eq-v-static text-xl text-volt">
              {solveVar.sym}
              {solveVar.sub && <sub className="eq-sub">{solveVar.sub}</sub>}
            </span>
            <span className="text-mut">=</span>
            <span className="font-disp text-3xl font-semibold text-ink tabular-nums">
              {fmt(shown!)}
            </span>
            {resUnits.length > 1 ? (
              <select
                value={resIdx}
                onChange={(e) => setResUnit(Number(e.target.value))}
                className="rounded-lg border border-line bg-bg/60 px-2 py-1 text-sm text-volt outline-none"
              >
                {resUnits.map((u, i) => (
                  <option key={i} value={i}>
                    {u.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-lg text-volt">{resUnits[0].label || solveVar.unitNote || ""}</span>
            )}
          </div>
        )}
      </div>

      {Object.keys(values).length > 0 && (
        <button
          type="button"
          onClick={() => {
            setValues({});
            setResUnit("auto");
          }}
          className="mt-3 text-xs text-mut underline-offset-2 hover:text-ink hover:underline"
        >
          Temizle
        </button>
      )}
    </div>
  );
}
