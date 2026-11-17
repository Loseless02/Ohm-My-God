// ── Laststromkreis simülasyonu (trifaze, fazör) ─────────────────────────────
// L1 = 230∠0°, L2 = 230∠−120°, L3 = 230∠+120°, N = 0. Karmaşık nodal çözüm.
// Motor sargıları anma değerlerinden (P, U, cos φ, η) gerçek empedans alır;
// kalkışta empedans düşük → kalkış akımı ~5×. Faz kaybında motor kalkamaz,
// akım yüksek kalır ve motor koruma rölesi (F) ayar akımına göre kendiliğinden atar.

import type { Part, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";
import { pn } from "./params";
import type { SimResult } from "./sim";

const G_WIRE = 1e4;
const G_LEAK = 1e-9;
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

/** Karmaşık katsayılı doğrusal sistem (kısmi pivotlu Gauss). */
function csolve(n: number, Ar: number[][], Ai: number[][], br: number[], bi: number[]): { re: number[]; im: number[] } {
  for (let k = 0; k < n; k++) {
    let p = k;
    let m = Math.hypot(Ar[k][k], Ai[k][k]);
    for (let i = k + 1; i < n; i++) {
      const a = Math.hypot(Ar[i][k], Ai[i][k]);
      if (a > m) {
        m = a;
        p = i;
      }
    }
    if (p !== k) {
      [Ar[k], Ar[p]] = [Ar[p], Ar[k]];
      [Ai[k], Ai[p]] = [Ai[p], Ai[k]];
      [br[k], br[p]] = [br[p], br[k]];
      [bi[k], bi[p]] = [bi[p], bi[k]];
    }
    const dr = Ar[k][k];
    const di = Ai[k][k];
    const dd = dr * dr + di * di || 1e-300;
    for (let i = k + 1; i < n; i++) {
      // f = A[i][k] / A[k][k]
      const fr = (Ar[i][k] * dr + Ai[i][k] * di) / dd;
      const fi = (Ai[i][k] * dr - Ar[i][k] * di) / dd;
      if (fr === 0 && fi === 0) continue;
      for (let j = k; j < n; j++) {
        Ar[i][j] -= fr * Ar[k][j] - fi * Ai[k][j];
        Ai[i][j] -= fr * Ai[k][j] + fi * Ar[k][j];
      }
      br[i] -= fr * br[k] - fi * bi[k];
      bi[i] -= fr * bi[k] + fi * br[k];
    }
  }
  const xr = new Array(n).fill(0);
  const xi = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sr = br[i];
    let si = bi[i];
    for (let j = i + 1; j < n; j++) {
      sr -= Ar[i][j] * xr[j] - Ai[i][j] * xi[j];
      si -= Ar[i][j] * xi[j] + Ai[i][j] * xr[j];
    }
    const dr = Ar[i][i];
    const di = Ai[i][i];
    const dd = dr * dr + di * di || 1e-300;
    xr[i] = (sr * dr + si * di) / dd;
    xi[i] = (si * dr - sr * di) / dd;
  }
  return { re: xr, im: xi };
}

/** Ana kontak / şalter / termik röle kutupları şu an iletiyor mu? */
export function poleClosed(p: Part, state: Record<string, boolean>, actuated: Record<string, boolean>): boolean {
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

/** Motor durumu: hız (0..1) ve aşırı yük birikimi — çağrılar arasında saklanır. */
export type Mem3 = Record<string, { w: number; H: number }>;

export function motorRating(p: Part) {
  const P = pn(p, "Pn");
  const U = pn(p, "Un");
  const cos = pn(p, "cos");
  const eta = pn(p, "eta");
  const IN = P / (Math.sqrt(3) * U * cos * eta);
  return { IN, cos, Zph: U / (IN / Math.sqrt(3)) }; // üçgen sargı empedansı
}

export function simulate3(
  parts: Part[],
  wires: Wire[],
  io: {
    state: Record<string, boolean>;
    actuated: Record<string, boolean>;
    held: Record<string, boolean>;
    mem?: Mem3;
    dt?: number;
  },
): SimResult & { phasor: Record<string, [number, number]>; trips: string[]; amps: Record<string, number> } {
  const mem = io.mem ?? {};
  const dt = io.dt ?? 0;
  const nets = parts.filter((p) => p.type === "netz3" && p.enabled !== false);
  const res = {
    hasSource: nets.length > 0,
    short: false,
    chatter: false,
    energized: {},
    level: {} as Record<string, number>,
    flow: {} as Record<string, number>,
    dir: {} as Record<string, number>,
    closed: {} as Record<string, boolean>,
    motor: {} as NonNullable<SimResult["motor"]>,
    phasor: {} as Record<string, [number, number]>,
    trips: [] as string[],
    amps: {} as Record<string, number>,
    rpm: {} as Record<string, number>,
  };
  for (const p of parts) {
    if (SPEC[p.type].kind === "pole3") res.closed[p.id] = p.type === "ol3" ? !io.held[p.label] : poleClosed(p, io.state, io.actuated);
    if (p.type === "contact_no" || p.type === "contact_nc") {
      const on = !!io.state[p.group ?? ""];
      res.closed[p.id] = p.type === "contact_no" ? on : !on;
    }
  }
  if (!res.hasSource) {
    for (const p of parts) if (p.type === "motor3") mem[p.id] = { w: Math.max(0, (mem[p.id]?.w ?? 0) - dt / 1.5), H: Math.max(0, (mem[p.id]?.H ?? 0) - dt) };
    return res;
  }

  const nodeIdx = new Map<string, number>();
  for (const p of parts) for (const t of terminalsOf(p)) nodeIdx.set(t.id, nodeIdx.size);
  const n = nodeIdx.size;
  const id = (tid: string) => nodeIdx.get(tid)!;

  // karmaşık iletkenlikler (Y = G + jB)
  const edges: { a: number; b: number; g: C }[] = [];
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a !== undefined && b !== undefined) edges.push({ a, b, g: { re: G_WIRE, im: 0 } });
  }
  const motY = new Map<string, C>();
  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    const ts = terminalsOf(p);
    if (kind === "pole3" && res.closed[p.id] !== false) {
      for (let i = 0; i < 3; i++) edges.push({ a: id(ts[i].id), b: id(ts[i + 3].id), g: { re: G_WIRE, im: 0 } });
    } else if (kind === "motor3") {
      const { cos, Zph } = motorRating(p);
      const w = mem[p.id]?.w ?? 0;
      const k = 0.2 + 0.8 * Math.min(1, w); // dururken empedans 1/5 → kalkış akımı ~5×
      const Z = Zph * k;
      const sin = Math.sqrt(1 - cos * cos);
      const Y = { re: cos / Z, im: -sin / Z };
      motY.set(p.id, Y);
      for (let i = 0; i < 3; i++) edges.push({ a: id(ts[i].id), b: id(ts[i + 3].id), g: Y });
      for (const [x, y] of bridges(p)) edges.push({ a: id(ts[x].id), b: id(ts[y].id), g: { re: G_WIRE, im: 0 } });
    } else if (kind === "load") {
      const R = (pn(p, "Un") ** 2) / pn(p, "Pn");
      edges.push({ a: id(ts[0].id), b: id(ts[1].id), g: { re: 1 / R, im: 0 } });
    } else if (kind === "switch" && res.closed[p.id]) {
      edges.push({ a: id(ts[0].id), b: id(ts[1].id), g: { re: G_WIRE, im: 0 } });
    }
  }

  const Ar = Array.from({ length: n }, () => new Array(n).fill(0));
  const Ai = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) Ar[i][i] = G_LEAK;
  for (const e of edges) {
    Ar[e.a][e.a] += e.g.re;
    Ai[e.a][e.a] += e.g.im;
    Ar[e.b][e.b] += e.g.re;
    Ai[e.b][e.b] += e.g.im;
    Ar[e.a][e.b] -= e.g.re;
    Ai[e.a][e.b] -= e.g.im;
    Ar[e.b][e.a] -= e.g.re;
    Ai[e.b][e.a] -= e.g.im;
  }
  const bRe = new Array(n).fill(0);
  const bIm = new Array(n).fill(0);
  const pinned = new Set<string>();
  for (const s of nets) {
    const src = [phasor(pn(s, "U1"), 0), phasor(pn(s, "U2"), -120), phasor(pn(s, "U3"), 120), { re: 0, im: 0 }];
    terminalsOf(s).forEach((t, i) => {
      const k = id(t.id);
      for (let c = 0; c < n; c++) {
        Ar[k][c] = 0;
        Ai[k][c] = 0;
      }
      Ar[k][k] = 1;
      bRe[k] = src[i].re;
      bIm[k] = src[i].im;
      pinned.add(t.id);
    });
  }
  const sol = csolve(n, Ar, Ai, bRe, bIm);
  const V = (tid: string): C => ({ re: sol.re[id(tid)], im: sol.im[id(tid)] });
  for (const [tid, k] of nodeIdx) res.phasor[tid] = [sol.re[k], sol.im[k]];

  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    const ts = terminalsOf(p);
    if (kind === "load") res.level[p.id] = Math.min(1.5, (abs(sub(V(ts[0].id), V(ts[1].id))) / pn(p, "Un")) ** 2);
    if (kind === "pole3") {
      // kutuplardan geçen en büyük akım (iletken kutup: kablo iletkenliği × gerilim farkı)
      let imax = 0;
      if (res.closed[p.id] !== false) for (let i = 0; i < 3; i++) imax = Math.max(imax, abs(sub(V(ts[i].id), V(ts[i + 3].id))) * G_WIRE);
      res.amps[p.id] = imax;
      if (p.type === "ol3" && !io.held[p.label]) {
        // termik röle: ayar akımının üstünde ısınır, sınırı geçince atar (Klasse 10'a benzer)
        const Ie = pn(p, "Ie");
        const r = imax / Ie;
        const m = (mem[p.id] ??= { w: 0, H: 0 });
        m.H = Math.max(0, m.H * Math.exp(-dt / 60) + Math.max(0, r * r - 1.1) * dt);
        if (m.H > 120) {
          m.H = 0;
          res.trips.push(p.label);
        }
      }
      if (p.type === "q3" && imax > 13 * pn(p, "In")) res.trips.push("§Q:" + p.id); // kısa devre açtırıcısı
    }
    if (kind !== "motor3") continue;
    const w3 = [0, 1, 2].map((i) => sub(V(ts[i].id), V(ts[i + 3].id)));
    const m = w3.map(abs);
    const max = Math.max(...m);
    const min = Math.min(...m);
    const Y = motY.get(p.id)!;
    const Iw = Math.max(...m) * Math.hypot(Y.re, Y.im);
    res.amps[p.id] = max > 1.4 * U_PH ? Iw * Math.sqrt(3) : Iw; // üçgende hat akımı = √3 · sargı akımı
    const st = (mem[p.id] ??= { w: 0, H: 0 });
    let target = 0;
    let fault = false;
    let dir = 0;
    if (max < 0.1 * U_PH) target = 0;
    else if (min < 0.6 * max) fault = true; // tek/iki faz: döner alan yok, motor kalkamaz
    else {
      const cross = w3[0].im * w3[1].re - w3[0].re * w3[1].im; // Im(Uu · conj(Uv))
      dir = cross >= 0 ? 1 : -1;
      target = Math.min(1.2, min / U_LL);
    }
    // hızlanma / yavaşlama (eylemsizlik)
    if (dt) st.w = st.w + (target - st.w) * Math.min(1, dt / (target > st.w ? 0.8 : 1.5));
    if (fault) st.w = Math.max(0, st.w - dt / 1.5);
    const speed = target > 0 ? st.w : 0;
    res.motor[p.id] = fault ? { speed: 0, dir: 0, fault: "phase" } : { speed, dir: speed > 0.02 ? dir : 0 };
    res.rpm[p.id] = speed * pn(p, "nn");
    res.level[p.id] = Math.min(1, max / U_LL);
  }

  let iSrc = 0;
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a === undefined || b === undefined) continue;
    const d = Math.hypot(sol.re[a] - sol.re[b], sol.im[a] - sol.im[b]) * G_WIRE;
    res.flow[w.id] = d > 1e-3 ? 1 : 0;
    res.dir[w.id] = 0; // trifaze AC
    if (pinned.has(w.a) !== pinned.has(w.b)) iSrc = Math.max(iSrc, d);
  }
  if (iSrc > 2000) {
    res.short = true;
    for (const w of wires) {
      const a = nodeIdx.get(w.a);
      const b = nodeIdx.get(w.b);
      if (a === undefined || b === undefined) continue;
      if (Math.hypot(sol.re[a] - sol.re[b], sol.im[a] - sol.im[b]) * G_WIRE > 500) res.flow[w.id] = 100;
    }
  }
  return res;
}
