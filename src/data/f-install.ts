import { v, num, mul, frac, SQRT3 } from "../lib/expr";
import type { FormulaDef } from "./types";
import { vU, vI, vCosPhi, vGamma, vLen, vA, U_PCT_RAW } from "./vars";

const vDu = (over = {}) =>
  vU({
    id: "du",
    sym: "Δu",
    name: "Gerilim düşümü",
    de: "Spannungsfall",
    desc: "Kablonun kendi direncinde 'kaybolan' gerilim. Sen 230 V yollarsın, hat ucuna 225 V varır — aradaki 5 V kabloda ısı olarak buharlaşmıştır.",
    find: "Hat başı ile hat sonu gerilimlerini ölçüp fark alırsın — ya da bu formülle önceden hesaplayıp hiç sürprizle karşılaşmazsın.",
    ...over,
  });

export const F_INSTALL: FormulaDef[] = [
  {
    id: "spannungsfall-1ph",
    cat: "spannungsfall",
    title: "Gerilim Düşümü (1 faz)",
    tagline: "Kablo uzadıkça gerilim eriyecek — fizik, pazarlık yapmaz.",
    desc: "Tek fazlı hatta gerilim düşümü: Δu = (2·l·I·cosφ)/(γ·A). Baştaki 2, akımın gidiş VE dönüş yolunu sayar (faz + nötr). Uzun hat, yüksek akım, ince kesit = büyük düşüm. Kesiti (A) tıklarsan bu formül kesit hesabına dönüşür — Querschnitt formülü diye ezberletilen şey, bunun umstellen halidir. Sürpriz!",
    note: "γ bakır için 56, alüminyum için 35 m/(Ω·mm²). l TEK YÖN uzunluğu — 2 çarpanı dönüşü zaten hallediyor.",
    vars: [
      vDu(),
      vLen(),
      vI({ desc: "Hattan geçen işletme akımı. Yükün çektiği akımı bilmeden kablo hesabı yapılmaz." }),
      vCosPhi({ desc: "Yükün güç faktörü. Priz devreleri ve omik yükler için 1 alınır; motor besliyorsan etiketine bak." }),
      vGamma(),
      vA(),
    ],
    base: "du",
    forms: {
      du: frac(mul(num(2), v("l"), v("I"), v("cosphi")), mul(v("gamma"), v("A"))),
      A: frac(mul(num(2), v("l"), v("I"), v("cosphi")), mul(v("gamma"), v("du"))),
      l: frac(mul(v("du"), v("gamma"), v("A")), mul(num(2), v("I"), v("cosphi"))),
      I: frac(mul(v("du"), v("gamma"), v("A")), mul(num(2), v("l"), v("cosphi"))),
    },
    keywords: ["spannungsfall", "gerilim düşümü", "querschnitt", "kesit hesabı", "kablo"],
  },
  {
    id: "spannungsfall-3ph",
    cat: "spannungsfall",
    title: "Gerilim Düşümü (trifaze)",
    tagline: "Aynı hikâye, ama 2 yerine √3 — trifaze nötrden dönmez.",
    desc: "Üç fazlı yüklü hatta gerilim düşümü: Δu = (√3·l·I·cosφ)/(γ·A). Simetrik yükte nötrden akım dönmediği için gidiş-dönüş çarpanı 2 değil √3'tür — trifazenin küçük ikramı. Kesit için A'yı tıkla: üç fazlı Querschnitt formülü hazır.",
    note: "Yine: l tek yön, γ = 56 (Cu). Sonucu hat gerilimine (400 V) oranlayıp %'ye çevirmek için alttaki 'Yüzdesel Gerilim Düşümü' kartını kullan.",
    vars: [
      vDu(),
      vLen(),
      vI({ name: "Hat akımı", de: "Leiterstrom" }),
      vCosPhi(),
      vGamma(),
      vA(),
    ],
    base: "du",
    forms: {
      du: frac(mul(SQRT3(), v("l"), v("I"), v("cosphi")), mul(v("gamma"), v("A"))),
      A: frac(mul(SQRT3(), v("l"), v("I"), v("cosphi")), mul(v("gamma"), v("du"))),
      l: frac(mul(v("du"), v("gamma"), v("A")), mul(SQRT3(), v("I"), v("cosphi"))),
      I: frac(mul(v("du"), v("gamma"), v("A")), mul(SQRT3(), v("l"), v("cosphi"))),
    },
    keywords: ["spannungsfall", "drehstrom", "trifaze kesit", "querschnitt"],
  },
  {
    id: "spannungsfall-prozent",
    cat: "spannungsfall",
    title: "Yüzdesel Gerilim Düşümü",
    tagline: "Voltlar güzel, ama norm senden yüzde ister.",
    desc: "Hesapladığın Δu'yu anlamlandırmanın yolu, anma gerilimine oranlamak: Δu% = Δu/U_n · 100. DIN 18015'e göre sayaçtan son prize kadar önerilen sınır %3'tür. 400 V hatta 12 V düşüm 'çok mu?' diye düşünme — %3, tam sınırda diye oku.",
    note: "Tek fazda U_n = 230 V, trifazede 400 V ile oranla. Sınır değerler: DIN 18015 → %3 (konut, sayaç sonrası); DIN VDE 0100-520 tavsiyesi → aydınlatma %3, diğer %5.",
    vars: [
      {
        id: "dup",
        sym: "Δu",
        sub: "%",
        name: "Yüzdesel düşüm",
        de: "prozentualer Spannungsfall",
        units: U_PCT_RAW,
        desc: "Gerilim düşümünün anma gerilimine oranı. Normların konuştuğu dil.",
        find: "Bu formülle hesaplanır; sınır değerlerle karşılaştırılır.",
      },
      vDu({ find: "Üstteki gerilim düşümü kartlarından hesapla ya da ölç." }),
      vU({
        id: "Un",
        sym: "U",
        sub: "n",
        name: "Anma gerilimi",
        de: "Nennspannung",
        desc: "Sistemin nominal gerilimi: 1 fazda 230 V, trifazede 400 V.",
        find: "Sistemine göre 230 ya da 400 V.",
      }),
    ],
    base: "dup",
    forms: {
      dup: mul(frac(v("du"), v("Un")), num(100)),
      du: frac(mul(v("dup"), v("Un")), num(100)),
      Un: frac(mul(v("du"), num(100)), v("dup")),
    },
    keywords: ["prozent", "yüzde", "din 18015", "%3", "sınır"],
  },
];
