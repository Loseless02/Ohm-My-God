// ── Laststromkreis simülasyonu (trifaze, fazör) ─────────────────────────────
// Aynı nodal yöntem, ama kaynaklar karmaşık: L1 = 230∠0°, L2 = 230∠−120°,
// L3 = 230∠+120°, N = 0. İletkenlikler gerçel olduğu için gerçel ve sanal
// kısımlar aynı matrisle ayrı ayrı çözülür.
// Motor sargıları U1–U2, V1–V2, W1–W2: yıldızda sargı başına 230 V,
// üçgende 400 V düşer → hız buna göre. Dönüş yönü faz sırasından okunur.

import type { Part, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";
import { solve, type SimResult } from "./sim";

const G_WIRE = 1e4;
const G_LOAD = 1;
const G_LEAK = 1e-9;
const SHORT_G = 100;
const U_PH = 230;
const U_LL = 400;

interface C {
  re: number;
  im: number;
}
const phasor = (mag: number, deg: number): C => ({
  re: mag * Math.cos((deg * Math.PI) / 180),
  im: mag * Math.sin((deg * Math.PI) / 180),
});
const sub = (a: C, b: C): C => ({ re: a.re - b.re, im: a.im - b.im });
const abs = (a: C) => Math.hypot(a.re, a.im);

/** Ana kontak / şalter / termik röle kutupları şu an iletiyor mu? */
export function poleClosed(
  p: Part,
  state: Record<string, boolean>,
  actuated: Record<string, boolean>,
): boolean {
  if (p.type === "contact3") return !!state[p.group ?? ""];
  if (p.type === "q3") return !actuated[p.id]; // ana şalter baştan devrede; simülasyonda tık = devreden çıkar
  return true; // ol3: termik eleman hep iletir, "atınca" yalnızca yardımcı kontakları oynar
}

/** Motor klemensindeki iç köprüler (yıldız / üçgen). Uç sırası: U1 V1 W1 U2 V2 W2. */
function bridges(p: Part): [number, number][] {
  if (p.conn === "Y") return [[3, 4], [4, 5]];
  if (p.conn === "D") return [[0, 5], [1, 3], [2, 4]]; // U1–W2, V1–U2, W1–V2
  return [];
}

export function simulate3(
  parts: Part[],
  wires: Wire[],
  io: {
    state: Record<string, boolean>; // kontaktör LABEL → çekili (Steuerstromkreis'ten)
    actuated: Record<string, boolean>;
    held: Record<string, boolean>;
  },
): SimResult {
  const nets = parts.filter((p) => p.type === "netz3" && p.enabled !== false);
  const res: SimResult = {
    hasSource: nets.length > 0,
    short: false,
    chatter: false,
    energized: {},
    level: {},
    flow: {},
    dir: {},
    closed: {},
    motor: {},
  };
  for (const p of parts) {
    if (SPEC[p.type].kind === "pole3")
      res.closed[p.id] = p.type === "ol3" ? !io.held[p.label] : poleClosed(p, io.state, io.actuated);
    if (p.type === "contact_no" || p.type === "contact_nc") {
      const on = !!io.state[p.group ?? ""];
      res.closed[p.id] = p.type === "contact_no" ? on : !on;
    }
  }
  if (!res.hasSource) return res;

  const nodeIdx = new Map<string, number>();
  for (const p of parts) for (const t of terminalsOf(p)) nodeIdx.set(t.id, nodeIdx.size);
  const n = nodeIdx.size;
  const id = (tid: string) => nodeIdx.get(tid)!;

  const edges: { a: number; b: number; g: number }[] = [];
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a !== undefined && b !== undefined) edges.push({ a, b, g: G_WIRE });
  }
  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    const ts = terminalsOf(p);
    if (kind === "pole3" && res.closed[p.id] !== false) {
      for (let i = 0; i < 3; i++) edges.push({ a: id(ts[i].id), b: id(ts[i + 3].id), g: G_WIRE });
    } else if (kind === "motor3") {
      for (let i = 0; i < 3; i++) edges.push({ a: id(ts[i].id), b: id(ts[i + 3].id), g: G_LOAD });
      for (const [x, y] of bridges(p)) edges.push({ a: id(ts[x].id), b: id(ts[y].id), g: G_WIRE });
    } else if (kind === "load") {
      edges.push({ a: id(ts[0].id), b: id(ts[1].id), g: G_LOAD });
    } else if (kind === "switch" && res.closed[p.id]) {
      edges.push({ a: id(ts[0].id), b: id(ts[1].id), g: G_WIRE });
    }
  }

  const A = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) A[i][i] = G_LEAK;
  for (const e of edges) {
    A[e.a][e.a] += e.g;
    A[e.b][e.b] += e.g;
    A[e.a][e.b] -= e.g;
    A[e.b][e.a] -= e.g;
  }
  const bRe = new Array(n).fill(0);
  const bIm = new Array(n).fill(0);
  const pinned = new Set<string>();
  const src = [phasor(U_PH, 0), phasor(U_PH, -120), phasor(U_PH, 120), { re: 0, im: 0 }];
  for (const s of nets)
    terminalsOf(s).forEach((t, i) => {
      const k = id(t.id);
      for (let c = 0; c < n; c++) A[k][c] = 0;
      A[k][k] = 1;
      bRe[k] = src[i].re;
      bIm[k] = src[i].im;
      pinned.add(t.id);
    });
  const re = solve(n, A.map((r) => [...r]), bRe);
  const im = solve(n, A, bIm);
  const V = (tid: string): C => ({ re: re[id(tid)], im: im[id(tid)] });

  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    const ts = terminalsOf(p);
    if (kind === "load") res.level[p.id] = Math.min(1, abs(sub(V(ts[0].id), V(ts[1].id))) / U_PH);
    if (kind !== "motor3") continue;
    const w = [0, 1, 2].map((i) => sub(V(ts[i].id), V(ts[i + 3].id)));
    const m = w.map(abs);
    const max = Math.max(...m);
    const min = Math.min(...m);
    res.level[p.id] = Math.min(1, max / U_LL);
    if (max < 0.1 * U_PH) {
      res.motor![p.id] = { speed: 0, dir: 0 };
    } else if (min < 0.6 * max) {
      res.motor![p.id] = { speed: 0, dir: 0, fault: "phase" }; // tek/iki faz: döner alan yok
    } else {
      // U sargısı V'den 120° öndeyse sağa döner
      const cross = w[0].im * w[1].re - w[0].re * w[1].im; // Im(Uu · conj(Uv))
      res.motor![p.id] = { speed: Math.min(1.2, min / U_LL), dir: cross >= 0 ? 1 : -1 };
    }
  }

  let iSrc = 0;
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a === undefined || b === undefined) continue;
    const d = Math.hypot(re[a] - re[b], im[a] - im[b]);
    res.flow[w.id] = (d * G_WIRE) / U_PH;
    if (pinned.has(w.a) !== pinned.has(w.b)) iSrc += d * G_WIRE;
  }
  if (iSrc / U_PH > SHORT_G) res.short = true;
  return res;
}
