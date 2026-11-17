import { v, num, mul, frac, sum, plus, minus, group, pow, sqrt, PI } from "../lib/expr";
import type { FormulaDef, UnitOption } from "./types";
import { vU, vI, vP, vF, vCap, U_VAR, U_V, U_A, U_OHM, U_PCT_RAW } from "./vars";

const u = (label: string, mult: number): UnitOption => ({ label, mult });
const U_LX: UnitOption[] = [u("lx", 1)];
const U_LM: UnitOption[] = [u("lm", 1), u("klm", 1e3)];
const U_M2: UnitOption[] = [u("m²", 1)];
const U_LMW: UnitOption[] = [u("lm/W", 1)];

const vQC = {
  id: "QC",
  sym: "Q",
  sub: "C",
  name: "Kondansatör gücü",
  de: "Kompensationsleistung",
  units: U_VAR,
  desc: "Kondansatörün şebekeye 'geri verdiği' reaktif güç. Bobinin çektiği reaktif gücü yerinde karşılar, kablo da trafo da rahatlar.",
  find: "Kompanzasyon formülüyle hesaplanır; kondansatör etiketinde kvar olarak yazar.",
};

const vTan = (id: string, sub: string, name: string, de: string, desc: string) => ({
  id,
  sym: "tan φ",
  sub,
  name,
  de,
  unitNote: "birimsiz",
  desc,
  find: "cos φ biliniyorsa: tan φ = √(1 − cos²φ) / cos φ. Örnek: cos φ 0,7 → 1,02 · 0,9 → 0,48 · 0,95 → 0,33.",
});

const vU0 = vU({
  id: "U0",
  sym: "U",
  sub: "0",
  name: "Faz-toprak gerilimi",
  de: "Nennspannung gegen Erde",
  desc: "Dış iletken ile toprak (PE) arasındaki anma gerilimi. Bizim şebekede 230 V.",
  find: "TN sisteminde 230 V — sınavda da hep bu.",
});

const vZs = {
  id: "Zs",
  sym: "Z",
  sub: "S",
  name: "Çevrim empedansı",
  de: "Schleifenimpedanz",
  units: U_OHM,
  desc: "Hata akımının dolaştığı tüm yolun direnci: trafo sargısı + faz iletkeni + hata yeri + PE + dönüş. Ne kadar küçükse hata akımı o kadar büyük, sigorta o kadar hızlı atar.",
  find: "Schleifenimpedanz ölçüm cihazıyla prizde ölçülür (VDE 0100-600 ilk muayene).",
};

const vIa = {
  id: "Ia",
  sym: "I",
  sub: "a",
  name: "Açma akımı",
  de: "Abschaltstrom",
  units: U_A,
  desc: "Koruma elemanının istenen sürede (ör. 0,4 s) kesin açtığı akım. Hata akımı bunun altında kalırsa sigorta 'düşünür' — ve o arada gövde gerilim altında kalır.",
  find: "LS için karakteristikten: B → 5·I_n, C → 10·I_n, D → 20·I_n.",
};

export const F_JAHR3: FormulaDef[] = [
  // ── Kompanzasyon ──────────────────────────────────────────────────────────
  {
    id: "kompensation-qc",
    cat: "kompensation",
    title: "Kompanzasyon Gücü",
    tagline: "Q_C = P·(tan φ₁ − tan φ₂) — reaktif gücü yerinde üret, şebekeden taşıma.",
    desc: "Motorlar ve balastlar şebekeden reaktif güç çeker; bu güç iş yapmaz ama kabloyu ve trafoyu doldurur, enerji şirketi de faturaya yazar. Paralel bağlanan kondansatör bu reaktif gücü yerinde karşılar. P sabit kalır, sadece φ küçülür: φ₁'den hedef φ₂'ye inmek için gereken kondansatör gücü budur.",
    note: "Hedef genelde cos φ₂ = 0,95 civarı. Tam 1'e kompanze etme: yük değişince aşırı kompanzasyona (kapasitif) kayarsın, o da ayrı dert.",
    vars: [
      vQC,
      vP({ desc: "Tesisin aktif gücü (Wirkleistung). Kompanzasyon bunu değiştirmez." }),
      vTan("t1", "1", "Kompanzasyon öncesi tan φ", "tan φ vorher", "Mevcut durumun tan φ'si. cos φ ne kadar kötüyse tan φ o kadar büyük."),
      vTan("t2", "2", "Hedef tan φ", "tan φ nachher", "Ulaşmak istediğin tan φ (ör. cos φ = 0,95 için 0,33)."),
    ],
    base: "QC",
    forms: {
      QC: mul(v("P"), group(sum(plus(v("t1")), minus(v("t2"))))),
      P: frac(v("QC"), group(sum(plus(v("t1")), minus(v("t2"))))),
      t1: sum(plus(frac(v("QC"), v("P"))), plus(v("t2"))),
      t2: sum(plus(v("t1")), minus(frac(v("QC"), v("P")))),
    },
    keywords: ["kompensation", "blindleistung", "kompanzasyon", "kondensator", "kvar", "cos phi"],
  },
  {
    id: "kompensation-c1",
    cat: "kompensation",
    title: "Kompanzasyon Kondansatörü (1 faz)",
    tagline: "C = Q_C / (U²·2π·f) — kvar'ı mikrofarada çevir.",
    desc: "Gereken reaktif gücü bulduktan sonra sıra kondansatörün kapasitesinde. Kondansatörün reaktif gücü Q_C = U²·ω·C olduğundan C bundan çekilir. Floresan armatürlerdeki paralel kondansatör tam olarak bu hesapla seçilir.",
    vars: [vCap(), vQC, vU(), vF()],
    base: "C",
    forms: {
      C: frac(v("QC"), mul(pow(v("U"), 2), num(2), PI(), v("f"))),
      QC: mul(pow(v("U"), 2), num(2), PI(), v("f"), v("C")),
      U: sqrt(frac(v("QC"), mul(num(2), PI(), v("f"), v("C")))),
      f: frac(v("QC"), mul(pow(v("U"), 2), num(2), PI(), v("C"))),
    },
    keywords: ["kompensation", "kondensator", "kapazität", "µF", "einphasig"],
  },
  {
    id: "kompensation-c3",
    cat: "kompensation",
    title: "Kompanzasyon Kondansatörü (üçgen)",
    tagline: "C_Δ = Q_C / (3·U²·2π·f) — üç kondansatör, her biri 400 V'ta.",
    desc: "Trifaze kompanzasyonda üç kondansatör çoğunlukla üçgen bağlanır: her biri hat gerilimini (400 V) görür ve toplam Q_C'nin üçte birini taşır. Üçgen bağlantı, yıldıza göre üç kat daha küçük kapasite ister — bu yüzden pratikte hep üçgen.",
    note: "U burada hat gerilimi (400 V). Hesaplanan C, TEK kondansatörün kapasitesidir.",
    vars: [
      vCap({ id: "C", sub: "Δ", name: "Kondansatör başına kapasite", de: "Kapazität je Kondensator (Dreieck)" }),
      vQC,
      vU({ name: "Hat gerilimi", de: "Leiterspannung" }),
      vF(),
    ],
    base: "C",
    forms: {
      C: frac(v("QC"), mul(num(3), pow(v("U"), 2), num(2), PI(), v("f"))),
      QC: mul(num(3), pow(v("U"), 2), num(2), PI(), v("f"), v("C")),
      f: frac(v("QC"), mul(num(3), pow(v("U"), 2), num(2), PI(), v("C"))),
    },
    keywords: ["kompensation", "dreieck", "drehstrom", "kondensator", "kapazität"],
  },
  // ── Koruma hesapları ──────────────────────────────────────────────────────
  {
    id: "kurzschlussstrom-zs",
    cat: "schutzrechnung",
    title: "Hata Akımı & Çevrim Empedansı",
    tagline: "I_k = U₀ / Z_S — kısa devre akımı ne kadar büyükse o kadar iyi (evet, gerçekten).",
    desc: "Gövdeye kaçak olduğunda akımın büyüklüğünü çevrim empedansı belirler. Otomatik kesme (Abschaltung) koruması ancak I_k, koruma elemanının açma akımından (I_a) büyükse çalışır. Yani uzun ve ince kablo burada iki kez cezalandırılır: hem gerilim düşer, hem sigorta zamanında atmaz.",
    note: "Abschaltbedingung: Z_S · I_a ≤ U₀. I_a'yı yandaki 'Açma Akımı' kartından bul, I_k ≥ I_a mı diye karşılaştır.",
    vars: [
      {
        id: "Ik",
        sym: "I",
        sub: "k",
        name: "Hata akımı",
        de: "Kurzschlussstrom (Fehlerstrom)",
        units: U_A,
        desc: "Faz ile PE arasında tam kısa devrede akan akım. Sigortayı attıran şey.",
        find: "Bu formülle hesaplanır; ölçüm cihazları Z_S'yi ölçüp I_k'yı da gösterir.",
      },
      vU0,
      vZs,
    ],
    base: "Ik",
    forms: {
      Ik: frac(v("U0"), v("Zs")),
      U0: mul(v("Ik"), v("Zs")),
      Zs: frac(v("U0"), v("Ik")),
    },
    keywords: ["schleifenimpedanz", "abschaltbedingung", "kurzschlussstrom", "zs", "ik", "çevrim"],
  },
  {
    id: "abschaltstrom",
    cat: "schutzrechnung",
    title: "Açma Akımı (LS)",
    tagline: "I_a = k · I_n — B'de 5, C'de 10, D'de 20 kat.",
    desc: "LS sigortanın manyetik açıcısı, anma akımının belli bir katında anında (≤ 0,1 s) açar. Bu kat karakteristiğe bağlıdır. Çevrim empedansı kontrolünde I_a bu yüzden k·I_n olarak alınır.",
    note: "B16 → I_a = 80 A, C16 → 160 A. Aynı kabloda C karakteristik daha büyük hata akımı ister — uzun hatta B seçmenin sebebi bu.",
    vars: [
      vIa,
      {
        id: "k",
        sym: "k",
        name: "Karakteristik katsayısı",
        de: "Auslösefaktor",
        unitNote: "birimsiz · B = 5, C = 10, D = 20",
        desc: "Manyetik açıcının çalıştığı akım katı (üst sınır).",
        find: "Sigortanın üstündeki harf: B, C, D.",
      },
      vI({ id: "In", sub: "n", name: "Anma akımı", de: "Bemessungsstrom", desc: "Sigortanın üstünde yazan akım (B16 → 16 A).", find: "Sigortanın üstünde yazar." }),
    ],
    base: "Ia",
    forms: {
      Ia: mul(v("k"), v("In")),
      k: frac(v("Ia"), v("In")),
      In: frac(v("Ia"), v("k")),
    },
    keywords: ["abschaltstrom", "ls", "auslösecharakteristik", "b16", "c16", "açma"],
  },
  {
    id: "erder-tt",
    cat: "schutzrechnung",
    title: "TT: Topraklama Direnci",
    tagline: "R_A ≤ U_L / I_Δn — 50 V'u geçmeyecek kadar iyi bir toprak.",
    desc: "TT sisteminde gövdeler binanın kendi toprak elektroduna bağlıdır. Kaçak olduğunda gövdede oluşan dokunma gerilimi R_A · I_Δn'dir ve izin verilen sınırı (U_L = 50 V) aşmamalıdır. 30 mA'lik RCD ile bu sınır ~1667 Ω'a kadar çıkar — bu yüzden TT'de RCD hayat kurtarır.",
    note: "U_L: insanlar için 50 V AC (tarım hayvanları için 25 V). Hesaplanan R_A üst sınırdır, ölçülen değer bunun altında olmalı.",
    vars: [
      {
        id: "RA",
        sym: "R",
        sub: "A",
        name: "Topraklama direnci",
        de: "Erdungswiderstand (Anlagenerder)",
        units: U_OHM,
        desc: "Toprak elektrodu ile toprak arasındaki direnç + PE iletkeni.",
        find: "Topraklama ölçer (Erdungsmesser) ile ölçülür.",
      },
      vU({ id: "UL", sub: "L", name: "İzin verilen dokunma gerilimi", de: "vereinbarte Grenze der Berührungsspannung", desc: "Kalıcı olarak dokunulmasına izin verilen en büyük gerilim: 50 V AC.", find: "Normda: 50 V AC (hayvanlar için 25 V)." }),
      {
        id: "IDn",
        sym: "I",
        sub: "Δn",
        name: "RCD anma fark akımı",
        de: "Bemessungsdifferenzstrom",
        units: [u("mA", 1e-3), u("A", 1)],
        desc: "RCD'nin açtığı kaçak akım: genelde 30 mA.",
        find: "RCD'nin üstünde yazar (I_Δn = 30 mA).",
      },
    ],
    base: "RA",
    forms: {
      RA: frac(v("UL"), v("IDn")),
      UL: mul(v("RA"), v("IDn")),
      IDn: frac(v("UL"), v("RA")),
    },
    keywords: ["tt", "erdungswiderstand", "anlagenerder", "rcd", "berührungsspannung", "topraklama"],
  },
  // ── Motor kalkışı & sürücüler ─────────────────────────────────────────────
  {
    id: "anlaufstrom",
    cat: "antriebe",
    title: "Kalkış Akımı",
    tagline: "I_A = k · I_N — motor uyanırken 6 kat fazla kahve içer.",
    desc: "Asenkron motor dururken rotor kısa devre edilmiş bir trafo sekonderi gibidir: kalkışta anma akımının 5–8 katını çeker. Bu ani akım hattı düşürür, ışıkları titretir, sigortayı attırabilir. Büyük motorlarda yıldız-üçgen, yumuşak yolverici ya da frekans konvertörü bu yüzden var.",
    note: "k = I_A/I_N tip etiketinde ya da katalogda yazar. Sigorta seçerken bu akımı unutma — motor korumada 'gecikmeli' (träge) karakteristiklerin sebebi bu.",
    vars: [
      { id: "IA", sym: "I", sub: "A", name: "Kalkış akımı", de: "Anlaufstrom (Anzugsstrom)", units: U_A, desc: "Motorun ilk anda çektiği akım.", find: "Hesapla ya da pens ampermetrenin 'inrush' fonksiyonuyla ölç." },
      { id: "kA", sym: "I", sub: "A/N", name: "Kalkış akımı oranı", de: "Anzugsstromverhältnis", unitNote: "birimsiz · tipik 5–8", desc: "Kalkış akımının anma akımına oranı.", find: "Motor kataloğu / tip etiketi (I_A/I_N)." },
      vI({ id: "IN", sub: "N", name: "Anma akımı", de: "Bemessungsstrom", desc: "Motorun tam yükte çektiği akım.", find: "Tip etiketinde (bağlantı türüne göre: Δ 400 V / Y 690 V)." }),
    ],
    base: "IA",
    forms: {
      IA: mul(v("kA"), v("IN")),
      kA: frac(v("IA"), v("IN")),
      IN: frac(v("IA"), v("kA")),
    },
    keywords: ["anlaufstrom", "anzugsstrom", "kalkış", "inrush", "motor"],
  },
  {
    id: "stern-dreieck-anlauf",
    cat: "antriebe",
    title: "Yıldız-Üçgen Kalkış Akımı",
    tagline: "I_Y = I_Δ / 3 — yıldızda kalk, şebekeyi üzme.",
    desc: "Motor normalde üçgende çalışırken yıldızda kalkarsa her sargıya 400 V yerine 230 V düşer. Sargı akımı √3 azalır, hat akımı da üçgendeki √3 çarpanını kaybeder: toplamda şebekeden çekilen kalkış akımı ÜÇTE BİRE iner. Bedeli: moment de üçte bire düşer — yüklü kalkışlarda motor kalkamayabilir.",
    note: "Sadece üçgende 400 V için yapılmış motorlarda (etiket: Δ 400 V / Y 690 V) kullanılır. M_Y = M_Δ / 3 — moment için de aynı formül geçerli. Playground'da 'Last + Steuer' modunda dene: pervanenin yıldızda yavaş döndüğünü gör.",
    vars: [
      { id: "IY", sym: "I", sub: "Y", name: "Yıldızda kalkış akımı", de: "Anlaufstrom in Sternschaltung", units: U_A, desc: "Yıldız kalkışta şebekeden çekilen akım.", find: "Bu formülle hesaplanır." },
      { id: "ID", sym: "I", sub: "Δ", name: "Üçgende (direkt) kalkış akımı", de: "Anlaufstrom bei Direktanlauf (Dreieck)", units: U_A, desc: "Motor direkt üçgende kalksaydı çekeceği akım.", find: "I_A = k · I_N ile (Kalkış Akımı kartı)." },
    ],
    base: "IY",
    forms: {
      IY: frac(v("ID"), num(3)),
      ID: mul(num(3), v("IY")),
    },
    keywords: ["stern-dreieck", "yıldız üçgen", "anlauf", "y-d", "kalkış"],
  },
  {
    id: "u-f-kennlinie",
    cat: "antriebe",
    title: "Frekans Konvertörü: U/f Sabit",
    tagline: "U₂ = U₁ · f₂ / f₁ — frekansı düşürürsen gerilimi de düşür.",
    desc: "Frekans konvertörü motoru yavaşlatmak için frekansı düşürür. Ama gerilim aynı kalırsa düşük frekansta sargının reaktansı azalır, akım ve mıknatıslanma şişer — motor doyuma gider ve ısınır. Çözüm: U/f oranını sabit tutmak. 400 V / 50 Hz = 8 V/Hz; 25 Hz'te 200 V.",
    note: "50 Hz'in üstünde (alan zayıflatma bölgesi) gerilim 400 V'ta sabit kalır, sadece frekans artar — moment düşer.",
    vars: [
      vU({ id: "U2", sub: "2", name: "Yeni gerilim", de: "Ausgangsspannung bei f₂", desc: "Konvertörün yeni frekansta vermesi gereken gerilim.", find: "Bu formülle hesaplanır." }),
      vU({ id: "U1", sub: "1", name: "Anma gerilimi", de: "Bemessungsspannung", desc: "Motorun anma gerilimi (genelde 400 V).", find: "Tip etiketi." }),
      vF({ id: "f2", sub: "2", name: "Yeni frekans", de: "neue Frequenz", desc: "Ayarlanan çıkış frekansı.", find: "Konvertör ayarı." }),
      vF({ id: "f1", sub: "1", name: "Anma frekansı", de: "Bemessungsfrequenz", desc: "Motorun anma frekansı (50 Hz).", find: "Tip etiketi." }),
    ],
    base: "U2",
    forms: {
      U2: frac(mul(v("U1"), v("f2")), v("f1")),
      f2: frac(mul(v("U2"), v("f1")), v("U1")),
      U1: frac(mul(v("U2"), v("f1")), v("f2")),
      f1: frac(mul(v("U1"), v("f2")), v("U2")),
    },
    keywords: ["frequenzumrichter", "fu", "u/f", "kennlinie", "frekans konvertörü", "drehzahl"],
  },
  {
    id: "gleichrichter",
    cat: "antriebe",
    title: "Doğrultucu Çıkış Gerilimi",
    tagline: "U_di = k · U — B2U'da 0,9, B6U'da 1,35.",
    desc: "Köprü doğrultucunun çıkışındaki ideal ortalama DC gerilim (filtresiz). Tek fazlı köprüde (B2U) k = 0,9; trifaze köprüde (B6U) k = 1,35. Frekans konvertörünün ara devresindeki ~540 V tam olarak buradan gelir: 400 V · 1,35.",
    note: "Kondansatörle filtrelenirse gerilim tepe değere (√2 · U) yaklaşır: 230 V → ~325 V. Formül filtresiz ortalama değer içindir.",
    vars: [
      { id: "Udi", sym: "U", sub: "di", name: "İdeal DC gerilim", de: "ideelle Gleichspannung", units: U_V, desc: "Doğrultucu çıkışının ortalama değeri.", find: "DC voltmetreyle ölçülür (ortalama değer)." },
      { id: "k", sym: "k", name: "Doğrultucu katsayısı", de: "Gleichrichterfaktor", unitNote: "birimsiz · M1U 0,45 · B2U 0,9 · B6U 1,35", desc: "Bağlantı tipine göre sabit.", find: "Devre tipinden: B2U → 0,9, B6U → 1,35." },
      vU({ name: "Giriş gerilimi (efektif)", de: "Anschlussspannung (Effektivwert)", desc: "Doğrultucunun beslendiği AC gerilim: B2U'da faz gerilimi, B6U'da hat gerilimi.", find: "230 V ya da 400 V." }),
    ],
    base: "Udi",
    forms: {
      Udi: mul(v("k"), v("U")),
      U: frac(v("Udi"), v("k")),
      k: frac(v("Udi"), v("U")),
    },
    keywords: ["gleichrichter", "b2u", "b6u", "doğrultucu", "zwischenkreis", "dc"],
  },
  // ── Trafo ────────────────────────────────────────────────────────────────
  {
    id: "trafo-uk",
    cat: "trafo",
    title: "Kısa Devre Gerilimi & Sürekli Kısa Devre Akımı",
    tagline: "I_k = I_N · 100 / u_k — küçük u_k, büyük kısa devre akımı.",
    desc: "u_k, sekonder kısa devre edilmişken anma akımını akıtmak için primere uygulanması gereken gerilimin yüzdesidir. Trafonun iç 'sertliğini' anlatır: u_k küçükse trafo serttir, gerilimi yükte az düşer ama kısa devre akımı çok büyüktür. Dağıtım trafolarında tipik u_k %4–6.",
    note: "u_k = %4 → I_k = 25 · I_N. Şalt cihazlarının kesme kapasitesi bu akıma göre seçilir.",
    vars: [
      { id: "Ik", sym: "I", sub: "k", name: "Sürekli kısa devre akımı", de: "Dauerkurzschlussstrom", units: U_A, desc: "Sekonder uçları kısa devre edilince akan akım.", find: "Bu formülle hesaplanır." },
      vI({ id: "IN", sub: "N", name: "Anma akımı", de: "Bemessungsstrom", desc: "Trafonun sekonder anma akımı.", find: "Tip etiketi ya da S / (√3 · U)." }),
      { id: "uk", sym: "u", sub: "k", name: "Bağıl kısa devre gerilimi", de: "relative Kurzschlussspannung", units: U_PCT_RAW, desc: "Kısa devre deneyinde anma akımı için gereken primer gerilimin yüzdesi.", find: "Tip etiketinde (ör. u_k = %4)." },
    ],
    base: "Ik",
    forms: {
      Ik: frac(mul(v("IN"), num(100)), v("uk")),
      IN: frac(mul(v("Ik"), v("uk")), num(100)),
      uk: frac(mul(v("IN"), num(100)), v("Ik")),
    },
    keywords: ["uk", "kurzschlussspannung", "dauerkurzschlussstrom", "transformator", "trafo"],
  },
  // ── Aydınlatma ───────────────────────────────────────────────────────────
  {
    id: "beleuchtungsstaerke",
    cat: "licht",
    title: "Aydınlık Düzeyi",
    tagline: "E = Φ / A — ışığı metrekareye bölüştür.",
    desc: "Bir yüzeye düşen ışık akısının o yüzeyin alanına oranı. 1 lux = 1 lümen / m². Normlar iş yerleri için en az aydınlık düzeyini belirler (DIN EN 12464-1): ofis 500 lx, koridor 100 lx, ince montaj işi 750 lx ve üstü.",
    vars: [
      { id: "E", sym: "E", name: "Aydınlık düzeyi", de: "Beleuchtungsstärke", units: U_LX, desc: "Yüzeye düşen ışık miktarı.", find: "Luxmetre ile çalışma yüksekliğinde (≈ 0,75 m) ölçülür." },
      { id: "phi", sym: "Φ", name: "Işık akısı", de: "Lichtstrom", units: U_LM, desc: "Kaynağın her yöne saldığı toplam ışık.", find: "Lamba ambalajında lümen olarak yazar." },
      { id: "A", sym: "A", name: "Alan", de: "Fläche", units: U_M2, desc: "Aydınlatılan yüzey.", find: "En × boy." },
    ],
    base: "E",
    forms: {
      E: frac(v("phi"), v("A")),
      phi: mul(v("E"), v("A")),
      A: frac(v("phi"), v("E")),
    },
    keywords: ["beleuchtungsstärke", "lux", "lumen", "aydınlatma", "licht"],
  },
  {
    id: "lichtausbeute",
    cat: "licht",
    title: "Işık Verimi",
    tagline: "η = Φ / P — watt başına kaç lümen?",
    desc: "Lambanın elektrik gücünü ne kadar ışığa çevirdiği. Akkor lamba ~12 lm/W (geri kalanı ısıtıcı), floresan ~80 lm/W, iyi bir LED 150 lm/W'ın üstü. Watt artık parlaklığın değil, faturanın birimi.",
    vars: [
      { id: "eta", sym: "η", name: "Işık verimi", de: "Lichtausbeute", units: U_LMW, desc: "Watt başına üretilen lümen.", find: "Ürün etiketi / veri sayfası." },
      { id: "phi", sym: "Φ", name: "Işık akısı", de: "Lichtstrom", units: U_LM, desc: "Lambanın toplam ışık çıkışı.", find: "Ambalajda lümen olarak." },
      vP({ desc: "Lambanın çektiği elektrik gücü.", find: "Ambalaj / tip etiketi." }),
    ],
    base: "eta",
    forms: {
      eta: frac(v("phi"), v("P")),
      phi: mul(v("eta"), v("P")),
      P: frac(v("phi"), v("eta")),
    },
    keywords: ["lichtausbeute", "lm/w", "led", "verim", "ışık"],
  },
  {
    id: "leuchtenanzahl",
    cat: "licht",
    title: "Armatür Sayısı (Verim Yöntemi)",
    tagline: "n = E·A / (Φ·η_B·WF) — kaç armatür lazım?",
    desc: "Wirkungsgradverfahren: istenen aydınlık düzeyi için gereken armatür sayısı. Armatürün tüm ışığı yere ulaşmaz (η_B, aydınlatma verimi: oda geometrisi + duvar yansıması), zamanla lambalar kirlenip zayıflar (WF, bakım faktörü). İkisini de hesaba katmazsan açılış günü güzel, bir yıl sonra loş bir oda teslim edersin.",
    note: "Sonucu YUKARI yuvarla. Tipik değerler: η_B 0,5–0,8 · WF 0,8 (temiz oda), 0,67 (normal).",
    vars: [
      { id: "n", sym: "n", name: "Armatür sayısı", de: "Anzahl der Leuchten", unitNote: "adet", integer: true, desc: "Gereken armatür (ya da lamba) adedi.", find: "Bu formülle hesaplanır, yukarı yuvarlanır." },
      { id: "E", sym: "E", name: "İstenen aydınlık düzeyi", de: "Wartungswert der Beleuchtungsstärke", units: U_LX, desc: "Normun istediği değer (ofis 500 lx).", find: "DIN EN 12464-1 tabloları." },
      { id: "A", sym: "A", name: "Oda alanı", de: "Raumfläche", units: U_M2, desc: "Aydınlatılacak zemin alanı.", find: "En × boy." },
      { id: "phi", sym: "Φ", name: "Armatür başına ışık akısı", de: "Lichtstrom je Leuchte", units: U_LM, desc: "Bir armatürün toplam lümeni.", find: "Armatür veri sayfası." },
      { id: "etaB", sym: "η", sub: "B", name: "Aydınlatma verimi", de: "Beleuchtungswirkungsgrad", unitNote: "birimsiz · 0,5–0,8", desc: "Işığın ne kadarının çalışma yüzeyine ulaştığı.", find: "Üretici tabloları (oda indeksi + yansıma)." },
      { id: "WF", sym: "WF", name: "Bakım faktörü", de: "Wartungsfaktor", unitNote: "birimsiz · 0,67–0,8", desc: "Kirlenme ve yaşlanma payı.", find: "Ortama göre seçilir: temiz 0,8, normal 0,67." },
    ],
    base: "n",
    forms: {
      n: frac(mul(v("E"), v("A")), mul(v("phi"), v("etaB"), v("WF"))),
      E: frac(mul(v("n"), v("phi"), v("etaB"), v("WF")), v("A")),
      A: frac(mul(v("n"), v("phi"), v("etaB"), v("WF")), v("E")),
      phi: frac(mul(v("E"), v("A")), mul(v("n"), v("etaB"), v("WF"))),
    },
    keywords: ["wirkungsgradverfahren", "leuchtenanzahl", "wartungsfaktor", "armatür", "beleuchtung"],
  },
];
