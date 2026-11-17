// ── Ortak simülasyon tipleri + Logik motoru ─────────────────────────────────
// Fiziksel/elektronik devreler engine.ts'te (zamana bağlı), trifaze sim3.ts'te.
// simulateLogic(): dijital devre — net'ler üzerinde boolean yayılım.

import type { Part, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";

const MAIN_SWITCH = ["switch_no", "switch_nc", "taster_no", "taster_nc"];

export interface MotorState {
  speed: number; // 0..1 (yıldızda ~0.58, üçgende 1)
  dir: number; // +1 sağa, -1 sola, 0 duruyor
  fault?: "phase"; // faz kaybı: vınlar ama dönmez
}

export interface SimResult {
  hasSource: boolean;
  short: boolean;
  chatter: boolean;
  energized: Record<string, boolean>; // bobin LABEL → enerjili
  level: Record<string, number>; // yük/kapı part id → 0..1
  flow: Record<string, number>; // kablo id → normalize akım / mantık değeri
  dir: Record<string, number>; // kablo id → akış yönü: +1 = a→b, -1 = b→a
  closed: Record<string, boolean>; // anahtar part id → kapalı mı
  burnt?: Record<string, boolean>; // bobin part id → nominalin çok üstünde gerilim
  motor?: Record<string, MotorState>; // trifaze motor part id → durum
}

// act: part id'ler + "§<label>" anahtarlarıyla ana şalter konumları
export function isClosed(
  p: Part,
  energized: Record<string, boolean>,
  act: Record<string, boolean>,
  timerDone: Record<string, boolean>,
  held: Record<string, boolean> = {},
): boolean {
  const g = p.group ?? "";
  const relay = () => (g in held ? !!held[g] : !!energized[g]);
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
    case "contact_co": // Wechsler: "kapalı" = 11-14 konumu
      return relay();
    case "contact_nc":
      return !relay();
    case "ol_nc":
      return !held[g];
    case "ol_no":
      return !!held[g];
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

export function solve(n: number, A: number[][], b: number[]): number[] {
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

// ── Dijital (Logik) simülasyon ───────────────────────────────────────────────
export function simulateLogic(
  parts: Part[],
  wires: Wire[],
  io: { actuated: Record<string, boolean>; held?: Record<string, boolean> },
): SimResult {
  const act = withLabels(parts, io.actuated);
  const held = io.held ?? {};
  const res: SimResult = {
    hasSource: parts.some((p) => p.type === "rail_l"),
    short: false,
    chatter: false,
    energized: {},
    level: {},
    flow: {},
    dir: {},
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
      const c = isClosed(p, {}, act, {}, held);
      res.closed[p.id] = c;
      if (c) {
        const [t0, t1] = terminalsOf(p);
        union(t0.id, t1.id);
      }
    }
    if (kind === "changeover") {
      const c = isClosed(p, {}, act, {}, held);
      res.closed[p.id] = c;
      const [t0, t1, t2] = terminalsOf(p);
      union(t0.id, c ? t2.id : t1.id);
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

  // akış yönü: sürücülerden (L rayı + aktif kapı çıkışları) uzaklaşan yönde.
  // iletken graf üzerinde çok kaynaklı BFS derinliği karşılaştırılır.
  const adj = new Map<string, string[]>();
  const link = (a: string, b: string) => {
    if (!par.has(a) || !par.has(b)) return;
    (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
  };
  for (const w of wires) link(w.a, w.b);
  for (const p of parts) {
    const kind = SPEC[p.type].kind;
    if (kind === "switch" && res.closed[p.id]) {
      const [t0, t1] = terminalsOf(p);
      link(t0.id, t1.id);
    }
    if (kind === "changeover") {
      const [t0, t1, t2] = terminalsOf(p);
      link(t0.id, res.closed[p.id] ? t2.id : t1.id);
    }
    if (kind === "rail") {
      const ts = terminalsOf(p);
      for (let i = 1; i < ts.length; i++) link(ts[0].id, ts[i].id);
    }
  }
  const depth = new Map<string, number>();
  const queue: string[] = [];
  for (const p of parts) {
    if (p.type === "rail_l") for (const t of terminalsOf(p)) if (!depth.has(t.id)) { depth.set(t.id, 0); queue.push(t.id); }
    if (SPEC[p.type].kind === "gate" && res.level[p.id] === 1) {
      const ts = terminalsOf(p);
      const out = ts[ts.length - 1].id;
      if (!depth.has(out)) { depth.set(out, 0); queue.push(out); }
    }
  }
  for (let qi = 0; qi < queue.length; qi++) {
    const cur = queue[qi];
    const d = depth.get(cur)!;
    for (const nb of adj.get(cur) ?? [])
      if (!depth.has(nb)) { depth.set(nb, d + 1); queue.push(nb); }
  }
  for (const w of wires) {
    if (!res.flow[w.id]) continue;
    const da = depth.get(w.a);
    const db = depth.get(w.b);
    if (da === undefined || db === undefined || da === db) continue;
    res.dir[w.id] = da < db ? 1 : -1;
  }
  return res;
}
