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
  | "contact_co" // Wechsler: 11 ortak, 12 açıcı, 14 kapayıcı
  | "relay_ss" // Stromstoßrelais (Eltako): her darbede konum değiştirir
  | "ol_nc" // Motorschutzrelais yardımcı kontağı 95-96
  | "ol_no" // 97-98
  | "led"
  | "fluo" // Leuchtstofflampe
  // Laststromkreis (trifaze)
  | "netz3" // L1 L2 L3 N besleme
  | "q3" // Motorschutzschalter / ana şalter, 3 kutup
  | "contact3" // Schütz ana kontakları 1-2 / 3-4 / 5-6
  | "ol3" // Motorschutzrelais (termik), 3 kutup
  | "motor3" // asenkron motor, 6 uçlu klemens
  // L üst / N alt raylar (yatay bara) — kaynak sürüklemeye gerek yok
  | "bus_l"
  | "bus_n"
  // ek güç parçaları
  | "fuse" // sigorta / LS
  | "heater" // ısıtıcı direnç
  // Elektronik
  | "res"
  | "pot"
  | "cap"
  | "ecap"
  | "ind"
  | "diode"
  | "zener"
  | "led_d"
  | "bridge"
  | "npn"
  | "pnp"
  | "nmos"
  | "reg"
  | "xfmr"
  | "opamp"
  | "mcu"
  | "fgen"
  | "ldr"
  | "ntc"
  | "dcmotor"
  // Logik kapıları (DIN EN 60617 kutu sembolleri)
  | "and"
  | "or"
  | "not"
  | "nand"
  | "nor"
  | "xor";

export type TimerMode = "ein" | "aus" | "impuls" | "blink" | "treppe";
export type LedColor = "red" | "green" | "yellow" | "blue" | "white";
export type MotorConn = "6" | "Y" | "D"; // klemens: köprüsüz / yıldız köprüsü / üçgen köprüsü

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
  color?: LedColor;
  conn?: MotorConn;
  angle?: number; // serbest modda derece (saat yönü tersine); varsa rot'un yerine geçer
  prm?: Record<string, number | string>; // parça ayarları (R, C, P_n, U_n, program …) — params.ts
}

// Terminal kimliği: "partId:0" | "partId:1" | …
export interface Wire {
  id: string;
  a: string;
  b: string;
  pts?: { x: number; y: number }[]; // eski kayıtlar için korunuyor (yeni kablolar node zinciri kullanır)
}

export type PartKind =
  | "source"
  | "switch"
  | "changeover"
  | "load"
  | "coil"
  | "node"
  | "rail"
  | "gate"
  | "source3"
  | "pole3"
  | "motor3"
  | "comp"; // elektronik / ayarlı yük — davranışı engine.ts tipine göre çözer

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
export const BUS_W = 1600; // yatay baraların boyu
const BUS_T: [number, number][] = Array.from({ length: BUS_W / 20 + 1 }, (_, i) => [i * 20, 0]);
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

const POLE3: [number, number][] = [
  [0, 0],
  [40, 0],
  [80, 0],
  [0, 60],
  [40, 60],
  [80, 60],
];

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
  contact_co: { name: "Kontak (Wechsler)", de: "Wechsler 11-12-14", prefix: "", kind: "changeover", w: 20, h: 60, t: [[0, 60], [0, 0], [20, 0]], vert: true },
  relay_ss: { name: "Darbe rölesi", de: "Stromstoßrelais", prefix: "K", kind: "coil", w: 0, h: 60, t: V, vert: true },
  ol_nc: { name: "Motor koruma kontağı (açıcı)", de: "Motorschutz-Öffner 95-96", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  ol_no: { name: "Motor koruma kontağı (kapayıcı)", de: "Motorschutz-Schließer 97-98", prefix: "", kind: "switch", w: 0, h: 60, t: V, vert: true },
  led: { name: "LED", de: "Leuchtdiode (LED)", prefix: "P", kind: "load", w: 0, h: 60, t: V, vert: true },
  fluo: { name: "Floresan lamba", de: "Leuchtstofflampe", prefix: "E", kind: "load", w: 0, h: 60, t: V, vert: true },
  netz3: { name: "Trifaze şebeke", de: "Drehstromnetz L1 L2 L3 N", prefix: "", kind: "source3", w: 120, h: 0, t: [[0, 0], [40, 0], [80, 0], [120, 0]] },
  q3: { name: "Motor koruma şalteri", de: "Motorschutzschalter (3-polig)", prefix: "Q", kind: "pole3", w: 80, h: 60, t: POLE3 },
  contact3: { name: "Kontaktör ana kontakları", de: "Hauptkontakte 1-2 / 3-4 / 5-6", prefix: "", kind: "pole3", w: 80, h: 60, t: POLE3 },
  ol3: { name: "Motor koruma rölesi", de: "Motorschutzrelais (Bimetall)", prefix: "F", kind: "pole3", w: 80, h: 60, t: POLE3 },
  motor3: {
    name: "Trifaze motor",
    de: "Drehstrom-Asynchronmotor",
    prefix: "M",
    kind: "motor3",
    w: 80,
    h: 100,
    t: [
      [0, 0],
      [40, 0],
      [80, 0],
      [0, 100],
      [40, 100],
      [80, 100],
    ],
  },
  bus_l: { name: "Ray L (üst)", de: "Sammelschiene L / +U", prefix: "", kind: "rail", w: BUS_W, h: 0, t: BUS_T },
  bus_n: { name: "Ray N (alt)", de: "Sammelschiene N / 0 V", prefix: "", kind: "rail", w: BUS_W, h: 0, t: BUS_T },
  fuse: { name: "Sigorta", de: "Sicherung / LS-Schalter", prefix: "F", kind: "comp", w: 0, h: 60, t: V, vert: true },
  heater: { name: "Isıtıcı", de: "Heizwiderstand", prefix: "E", kind: "comp", w: 0, h: 60, t: V, vert: true },
  res: { name: "Direnç", de: "Widerstand", prefix: "R", kind: "comp", w: 0, h: 60, t: V, vert: true },
  pot: { name: "Potansiyometre", de: "Potentiometer", prefix: "R", kind: "comp", w: 0, h: 80, t: [[0, 0], [0, 80], [40, 40]], vert: true },
  cap: { name: "Kondansatör", de: "Kondensator", prefix: "C", kind: "comp", w: 0, h: 60, t: V, vert: true },
  ecap: { name: "Elektrolitik kond.", de: "Elko (gepolt)", prefix: "C", kind: "comp", w: 0, h: 60, t: V, vert: true },
  ind: { name: "Bobin", de: "Spule / Drossel", prefix: "L", kind: "comp", w: 0, h: 60, t: V, vert: true },
  diode: { name: "Diyot", de: "Diode", prefix: "V", kind: "comp", w: 0, h: 60, t: V, vert: true },
  zener: { name: "Zener diyot", de: "Z-Diode", prefix: "V", kind: "comp", w: 0, h: 60, t: V, vert: true },
  led_d: { name: "LED (diyot)", de: "Leuchtdiode", prefix: "P", kind: "comp", w: 0, h: 60, t: V, vert: true },
  bridge: { name: "Köprü doğrultucu", de: "Brückengleichrichter B2U", prefix: "V", kind: "comp", w: 80, h: 80, t: [[0, 40], [80, 40], [40, 0], [40, 80]] },
  npn: { name: "NPN transistör", de: "Transistor NPN", prefix: "Q", kind: "comp", w: 40, h: 80, t: [[-40, 40], [0, 0], [0, 80]] },
  pnp: { name: "PNP transistör", de: "Transistor PNP", prefix: "Q", kind: "comp", w: 40, h: 80, t: [[-40, 40], [0, 80], [0, 0]] },
  nmos: { name: "N-MOSFET", de: "MOSFET N-Kanal", prefix: "Q", kind: "comp", w: 40, h: 80, t: [[-40, 40], [0, 0], [0, 80]] },
  reg: { name: "Gerilim regülatörü", de: "Spannungsregler 78xx", prefix: "N", kind: "comp", w: 80, h: 40, t: [[0, 0], [80, 0], [40, 40]] },
  xfmr: { name: "Trafo", de: "Transformator", prefix: "T", kind: "comp", w: 60, h: 80, t: [[0, 0], [0, 80], [60, 0], [60, 80]] },
  opamp: { name: "Op-amp", de: "Operationsverstärker", prefix: "N", kind: "comp", w: 80, h: 40, t: [[0, 0], [0, 40], [80, 20], [40, -20], [40, 60]] },
  mcu: { name: "Mikrodenetleyici", de: "Mikrocontroller", prefix: "A", kind: "comp", w: 100, h: 100, t: [[0, 20], [0, 80], [100, 20], [100, 40], [100, 60], [100, 80]] },
  fgen: { name: "Sinyal üreteci", de: "Funktionsgenerator", prefix: "G", kind: "comp", w: 0, h: 60, t: V, vert: true },
  ldr: { name: "LDR (ışık sensörü)", de: "Fotowiderstand (LDR)", prefix: "R", kind: "comp", w: 0, h: 60, t: V, vert: true },
  ntc: { name: "NTC (sıcaklık sensörü)", de: "Heißleiter (NTC)", prefix: "R", kind: "comp", w: 0, h: 60, t: V, vert: true },
  dcmotor: { name: "DC motor", de: "Gleichstrommotor", prefix: "M", kind: "comp", w: 0, h: 60, t: V, vert: true },
  and: gate("UND (&)", "AND-Gatter"),
  or: gate("ODER (≥1)", "OR-Gatter"),
  not: { ...gate("NICHT (1)", "NOT / Negation"), t: [[0, 20], [60, 20]] },
  nand: gate("NAND (& ∘)", "NAND-Gatter"),
  nor: gate("NOR (≥1 ∘)", "NOR-Gatter"),
  xor: gate("XOR (=1)", "XOR / Antivalenz"),
};

export const GRID = 20;
export const CANVAS_W = 1200;
export const CANVAS_H = 820;

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

/** Parçanın açısı (derece, saat yönü tersine). Serbest modda angle, ızgara modunda rot·90. */
export const angleOf = (p: Part) => p.angle ?? (p.rot ?? 0) * 90;

/** Yerel ofseti parçanın açısına göre döndür. Dik açılarda tam sayı kalsın diye rotXY kullanılır. */
export function rotPt(dx: number, dy: number, deg: number): [number, number] {
  const d = ((deg % 360) + 360) % 360;
  if (d % 90 === 0) return rotXY(dx, dy, d / 90);
  const r = (d * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [dx * c + dy * s, -dx * s + dy * c];
}

export const terminalsOf = (p: Part) =>
  SPEC[p.type].t.map(([dx, dy], i) => {
    const [rx, ry] = rotPt(dx, dy, angleOf(p));
    return { id: `${p.id}:${i}`, x: p.x + rx, y: p.y + ry };
  });

export const termPos = (parts: Part[], tid: string) => {
  const [pid, idxs] = tid.split(":");
  const p = parts.find((q) => q.id === pid);
  if (!p) return null;
  const spec = SPEC[p.type];
  const off = spec.t[Number(idxs)];
  if (!off) return null;
  const [rx, ry] = rotPt(off[0], off[1], angleOf(p));
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
  if (t === "bus_l" || t === "bus_n") return { x1: -6, y1: -8, x2: BUS_W + 6, y2: 8 };
  if (spec.kind === "rail") return { x1: -8, y1: -6, x2: 8, y2: RAIL_H + 6 };
  if (t === "pot") return { x1: -18, y1: -4, x2: 44, y2: 84 };
  if (t === "bridge") return { x1: -4, y1: -4, x2: 84, y2: 84 };
  if (t === "npn" || t === "pnp" || t === "nmos") return { x1: -42, y1: -4, x2: 24, y2: 84 };
  if (t === "reg") return { x1: -4, y1: -22, x2: 84, y2: 42 };
  if (t === "xfmr") return { x1: -14, y1: -4, x2: 74, y2: 84 };
  if (t === "opamp") return { x1: -4, y1: -22, x2: 84, y2: 62 };
  if (t === "mcu") return { x1: -4, y1: -4, x2: 104, y2: 104 };
  if (spec.kind === "node") return { x1: -8, y1: -8, x2: 8, y2: 8 };
  if (spec.kind === "gate") return { x1: -2, y1: -10, x2: 62, y2: 50 };
  if (t.startsWith("taster")) return { x1: -28, y1: -4, x2: 20, y2: 64 };
  if (t === "contact_co") return { x1: -14, y1: -4, x2: 30, y2: 64 };
  if (t === "netz3") return { x1: -16, y1: -44, x2: 136, y2: -6 };
  if (spec.kind === "pole3") return { x1: -14, y1: -4, x2: 94, y2: 64 };
  if (t === "motor3") return { x1: -12, y1: -4, x2: 92, y2: 104 };
  return { x1: -20, y1: -4, x2: 20, y2: 64 };
}

export function worldBox(p: Part): Box {
  const lb = localBox(p.type);
  const a = angleOf(p);
  const cs = [
    rotPt(lb.x1, lb.y1, a),
    rotPt(lb.x2, lb.y1, a),
    rotPt(lb.x1, lb.y2, a),
    rotPt(lb.x2, lb.y2, a),
  ];
  return {
    x1: p.x + Math.min(...cs.map((c) => c[0])),
    y1: p.y + Math.min(...cs.map((c) => c[1])),
    x2: p.x + Math.max(...cs.map((c) => c[0])),
    y2: p.y + Math.max(...cs.map((c) => c[1])),
  };
}
