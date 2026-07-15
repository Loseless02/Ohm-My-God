import { v, mul, frac, pow, sqrt, sum, plus, minus, add, SQRT3 } from "../lib/expr";
import type { FormulaDef } from "./types";
import { vU, vI, vP, vCosPhi, U_VA, U_VAR } from "./vars";

const vS = (over: Partial<ReturnType<typeof vP>> = {}) => ({
  id: "S",
  sym: "S",
  name: "Görünür güç",
  de: "Scheinleistung",
  units: U_VA,
  desc: "Şebekenin taşımak zorunda olduğu toplam güç: U·I. Aktif ve reaktif gücün vektörel toplamı. Kablolar ve trafolar buna göre boyutlandırılır — şebeke 'ne iş yaptığına' değil 'ne taşıdığına' bakar.",
  find: "U ve I ölçümünden (S = U·I) ya da güç üçgeninden.",
  ...over,
});

export const F_LEISTUNGSARTEN: FormulaDef[] = [
  {
    id: "wirkleistung-ac",
    cat: "leistungsarten",
    title: "Aktif Güç (AC, 1 faz)",
    tagline: "P = U · I · cos φ — işe yarayan kısım.",
    desc: "Alternatif akımda gerilimle akım her zaman aynı anda zirve yapmaz; aradaki faz kayması (φ) yüzünden çarpımın sadece cos φ'lik kısmı gerçek işe dönüşür. Motor, bobin ve floresan gibi endüktif yüklerde cos φ < 1'dir. Rezistif yüklerde (ısıtıcı, akkor ampul) cos φ = 1 — ne alırsan iş.",
    vars: [
      vP({ name: "Aktif güç", de: "Wirkleistung", desc: "Isıya, harekete, ışığa dönüşen 'gerçek' güç. Sayacın saydığı ve faturalandırılan kısım." }),
      vU(),
      vI(),
      vCosPhi(),
    ],
    base: "P",
    forms: {
      P: mul(v("U"), v("I"), v("cosphi")),
      U: frac(v("P"), mul(v("I"), v("cosphi"))),
      I: frac(v("P"), mul(v("U"), v("cosphi"))),
      cosphi: frac(v("P"), mul(v("U"), v("I"))),
    },
    keywords: ["wirkleistung", "aktif güç", "cosphi", "faz kayması"],
  },
  {
    id: "scheinleistung",
    cat: "leistungsarten",
    title: "Görünür Güç (1 faz)",
    tagline: "S = U · I — şebekenin sırtındaki toplam yük.",
    desc: "Faz açısını hiç sormadan gerilim çarpı akım: görünür güç. Birimi bilerek VA'dır, W değil — çünkü hepsi 'iş' değil. Trafolar ve jeneratörler VA/kVA ile etiketlenir; onların derdi taşımak, işin ne kadarının 'gerçek' olduğu yükün bileceği iş.",
    vars: [vS(), vU(), vI()],
    base: "S",
    forms: {
      S: mul(v("U"), v("I")),
      U: frac(v("S"), v("I")),
      I: frac(v("S"), v("U")),
    },
    keywords: ["scheinleistung", "görünür güç", "va", "kva"],
  },
  {
    id: "scheinleistung-3ph",
    cat: "leistungsarten",
    title: "Görünür Güç (trifaze)",
    tagline: "S = √3 · U · I — üç fazlı versiyonu, √3 dahil.",
    desc: "Trifaze sistemde görünür güç. U hat gerilimi (400 V), I hat akımı. Trafo boyutlandırırken, jeneratör seçerken, 'bu hat kaç amper taşır' sorusunu cevaplandırırken kullanılır.",
    vars: [
      vS({ desc: "Üç fazın toplam görünür gücü. Trafoların etiketindeki kVA budur." }),
      vU({ name: "Hat gerilimi", de: "Leiterspannung", find: "Fazlar arasından ölç ya da 400 V al." }),
      vI({ name: "Hat akımı", de: "Leiterstrom" }),
    ],
    base: "S",
    forms: {
      S: mul(SQRT3(), v("U"), v("I")),
      U: frac(v("S"), mul(SQRT3(), v("I"))),
      I: frac(v("S"), mul(SQRT3(), v("U"))),
    },
    keywords: ["scheinleistung", "trifaze", "kva", "trafo boyutlandırma"],
  },
  {
    id: "leistungsdreieck",
    cat: "leistungsarten",
    title: "Güç Üçgeni",
    tagline: "S² = P² + Q² — Pisagor, elektrikçilikte de mesai yapıyor.",
    desc: "Aktif güç (P), reaktif güç (Q) ve görünür güç (S) bir dik üçgen oluşturur: S hipotenüs, P ve Q dik kenarlar. Reaktif güç 'boşuna' gidip gelen enerjidir — iş yapmaz ama hatları meşgul eder. Kompanzasyonun (kondansatör bankalarının) bütün amacı Q'yu küçültüp üçgeni yatırmaktır.",
    note: "S her zaman en uzun kenardır. P > S çıkıyorsa üçgen değil, ölçüm hatası çizmişsin demektir.",
    vars: [
      vS(),
      vP({
        name: "Aktif güç",
        de: "Wirkleistung",
        desc: "Üçgenin yatay kenarı: gerçek işe dönüşen güç (W).",
      }),
      {
        id: "Q",
        sym: "Q",
        name: "Reaktif güç",
        de: "Blindleistung",
        units: U_VAR,
        desc: "Manyetik/elektrik alan kurmak için gidip gelen güç. İş yapmaz ama hat kapasitesi yer; birimi var. Şebekenin 'boş koltukta seyahat eden yolcusu'.",
        find: "Ölçü cihazından ya da üçgenden: Q = √(S²−P²).",
      },
    ],
    base: "S",
    forms: {
      S: sqrt(add(pow(v("P"), 2), pow(v("Q"), 2))),
      P: sqrt(sum(plus(pow(v("S"), 2)), minus(pow(v("Q"), 2)))),
      Q: sqrt(sum(plus(pow(v("S"), 2)), minus(pow(v("P"), 2)))),
    },
    keywords: ["leistungsdreieck", "güç üçgeni", "blindleistung", "reaktif", "pisagor", "kompanzasyon"],
  },
  {
    id: "leistungsfaktor",
    cat: "leistungsarten",
    title: "Güç Faktörü",
    tagline: "cos φ = P / S — üçgenin özet istatistiği.",
    desc: "Güç faktörü, görünür gücün ne kadarının işe dönüştüğünü söyler. cos φ = 0,8 ise şebekeden çektiğinin %80'i iş, %20'si 'alan kurma servisi'. Endüstride düşük cos φ cezalıdır — elektrik dağıtıcısı, boşuna taşıdığı reaktif gücün faturasını kibarca sana keser.",
    vars: [
      vCosPhi(),
      vP({ name: "Aktif güç", de: "Wirkleistung" }),
      vS(),
    ],
    base: "cosphi",
    forms: {
      cosphi: frac(v("P"), v("S")),
      P: mul(v("S"), v("cosphi")),
      S: frac(v("P"), v("cosphi")),
    },
    keywords: ["leistungsfaktor", "güç faktörü", "kompanzasyon"],
  },
];
