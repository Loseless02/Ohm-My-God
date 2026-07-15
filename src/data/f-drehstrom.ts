import { v, mul, frac, SQRT3 } from "../lib/expr";
import type { FormulaDef } from "./types";
import { vU, vI, vP, vCosPhi } from "./vars";

export const F_DREHSTROM: FormulaDef[] = [
  {
    id: "stern-spannungen",
    cat: "drehstrom",
    title: "Yıldız Bağlantı: Gerilimler",
    tagline: "U_L = √3 · U_Str — 230 ile 400'ün gizli akrabalığı.",
    desc: "Yıldız (Stern/Y) bağlantıda faz-nötr gerilimi (U_Str) ile faz-faz gerilimi (U_L) arasında √3 çarpanı vardır: 230 V · √3 ≈ 400 V. Prizindeki 230 ile trifaze hattın 400'ü aynı şebekenin iki farklı ölçüm noktası. Yıldızda akımlar ise eşittir: I_L = I_Str — akım için çevirme yok, rahatla.",
    note: "√3 ≈ 1,732. Drehstrom'da bir yerde √3 görmüyorsan muhtemelen bir şeyi unutmuşsundur.",
    vars: [
      vU({
        id: "UL",
        sym: "U",
        sub: "L",
        name: "Hat gerilimi (faz-faz)",
        de: "Leiterspannung / Außenleiterspannung",
        desc: "İki faz iletkeni ARASINDAKİ gerilim. Avrupa şebekesinde 400 V.",
        find: "İki faz arasında multimetreyle ölç: L1–L2, L2–L3, L3–L1 → hepsi 400 V olmalı.",
      }),
      vU({
        id: "UStr",
        sym: "U",
        sub: "Str",
        name: "Yıldız gerilimi (faz-nötr)",
        de: "Strangspannung",
        desc: "Bir faz ile nötr (yıldız noktası) arasındaki gerilim. Bildiğin priz gerilimi: 230 V.",
        find: "Faz ile N arasında ölç: L1–N → 230 V.",
      }),
    ],
    base: "UL",
    forms: {
      UL: mul(SQRT3(), v("UStr")),
      UStr: frac(v("UL"), SQRT3()),
    },
    keywords: ["stern", "yıldız", "400", "230", "strangspannung", "leiterspannung"],
  },
  {
    id: "dreieck-stroeme",
    cat: "drehstrom",
    title: "Üçgen Bağlantı: Akımlar",
    tagline: "I_L = √3 · I_Str — üçgende √3, akım tarafına geçer.",
    desc: "Üçgen (Dreieck/Δ) bağlantıda sargılar fazlar ARASINA bağlanır: sargı gerilimi = hat gerilimi (U_Str = U_L = 400 V), ama hat akımı sargı akımının √3 katıdır. Yıldızın tam simetriği: yıldızda √3 gerilimde, üçgende akımdadır. Motorların yıldız-üçgen yol vermesinin bütün sırrı bu iki karttadır.",
    note: "Aynı motor üçgende, yıldıza göre 3 KAT güç çeker. Yıldız-üçgen yol verme, kalkışta bu farkı kullanarak şebekeyi korur.",
    vars: [
      vI({
        id: "IL",
        sym: "I",
        sub: "L",
        name: "Hat akımı",
        de: "Leiterstrom / Außenleiterstrom",
        desc: "Besleme hattından (L1, L2, L3) akan akım — sigortanın ve kablonun gördüğü akım.",
        find: "Pens ampermetreyle faz iletkeninden ölç.",
      }),
      vI({
        id: "IStr",
        sym: "I",
        sub: "Str",
        name: "Sargı akımı",
        de: "Strangstrom",
        desc: "Motor/yük sargısının İÇİNDEN akan akım. Hat akımından küçüktür (üçgende).",
        find: "Sargı koluna seri ampermetre — pratikte genelde hesaplanır.",
      }),
    ],
    base: "IL",
    forms: {
      IL: mul(SQRT3(), v("IStr")),
      IStr: frac(v("IL"), SQRT3()),
    },
    keywords: ["dreieck", "üçgen", "delta", "strangstrom", "yol verme"],
  },
  {
    id: "drehstromleistung",
    cat: "drehstrom",
    title: "Trifaze Güç",
    tagline: "P = √3 · U · I · cos φ — endüstrinin ekmek teknesi formülü.",
    desc: "Trifaze sistemin aktif gücü. U hat gerilimi (400 V), I hat akımı — bağlantı yıldız da olsa üçgen de olsa BU formül aynen çalışır, √3 farkları kendi içinde halleder (kibarlığına bak). Motor etiketindeki değerlerle motorun şebekeden ne çektiğini bulmanın standart yolu.",
    note: "U = hat gerilimi (400 V), I = hat akımı. Strang değerleriyle karıştırırsan √3 sana iki kere güler.",
    vars: [
      vP({ desc: "Üç fazın toplam aktif gücü — işe dönüşen kısım." }),
      vU({
        name: "Hat gerilimi",
        de: "Leiterspannung",
        desc: "Fazlar arası gerilim; Avrupa'da 400 V.",
        find: "İki faz arasından ölç ya da 400 V kabul et.",
      }),
      vI({
        name: "Hat akımı",
        de: "Leiterstrom",
        desc: "Faz iletkeninden akan akım.",
        find: "Pens ampermetre ya da motor etiketi.",
      }),
      vCosPhi(),
    ],
    base: "P",
    forms: {
      P: mul(SQRT3(), v("U"), v("I"), v("cosphi")),
      I: frac(v("P"), mul(SQRT3(), v("U"), v("cosphi"))),
      U: frac(v("P"), mul(SQRT3(), v("I"), v("cosphi"))),
      cosphi: frac(v("P"), mul(SQRT3(), v("U"), v("I"))),
    },
    keywords: ["drehstrom", "trifaze", "üç faz", "400v", "motor gücü"],
  },
];
