import type { UnitOption } from "../data/types";

// "3,5" da "3.5" da kabul et — Türk klavyesine saygı.
export function parseNum(s: string): number {
  const clean = s.trim().replace(/\s/g, "").replace(",", ".");
  if (clean === "" || clean === "-" || clean === ".") return NaN;
  return Number(clean);
}

const fmtCache = new Intl.NumberFormat("tr-TR", { maximumSignificantDigits: 5 });

export function fmt(x: number): string {
  if (!Number.isFinite(x)) return "—";
  // Çok büyük/küçük sayılarda bilimsel gösterime düş
  const ax = Math.abs(x);
  if (ax !== 0 && (ax >= 1e9 || ax < 1e-4)) {
    return x.toExponential(3).replace(".", ",");
  }
  return fmtCache.format(x);
}

// Sonuç için en okunaklı birimi seç (değer/mult 1–1000 aralığına düşsün)
export function bestUnit(value: number, units: UnitOption[]): number {
  if (!Number.isFinite(value) || value === 0) return 0;
  let best = 0;
  let bestScore = Infinity;
  units.forEach((u, i) => {
    const scaled = Math.abs(value / u.mult);
    // 1–1000 arası ideal; log uzaklığıyla puanla
    const lg = Math.log10(scaled);
    const score = lg >= 0 && lg < 3 ? 0 : Math.min(Math.abs(lg), Math.abs(lg - 3));
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}
