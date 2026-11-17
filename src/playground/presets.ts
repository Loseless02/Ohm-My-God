import type { Part, Wire } from "./types";
import type { Circuit, Domain, Orient } from "./file";
import { cleanPanes } from "./file";
import CUSTOM_RAW from "./custom-presets.json";

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

// ── Last + Steuer örnekleri: solda kumanda, sağda güç devresi ─────────────────
export interface PowerPreset {
  id: string;
  name: string;
  desc: string;
  steuer: Circuit;
  last: Circuit;
}

const netz = () => P("netz", "netz3", 100, 60, "");
/** a parçasının i. ucundan b parçasının j. ucuna, üç faz için sırayla. */
const W3 = (pre: string, a: string, ai: number, b: string, bi: number, order = [0, 1, 2]) =>
  order.map((o, i) => W(`${pre}${i}`, `${a}:${ai + i}`, `${b}:${bi + o}`));

export const POWER_PRESETS: PowerPreset[] = [
  {
    id: "direkt",
    name: "Direktanlauf (Selbsthaltung + motor koruma)",
    desc: "S1'e bas: K1 çeker, kendini mühürler, motor döner. S0 durdurur. Sağdaki F2'ye tıkla = aşırı yük: 95-96 açılır, K1 düşer.",
    steuer: {
      parts: [
        P("src", "source", 100, 0, "G1", { volts: 230 }),
        P("f2", "ol_nc", 100, 80, "95-96", { group: "F2" }),
        P("s0", "taster_nc", 100, 180, "S0"),
        P("s1", "taster_no", 100, 280, "S1"),
        P("k1a", "contact_no", 200, 280, "13-14", { group: "K1" }),
        P("k1", "coil", 100, 420, "K1"),
        P("k1b", "contact_no", 340, 280, "23-24", { group: "K1" }),
        P("h1", "lamp", 340, 420, "H1"),
      ],
      wires: [
        W("w1", "src:0", "f2:0"),
        W("w2", "f2:1", "s0:0"),
        W("w3", "s0:1", "s1:0"),
        W("w4", "s0:1", "k1a:0"),
        W("w5", "s1:1", "k1:0"),
        W("w6", "k1a:1", "k1:0"),
        W("w7", "k1:1", "src:1"),
        W("w8", "s0:1", "k1b:0"),
        W("w9", "k1b:1", "h1:0"),
        W("w10", "h1:1", "src:1"),
      ],
    },
    last: {
      parts: [
        netz(),
        P("q1", "q3", 100, 140, "Q1"),
        P("k1", "contact3", 100, 260, "1-6", { group: "K1" }),
        P("f2", "ol3", 100, 380, "F2"),
        P("m1", "motor3", 100, 500, "M1", { conn: "D" }),
      ],
      wires: [
        ...W3("a", "netz", 0, "q1", 0),
        ...W3("b", "q1", 3, "k1", 0),
        ...W3("c", "k1", 3, "f2", 0),
        ...W3("d", "f2", 3, "m1", 0),
      ],
    },
  },
  {
    id: "wende",
    name: "Wendeschützschaltung (yön değiştirme)",
    desc: "S1 sağa, S2 sola. K2 iki fazı (L1↔L3) çaprazlar → döner alan ters döner. Kontaktörler birbirini açıcı kontaklarıyla kilitler; ikisi birden çekseydi L1–L3 kısa devre olurdu.",
    steuer: {
      parts: [
        P("src", "source", 360, -20, "G1", { volts: 230 }),
        P("f2", "ol_nc", 360, 60, "95-96", { group: "F2" }),
        P("s0", "taster_nc", 360, 160, "S0"),
        P("s1", "taster_no", 200, 280, "S1"),
        P("k1a", "contact_no", 300, 280, "13-14", { group: "K1" }),
        P("k2n", "contact_nc", 200, 400, "21-22", { group: "K2" }),
        P("k1", "coil", 200, 520, "K1"),
        P("s2", "taster_no", 520, 280, "S2"),
        P("k2a", "contact_no", 620, 280, "13-14", { group: "K2" }),
        P("k1n", "contact_nc", 520, 400, "21-22", { group: "K1" }),
        P("k2", "coil", 520, 520, "K2"),
      ],
      wires: [
        W("w1", "src:0", "f2:0"),
        W("w2", "f2:1", "s0:0"),
        W("w3", "s0:1", "s1:0"),
        W("w4", "s0:1", "k1a:0"),
        W("w5", "s1:1", "k2n:0"),
        W("w6", "k1a:1", "k2n:0"),
        W("w7", "k2n:1", "k1:0"),
        W("w8", "k1:1", "src:1"),
        W("w9", "s0:1", "s2:0"),
        W("w10", "s0:1", "k2a:0"),
        W("w11", "s2:1", "k1n:0"),
        W("w12", "k2a:1", "k1n:0"),
        W("w13", "k1n:1", "k2:0"),
        W("w14", "k2:1", "src:1"),
      ],
    },
    last: {
      parts: [
        netz(),
        P("q1", "q3", 100, 140, "Q1"),
        P("k1", "contact3", 100, 280, "1-6", { group: "K1" }),
        P("k2", "contact3", 280, 280, "1-6", { group: "K2" }),
        P("f2", "ol3", 100, 420, "F2"),
        P("m1", "motor3", 100, 540, "M1", { conn: "D" }),
      ],
      wires: [
        ...W3("a", "netz", 0, "q1", 0),
        ...W3("b", "q1", 3, "k1", 0),
        ...W3("c", "q1", 3, "k2", 0),
        ...W3("d", "k1", 3, "f2", 0),
        ...W3("e", "k2", 3, "f2", 0, [2, 1, 0]), // L1 ↔ L3 çapraz
        ...W3("f", "f2", 3, "m1", 0),
      ],
    },
  },
  {
    id: "stern-dreieck",
    name: "Stern-Dreieck-Anlauf (otomatik, KT1)",
    desc: "S1: K1 (şebeke) + K3 (yıldız) çeker, motor yıldızda yumuşak kalkar. KT1 süresi dolunca K3 düşer, K2 (üçgen) çeker: tam devir. K2 ile K3 birbirini kilitler — ikisi birden = kısa devre.",
    steuer: {
      parts: [
        P("src", "source", 100, 0, "G1", { volts: 230 }),
        P("f2", "ol_nc", 100, 80, "95-96", { group: "F2" }),
        P("s0", "taster_nc", 100, 180, "S0"),
        P("s1", "taster_no", 100, 280, "S1"),
        P("k1a", "contact_no", 200, 280, "13-14", { group: "K1" }),
        P("k1", "coil", 100, 440, "K1"),
        P("kt1", "tcoil", 300, 440, "KT1", { delay: 3, tmode: "ein" }),
        P("ktn", "tcontact_nc", 460, 260, "15-16", { group: "KT1" }),
        P("k2n", "contact_nc", 460, 360, "21-22", { group: "K2" }),
        P("k3", "coil", 460, 440, "K3"),
        P("kto", "tcontact_no", 620, 260, "17-18", { group: "KT1" }),
        P("k2a", "contact_no", 720, 260, "13-14", { group: "K2" }),
        P("k3n", "contact_nc", 620, 360, "21-22", { group: "K3" }),
        P("k2", "coil", 620, 440, "K2"),
      ],
      wires: [
        W("w1", "src:0", "f2:0"),
        W("w2", "f2:1", "s0:0"),
        W("w3", "s0:1", "s1:0"),
        W("w4", "s0:1", "k1a:0"),
        W("w5", "s1:1", "k1:0"),
        W("w6", "k1a:1", "k1:0"),
        W("w7", "k1:1", "src:1"),
        W("w8", "k1a:1", "kt1:0"),
        W("w9", "kt1:1", "src:1"),
        W("w10", "kt1:0", "ktn:0"),
        W("w11", "ktn:1", "k2n:0"),
        W("w12", "k2n:1", "k3:0"),
        W("w13", "k3:1", "src:1"),
        W("w14", "ktn:0", "kto:0"),
        W("w15", "kto:0", "k2a:0"),
        W("w16", "kto:1", "k3n:0"),
        W("w17", "k2a:1", "k3n:0"),
        W("w18", "k3n:1", "k2:0"),
        W("w19", "k2:1", "src:1"),
      ],
    },
    last: {
      parts: [
        netz(),
        P("q1", "q3", 100, 140, "Q1"),
        P("k1", "contact3", 100, 260, "1-6", { group: "K1" }),
        P("f2", "ol3", 100, 380, "F2"),
        P("m1", "motor3", 100, 500, "M1", { conn: "6" }),
        P("k2", "contact3", 300, 460, "1-6", { group: "K2" }),
        P("k3", "contact3", 100, 700, "1-6", { group: "K3" }),
      ],
      wires: [
        ...W3("a", "netz", 0, "q1", 0),
        ...W3("b", "q1", 3, "k1", 0),
        ...W3("c", "k1", 3, "f2", 0),
        ...W3("d", "f2", 3, "m1", 0),
        // üçgen: L1→W2, L2→U2, L3→V2 (K2 beslemesi F2 çıkışından)
        ...W3("e", "f2", 3, "k2", 0),
        ...W3("f", "k2", 3, "m1", 3, [2, 0, 1]),
        // yıldız köprüsü: U2 V2 W2 → K3 → kısa bağlı
        ...W3("g", "m1", 3, "k3", 0),
        W("h0", "k3:3", "k3:4"),
        W("h1", "k3:4", "k3:5"),
      ],
    },
  },
];

// ── Admin panelinden kaydedilen örnekler (custom-presets.json, repoya commit'lenir) ──
export interface CustomPreset {
  id: string;
  name: string;
  desc: string;
  orient?: Orient;
  panes: Record<string, Circuit>;
}

export const CUSTOM_PRESETS: Record<Domain, CustomPreset[]> = (() => {
  const out: Record<Domain, CustomPreset[]> = { phys: [], logic: [], power: [] };
  const raw = CUSTOM_RAW as unknown as Record<string, unknown>;
  for (const d of ["phys", "logic", "power"] as Domain[]) {
    const list = Array.isArray(raw[d]) ? (raw[d] as Record<string, unknown>[]) : [];
    for (const it of list) {
      if (typeof it?.id !== "string" || typeof it.name !== "string") continue;
      out[d].push({
        id: "c-" + it.id,
        name: it.name,
        desc: typeof it.desc === "string" ? it.desc : "",
        orient: it.orient === "h" ? "h" : "v",
        panes: cleanPanes(d, it.panes),
      });
    }
  }
  return out;
})();
