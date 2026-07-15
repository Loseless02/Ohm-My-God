import type { UnitOption, VariableDef } from "./types";

const u = (label: string, mult: number): UnitOption => ({ label, mult });

// ── Birim listeleri (ilk eleman = varsayılan giriş birimi) ───────────────────
export const U_V: UnitOption[] = [u("V", 1), u("mV", 1e-3), u("kV", 1e3)];
export const U_A: UnitOption[] = [u("A", 1), u("mA", 1e-3), u("kA", 1e3)];
export const U_OHM: UnitOption[] = [u("Ω", 1), u("mΩ", 1e-3), u("kΩ", 1e3), u("MΩ", 1e6)];
export const U_W: UnitOption[] = [u("W", 1), u("mW", 1e-3), u("kW", 1e3), u("MW", 1e6)];
export const U_KW: UnitOption[] = [u("kW", 1), u("W", 1e-3)]; // motor formülü kW ister
export const U_WS: UnitOption[] = [u("kWh", 3.6e6), u("Wh", 3600), u("Ws (J)", 1), u("MJ", 1e6)];
export const U_S: UnitOption[] = [u("s", 1), u("min", 60), u("h", 3600), u("ms", 1e-3)];
export const U_C: UnitOption[] = [u("C (As)", 1), u("Ah", 3600), u("mAh", 3.6)];
export const U_HZ: UnitOption[] = [u("Hz", 1), u("kHz", 1e3), u("MHz", 1e6)];
export const U_H: UnitOption[] = [u("mH", 1e-3), u("H", 1), u("µH", 1e-6)];
export const U_F: UnitOption[] = [u("µF", 1e-6), u("nF", 1e-9), u("mF", 1e-3)];
export const U_VA: UnitOption[] = [u("VA", 1), u("kVA", 1e3)];
export const U_VAR: UnitOption[] = [u("var", 1), u("kvar", 1e3)];
export const U_M: UnitOption[] = [u("m", 1), u("km", 1e3)];
export const U_MM2: UnitOption[] = [u("mm²", 1)];
export const U_NM: UnitOption[] = [u("Nm", 1)];
export const U_RPM: UnitOption[] = [u("1/min", 1)];
export const U_PCT: UnitOption[] = [u("%", 0.01)]; // formül ondalık bekler, kullanıcı % girer
export const U_PCT_RAW: UnitOption[] = [u("%", 1)]; // formülün içinde zaten ·100 var
export const U_K: UnitOption[] = [u("K", 1)];

type Over = Partial<VariableDef>;
const def = (base: VariableDef, over: Over = {}): VariableDef => ({ ...base, ...over });

// ── Ortak değişkenler: bir kere düzgün anlat, her yerde kullan ──────────────
export const vU = (over: Over = {}) =>
  def(
    {
      id: "U",
      sym: "U",
      name: "Gerilim",
      de: "Spannung",
      units: U_V,
      desc: "Elektronları harekete zorlayan 'itiş'. Su borusundaki basınç gibi: basınç yoksa akış da yok, gerilim yoksa akım da yok.",
      find: "Multimetreyle ölçülür — uçlar ölçülecek iki noktaya PARALEL bağlanır. Çoğu zaman zaten bellidir: priz 230 V, trifaze 400 V, ya da tip etiketinde / görev metninde yazar.",
    },
    over,
  );

export const vI = (over: Over = {}) =>
  def(
    {
      id: "I",
      sym: "I",
      name: "Akım",
      de: "Strom(stärke)",
      units: U_A,
      desc: "Bir noktadan saniyede geçen yük miktarı; elektron trafiğinin yoğunluğu. Isıtan, çarpan ve sigorta attıran şey budur.",
      find: "Ampermetre devreye SERİ bağlanır (devreyi kesip araya girersin) ya da pens ampermetreyle kablonun etrafından tembelce ölçülür. Tip etiketinde de yazar.",
    },
    over,
  );

export const vR = (over: Over = {}) =>
  def(
    {
      id: "R",
      sym: "R",
      name: "Direnç",
      de: "Widerstand",
      units: U_OHM,
      desc: "Akıma 'dur bakalım, öyle kolay geçemezsin' diyen büyüklük. Her şeyin bir direnci var — kabloların, insanların, pazartesi sabahlarının.",
      find: "Ohmmetreyle GERİLİMSİZ devrede ölçülür (yoksa ölçtüğün direnç değil, multimetrenin son anıları olur), dirençlerde renk kodundan okunur ya da şemada yazar.",
    },
    over,
  );

export const vP = (over: Over = {}) =>
  def(
    {
      id: "P",
      sym: "P",
      name: "Güç",
      de: "Leistung",
      units: U_W,
      desc: "Birim zamanda çevrilen enerji — yani işin 'hızı'. Elektrik faturanın gerçek mimarı.",
      find: "İlk bakılacak yer cihazın tip etiketi (Typenschild). Orada yoksa U ve I'dan hesaplanır. Görevlerde genelde verilir.",
    },
    over,
  );

export const vT = (over: Over = {}) =>
  def(
    {
      id: "t",
      sym: "t",
      name: "Zaman",
      de: "Zeit",
      units: U_S,
      desc: "Evrendeki tek yön bildiren büyüklük. Formülde saniye cinsinden çalışır ama biz sana min/h seçeneği de koyduk, hesap makinesi değiliz… dur, tam olarak oyuz.",
      find: "Kronometre, saat ya da görev metni. 'Günde 3 saat çalışıyor' tarzı cümlelerde saklanır.",
    },
    over,
  );

export const vW = (over: Over = {}) =>
  def(
    {
      id: "W",
      sym: "W",
      name: "İş / Enerji",
      de: "Arbeit / Energie",
      units: U_WS,
      desc: "Harcanan (ya da üretilen) toplam enerji. Güç bir hızsa, iş kat edilen mesafedir. Faturada kWh olarak karşına çıkar.",
      find: "Elektrik sayacından okunur ya da P·t ile hesaplanır. 1 kWh = 3,6 MJ — sınavda birim tuzağına düşme.",
    },
    over,
  );

export const vF = (over: Over = {}) =>
  def(
    {
      id: "f",
      sym: "f",
      name: "Frekans",
      de: "Frequenz",
      units: U_HZ,
      desc: "Saniyedeki tam dalga sayısı. Avrupa şebekesi 50 Hz — yani gerilim saniyede 50 kez fikir değiştirir ve buna 'kararlılık' deriz.",
      find: "Şebeke için 50 Hz kabul edilir (ABD 60 Hz). Aksi belirtilmedikçe görev metninde yazar ya da frekansmetreyle ölçülür.",
    },
    over,
  );

export const vCosPhi = (over: Over = {}) =>
  def(
    {
      id: "cosphi",
      sym: "cos φ",
      name: "Güç faktörü",
      de: "Leistungsfaktor",
      unitNote: "birimsiz, 0–1 arası",
      desc: "Gerilimle akımın arasının ne kadar iyi olduğunun ölçüsü. 1 = mükemmel uyum (saf omik yük), 0 = küslük (saf reaktif yük). Motorlarda tipik 0,8 civarı.",
      find: "Motorun tip etiketinde yazar (cos φ 0,82 gibi) ya da P/S oranından hesaplanır. Ölçü cihazlarının çoğu doğrudan gösterir.",
    },
    over,
  );

export const vEta = (over: Over = {}) =>
  def(
    {
      id: "eta",
      sym: "η",
      name: "Verim",
      de: "Wirkungsgrad",
      units: U_PCT,
      desc: "Verdiğin enerjinin ne kadarını işe dönüştürebildiğin. %100 yok — termodinamik pazarlık kabul etmiyor. Aradaki fark ısı olarak evrene bağışlanır.",
      find: "Tip etiketi veya veri sayfasından. Yoksa P_ab / P_zu oranından hesaplarsın. Yunan harfi η 'eta' diye okunur, 'n' değil!",
    },
    over,
  );

export const vL = (over: Over = {}) =>
  def(
    {
      id: "L",
      sym: "L",
      name: "İndüktans",
      de: "Induktivität",
      units: U_H,
      desc: "Bobinin akım değişimine karşı gösterdiği inat. Akım değişmek istedikçe bobin 'acele etme' der. Birimi Henry (H).",
      find: "Bobinin/şok bobininin etiketi veya veri sayfası; LCR metreyle de ölçülür.",
    },
    over,
  );

export const vCap = (over: Over = {}) =>
  def(
    {
      id: "C",
      sym: "C",
      name: "Kapasite",
      de: "Kapazität",
      units: U_F,
      desc: "Kondansatörün yük depolama kabiliyeti. Elektriğin küçük deposu; gerilim değişimine direnir. Birimi Farad — 1 F kocamandır, pratikte µF/nF görürsün.",
      find: "Kondansatörün üzerinde yazar (ör. 4,7 µF / 450 V) ya da LCR metreyle ölçülür.",
    },
    over,
  );

export const vRho = (over: Over = {}) =>
  def(
    {
      id: "rho",
      sym: "ρ",
      name: "Öz direnç",
      de: "spezifischer Widerstand",
      units: [u("Ω·mm²/m", 1)],
      desc: "Malzemenin karakteri: elektriği ne kadar gönülsüz ilettiği. Bakır 0,0178, alüminyum 0,0278 Ω·mm²/m. (γ iletkenliğin tersi: ρ = 1/γ.)",
      find: "Tablo kitabından (Tabellenbuch) — ezberleme, bak. Ama bakırınkini yine de ezberlemiş olacaksın, kabullen: 0,0178.",
    },
    over,
  );

export const vGamma = (over: Over = {}) =>
  def(
    {
      id: "gamma",
      sym: "γ",
      name: "İletkenlik",
      de: "Leitfähigkeit",
      units: [u("m/(Ω·mm²)", 1)],
      desc: "Öz direncin tersi (γ = 1/ρ): malzeme elektriği ne kadar severek iletiyor. Bakır 56, alüminyum 35 m/(Ω·mm²).",
      find: "Tablo kitabından. Pratik değerler: Cu = 56, Al = 35. Kappa (κ) olarak da gösterilir, panik yok, aynı şey.",
    },
    over,
  );

export const vLen = (over: Over = {}) =>
  def(
    {
      id: "l",
      sym: "l",
      name: "Uzunluk",
      de: "Länge (Leitung)",
      units: U_M,
      desc: "Hattın TEK YÖN uzunluğu. Gidiş-dönüşü sen hesaplama — tek fazlı formüldeki 2 çarpanı dönüş yolunu zaten sayıyor.",
      find: "Projeden okunur ya da şerit metreyle güzergâh boyunca ölçülür (dikkat: kuş uçuşu değil, kablonun gerçek yolu).",
    },
    over,
  );

export const vA = (over: Over = {}) =>
  def(
    {
      id: "A",
      sym: "A",
      name: "Kesit",
      de: "Querschnitt",
      units: U_MM2,
      desc: "İletkenin kesit alanı — elektronların otoyolundaki şerit sayısı. Kesit büyüdükçe direnç düşer, cüzdan da hafifler.",
      find: "Kablonun üzerinde yazar (ör. NYM-J 3×1,5), projede belirtilir. Standart değerler: 1,5 / 2,5 / 4 / 6 / 10 / 16 mm²…",
    },
    over,
  );
