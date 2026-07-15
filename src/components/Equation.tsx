import type { ReactNode } from "react";
import { Fragment } from "react";
import { motion, LayoutGroup } from "motion/react";
import type { Expr } from "../lib/expr";
import type { FormulaDef, VariableDef } from "../data/types";

interface Ctx {
  vars: Record<string, VariableDef>;
  selected?: string;
  onSelect?: (id: string) => void;
  interactive: boolean;
}

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;

function VarTok({ id, k, ctx }: { id: string; k?: string; ctx: Ctx }) {
  const vd = ctx.vars[id];
  const sel = ctx.interactive && ctx.selected === id;
  const inner = (
    <>
      {vd?.sym ?? id}
      {vd?.sub && <sub className="eq-sub">{vd.sub}</sub>}
    </>
  );
  if (!ctx.interactive) {
    return <span className="eq-v eq-v-static">{inner}</span>;
  }
  return (
    <motion.button
      type="button"
      layoutId={`${id}${k ? "·" + k : ""}`}
      transition={SPRING}
      className={`eq-v ${sel ? "eq-v-sel" : ""}`}
      onClick={() => ctx.onSelect?.(id)}
      title={vd ? `${vd.name}${vd.de ? ` (${vd.de})` : ""}` : id}
    >
      {inner}
    </motion.button>
  );
}

function Node({ e, ctx }: { e: Expr; ctx: Ctx }): ReactNode {
  switch (e.t) {
    case "v":
      return <VarTok id={e.id} k={e.k} ctx={ctx} />;
    case "n":
      return <span className="eq-n">{e.label}</span>;
    case "mul":
      return (
        <>
          {e.parts.map((p, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="eq-op">·</span>}
              <Node e={p} ctx={ctx} />
            </Fragment>
          ))}
        </>
      );
    case "frac":
      return (
        <span className="eq-frac">
          <span className="eq-row">
            <Node e={e.num} ctx={ctx} />
          </span>
          <span className="eq-bar" />
          <span className="eq-row">
            <Node e={e.den} ctx={ctx} />
          </span>
        </span>
      );
    case "add":
      return (
        <>
          {e.terms.map((t, i) => (
            <Fragment key={i}>
              {(i > 0 || t.sign < 0) && (
                <span className="eq-op">{t.sign < 0 ? "−" : "+"}</span>
              )}
              <Node e={t.e} ctx={ctx} />
            </Fragment>
          ))}
        </>
      );
    case "pow":
      return (
        <span className="eq-pow">
          <Node e={e.base} ctx={ctx} />
          <sup className="eq-sup">{e.exp === 2 ? "2" : e.exp === 3 ? "3" : e.exp}</sup>
        </span>
      );
    case "sqrt":
      return (
        <span className="eq-sqrt">
          <span className="eq-rad">√</span>
          <span className="eq-sqrt-arg eq-row">
            <Node e={e.arg} ctx={ctx} />
          </span>
        </span>
      );
    case "group":
      return (
        <>
          <span className="eq-paren">(</span>
          <Node e={e.arg} ctx={ctx} />
          <span className="eq-paren">)</span>
        </>
      );
  }
}

interface EquationProps {
  formula: FormulaDef;
  solveFor: string;
  selected?: string;
  onSelect?: (id: string) => void;
  interactive?: boolean;
  className?: string;
}

export function Equation({
  formula,
  solveFor,
  selected,
  onSelect,
  interactive = false,
  className = "",
}: EquationProps) {
  const ctx: Ctx = {
    vars: Object.fromEntries(formula.vars.map((v) => [v.id, v])),
    selected,
    onSelect,
    interactive,
  };
  const rhs = formula.forms[solveFor];
  const body = (
    <span className={`eq eq-row ${className}`}>
      {/* key: form değişince ağaç yeniden kurulur → operatörler fade, değişkenler layoutId ile süzülür */}
      <Fragment key={solveFor}>
        <VarTok id={solveFor} ctx={ctx} />
        <span className="eq-op eq-eq">=</span>
        <Node e={rhs} ctx={ctx} />
      </Fragment>
    </span>
  );
  if (!interactive) return body;
  return <LayoutGroup id={`eq-${formula.id}`}>{body}</LayoutGroup>;
}
