// ── Simülasyon motorları ─────────────────────────────────────────────────────
// simulate():      fiziksel devre — iletkenlik ağı + Gauss eliminasyonu.
// simulateLogic(): dijital devre — net'ler üzerinde boolean yayılım.
// İkisi de aynı SimResult şeklini döndürür; çizim katmanı farkı bilmez.

import type { Part, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";

const G_WIRE = 1e4;
const G_LOAD = 1;
const G_LEAK = 1e-9;
const SHORT_G = 100; // etkin iletkenlik bunu aşarsa: metalik yol = kısa devre

const MAIN_SWITCH = ["switch_no", "switch_nc", "taster_no", "taster_nc"];

export interface SimIO {
  actuated: Record<string, boolean>; // şalter/buton PART ID → basılı/kapalı konum
  timerDone: Record<string, boolean>; // tcoil LABEL → kontakları şu an çekili mi
  prevEnergized: Record<string, boolean>; // bobin LABEL → önceki durum (tohum)
}

export interface SimResult {
  hasSource: boolean;
  short: boolean;
  chatter: boolean;
  energized: Record<string, boolean>; // bobin LABEL → enerjili
  level: Record<string, number>; // yük/kapı part id → 0..1
  flow: Record<string, number>; // kablo id → normalize akım / mantık değeri
  closed: Record<string, boolean>; // anahtar part id → kapalı mı
}

// act: part id'ler + "§<label>" anahtarlarıyla ana şalter konumları
export function isClosed(
  p: Part,
  energized: Record<string, boolean>,
  act: Record<string, boolean>,
  timerDone: Record<string, boolean>,
): boolean {
  switch (p.type) {
    case "switch_no":
    case "taster_no":
      return !!act[p.id];
    case "switch_nc":
    case "taster_nc":
      return !act[p.id];
    case "pairc_no":
      return !!act["§" + (p.group ?? "")];
    case "pairc_nc":
      return !act["§" + (p.group ?? "")];
    case "contact_no":
      return !!energized[p.group ?? ""];
    case "contact_nc":
      return !energized[p.group ?? ""];
    case "tcontact_no":
      return !!timerDone[p.group ?? ""];
    case "tcontact_nc":
      return !timerDone[p.group ?? ""];
    default:
      return false;
  }
}

// ana şalter konumlarını etikete de yaz (eş kontaklar "§S1" üzerinden okur)
function withLabels(parts: Part[], actuated: Record<string, boolean>) {
  const m: Record<string, boolean> = { ...actuated };
  for (const p of parts) if (MAIN_SWITCH.includes(p.type)) m["§" + p.label] = !!actuated[p.id];
  return m;
}

function solve(n: number, A: number[][], b: number[]): number[] {
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let row = col + 1; row < n; row++)
      if (Math.abs(A[row][col]) > Math.abs(A[piv][col])) piv = row;
    if (piv !== col) {
      [A[col], A[piv]] = [A[piv], A[col]];
      [b[col], b[piv]] = [b[piv], b[col]];
    }
    const d = A[col][col];
    if (Math.abs(d) < 1e-15) continue;
    for (let row = col + 1; row < n; row++) {
      const f = A[row][col] / d;
      if (f === 0) continue;
      for (let c = col; c < n; c++) A[row][c] -= f * A[col][c];
      b[row] -= f * b[col];
    }
  }
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let s = b[row];
    for (let c = row + 1; c < n; c++) s -= A[row][c] * x[c];
    x[row] = Math.abs(A[row][row]) < 1e-15 ? 0 : s / A[row][row];
  }
  return x;
}

// ── Fiziksel simülasyon ──────────────────────────────────────────────────────
export function simulate(parts: Part[], wires: Wire[], io: SimIO): SimResult {
  const act = withLabels(parts, io.actuated);
  const sources = parts.filter((p) => SPEC[p.type].kind === "source" && p.enabled !== false);
  const railsL = parts.filter((p) => p.type === "rail_l");
  const railsN = parts.filter((p) => p.type === "rail_n");
  const empty: SimResult = {
    hasSource: sources.length > 0 || railsL.length > 0,
    short: false,
    chatter: false,
    energized: {},
    level: {},
    flow: {},
    closed: {},
  };
  if (!empty.hasSource) {
    for (const p of parts)
      if (SPEC[p.type].kind === "switch") empty.closed[p.id] = isClosed(p, {}, act, io.timerDone);
    return empty;
  }
  const vRef = Math.max(
    230,
    ...sources.map((s) => s.volts ?? 230),
    ...railsL.map((rail) => rail.volts ?? 230),
  );

  const nodeIdx = new Map<string, number>();
  for (const p of parts) for (const t of terminalsOf(p)) nodeIdx.set(t.id, nodeIdx.size);
  const n = nodeIdx.size;

  let energized = { ...io.prevEnergized };
  let volts: number[] = [];
  let chatter = false;
  const seen: string[] = [];

  for (let iter = 0; ; iter++) {
    const edges: { a: number; b: number; g: number }[] = [];
    for (const w of wires) {
      const a = nodeIdx.get(w.a);
      const b = nodeIdx.get(w.b);
      if (a !== undefined && b !== undefined) edges.push({ a, b, g: G_WIRE });
    }
    for (const p of parts) {
      const kind = SPEC[p.type].kind;
      if (kind !== "switch" && kind !== "load" && kind !== "coil") continue;
      const [t0, t1] = terminalsOf(p);
      const a = nodeIdx.get(t0.id)!;
      const b = nodeIdx.get(t1.id)!;
      if (kind === "switch") {
        if (isClosed(p, energized, act, io.timerDone)) edges.push({ a, b, g: G_WIRE });
      } else {
        edges.push({ a, b, g: G_LOAD });
      }
    }

    const A = Array.from({ length: n }, () => new Array(n).fill(0));
    const rhs = new Array(n).fill(0);
    for (let i = 0; i < n; i++) A[i][i] = G_LEAK;
    for (const e of edges) {
      A[e.a][e.a] += e.g;
      A[e.b][e.b] += e.g;
      A[e.a][e.b] -= e.g;
      A[e.b][e.a] -= e.g;
    }
    const pins: [string, number][] = [];
    for (const s of sources) {
      const [tL, tN] = terminalsOf(s);
      pins.push([tL.id, s.volts ?? 230], [tN.id, 0]);
    }
    for (const rail of railsL) for (const t of terminalsOf(rail)) pins.push([t.id, rail.volts ?? 230]);
    for (const rail of railsN) for (const t of terminalsOf(rail)) pins.push([t.id, 0]);
    for (const [tid, val] of pins) {
      const i = nodeIdx.get(tid)!;
      for (let c = 0; c < n; c++) A[i][c] = 0;
      A[i][i] = 1;
      rhs[i] = val;
    }
    volts = solve(n, A, rhs);

    const next: Record<string, boolean> = {};
    for (const p of parts) {
      if (SPEC[p.type].kind !== "coil") continue;
      const [t0, t1] = terminalsOf(p);
      const dv = Math.abs(volts[nodeIdx.get(t0.id)!] - volts[nodeIdx.get(t1.id)!]);
      const on = dv / vRef > 0.7;
      next[p.label] = next[p.label] || on;
    }
    const key = JSON.stringify(next);
    if (JSON.stringify(energized) === key || iter >= 20) {
      if (iter >= 20) chatter = true;
      energized = next;
      break;
    }
    if (seen.includes(key)) {
      chatter = true;
      energized = next;
      break;
    }
    seen.push(key);
    energized = next;
  }

  const res: SimResult = { ...empty, chatter, energized };
  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    if (kind !== "switch" && kind !== "load" && kind !== "coil") continue;
    const [t0, t1] = terminalsOf(p);
    if (kind === "switch") res.closed[p.id] = isClosed(p, energized, act, io.timerDone);
    else {
      const dv = Math.abs(volts[nodeIdx.get(t0.id)!] - volts[nodeIdx.get(t1.id)!]);
      res.level[p.id] = Math.min(1, dv / vRef);
    }
  }
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a === undefined || b === undefined) continue;
    res.flow[w.id] = (Math.abs(volts[a] - volts[b]) * G_WIRE) / vRef;
  }
  // kısa devre: yüksek potansiyel uçlarından çekilen etkin iletkenlik
  const highIds = new Set<string>([
    ...sources.map((s) => terminalsOf(s)[0].id),
    ...railsL.flatMap((rail) => terminalsOf(rail).map((t) => t.id)),
  ]);
  let iSrc = 0;
  for (const w of wires) {
    const a = nodeIdx.get(w.a);
    const b = nodeIdx.get(w.b);
    if (a === undefined || b === undefined) continue;
    if (highIds.has(w.a) !== highIds.has(w.b)) iSrc += Math.abs(volts[a] - volts[b]) * G_WIRE;
  }
  if (iSrc / vRef > SHORT_G) res.short = true;
  return res;
}

// ── Dijital (Logik) simülasyon ───────────────────────────────────────────────
export function simulateLogic(
  parts: Part[],
  wires: Wire[],
  io: { actuated: Record<string, boolean> },
): SimResult {
  const act = withLabels(parts, io.actuated);
  const res: SimResult = {
    hasSource: parts.some((p) => p.type === "rail_l"),
    short: false,
    chatter: false,
    energized: {},
    level: {},
    flow: {},
    closed: {},
  };

  // union-find: kablolar + kapalı anahtarlar + ray içi bağlar
  const par = new Map<string, string>();
  for (const p of parts) for (const t of terminalsOf(p)) par.set(t.id, t.id);
  const find = (x: string): string => {
    let root = x;
    while (par.get(root) !== root) root = par.get(root)!;
    let c = x;
    while (par.get(c) !== c) {
      const nx = par.get(c)!;
      par.set(c, root);
      c = nx;
    }
    return root;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) par.set(ra, rb);
  };
  for (const w of wires) if (par.has(w.a) && par.has(w.b)) union(w.a, w.b);
  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    if (kind === "switch") {
      const c = isClosed(p, {}, act, {});
      res.closed[p.id] = c;
      if (c) {
        const [t0, t1] = terminalsOf(p);
        union(t0.id, t1.id);
      }
    }
    if (kind === "rail") {
      const ts = terminalsOf(p);
      for (let i = 1; i < ts.length; i++) union(ts[0].id, ts[i].id);
    }
  }

  const lRoots = new Set(
    parts.filter((p) => p.type === "rail_l").map((p) => find(terminalsOf(p)[0].id)),
  );
  const nRoots = new Set(
    parts.filter((p) => p.type === "rail_n").map((p) => find(terminalsOf(p)[0].id)),
  );
  for (const root of lRoots) if (nRoots.has(root)) res.short = true; // L'yi N'ye bağlamak: dijitalde de ayıp

  const gates = parts
    .filter((p) => SPEC[p.type].kind === "gate")
    .map((p) => {
      const ts = terminalsOf(p);
      return p.type === "not"
        ? { p, ins: [ts[0].id], out: ts[1].id }
        : { p, ins: [ts[0].id, ts[1].id], out: ts[2].id };
    });

  const fn = (t: string, i: boolean[]) =>
    t === "and"
      ? i[0] && i[1]
      : t === "or"
        ? i[0] || i[1]
        : t === "not"
          ? !i[0]
          : t === "nand"
            ? !(i[0] && i[1])
            : t === "nor"
              ? !(i[0] || i[1])
              : i[0] !== i[1]; // xor

  let val: Record<string, boolean> = {};
  for (let iter = 0; ; iter++) {
    const next: Record<string, boolean> = {};
    for (const root of lRoots) next[root] = true;
    for (const g of gates) {
      const ins = g.ins.map((t) => !!val[find(t)]);
      if (fn(g.p.type, ins)) next[find(g.out)] = true;
    }
    for (const root of nRoots) delete next[root]; // N rayı daima 0
    const same = JSON.stringify(next) === JSON.stringify(val);
    val = next;
    if (same) break;
    if (iter >= 30) {
      res.chatter = true; // geri besleme salınıyor (NOT kendini besliyor olabilir)
      break;
    }
  }

  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    if (kind === "load") res.level[p.id] = val[find(terminalsOf(p)[0].id)] ? 1 : 0;
    if (kind === "gate") {
      const ts = terminalsOf(p);
      res.level[p.id] = val[find(ts[ts.length - 1].id)] ? 1 : 0;
    }
  }
  for (const w of wires) {
    if (!par.has(w.a)) continue;
    res.flow[w.id] = val[find(w.a)] ? 1 : 0;
  }
  return res;
}
