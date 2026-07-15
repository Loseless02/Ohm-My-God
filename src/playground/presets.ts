import type { Part, Wire } from "./types";

export interface Preset {
  id: string;
  name: string;
  desc: string;
  parts: Part[];
  wires: Wire[];
}

const P = (id: string, type: Part["type"], x: number, y: number, label: string, extra: Partial<Part> = {}): Part => ({
  id,
  type,
  x,
  y,
  label,
  ...extra,
});
const W = (id: string, a: string, b: string): Wire => ({ id, a, b });

// ── Fiziksel devre örnekleri ─────────────────────────────────────────────────
export const PRESETS: Preset[] = [
  {
    id: "lamba",
    name: "Lamba + Şalter",
    desc: "Klasiklerin klasiği: şalteri kapat, lamba yansın. Her şey buradan başladı.",
    parts: [
      P("src", "source", 440, 20, "G1", { volts: 230 }),
      P("s1", "switch_no", 300, 160, "S1"),
      P("h1", "lamp", 300, 280, "H1"),
    ],
    wires: [
      W("w1", "src:0", "s1:0"),
      W("w2", "s1:1", "h1:0"),
      W("w3", "h1:1", "src:1"),
    ],
  },
  {
    id: "selbsthaltung",
    name: "Selbsthaltung (mühürleme)",
    desc: "Kontaktör tekniğinin temeli: S1'e bas → K1 çeker ve kendi kontağıyla kendini besler (mühür). S0 (açıcı) zinciri keser.",
    parts: [
      P("src", "source", 440, 20, "G1", { volts: 230 }),
      P("s0", "taster_nc", 200, 100, "S0"),
      P("s1", "taster_no", 160, 220, "S1"),
      P("k1c1", "contact_no", 260, 220, "13-14", { group: "K1" }),
      P("k1", "coil", 200, 340, "K1"),
      P("k1c2", "contact_no", 620, 100, "23-24", { group: "K1" }),
      P("h1", "lamp", 620, 220, "H1"),
    ],
    wires: [
      W("w1", "src:0", "s0:0"),
      W("w2", "s0:1", "s1:0"),
      W("w3", "s0:1", "k1c1:0"),
      W("w4", "s1:1", "k1:0"),
      W("w5", "k1c1:1", "k1:0"),
      W("w6", "k1:1", "src:1"),
      W("w7", "src:0", "k1c2:0"),
      W("w8", "k1c2:1", "h1:0"),
      W("w9", "h1:1", "src:1"),
    ],
  },
  {
    id: "tasterverriegelung",
    name: "Tasterverriegelung (eş kontaklarla)",
    desc: "Her butonun 1 kapayıcı + 1 açıcı kontağı var: S1'e basmak K1'i çekerken S1'in açıcısı K2 yolunu keser (ve tersi). İkisine aynı anda basılırsa İKİSİ DE çalışmaz — buna güvenlik denir.",
    parts: [
      P("src", "source", 400, 20, "G1", { volts: 230 }),
      P("s1", "taster_no", 240, 120, "S1"),
      P("s2p", "pairc_nc", 240, 240, "21-22", { group: "S2" }),
      P("k1", "coil", 240, 380, "K1"),
      P("s2", "taster_no", 620, 120, "S2"),
      P("s1p", "pairc_nc", 620, 240, "21-22", { group: "S1" }),
      P("k2", "coil", 620, 380, "K2"),
    ],
    wires: [
      W("w1", "src:0", "s1:0"),
      W("w2", "s1:1", "s2p:0"),
      W("w3", "s2p:1", "k1:0"),
      W("w4", "k1:1", "src:1"),
      W("w5", "src:0", "s2:0"),
      W("w6", "s2:1", "s1p:0"),
      W("w7", "s1p:1", "k2:0"),
      W("w8", "k2:1", "src:1"),
    ],
  },
  {
    id: "zeitrelais",
    name: "Zaman rölesi (gecikmeli lamba)",
    desc: "S1'i kapat → KT1 saymaya başlar → süre dolunca kontak kapanır, lamba yanar. Rölenin modunu panelden değiştir: aus-verzögert, impuls, takt…",
    parts: [
      P("src", "source", 440, 20, "G1", { volts: 230 }),
      P("s1", "switch_no", 240, 140, "S1"),
      P("kt1", "tcoil", 240, 280, "KT1", { delay: 3, tmode: "ein" }),
      P("ktc", "tcontact_no", 600, 140, "17-18", { group: "KT1" }),
      P("h1", "lamp", 600, 280, "H1"),
    ],
    wires: [
      W("w1", "src:0", "s1:0"),
      W("w2", "s1:1", "kt1:0"),
      W("w3", "kt1:1", "src:1"),
      W("w4", "src:0", "ktc:0"),
      W("w5", "ktc:1", "h1:0"),
      W("w6", "h1:1", "src:1"),
    ],
  },
  {
    id: "wechselseitig",
    name: "Kontaktör kilitleme (Verriegelung)",
    desc: "İki kontaktör, birbirinin açıcı kontağı üzerinden kilitli: K1 çekiliyken K2 çekemez (ve tersi). Wendeschaltung'un kalbi.",
    parts: [
      P("src", "source", 440, 20, "G1", { volts: 230 }),
      P("s1", "switch_no", 160, 140, "S1"),
      P("k2nc", "contact_nc", 160, 260, "21-22", { group: "K2" }),
      P("k1", "coil", 160, 400, "K1"),
      P("s2", "switch_no", 680, 140, "S2"),
      P("k1nc", "contact_nc", 680, 260, "21-22", { group: "K1" }),
      P("k2", "coil", 680, 400, "K2"),
    ],
    wires: [
      W("w1", "src:0", "s1:0"),
      W("w2", "s1:1", "k2nc:0"),
      W("w3", "k2nc:1", "k1:0"),
      W("w4", "k1:1", "src:1"),
      W("w5", "src:0", "s2:0"),
      W("w6", "s2:1", "k1nc:0"),
      W("w7", "k1nc:1", "k2:0"),
      W("w8", "k2:1", "src:1"),
    ],
  },
  {
    id: "kurzschluss",
    name: "Kısa devre (bilerek 💥)",
    desc: "Yük olmadan L'den N'ye direkt yol: kısa devre nasıl görünür, gör. Gerçek hayatta bunu yapma.",
    parts: [
      P("src", "source", 440, 20, "G1", { volts: 230 }),
      P("s1", "switch_no", 440, 160, "S1"),
    ],
    wires: [
      W("w1", "src:0", "s1:0"),
      W("w2", "s1:1", "src:1"),
    ],
  },
];

// ── Logik örnekleri (yatay, L rayından N rayına) ─────────────────────────────
const rails = () => [
  P("railL", "rail_l", 60, 40, "L"),
  P("railN", "rail_n", 900, 40, "N"),
];

export const LOGIC_PRESETS: Preset[] = [
  {
    id: "und",
    name: "UND — iki el kumandası",
    desc: "İki şalter DE kapalıysa lamba yanar. Pres makinelerinin iki el butonu: tek elle olmaz, güvenlik böyle bir şey.",
    parts: [
      ...rails(),
      P("s1", "switch_no", 160, 80, "S1", { rot: 1 }),
      P("s2", "switch_no", 160, 160, "S2", { rot: 1 }),
      P("g1", "and", 340, 80, ""),
      P("h1", "lamp", 560, 100, "H1", { rot: 1 }),
    ],
    wires: [
      W("w1", "railL:1", "s1:0"),
      W("w2", "railL:3", "s2:0"),
      W("w3", "s1:1", "g1:0"),
      W("w4", "s2:1", "g1:1"),
      W("w5", "g1:2", "h1:0"),
      W("w6", "h1:1", "railN:1"),
    ],
  },
  {
    id: "oder",
    name: "ODER — kapı zili",
    desc: "Şalterlerden HERHANGİ biri kapalıysa çıkış 1. Alt kapı da üst kapı da zili çaldırabilir; misafir kaçmaz.",
    parts: [
      ...rails(),
      P("s1", "switch_no", 160, 80, "S1", { rot: 1 }),
      P("s2", "switch_no", 160, 160, "S2", { rot: 1 }),
      P("g1", "or", 340, 80, ""),
      P("h1", "lamp", 560, 100, "H1", { rot: 1 }),
    ],
    wires: [
      W("w1", "railL:1", "s1:0"),
      W("w2", "railL:3", "s2:0"),
      W("w3", "s1:1", "g1:0"),
      W("w4", "s2:1", "g1:1"),
      W("w5", "g1:2", "h1:0"),
      W("w6", "h1:1", "railN:1"),
    ],
  },
  {
    id: "xor-koridor",
    name: "XOR — koridor lambası",
    desc: "Girişler FARKLIYSA lamba yanar: iki Wechselschalter'li koridor devresinin mantık hali. İki şalteri de değiştir, lamba her seferinde durum değiştirsin.",
    parts: [
      ...rails(),
      P("s1", "switch_no", 160, 80, "S1", { rot: 1 }),
      P("s2", "switch_no", 160, 160, "S2", { rot: 1 }),
      P("g1", "xor", 340, 80, ""),
      P("h1", "lamp", 560, 100, "H1", { rot: 1 }),
    ],
    wires: [
      W("w1", "railL:1", "s1:0"),
      W("w2", "railL:3", "s2:0"),
      W("w3", "s1:1", "g1:0"),
      W("w4", "s2:1", "g1:1"),
      W("w5", "g1:2", "h1:0"),
      W("w6", "h1:1", "railN:1"),
    ],
  },
  {
    id: "nand-tanitim",
    name: "NAND — üniversal kapı",
    desc: "İkisi birden kapalı OLMADIKÇA çıkış 1. Elektronikte her devre sadece NAND'lerle kurulabilir — İsviçre çakısı budur.",
    parts: [
      ...rails(),
      P("s1", "switch_no", 160, 80, "S1", { rot: 1 }),
      P("s2", "switch_no", 160, 160, "S2", { rot: 1 }),
      P("g1", "nand", 340, 80, ""),
      P("h1", "lamp", 560, 100, "H1", { rot: 1 }),
    ],
    wires: [
      W("w1", "railL:1", "s1:0"),
      W("w2", "railL:3", "s2:0"),
      W("w3", "s1:1", "g1:0"),
      W("w4", "s2:1", "g1:1"),
      W("w5", "g1:2", "h1:0"),
      W("w6", "h1:1", "railN:1"),
    ],
  },
];
