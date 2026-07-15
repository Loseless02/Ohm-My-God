import { v, num, mul, frac, add, sum, plus, minus } from "../lib/expr";
import type { FormulaDef } from "./types";
import { vR, vU, vI } from "./vars";

const r = (sub: string, extra: Partial<ReturnType<typeof vR>> = {}) =>
  vR({ id: `R${sub}`, sub, ...extra });
const uu = (sub: string, extra: Partial<ReturnType<typeof vU>> = {}) =>
  vU({ id: `U${sub}`, sub, ...extra });
const ii = (sub: string, extra: Partial<ReturnType<typeof vI>> = {}) =>
  vI({ id: `I${sub}`, sub, ...extra });

export const F_SCHALTUNGEN: FormulaDef[] = [
  // ── Reihenschaltung ────────────────────────────────────────────────────────
  {
    id: "reihe-gesamtwiderstand",
    cat: "reihenschaltung",
    title: "Seri Devrede Toplam Direnç",
    tagline: "Seri devre: herkes aynı kuyrukta bekler.",
    desc: "Seri bağlı dirençler düz toplama: R_ges = R₁ + R₂ + R₃. Akımın gidecek başka yolu yok, sırayla hepsinin içinden geçmek zorunda — dolayısıyla dirençler üst üste biner. Akım her yerde AYNIDIR (I = sabit), gerilim ise dirençlere paylaştırılır.",
    note: "İki dirençli devre için üçüncü kutuya 0 yaz, kimse alınmaz.",
    vars: [
      r("ges", {
        name: "Toplam direnç",
        de: "Gesamtwiderstand / Ersatzwiderstand",
        desc: "Devrenin dışarıdan görünen tek eşdeğer direnci. Kaynak, üç direnci ayrı ayrı görmez — tek büyük direnç görür.",
        find: "Hesapla ya da devre gerilimsizken uçlardan ohmmetreyle ölç.",
      }),
      r("1"),
      r("2"),
      r("3"),
    ],
    base: "Rges",
    forms: {
      Rges: add(v("R1"), v("R2"), v("R3")),
      R1: sum(plus(v("Rges")), minus(v("R2")), minus(v("R3"))),
      R2: sum(plus(v("Rges")), minus(v("R1")), minus(v("R3"))),
      R3: sum(plus(v("Rges")), minus(v("R1")), minus(v("R2"))),
    },
    keywords: ["reihenschaltung", "seri", "toplam direnç", "gesamtwiderstand"],
  },
  {
    id: "reihe-spannungen",
    cat: "reihenschaltung",
    title: "Seri Devrede Gerilimler",
    tagline: "Gerilim pastası dilimlere ayrılır — büyük direnç büyük dilim kapar.",
    desc: "Seri devrede kaynak gerilimi, dirençlerin üzerine bölüşülür: U_ges = U₁ + U₂ + U₃ (2. Kirchhoff kanunu / Maschenregel). Her direncin kaptığı pay kendi büyüklüğüyle orantılıdır. Toplam her zaman tutar; tutmuyorsa bir yerde ölçüm hatası ya da unutulmuş bir eleman vardır.",
    vars: [
      uu("ges", {
        name: "Toplam gerilim",
        de: "Gesamtspannung",
        desc: "Kaynağın verdiği toplam gerilim — dağıtılacak pasta.",
        find: "Kaynağın etiketi ya da uçlarından ölçüm.",
      }),
      uu("1", { name: "1. kısmi gerilim", de: "Teilspannung 1" }),
      uu("2", { name: "2. kısmi gerilim", de: "Teilspannung 2" }),
      uu("3", { name: "3. kısmi gerilim", de: "Teilspannung 3" }),
    ],
    base: "Uges",
    forms: {
      Uges: add(v("U1"), v("U2"), v("U3")),
      U1: sum(plus(v("Uges")), minus(v("U2")), minus(v("U3"))),
      U2: sum(plus(v("Uges")), minus(v("U1")), minus(v("U3"))),
      U3: sum(plus(v("Uges")), minus(v("U1")), minus(v("U2"))),
    },
    keywords: ["maschenregel", "kirchhoff", "teilspannung", "kısmi gerilim"],
  },
  {
    id: "spannungsteiler",
    cat: "reihenschaltung",
    title: "Gerilim Bölücü Oranı",
    tagline: "U₁/U₂ = R₁/R₂ — adalet vardır, orantılıdır.",
    desc: "Seri devrede gerilimler dirençlerle aynı oranda bölüşülür. R₁ iki kat büyükse üzerine iki kat gerilim düşer. Bu oran kuralı, potansiyometrelerin ve sensör devrelerinin temelidir. Dört büyüklükten üçünü bil, dördüncüyü formül sana getirsin.",
    vars: [
      uu("1", { name: "R₁ üzerindeki gerilim", de: "Teilspannung an R₁" }),
      uu("2", { name: "R₂ üzerindeki gerilim", de: "Teilspannung an R₂" }),
      r("1"),
      r("2"),
    ],
    base: "U1",
    forms: {
      U1: mul(v("U2"), frac(v("R1"), v("R2"))),
      U2: mul(v("U1"), frac(v("R2"), v("R1"))),
      R1: mul(v("R2"), frac(v("U1"), v("U2"))),
      R2: mul(v("R1"), frac(v("U2"), v("U1"))),
    },
    keywords: ["spannungsteiler", "gerilim bölücü", "oran", "potansiyometre"],
  },
  // ── Parallelschaltung ──────────────────────────────────────────────────────
  {
    id: "parallel-zwei",
    cat: "parallelschaltung",
    title: "İki Paralel Direnç",
    tagline: "Çarp, topla, böl — klasiklerden.",
    desc: "İki paralel direnç için pratik formül: R_ges = (R₁·R₂)/(R₁+R₂). Paralel bağlantıda akıma yeni yollar açılır, bu yüzden toplam direnç HER ZAMAN en küçük dirençten bile küçüktür. İki eşit direnci paralel bağlarsan sonuç yarısıdır — sınavda 10 saniyelik kontrol imkânı.",
    note: "Sonuç R₁'den veya R₂'den büyük çıktıysa bir şeyler ters gitti. Paralel direnç küçültür, büyütmez.",
    vars: [
      r("ges", {
        name: "Toplam direnç",
        de: "Gesamtwiderstand",
        desc: "İki direncin birlikte gösterdiği eşdeğer direnç. Daima en küçük olandan daha küçüktür.",
        find: "Hesapla ya da gerilimsiz devrede uçlardan ölç.",
      }),
      r("1"),
      r("2"),
    ],
    base: "Rges",
    forms: {
      Rges: frac(mul(v("R1"), v("R2")), add(v("R1"), v("R2"))),
      R1: frac(mul(v("Rges"), v("R2")), sum(plus(v("R2")), minus(v("Rges")))),
      R2: frac(mul(v("Rges"), v("R1")), sum(plus(v("R1")), minus(v("Rges")))),
    },
    keywords: ["parallel", "paralel", "iki direnç", "produkt durch summe"],
  },
  {
    id: "parallel-allgemein",
    cat: "parallelschaltung",
    title: "Genel Paralel Formülü",
    tagline: "Terslerin toplamının tersi. Evet, üç kere 'ters' dedik.",
    desc: "Üç ve daha fazla paralel direnç için: 1/R_ges = 1/R₁ + 1/R₂ + 1/R₃. Yani iletkenlik değerleri (Leitwert) toplanır — her yeni paralel yol, akıma yeni bir kapı açar. Bu kart sadece R_ges'i çözer; tek tek dirençleri çözmek istiyorsan değerleri Leitwert'e çevirip toplamadan çıkarman gerekir (ya da bize güven, R_ges'i bul, gerisini iki-dirençli karttan yürüt).",
    note: "İki direnç varsa üçüncü kutuya çok büyük bir değer yaz (ör. 999999999) — sonsuz dirençli kol, olmayan kol demektir. Ya da direkt 'İki Paralel Direnç' kartını kullan, o bunun için var.",
    vars: [
      r("ges", {
        name: "Toplam direnç",
        de: "Gesamtwiderstand",
        desc: "Tüm paralel kolların birlikte gösterdiği eşdeğer direnç.",
        find: "Bu formülle hesaplanır — ya da ohmmetreyle, ama önce fişi çek.",
      }),
      r("1"),
      r("2"),
      r("3"),
    ],
    base: "Rges",
    forms: {
      Rges: frac(
        num(1),
        add(frac(num(1), v("R1")), frac(num(1), v("R2")), frac(num(1), v("R3"))),
      ),
    },
    keywords: ["parallel", "kehrwert", "leitwert", "üç direnç"],
  },
  {
    id: "parallel-gleiche",
    cat: "parallelschaltung",
    title: "n Adet Eşit Direnç",
    tagline: "Tembellik bir erdemdir: R_ges = R / n",
    desc: "Aynı değerde n adet direnç paralel bağlanırsa toplam direnç R/n olur. 4 tane 100 Ω → 25 Ω. Isıtıcı rezistansları, LED dizileri ve 'aynı üründen çok var' senaryolarında kesirli formülle boğuşmana gerek yok.",
    vars: [
      r("ges", { name: "Toplam direnç", de: "Gesamtwiderstand", find: "Bu formülle. Bu kadar basit." }),
      vR({ desc: "Tek bir direncin değeri (hepsi aynı olmak zorunda, formülün tek şartı bu)." }),
      {
        id: "nn",
        sym: "n",
        name: "Direnç adedi",
        de: "Anzahl",
        integer: true,
        unitNote: "adet",
        desc: "Kaç tane eşit direnç paralel bağlı. Tam sayı olması beklenir; 2,5 direnç bağlayabiliyorsan bize de öğret.",
        find: "Say. Gerçekten, sadece say.",
      },
    ],
    base: "Rges",
    forms: {
      Rges: frac(v("R"), v("nn")),
      R: mul(v("Rges"), v("nn")),
      nn: frac(v("R"), v("Rges")),
    },
    keywords: ["eşit direnç", "gleiche widerstände", "r/n"],
  },
  {
    id: "stromteiler",
    cat: "parallelschaltung",
    title: "Akım Bölücü Oranı",
    tagline: "I₁/I₂ = R₂/R₁ — akım tembeldir, kolay yolu sever.",
    desc: "Paralel kollarda akım, dirençle TERS orantılı bölüşülür: küçük dirençli koldan büyük akım geçer. Oranın ters olmasına dikkat — I₁'in karşısında R₂ var. Sınavların 'bunu kesin karıştırırlar' klasiği.",
    note: "Paralel devrede gerilim tüm kollarda AYNIDIR; bölüşülen şey akımdır. (Seri devrede tam tersi.)",
    vars: [
      ii("1", { name: "1. koldaki akım", de: "Teilstrom 1" }),
      ii("2", { name: "2. koldaki akım", de: "Teilstrom 2" }),
      r("1", { name: "1. kolun direnci" }),
      r("2", { name: "2. kolun direnci" }),
    ],
    base: "I1",
    forms: {
      I1: mul(v("I2"), frac(v("R2"), v("R1"))),
      I2: mul(v("I1"), frac(v("R1"), v("R2"))),
      R1: mul(v("R2"), frac(v("I2"), v("I1"))),
      R2: mul(v("R1"), frac(v("I1"), v("I2"))),
    },
    keywords: ["stromteiler", "akım bölücü", "teilstrom", "knotenregel"],
  },
];
