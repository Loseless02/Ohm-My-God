// ── Playground veri modeli ───────────────────────────────────────────────────
export type PartType =
  | "source"
  | "source2" // dikey ray kaynak: L üstte, N altta
  | "rail_l" // sol ray: L (fizik: faz, logik: 1)
  | "rail_n" // sağ ray: N (fizik: nötr, logik: 0)
  | "node" // Knotenpunkt (palet dışı: kablo çekerken otomatik oluşur)
  | "switch_no" // Schalter, Schließer
  | "switch_nc" // Schalter, Öffner
  | "taster_no" // Taster (basılı tut)
  | "taster_nc"
  | "pairc_no" // bir şalterin/tasterin EŞ kontağı (kapayıcı) — aynı düğme, ikinci kontak
  | "pairc_nc" // eş kontak (açıcı) — Tasterverriegelung bununla kurulur
  | "lamp"
  | "motor"
  | "coil" // Schütz bobini (K)
  | "contact_no" // Schütz kontağı
  | "contact_nc"
  | "tcoil" // Zeitrelais bobini (KT) — tmode ile 4 çeşit
  | "tcontact_no" // zaman kontağı
  | "tcontact_nc"
  // Logik kapıları (DIN EN 60617 kutu sembolleri)
  | "and"
  | "or"
  | "not"
  | "nand"
  | "nor"
  | "xor";

export type TimerMode = "ein" | "aus" | "impuls" | "blink";

export interface Part {
  id: string;
  type: PartType;
  x: number;
  y: number;
  label: string; // S1, K1, H1, M1, KT1 …
  group?: string; // kontaklar için: hangi bobini/şalteri takip ediyor (K1 / KT1 / S1)
  volts?: number; // kaynaklar ve L rayı
  delay?: number; // tcoil (saniye)
  enabled?: boolean; // kaynaklar: aktif/deaktif (undefined = aktif)
  rot?: number; // çeyrek tur (saat yönü tersine): 0..3
  tmode?: TimerMode; // zaman rölesi çalışma şekli
}

// Terminal kimliği: "partId:0" | "partId:1" | …
export interface Wire {
  id: string;
  a: string;
  b: string;
  pts?: { x: number; y: number }[]; // eski kayıtlar için korunuyor (yeni kablolar node zinciri kullanır)
}

export type PartKind = "source" | "switch" | "load" | "coil" | "node" | "rail" | "gate";

export interface PartSpec {
  name: string; // palet adı (TR)
  de: string; // Almanca terim
  prefix: string; // otomatik etiket öneki
  kind: PartKind;
  w: number;
  h: number;
  t: [number, number][]; // terminal ofsetleri (part origin'e göre, rot=0)
  vert?: boolean; // dikey iki uçlu standart parça (yatay mod bunları döndürür)
}

const V: [number, number][] = [
  [0, 0],
  [0, 60],
];

export const RAIL_H = 520;
const RAIL_T: [number, number][] = Array.from({ length: 14 }, (_, i) => [0, i * 40]);

const GATE_T: [number, number][] = [
  [0, 0],
  [0, 40],
  [60, 20],
];

const gate = (name: string, de: string): PartSpec => ({
  name,
  de,
  prefix: "",
  kind: "gate",
  w: 60,
  h: 40,
  t: GATE_T,
});

export const SPEC: Record<PartType, PartSpec> = {
  source: { name: "Kaynak (yatay)", de: "Netz / Spannungsquelle", prefix: "G", kind: "source", w: 80, h: 40, t: [[0, 40], [80, 40]] },
  source2: { name: "Kaynak (dikey)", de: "Spannungsquelle, L üst / N alt", prefix: "G", kind: "source", w: 0, h: 60, t: V, vert: true },
  rail_l: { name: "Ray L", de: "Sammelschiene L", prefix: "", kind: "rail", w: 0, h: RAIL_H, t: RAIL_T },
  rail_n: { name: "Ray N", de: "Sammelschiene N", prefix: "", kind: "rail", w: 0, h: RAIL_H, t: RAIL_T },
  node: { name: "Knotenpunkt", de: "Verbindungspunkt", prefix: "", kind: "node", w: 0, h: 0, t: [[0, 0]] },
  switch_no: { name: "Şalter (kapayıcı)", de: "Schalter, Schließer", prefix: "S", kind: "switch", w: 0, h: 60, t: V, vert: true },
  switch_nc: { name: "Şalter (açıcı)", de: "Schalter, Öffner", prefix: "S", kind: "switch", w: 0, h: 60, t: V, vert: true },
  taster_no: { name: "Buton (kapayıcı)", de: "Taster, Schließer", prefix: "S", kind: "switch", w: 0, h: 60, t: V, vert: true },
  taster_nc: { name: "Buton (açıcı)", de: "Taster, Öffner", prefix: "S", kind: "switch", w: 0, h: 60, t: V, vert: true },
  pairc_no: { name: "Eş kontak (kapayıcı)", de: "gekoppelter Schließer", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  pairc_nc: { name: "Eş kontak (açıcı)", de: "gekoppelter Öffner", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  lamp: { name: "Lamba", de: "Leuchte", prefix: "H", kind: "load", w: 0, h: 60, t: V, vert: true },
  motor: { name: "Motor", de: "Motor", prefix: "M", kind: "load", w: 0, h: 60, t: V, vert: true },
  coil: { name: "Kontaktör bobini", de: "Schütz(spule)", prefix: "K", kind: "coil", w: 0, h: 60, t: V, vert: true },
  contact_no: { name: "Kontak (kapayıcı)", de: "Schützkontakt, Schließer", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  contact_nc: { name: "Kontak (açıcı)", de: "Schützkontakt, Öffner", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  tcoil: { name: "Zaman rölesi", de: "Zeitrelais", prefix: "KT", kind: "coil", w: 0, h: 60, t: V, vert: true },
  tcontact_no: { name: "Zaman kontağı (kapayıcı)", de: "zeitverzögerter Schließer", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  tcontact_nc: { name: "Zaman kontağı (açıcı)", de: "zeitverzögerter Öffner", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  and: gate("UND (&)", "AND-Gatter"),
  or: gate("ODER (≥1)", "OR-Gatter"),
  not: { ...gate("NICHT (1)", "NOT / Negation"), t: [[0, 20], [60, 20]] },
  nand: gate("NAND (& ∘)", "NAND-Gatter"),
  nor: gate("NOR (≥1 ∘)", "NOR-Gatter"),
  xor: gate("XOR (=1)", "XOR / Antivalenz"),
};

export const GRID = 20;
export const CANVAS_W = 960;
export const CANVAS_H = 600;

export const snap = (v: number) => Math.round(v / GRID) * GRID;

// çeyrek tur döndürme: k=1 → saat yönü tersi 90° (SVG rotate(-90) ile aynı)
export const rotXY = (dx: number, dy: number, k: number): [number, number] => {
  switch (((k % 4) + 4) % 4) {
    case 1:
      return [dy, -dx];
    case 2:
      return [-dx, -dy];
    case 3:
      return [-dy, dx];
    default:
      return [dx, dy];
  }
};

export const terminalsOf = (p: Part) =>
  SPEC[p.type].t.map(([dx, dy], i) => {
    const [rx, ry] = rotXY(dx, dy, p.rot ?? 0);
    return { id: `${p.id}:${i}`, x: p.x + rx, y: p.y + ry };
  });

export const termPos = (parts: Part[], tid: string) => {
  const [pid, idxs] = tid.split(":");
  const p = parts.find((q) => q.id === pid);
  if (!p) return null;
  const spec = SPEC[p.type];
  const off = spec.t[Number(idxs)];
  if (!off) return null;
  const [rx, ry] = rotXY(off[0], off[1], p.rot ?? 0);
  return { x: p.x + rx, y: p.y + ry };
};

export interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// parçanın kendi (döndürülmemiş) kapladığı alan — hitbox + seçim + engel için
export function localBox(t: PartType): Box {
  const spec = SPEC[t];
  if (t === "source") return { x1: -4, y1: -2, x2: 84, y2: 42 };
  if (spec.kind === "rail") return { x1: -8, y1: -6, x2: 8, y2: RAIL_H + 6 };
  if (spec.kind === "node") return { x1: -8, y1: -8, x2: 8, y2: 8 };
  if (spec.kind === "gate") return { x1: -2, y1: -10, x2: 62, y2: 50 };
  if (t.startsWith("taster")) return { x1: -28, y1: -4, x2: 20, y2: 64 };
  return { x1: -20, y1: -4, x2: 20, y2: 64 };
}

export function worldBox(p: Part): Box {
  const lb = localBox(p.type);
  const k = p.rot ?? 0;
  const [ax, ay] = rotXY(lb.x1, lb.y1, k);
  const [bx, by] = rotXY(lb.x2, lb.y2, k);
  return {
    x1: p.x + Math.min(ax, bx),
    y1: p.y + Math.min(ay, by),
    x2: p.x + Math.max(ax, bx),
    y2: p.y + Math.max(ay, by),
  };
}
