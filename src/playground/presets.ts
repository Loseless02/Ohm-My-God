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
  const out: Record<Domain, CustomPreset[]> = { phys: [], el: [], logic: [], power: [] };
  const raw = CUSTOM_RAW as unknown as Record<string, unknown>;
  for (const d of ["phys", "el", "logic", "power"] as Domain[]) {
    const list = Array.isArray(raw[d]) ? (raw[d] as Record<string, unknown>[]) : [];
    for (const it of list) {
      if (typeof it?.id !== "string" || typeof it.name !== "string") continue;
      out[d].push({
        id: "c-" + it.id,
        name: it.name,
        desc: typeof it.desc === "string" ? it.desc : "",
        orient: it.orient === "h" ? "h" : it.orient === "b" ? "b" : "v",
        panes: cleanPanes(d, it.panes),
      });
    }
  }
  return out;
})();

// ── L üst / N alt raylı örnekler ────────────────────────────────────────────
const busL = (volts = 230, el = false) => P("busL", "bus_l", 0, 0, el ? "+" : "L", { volts, ...(el ? { prm: { ac: "dc", In: 3 } } : {}) });
const busN = (el = false) => P("busN", "bus_n", 0, 560, el ? "0V" : "N");

export const RAIL_PRESETS: Preset[] = [
  {
    id: "seri-paralel",
    name: "Seri ve paralel lambalar (L–N raylı)",
    desc: "Soldaki iki lamba seri: her biri 115 V alır, gücün dörtte biriyle loş yanar. Sağdakiler paralel: her biri tam 230 V, tam parlak.",
    parts: [
      busL(),
      busN(),
      P("h1", "lamp", 200, 120, "H1"),
      P("h2", "lamp", 200, 300, "H2"),
      P("h3", "lamp", 400, 260, "H3"),
      P("h4", "lamp", 540, 260, "H4"),
    ],
    wires: [W("w1", "busL:10", "h1:0"), W("w2", "h1:1", "h2:0"), W("w3", "h2:1", "busN:10"), W("w4", "busL:20", "h3:0"), W("w5", "h3:1", "busN:20"), W("w6", "busL:27", "h4:0"), W("w7", "h4:1", "busN:27")],
  },
  {
    id: "kurzschluss-ls",
    name: "Kısa devre → LS atar (L–N raylı)",
    desc: "S1'i kapat: L ile N arasında yük yok, akım yüzlerce ampere fırlar, 16 A'lik LS anında atar ve lamba da söner. Tekrar açmak için önce S1'i aç, sonra L rayına tıkla.",
    parts: [busL(), busN(), P("s1", "switch_no", 200, 260, "S1"), P("h1", "lamp", 400, 260, "H1")],
    wires: [W("w1", "busL:10", "s1:0"), W("w2", "s1:1", "busN:10"), W("w3", "busL:20", "h1:0"), W("w4", "h1:1", "busN:20")],
  },
  {
    id: "floresan-seri",
    name: "Seri floresanlar tutuşmaz",
    desc: "Soldaki dört floresan seri: her birine ~57 V düşer, tutuşma gerilimine ulaşamazlar. Sağdaki tek floresan 230 V alır ve yanar. Gerilimi L rayından 1 MV yap → hepsi patlar.",
    parts: [
      busL(),
      busN(),
      P("e1", "fluo", 200, 40, "E1"),
      P("e2", "fluo", 200, 160, "E2"),
      P("e3", "fluo", 200, 280, "E3"),
      P("e4", "fluo", 200, 400, "E4"),
      P("e5", "fluo", 420, 260, "E5"),
    ],
    wires: [
      W("w1", "busL:10", "e1:0"),
      W("w2", "e1:1", "e2:0"),
      W("w3", "e2:1", "e3:0"),
      W("w4", "e3:1", "e4:0"),
      W("w5", "e4:1", "busN:10"),
      W("w6", "busL:21", "e5:0"),
      W("w7", "e5:1", "busN:21"),
    ],
  },
  {
    id: "motor-termik",
    name: "Motor + sigorta (kalkış akımı)",
    desc: "S1'i kapat: motor kalkışta anma akımının ~5 katını çeker, sonra hızlanınca akım düşer. Ölçü aletini motorun iki ucuna değdir, akımı izle. Sigortayı 1 A yap → kalkışta atar.",
    parts: [busL(), busN(), P("s1", "switch_no", 200, 100, "S1"), P("f1", "fuse", 200, 220, "F1"), P("m1", "motor", 200, 360, "M1")],
    wires: [W("w1", "busL:10", "s1:0"), W("w2", "s1:1", "f1:0"), W("w3", "f1:1", "m1:0"), W("w4", "m1:1", "busN:10")],
  },
];
PRESETS.push(...RAIL_PRESETS);

// ── Elektronik örnekleri ────────────────────────────────────────────────────
const R_ = (id: string, x: number, y: number, label: string, R: number, extra: Partial<Part> = {}) => P(id, "res", x, y, label, { prm: { R }, ...extra });

export const EL_PRESETS: Preset[] = [
  {
    id: "led-direnc",
    name: "LED + ön direnç (12 V)",
    desc: "S1: LED 470 Ω ön dirençle ~21 mA çeker, mutlu. S2: ön dirençsiz LED… bir kez parlar ve yanar. Sonra üstüne tıklayıp yenisini tak.",
    parts: [
      busL(12, true),
      busN(true),
      P("s1", "switch_no", 200, 100, "S1"),
      R_("r1", 200, 240, "R1", 470),
      P("p1", "led_d", 200, 380, "P1", { color: "green" }),
      P("s2", "switch_no", 500, 100, "S2"),
      P("p2", "led_d", 500, 300, "P2", { color: "red" }),
    ],
    wires: [
      W("w1", "busL:10", "s1:0"),
      W("w2", "s1:1", "r1:0"),
      W("w3", "r1:1", "p1:0"),
      W("w4", "p1:1", "busN:10"),
      W("w5", "busL:25", "s2:0"),
      W("w6", "s2:1", "p2:0"),
      W("w7", "p2:1", "busN:25"),
    ],
  },
  {
    id: "pot-dimmer",
    name: "Potansiyometre ile LED kısma",
    desc: "R1 ve pot bir gerilim bölücü kurar. Potun sürgüsünü özelliklerden kaydır: orta uçtaki gerilim değişir, LED'in akımı ve parlaklığı onunla birlikte.",
    parts: [busL(12, true), busN(true), R_("r1", 200, 100, "R1", 220), P("rp1", "pot", 200, 240, "RP1", { prm: { R: 1000, pos: 0.5 } }), R_("r2", 400, 280, "R2", 330), P("p1", "led_d", 400, 400, "P1", { color: "yellow" })],
    wires: [W("w1", "busL:10", "r1:0"), W("w2", "r1:1", "rp1:0"), W("w3", "rp1:1", "busN:10"), W("w4", "rp1:2", "r2:0"), W("w5", "r2:1", "p1:0"), W("w6", "p1:1", "busN:20")],
  },
  {
    id: "npn-schalter",
    name: "Transistör anahtar (NPN)",
    desc: "S1 kapanınca tabana 10 kΩ üzerinden ~1 mA akar; transistör doyuma girer ve kolektördeki LED'e ~10 mA yol açar. Küçük akım, büyük akımı yönetiyor.",
    parts: [
      busL(12, true),
      busN(true),
      P("s1", "switch_no", 200, 100, "S1"),
      R_("rb", 200, 240, "R1", 10000),
      P("q1", "npn", 400, 300, "Q1"),
      R_("rc", 400, 80, "R2", 1000),
      P("p1", "led_d", 400, 180, "P1", { color: "blue" }),
    ],
    wires: [W("w1", "busL:10", "s1:0"), W("w2", "s1:1", "rb:0"), W("w3", "rb:1", "q1:0"), W("w4", "busL:20", "rc:0"), W("w5", "rc:1", "p1:0"), W("w6", "p1:1", "q1:1"), W("w7", "q1:2", "busN:20")],
  },
  {
    id: "netzteil",
    name: "Güç kaynağı: trafo + köprü + Elko + 7805",
    desc: "230 V AC → trafo 12 V → köprü doğrultucu → 1000 µF Elko (≈15 V DC) → 7805 → sabit 5 V. Ölçü aletini her kademeye değdir: AC, titreşimli DC, düz DC. Elko'yu sil → dalgalanmayı gör.",
    parts: [
      busL(230),
      busN(),
      P("t1", "xfmr", 200, 100, "T1"),
      P("v1", "bridge", 360, 100, "V1"),
      P("c1", "ecap", 520, 120, "C1", { prm: { C: 1000e-6, Umax: 35 } }),
      P("n1", "reg", 600, 100, "N1"),
      P("c2", "cap", 760, 120, "C2"),
      R_("r1", 840, 120, "R1", 220),
      P("p1", "led_d", 840, 240, "P1", { color: "green" }),
    ],
    wires: [
      W("w1", "busL:10", "t1:0"),
      W("w2", "t1:1", "busN:10"),
      W("w3", "t1:2", "v1:0"),
      W("w4", "t1:3", "v1:1"),
      W("w5", "v1:2", "c1:0"),
      W("w6", "v1:3", "c1:1"),
      W("w7", "c1:0", "n1:0"),
      W("w8", "n1:2", "c1:1"),
      W("w9", "n1:1", "c2:0"),
      W("w10", "c2:1", "c1:1"),
      W("w11", "c2:0", "r1:0"),
      W("w12", "r1:1", "p1:0"),
      W("w13", "p1:1", "c2:1"),
    ],
  },
  {
    id: "rc-zeit",
    name: "RC şarjı: zaman sabiti τ = 1 s",
    desc: "S1: kondansatör 10 kΩ üzerinden dolar — 1 s'de %63, 5 s'de neredeyse tam. S2: 1 kΩ üzerinden boşalır. Ölçü aletini C1'e değdir, osiloskop izinde üstel eğriyi izle.",
    parts: [
      busL(12, true),
      busN(true),
      P("s1", "switch_no", 200, 100, "S1"),
      R_("r1", 200, 240, "R1", 10000),
      P("c1", "ecap", 200, 380, "C1", { prm: { C: 100e-6 } }),
      P("s2", "switch_no", 400, 300, "S2"),
      R_("r2", 400, 420, "R2", 1000),
    ],
    wires: [W("w1", "busL:10", "s1:0"), W("w2", "s1:1", "r1:0"), W("w3", "r1:1", "c1:0"), W("w4", "c1:1", "busN:10"), W("w5", "c1:0", "s2:0"), W("w6", "s2:1", "r2:0"), W("w7", "r2:1", "busN:20")],
  },
  {
    id: "mcu-ampel",
    name: "Mikrodenetleyici: trafik lambası",
    desc: "5 V ile beslenen mikrodenetleyici P1–P3 pinlerinden üç LED'i sırayla yakar. Özelliklerden programı değiştir: yürüyen ışık, yanıp sönme, PWM… Besleme 3,5 V'un altına düşerse çalışmaz.",
    parts: [
      busL(5, true),
      busN(true),
      P("a1", "mcu", 200, 100, "A1", { prm: { prog: "traffic", T: 500 } }),
      R_("r1", 340, 120, "R1", 150, { rot: 1 }),
      R_("r2", 340, 240, "R2", 150, { rot: 1 }),
      R_("r3", 340, 360, "R3", 150, { rot: 1 }),
      P("p1", "led_d", 460, 120, "P1", { color: "red" }),
      P("p2", "led_d", 560, 240, "P2", { color: "yellow" }),
      P("p3", "led_d", 660, 360, "P3", { color: "green" }),
    ],
    wires: [
      W("w1", "busL:10", "a1:0"),
      W("w2", "a1:1", "busN:10"),
      W("w3", "a1:2", "r1:0"),
      W("w4", "a1:3", "r2:0"),
      W("w5", "a1:4", "r3:0"),
      W("w6", "r1:1", "p1:0"),
      W("w7", "r2:1", "p2:0"),
      W("w8", "r3:1", "p3:0"),
      W("w9", "p1:1", "busN:23"),
      W("w10", "p2:1", "busN:28"),
      W("w11", "p3:1", "busN:33"),
    ],
  },
  {
    id: "daemmerung",
    name: "Alacakaranlık şalteri (LDR + NPN)",
    desc: "47 kΩ ve LDR bir gerilim bölücü. Işıkta LDR'nin direnci düşük, taban gerilimi düşük → LED söner. LDR'yi seç, ışığı 0'a doğru kaydır: karanlıkta direnç yükselir, transistör açar, LED yanar.",
    parts: [
      busL(12, true),
      busN(true),
      R_("r1", 200, 100, "R1", 47000),
      P("b1", "ldr", 200, 260, "R2"),
      R_("rb", 300, 200, "R3", 1000),
      P("q1", "npn", 400, 300, "Q1"),
      R_("rc", 400, 80, "R4", 470),
      P("p1", "led_d", 400, 180, "P1", { color: "white" }),
    ],
    wires: [
      W("w1", "busL:10", "r1:0"),
      W("w2", "r1:1", "b1:0"),
      W("w3", "b1:1", "busN:10"),
      W("w4", "r1:1", "rb:0"),
      W("w5", "rb:1", "q1:0"),
      W("w6", "busL:20", "rc:0"),
      W("w7", "rc:1", "p1:0"),
      W("w8", "p1:1", "q1:1"),
      W("w9", "q1:2", "busN:20"),
    ],
  },
];
