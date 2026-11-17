// Parça ayarları: her tipin anma değerleri ve özellik panelinde düzenlenebilen alanları.
// Değerler Part.prm içinde tutulur; yoksa buradaki varsayılan geçerlidir.
import type { Part, PartType } from "./types";

export interface ParamDef {
  k: string;
  label: string;
  unit?: string;
  def: number | string;
  min?: number;
  max?: number;
  step?: number;
  options?: [string, string][]; // [değer, etiket]
  slider?: boolean; // simülasyon sırasında da kaydırılabilir (pot, ışık, sıcaklık …)
  field?: "volts"; // eski kayıtlarla uyum: değer Part.volts'ta durur
}

const ACDC: [string, string][] = [
  ["ac", "AC ~ (sinüs)"],
  ["dc", "DC ="],
];
const U = (def: number, label = "Gerilim"): ParamDef => ({ k: "U", label, unit: "V", def, min: 0, max: 1e7, field: "volts" });
const UN = (def: number): ParamDef => ({ k: "Un", label: "Anma gerilimi", unit: "V", def, min: 0.1, max: 1e5 });
const PN = (def: number): ParamDef => ({ k: "Pn", label: "Anma gücü", unit: "W", def, min: 0.01, max: 1e6 });

const SUPPLY: ParamDef[] = [
  U(230),
  { k: "ac", label: "Akım türü", def: "ac", options: ACDC },
  { k: "f", label: "Frekans", unit: "Hz", def: 50, min: 0.1, max: 1000 },
  { k: "In", label: "Koruma (LS) anma akımı", unit: "A", def: 16, min: 0.01, max: 1000 },
];

export const PARAMS: Partial<Record<PartType, ParamDef[]>> = {
  source: SUPPLY,
  source2: SUPPLY,
  bus_l: SUPPLY,
  lamp: [UN(230), PN(60)],
  led: [UN(230), PN(8)],
  fluo: [UN(230), PN(36)],
  heater: [UN(230), PN(2000)],
  motor: [
    UN(230),
    PN(370),
    { k: "nn", label: "Anma devri", unit: "1/min", def: 1400, min: 1, max: 30000 },
    { k: "cos", label: "cos φ", def: 0.8, min: 0.1, max: 1, step: 0.01 },
    { k: "prot", label: "Sargı koruması (termik)", def: "on", options: [["on", "var"], ["off", "yok — yanar"]] },
  ],
  coil: [U(230, "Bobin gerilimi"), { k: "S", label: "Çekme gücü", unit: "VA", def: 8, min: 0.1, max: 500 }],
  relay_ss: [U(230, "Bobin gerilimi"), { k: "S", label: "Çekme gücü", unit: "VA", def: 3, min: 0.1, max: 500 }],
  tcoil: [U(230, "Bobin gerilimi")],
  fuse: [
    { k: "In", label: "Anma akımı", unit: "A", def: 10, min: 0.001, max: 1000 },
    { k: "ch", label: "Karakteristik", def: "B", options: [["B", "B (5×)"], ["C", "C (10×)"], ["gG", "Eriyen telli (gG)"], ["F", "Hızlı cam sigorta (F)"]] },
  ],
  res: [
    { k: "R", label: "Direnç", unit: "Ω", def: 1000, min: 0.001, max: 1e9 },
    { k: "Pmax", label: "Güç değeri", unit: "W", def: 0.25, min: 0.01, max: 1000 },
  ],
  pot: [
    { k: "R", label: "Toplam direnç", unit: "Ω", def: 10000, min: 1, max: 1e8 },
    { k: "pos", label: "Konum (sürgü)", def: 0.5, min: 0, max: 1, step: 0.01, slider: true },
    { k: "Pmax", label: "Güç değeri", unit: "W", def: 0.5, min: 0.01, max: 100 },
  ],
  cap: [
    { k: "C", label: "Kapasite", unit: "F", def: 100e-9, min: 1e-12, max: 10 },
    { k: "Umax", label: "Dayanım gerilimi", unit: "V", def: 63, min: 1, max: 1e5 },
  ],
  ecap: [
    { k: "C", label: "Kapasite", unit: "F", def: 100e-6, min: 1e-9, max: 10 },
    { k: "Umax", label: "Dayanım gerilimi", unit: "V", def: 25, min: 1, max: 1000 },
  ],
  ind: [{ k: "L", label: "Endüktans", unit: "H", def: 0.01, min: 1e-9, max: 1000 }],
  diode: [{ k: "Imax", label: "En yüksek akım", unit: "A", def: 1, min: 0.001, max: 1000 }],
  zener: [
    { k: "Vz", label: "Zener gerilimi", unit: "V", def: 5.1, min: 1, max: 200 },
    { k: "Pmax", label: "Güç değeri", unit: "W", def: 0.5, min: 0.05, max: 50 },
  ],
  led_d: [
    { k: "Vf", label: "İletim gerilimi", unit: "V", def: 2, min: 1.2, max: 4 },
    { k: "Imax", label: "En yüksek akım", unit: "A", def: 0.02, min: 0.001, max: 2 },
  ],
  bridge: [{ k: "Imax", label: "En yüksek akım", unit: "A", def: 1, min: 0.01, max: 100 }],
  npn: [
    { k: "beta", label: "Akım kazancı β", def: 200, min: 1, max: 2000 },
    { k: "Imax", label: "En yüksek kolektör akımı", unit: "A", def: 0.1, min: 0.001, max: 100 },
  ],
  pnp: [
    { k: "beta", label: "Akım kazancı β", def: 200, min: 1, max: 2000 },
    { k: "Imax", label: "En yüksek kolektör akımı", unit: "A", def: 0.1, min: 0.001, max: 100 },
  ],
  nmos: [
    { k: "Vth", label: "Eşik gerilimi", unit: "V", def: 2.5, min: 0.3, max: 10 },
    { k: "K", label: "İletkenlik katsayısı", unit: "A/V²", def: 0.5, min: 0.001, max: 100 },
    { k: "Imax", label: "En yüksek akım", unit: "A", def: 10, min: 0.01, max: 500 },
  ],
  reg: [
    { k: "Uo", label: "Çıkış gerilimi", unit: "V", def: 5, min: 1, max: 48 },
    { k: "Imax", label: "Akım sınırı", unit: "A", def: 1, min: 0.01, max: 10 },
    { k: "sink", label: "Soğutucu", def: "no", options: [["no", "yok"], ["yes", "var"]] },
  ],
  xfmr: [
    { k: "U1", label: "Primer gerilim", unit: "V", def: 230, min: 1, max: 1e5 },
    { k: "U2", label: "Sekonder gerilim", unit: "V", def: 12, min: 0.1, max: 1e5 },
    { k: "S", label: "Anma gücü", unit: "VA", def: 10, min: 0.1, max: 1e6 },
  ],
  opamp: [{ k: "A", label: "Açık çevrim kazancı", def: 20000, min: 10, max: 1e6 }],
  mcu: [
    {
      k: "prog",
      label: "Program",
      def: "blink",
      options: [
        ["blink", "Yanıp sönme (P1)"],
        ["button", "Buton P4 → LED P1"],
        ["runner", "Yürüyen ışık (P1–P3)"],
        ["traffic", "Trafik lambası (P1 kırmızı, P2 sarı, P3 yeşil)"],
        ["fade", "PWM yavaş yanma (P1)"],
        ["thresh", "Eşik: P4 > Ucc/2 → P1 (alacakaranlık)"],
      ],
    },
    { k: "T", label: "Adım süresi", unit: "ms", def: 500, min: 20, max: 10000 },
  ],
  fgen: [
    { k: "wave", label: "Dalga", def: "sine", options: [["sine", "Sinüs"], ["square", "Kare"], ["tri", "Üçgen"], ["dc", "DC"]] },
    { k: "Up", label: "Genlik (tepe)", unit: "V", def: 5, min: 0, max: 1000, slider: true },
    { k: "f", label: "Frekans", unit: "Hz", def: 2, min: 0.01, max: 500, slider: true },
    { k: "off", label: "DC ofset", unit: "V", def: 0, min: -1000, max: 1000 },
  ],
  ldr: [
    { k: "lux", label: "Işık", unit: "lx", def: 300, min: 0, max: 2000, step: 1, slider: true },
    { k: "R10", label: "Direnç @10 lx", unit: "Ω", def: 20000, min: 10, max: 1e7 },
  ],
  ntc: [
    { k: "T", label: "Ortam sıcaklığı", unit: "°C", def: 25, min: -40, max: 150, step: 1, slider: true },
    { k: "R25", label: "Direnç @25 °C", unit: "Ω", def: 10000, min: 1, max: 1e7 },
    { k: "B", label: "B sabiti", unit: "K", def: 3950, min: 500, max: 10000 },
  ],
  motor3: [
    { k: "Pn", label: "Anma gücü (mil)", unit: "W", def: 4000, min: 10, max: 1e7 },
    { k: "Un", label: "Anma gerilimi (Δ)", unit: "V", def: 400, min: 1, max: 1e5 },
    { k: "cos", label: "cos φ", def: 0.82, min: 0.1, max: 1, step: 0.01 },
    { k: "eta", label: "Verim η", def: 0.86, min: 0.1, max: 1, step: 0.01 },
    { k: "nn", label: "Anma devri", unit: "1/min", def: 1440, min: 1, max: 30000 },
  ],
  ol3: [{ k: "Ie", label: "Ayar akımı (motor I_N)", unit: "A", def: 8.5, min: 0.1, max: 1000 }],
  q3: [{ k: "In", label: "Anma akımı", unit: "A", def: 10, min: 0.1, max: 1000 }],
  dcmotor: [
    UN(12),
    PN(5),
    { k: "nn", label: "Anma devri", unit: "1/min", def: 3000, min: 1, max: 50000 },
  ],
};

/** Elektronik modunda bazı parçalar küçük gerilimle gelsin. */
export const EL_DEFAULTS: Partial<Record<PartType, Record<string, number | string>>> = {
  lamp: { Un: 12, Pn: 5 },
  coil: { U: 12, S: 0.5 },
  relay_ss: { U: 12, S: 0.5 },
  tcoil: { U: 12 },
  fuse: { In: 0.5, ch: "F" },
};

export function paramDef(t: PartType, k: string): ParamDef | undefined {
  return PARAMS[t]?.find((d) => d.k === k);
}

/** Sayısal ayar (yoksa varsayılan). */
export function pn(p: Part, k: string): number {
  const d = paramDef(p.type, k);
  if (d?.field === "volts" && p.volts !== undefined) return p.volts;
  const v = p.prm?.[k];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return typeof d?.def === "number" ? d.def : 0;
}

/** Seçenek ayarı (yoksa varsayılan). */
export function ps(p: Part, k: string): string {
  const v = p.prm?.[k];
  if (typeof v === "string") return v;
  const d = paramDef(p.type, k);
  return typeof d?.def === "string" ? d.def : "";
}

/** Değeri birim önekiyle yaz: 0.0047 → "4,7 m". */
export function si(v: number, unit = "", digits = 3): string {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  const pre: [number, string][] = [
    [1e9, "G"],
    [1e6, "M"],
    [1e3, "k"],
    [1, ""],
    [1e-3, "m"],
    [1e-6, "µ"],
    [1e-9, "n"],
    [1e-12, "p"],
  ];
  if (a === 0) return `0 ${unit}`.trim();
  for (const [m, s] of pre)
    if (a >= m * 0.9995) return `${(v / m).toLocaleString("tr-TR", { maximumSignificantDigits: digits + 1 })} ${s}${unit}`.trim();
  return `${v.toExponential(2)} ${unit}`.trim();
}

/** Tuvalde etiketin yanına yazılan kısa değer (R1 4,7 kΩ gibi). */
export function valueText(p: Part): string {
  switch (p.type) {
    case "res":
    case "pot":
      return si(pn(p, "R"), "Ω", 2);
    case "cap":
    case "ecap":
      return si(pn(p, "C"), "F", 2);
    case "ind":
      return si(pn(p, "L"), "H", 2);
    case "zener":
      return `${pn(p, "Vz")} V`;
    case "lamp":
    case "fluo":
    case "heater":
    case "led":
      return `${pn(p, "Un")} V ${si(pn(p, "Pn"), "W", 2)}`;
    case "motor":
      return si(pn(p, "Pn"), "W", 2);
    case "coil":
    case "relay_ss":
    case "tcoil":
      return pn(p, "U") !== 230 ? `${pn(p, "U")} V` : "";
    case "fuse":
      return `${pn(p, "In")} A`;
    case "dcmotor":
      return `${pn(p, "Un")} V`;
  }
  return "";
}
