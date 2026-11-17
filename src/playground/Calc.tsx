// Küçük hesap makinesi: + − × ÷ ^ ( ), √, π, sin/cos/tan (derece), log, ln ve birim önekleri (4k7 değil: 4.7k).
import { useState } from "react";

const PREFIX: Record<string, number> = { p: 1e-12, n: 1e-9, u: 1e-6, "µ": 1e-6, m: 1e-3, k: 1e3, M: 1e6, G: 1e9 };
const FN: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  "√": Math.sqrt,
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  asin: (x) => (Math.asin(x) * 180) / Math.PI,
  acos: (x) => (Math.acos(x) * 180) / Math.PI,
  atan: (x) => (Math.atan(x) * 180) / Math.PI,
  log: Math.log10,
  ln: Math.log,
  abs: Math.abs,
};

/** Küçük özyinelemeli ayrıştırıcı — eval yok. */
export function calc(src: string, ans = 0): number {
  const s = src.replace(/,/g, ".").replace(/×/g, "*").replace(/÷/g, "/").replace(/\s+/g, "");
  let i = 0;
  const peek = () => s[i];
  const eat = (c: string) => (s[i] === c ? (i++, true) : false);
  function expr(): number {
    let v = term();
    for (;;) {
      if (eat("+")) v += term();
      else if (eat("-")) v -= term();
      else return v;
    }
  }
  function term(): number {
    let v = power();
    for (;;) {
      if (eat("*")) v *= power();
      else if (eat("/")) v /= power();
      else return v;
    }
  }
  function power(): number {
    const b = unary();
    if (eat("^")) return Math.pow(b, power());
    return b;
  }
  function unary(): number {
    if (eat("-")) return -unary();
    if (eat("+")) return unary();
    return atom();
  }
  function atom(): number {
    if (eat("(")) {
      const v = expr();
      if (!eat(")")) throw new Error(")");
      return v;
    }
    const m = /^(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+)/i.exec(s.slice(i));
    if (m) {
      i += m[0].length;
      let v = parseFloat(m[0]);
      const p = peek();
      if (p && p in PREFIX && !/^[a-zA-Z]{2}/.test(s.slice(i))) {
        v *= PREFIX[p];
        i++;
      }
      return v;
    }
    const w = /^(π|pi|ans|√|[a-z]+)/i.exec(s.slice(i));
    if (w) {
      i += w[0].length;
      const k = w[0].toLowerCase();
      if (k === "π" || k === "pi") return Math.PI;
      if (k === "ans") return ans;
      if (k === "e") return Math.E;
      const f = FN[k] ?? FN[w[0]];
      if (f) return f(atom());
    }
    throw new Error("?");
  }
  const v = expr();
  if (i < s.length) throw new Error("?");
  return v;
}

const KEYS = ["7", "8", "9", "÷", "√(", "4", "5", "6", "×", "^", "1", "2", "3", "-", "(", "0", ",", "π", "+", ")"];

export default function Calc() {
  const [src, setSrc] = useState("");
  const [hist, setHist] = useState<{ q: string; a: number }[]>([]);
  const [err, setErr] = useState(false);
  const ans = hist[0]?.a ?? 0;

  function run() {
    if (!src.trim()) return;
    try {
      const a = calc(src, ans);
      if (!Number.isFinite(a)) throw new Error("∞");
      setHist((h) => [{ q: src, a }, ...h].slice(0, 6));
      setSrc("");
      setErr(false);
    } catch {
      setErr(true);
    }
  }
  const show = (a: number) => (Math.abs(a) < 1e-4 || Math.abs(a) >= 1e9 ? a.toExponential(4) : +a.toPrecision(10)).toLocaleString("tr-TR");

  return (
    <div className="space-y-2 text-xs">
      <div className="max-h-24 space-y-0.5 overflow-auto rounded border border-line bg-bg/60 p-1.5 font-mono">
        {hist.length === 0 && <p className="text-mut">ör. 230^2/60 · 4.7k*20m · √(3)*400*16</p>}
        {hist.map((h, i) => (
          <button key={i} type="button" onClick={() => setSrc((s) => s + String(h.a).replace(".", ","))} className="flex w-full justify-between gap-2 text-left hover:text-volt">
            <span className="truncate text-mut">{h.q}</span>
            <span className="text-ink">= {show(h.a)}</span>
          </button>
        ))}
      </div>
      <input
        value={src}
        onChange={(e) => {
          setSrc(e.target.value);
          setErr(false);
        }}
        onKeyDown={(e) => e.key === "Enter" && run()}
        placeholder="ifade yaz, Enter"
        aria-label="Hesap makinesi"
        className={`pg-input font-mono ${err ? "!border-rose-400" : ""}`}
      />
      <div className="grid grid-cols-5 gap-1">
        {KEYS.map((k) => (
          <button key={k} type="button" onClick={() => setSrc((s) => s + k)} className="rounded bg-panel2 py-1.5 font-mono text-ink hover:bg-bg">
            {k}
          </button>
        ))}
        <button type="button" onClick={() => setSrc("")} className="col-span-2 rounded bg-panel2 py-1.5 text-mut hover:text-rose-300">
          C
        </button>
        <button type="button" onClick={() => setSrc((s) => s.slice(0, -1))} className="rounded bg-panel2 py-1.5 text-mut hover:text-ink">
          ⌫
        </button>
        <button type="button" onClick={run} className="col-span-2 rounded bg-volt py-1.5 font-semibold text-black hover:brightness-110">
          =
        </button>
      </div>
      <p className="text-[10px] text-mut">Önekler: p n µ(u) m k M G · sin/cos/tan derece · ans = son sonuç</p>
    </div>
  );
}
