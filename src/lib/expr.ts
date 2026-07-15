// ── İfade ağacı (Expression AST) ─────────────────────────────────────────────
// Her formül bu ağaçla tanımlanır; hem ekranda çizilir hem de hesaplanır.
// "v" düğümleri (değişkenler) motion layoutId alır → formül "umstellen"
// yapılınca token'lar yeni yerlerine süzülerek gider.

export type Term = { sign: 1 | -1; e: Expr };

export type Expr =
  | { t: "v"; id: string; k?: string } // değişken (k: aynı değişken 2. kez geçerse ayırt etmek için)
  | { t: "n"; label: string; value: number } // sabit sayı / sembol (2, π, √3, 9550…)
  | { t: "mul"; parts: Expr[] } // a · b · c
  | { t: "frac"; num: Expr; den: Expr } // kesir
  | { t: "add"; terms: Term[] } // a + b − c
  | { t: "pow"; base: Expr; exp: number } // üs (², ³)
  | { t: "sqrt"; arg: Expr } // karekök
  | { t: "group"; arg: Expr }; // parantez

// ── Kısa kurucular: formül tanımlarını okunur tutar ──────────────────────────
export const v = (id: string, k?: string): Expr => (k ? { t: "v", id, k } : { t: "v", id });
export const num = (value: number, label?: string): Expr => ({
  t: "n",
  value,
  label: label ?? String(value),
});
export const mul = (...parts: Expr[]): Expr => ({ t: "mul", parts });
export const frac = (numer: Expr, den: Expr): Expr => ({ t: "frac", num: numer, den });
export const add = (...parts: Expr[]): Expr => ({
  t: "add",
  terms: parts.map((e) => ({ sign: 1 as const, e })),
});
export const plus = (e: Expr): Term => ({ sign: 1, e });
export const minus = (e: Expr): Term => ({ sign: -1, e });
export const sum = (...terms: Term[]): Expr => ({ t: "add", terms });
export const pow = (base: Expr, exp: number): Expr => ({ t: "pow", base, exp });
export const sqrt = (arg: Expr): Expr => ({ t: "sqrt", arg });
export const group = (arg: Expr): Expr => ({ t: "group", arg });

export const PI = () => num(Math.PI, "π");
export const SQRT2 = () => num(Math.SQRT2, "√2");
export const SQRT3 = () => num(Math.sqrt(3), "√3");
export const ONE = () => num(1);

// ── Hesaplama ────────────────────────────────────────────────────────────────
export function evalExpr(e: Expr, vals: Record<string, number>): number {
  switch (e.t) {
    case "v": {
      const x = vals[e.id];
      return x === undefined ? NaN : x;
    }
    case "n":
      return e.value;
    case "mul":
      return e.parts.reduce((acc, p) => acc * evalExpr(p, vals), 1);
    case "frac":
      return evalExpr(e.num, vals) / evalExpr(e.den, vals);
    case "add":
      return e.terms.reduce((acc, t) => acc + t.sign * evalExpr(t.e, vals), 0);
    case "pow":
      return Math.pow(evalExpr(e.base, vals), e.exp);
    case "sqrt":
      return Math.sqrt(evalExpr(e.arg, vals));
    case "group":
      return evalExpr(e.arg, vals);
  }
}

// İfadede geçen değişken id'leri (tekrarsız, geçiş sırasıyla)
export function collectVars(e: Expr, out: string[] = []): string[] {
  switch (e.t) {
    case "v":
      if (!out.includes(e.id)) out.push(e.id);
      break;
    case "n":
      break;
    case "mul":
      e.parts.forEach((p) => collectVars(p, out));
      break;
    case "frac":
      collectVars(e.num, out);
      collectVars(e.den, out);
      break;
    case "add":
      e.terms.forEach((t) => collectVars(t.e, out));
      break;
    case "pow":
      collectVars(e.base, out);
      break;
    case "sqrt":
      collectVars(e.arg, out);
      break;
    case "group":
      collectVars(e.arg, out);
      break;
  }
  return out;
}
