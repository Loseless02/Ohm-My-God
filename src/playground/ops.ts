// Devre üzerinde saf işlemler: hem tuval (Board) hem de Playground kabuğu kullanır.
import type { Part, PartType, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";
import { EL_DEFAULTS } from "./params";

export const MAIN_SWITCH: PartType[] = ["switch_no", "switch_nc", "taster_no", "taster_nc"];

let idc = 0;
export const newId = (p = "p") => `${p}${++idc}${Date.now().toString(36)}`;

const FIXED_LABEL: Partial<Record<PartType, string>> = {
  contact_co: "11-14",
  ol_nc: "95-96",
  ol_no: "97-98",
  contact3: "1-6",
  tcontact_no: "17-18",
};

export function nextLabel(type: PartType, list: Part[]): string {
  const kind = SPEC[type].kind;
  if (kind === "node" || kind === "gate" || kind === "rail" || kind === "source3") return "";
  const prefix = SPEC[type].prefix;
  if (!prefix) return FIXED_LABEL[type] ?? (type.endsWith("_no") ? "13-14" : "21-22");
  let n = 1;
  while (list.some((p) => p.label === prefix + n)) n++;
  return prefix + n;
}

const firstLabel = (pool: Part[], types: PartType[]) => pool.find((q) => types.includes(q.type))?.label;

/** Yeni parça: etiket, varsayılan ayarlar ve bağlı olduğu bobin/düğme önerisi. */
export function makePart(type: PartType, x: number, y: number, pool: Part[], rotate: boolean, el = false): Part {
  const p: Part = { id: newId(), type, x, y, label: nextLabel(type, pool) };
  const d = el ? EL_DEFAULTS[type] : undefined;
  if (d) {
    const { U, ...rest } = d;
    if (typeof U === "number") p.volts = U;
    if (Object.keys(rest).length) p.prm = { ...rest };
  }
  const kind = SPEC[type].kind;
  if (SPEC[type].vert && rotate) p.rot = 1;
  if (kind === "source" && p.volts === undefined) p.volts = el ? 12 : 230;
  if (kind === "source" && el) p.prm = { ...p.prm, ac: "dc" };
  if (type === "tcoil") {
    p.delay = 3;
    p.tmode = "ein";
  }
  if (type === "contact_no" || type === "contact_nc" || type === "contact_co")
    p.group = firstLabel(pool, ["coil", "relay_ss"]);
  if (type === "contact3") p.group = firstLabel(pool, ["coil"]);
  if (type === "tcontact_no" || type === "tcontact_nc") p.group = firstLabel(pool, ["tcoil"]);
  if (type === "pairc_no" || type === "pairc_nc") p.group = firstLabel(pool, MAIN_SWITCH);
  if (type === "ol_nc" || type === "ol_no") p.group = firstLabel(pool, ["ol3"]);
  if (type === "led" || type === "led_d") p.color = "red";
  if (type === "motor3") p.conn = "6";
  return p;
}

/** Taşınan/bırakılan parçanın terminalleriyle çakışan yabancı terminaller. */
export function coincidentPairs(moved: Part, others: Part[]) {
  const out: { a: string; b: string; x: number; y: number }[] = [];
  for (const m of terminalsOf(moved))
    for (const op of others) {
      if (op.id === moved.id) continue;
      for (const t of terminalsOf(op)) if (t.x === m.x && t.y === m.y) out.push({ a: m.id, b: t.id, x: t.x, y: t.y });
    }
  return out;
}

/** Eksik olan kabloları ekle (aynı uç çifti iki kez bağlanmaz). */
export function withWires(ws: Wire[], pairs: { a: string; b: string }[]): Wire[] {
  if (!pairs.length) return ws;
  const out = [...ws];
  for (const pr of pairs) {
    const dup = out.some((w) => (w.a === pr.a && w.b === pr.b) || (w.a === pr.b && w.b === pr.a));
    if (!dup && pr.a !== pr.b) out.push({ id: newId("w"), a: pr.a, b: pr.b });
  }
  return out;
}

/** Kablosu kalmayan Knotenpunkt'lar kablosuyla birlikte yok olur. */
export function pruneOrphanNodes(ps: Part[], ws: Wire[]): Part[] {
  const used = new Set<string>();
  for (const w of ws) {
    used.add(w.a.split(":")[0]);
    used.add(w.b.split(":")[0]);
  }
  return ps.filter((p) => p.type !== "node" || used.has(p.id));
}

export function removeItem(parts: Part[], wires: Wire[], kind: "part" | "wire", id: string) {
  const nextWires =
    kind === "part"
      ? wires.filter((w) => !w.a.startsWith(id + ":") && !w.b.startsWith(id + ":"))
      : wires.filter((w) => w.id !== id);
  const rest = kind === "part" ? parts.filter((p) => p.id !== id) : parts;
  return { parts: pruneOrphanNodes(rest, nextWires), wires: nextWires };
}
