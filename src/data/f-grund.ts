import { v, mul, frac } from "../lib/expr";
import type { FormulaDef } from "./types";
import { vU, vI, vR, vP, vT, vW, U_C } from "./vars";

export const F_GRUND: FormulaDef[] = [
  {
    id: "ohmsches-gesetz",
    cat: "grundlagen",
    title: "Ohm Kanunu",
    tagline: "Elektriğin anayasası. Gerisi detay.",
    desc: "Gerilim, akım ve direnç arasındaki kutsal üçgen: U = R · I. Bir devrede bu üçünden ikisini biliyorsan üçüncüsü kaçamaz. Georg Simon Ohm bunu 1827'de yayınladığında kimse ciddiye almadı; şimdi onsuz priz bile takamıyoruz. Formüldeki herhangi bir büyüklüğe tıkla — formül senin için onu yalnız bıraksın.",
    note: "Birimlere dikkat: mA girdiysen sonucu kΩ'da düşünmen gerekebilir. Neyse ki birim seçicilerimiz var — biz düşündük, sen yaşa.",
    vars: [vU(), vR(), vI()],
    base: "U",
    forms: {
      U: mul(v("R"), v("I")),
      R: frac(v("U"), v("I")),
      I: frac(v("U"), v("R")),
    },
    keywords: ["ohm", "urı", "uri", "gerilim", "akım", "direnç", "spannung", "strom", "widerstand"],
  },
  {
    id: "elektrische-arbeit",
    cat: "grundlagen",
    title: "Elektriksel İş",
    tagline: "Faturanın matematiksel itirafı: W = P · t",
    desc: "Enerji = güç × zaman. 2 kW'lık ısıtıcıyı 3 saat çalıştırırsan 6 kWh yakarsın; sayaç döner, sen ödersin. Güç anlık 'hız', iş ise kat edilen toplam 'mesafe'dir. Sınavlarda en sevilen tuzak: saati saniyeye, kW'ı W'a çevirmeyi unutturmak.",
    note: "1 kWh = 3,6 MJ = 3.600.000 Ws. Birim seçiciden kWh seçersen çevirmeyle uğraşmazsın.",
    vars: [
      vW(),
      vP({ desc: "Cihazın çektiği güç. Tip etiketindeki değer — ısıtıcılarda kocaman, LED'de utangaç." }),
      vT(),
    ],
    base: "W",
    forms: {
      W: mul(v("P"), v("t")),
      P: frac(v("W"), v("t")),
      t: frac(v("W"), v("P")),
    },
    keywords: ["arbeit", "enerji", "energie", "kwh", "iş", "sayaç"],
  },
  {
    id: "elektrische-ladung",
    cat: "grundlagen",
    title: "Elektrik Yükü",
    tagline: "Q = I · t — pilin 'deposunda' ne var?",
    desc: "Yük = akım × zaman. 1 saniyede 1 amper akarsa 1 coulomb (1 As) yük geçmiş demektir. Akülerdeki 'Ah' (amper-saat) tam olarak bu: 50 Ah'lik akü, 50 saat boyunca 1 A verebilir — ya da 1 saat boyunca 50 A, tercih senin (akünün değil).",
    vars: [
      {
        id: "Q",
        sym: "Q",
        name: "Elektrik yükü",
        de: "Ladung",
        units: U_C,
        desc: "Geçen toplam elektron miktarının ölçüsü. Birimi Coulomb (C) = amper-saniye (As). Pil/akü kapasitesi olarak Ah cinsinden karşına çıkar.",
        find: "Akü etiketinde Ah olarak yazar. Hesapta I·t'den çıkar.",
      },
      vI(),
      vT(),
    ],
    base: "Q",
    forms: {
      Q: mul(v("I"), v("t")),
      I: frac(v("Q"), v("t")),
      t: frac(v("Q"), v("I")),
    },
    keywords: ["ladung", "yük", "coulomb", "ah", "amper saat", "akü", "batarya"],
  },
];
