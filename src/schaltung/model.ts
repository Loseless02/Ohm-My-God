// ── Schaltung çözücü modeli ──────────────────────────────────────────────────
// Devre bir ağaçtır: dirençler yaprak, seri/paralel gruplar dal. Kullanıcının
// girdiği değerlerden türetilebilen HER şey, kurallar sabitlenene kadar
// yinelemeli olarak hesaplanır:
//   - Ohm: U = R·I (her düğümde, ikisi bilinince üçüncüsü)
//   - Seri: I ortak, U ve R toplanır
//   - Paralel: U ortak, I toplanır, iletkenlikler (1/R) toplanır
// Çelişen girdiler tespit edilir (aynı değeri iki yoldan farklı bulursak).

export interface RNode {
  id: string;
  kind: "R";
  label: string;
}

export interface GNode {
  id: string;
  kind: "series" | "parallel";
  label: string;
  children: CNode[];
}

export type CNode = RNode | GNode;

export interface Quantities {
  R?: number;
  U?: number;
  I?: number;
  P?: number;
}

export type Given = Record<string, { R?: number; U?: number; I?: number }>;

// Çelişki: metin arayüzde üretilir (çok dilli) — model yalnızca türü ve parametreleri bildirir.
export interface Conflict {
  code: "twoWays" | "negative" | "equalI" | "equalU" | "parallelR" | "ohm";
  p: Record<string, string>;
}

export interface SolveResult {
  vals: Record<string, Quantities>;
  conflict: Conflict | null;
}

export function collectNodes(n: CNode, out: CNode[] = []): CNode[] {
  out.push(n);
  if (n.kind !== "R") for (const c of n.children) collectNodes(c, out);
  return out;
}

export function solveCircuit(root: CNode, given: Given): SolveResult {
  const vals: Record<string, Quantities> = {};
  let conflict: Conflict | null = null;

  for (const [id, q] of Object.entries(given)) {
    vals[id] = {};
    if (q.R !== undefined) vals[id].R = q.R;
    if (q.U !== undefined) vals[id].U = q.U;
    if (q.I !== undefined) vals[id].I = q.I;
  }

  const get = (id: string) => (vals[id] ??= {});
  const close = (a: number, b: number) =>
    Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(a), Math.abs(b));
  const flag = (code: Conflict["code"], p: Record<string, string>) => {
    if (!conflict) conflict = { code, p };
  };
  const set = (id: string, k: "R" | "U" | "I", v: number, label: string): boolean => {
    if (!Number.isFinite(v)) return false;
    const o = get(id);
    const ex = o[k];
    if (ex !== undefined) {
      if (!close(ex, v))
        flag("twoWays", { label, k, a: ex.toPrecision(4), b: v.toPrecision(4) });
      return false;
    }
    o[k] = v;
    return true;
  };

  const nodes = collectNodes(root);
  const labelOf = new Map(nodes.map((n) => [n.id, n.label]));

  // grup + çocuklar üzerinde toplama kuralı (U seri / I paralel / R seri)
  const sumRule = (g: CNode & { kind: "series" | "parallel" }, key: "R" | "U" | "I"): boolean => {
    let changed = false;
    const kids = g.children.map((c) => ({ id: c.id, v: get(c.id)[key] }));
    const known = kids.filter((k) => k.v !== undefined);
    const gv = get(g.id)[key];
    if (known.length === kids.length) {
      const sum = known.reduce((a, k) => a + (k.v as number), 0);
      changed = set(g.id, key, sum, g.label) || changed;
    }
    if (gv !== undefined && known.length === kids.length - 1) {
      const miss = kids.find((k) => k.v === undefined)!;
      const rest = known.reduce((a, k) => a + (k.v as number), 0);
      const v = gv - rest;
      if (v < -1e-9)
        flag("negative", { label: labelOf.get(miss.id) ?? miss.id, k: key });
      else changed = set(miss.id, key, v, labelOf.get(miss.id) ?? miss.id) || changed;
    }
    return changed;
  };

  // eşitlik kuralı (I seri / U paralel): grup ve tüm çocuklar aynı değeri taşır
  const equalRule = (g: GNode, key: "U" | "I"): boolean => {
    let changed = false;
    const members = [{ id: g.id, label: g.label }, ...g.children.map((c) => ({ id: c.id, label: c.label }))];
    const knownVal = members.map((m) => get(m.id)[key]).find((v) => v !== undefined);
    if (knownVal === undefined) return false;
    for (const m of members)
      if (get(m.id)[key] === undefined) changed = set(m.id, key, knownVal, m.label) || changed;
      else if (!close(get(m.id)[key]!, knownVal))
        flag(key === "I" ? "equalI" : "equalU", { group: g.label, label: m.label });
    return changed;
  };

  // paralel direnç: iletkenlikler toplanır
  const invSumRule = (g: GNode): boolean => {
    let changed = false;
    const kids = g.children.map((c) => ({ id: c.id, v: get(c.id).R }));
    const known = kids.filter((k) => k.v !== undefined);
    const gv = get(g.id).R;
    if (known.length === kids.length && known.every((k) => (k.v as number) > 0)) {
      const inv = known.reduce((a, k) => a + 1 / (k.v as number), 0);
      if (inv > 0) changed = set(g.id, "R", 1 / inv, g.label) || changed;
    }
    if (gv !== undefined && gv > 0 && known.length === kids.length - 1) {
      const miss = kids.find((k) => k.v === undefined)!;
      const rest = known.reduce((a, k) => a + 1 / (k.v as number), 0);
      const inv = 1 / gv - rest;
      if (inv <= 0)
        flag("parallelR", { label: labelOf.get(miss.id) ?? miss.id });
      else changed = set(miss.id, "R", 1 / inv, labelOf.get(miss.id) ?? miss.id) || changed;
    }
    return changed;
  };

  for (let iter = 0; iter < 80 && !conflict; iter++) {
    let changed = false;
    for (const n of nodes) {
      const o = get(n.id);
      // Ohm kanunu her düğümde geçerli (grup dahil: eşdeğer büyüklükler)
      if (o.R !== undefined && o.I !== undefined && o.U === undefined)
        changed = set(n.id, "U", o.R * o.I, n.label) || changed;
      if (o.U !== undefined && o.I !== undefined && o.R === undefined && o.I !== 0)
        changed = set(n.id, "R", o.U / o.I, n.label) || changed;
      if (o.U !== undefined && o.R !== undefined && o.I === undefined && o.R !== 0)
        changed = set(n.id, "I", o.U / o.R, n.label) || changed;
      if (
        o.U !== undefined &&
        o.R !== undefined &&
        o.I !== undefined &&
        !close(o.U, o.R * o.I)
      )
        flag("ohm", { label: n.label, a: o.U.toPrecision(4), b: (o.R * o.I).toPrecision(4) });

      if (n.kind === "R") continue;
      if (n.kind === "series") {
        changed = equalRule(n, "I") || changed;
        changed = sumRule(n, "U") || changed;
        changed = sumRule(n, "R") || changed;
      } else {
        changed = equalRule(n, "U") || changed;
        changed = sumRule(n, "I") || changed;
        changed = invSumRule(n) || changed;
      }
    }
    if (!changed) break;
  }

  for (const n of nodes) {
    const o = get(n.id);
    if (o.U !== undefined && o.I !== undefined) o.P = o.U * o.I;
  }
  return { vals, conflict };
}
