import { v, num, mul, frac, sum, plus, minus, pow, sqrt, group, PI, SQRT3 } from "../lib/expr";
import type { FormulaDef, UnitOption } from "./types";
import { vU, vI, vR, vP, vT, vF, vL, vCap, vCosPhi, vEta, U_A, U_OHM, U_W, U_KW, U_VA, U_S } from "./vars";

const u = (label: string, mult: number): UnitOption => ({ label, mult });
const U_EUR: UnitOption[] = [u("€", 1)];
const U_EUR_KWH: UnitOption[] = [u("€/kWh", 1), u("ct/kWh", 0.01)];
const U_KWH: UnitOption[] = [u("kWh", 1), u("MWh", 1e3)];
const U_H_TIME: UnitOption[] = [u("h", 1), u("min", 1 / 60)];
const U_KG: UnitOption[] = [u("kg (≈ l su)", 1)];
const U_C_SPEC: UnitOption[] = [u("Wh/(kg·K)", 1)];
const U_K: UnitOption[] = [u("K", 1)];
const U_KWP: UnitOption[] = [u("kWp", 1)];
const U_YIELD: UnitOption[] = [u("kWh/kWp", 1)];

const vX = {
  id: "X",
  sym: "X",
  name: "Reaktans",
  de: "Blindwiderstand",
  units: U_OHM,
  desc: "Bobinin ya da kondansatörün AC'ye gösterdiği 'ısıtmayan' direnç. Enerjiyi yakmaz, sadece ileri geri taşır.",
  find: "X_L = 2π·f·L ya da X_C = 1/(2π·f·C) kartlarından.",
};

export const F_JAHR3B: FormulaDef[] = [
  // ── motor & kablo ─────────────────────────────────────────────────────────
  {
    id: "motor-nennstrom",
    cat: "antriebe",
    title: "Motor Anma Akımı (trifaze)",
    tagline: "I = P / (√3 · U · cos φ · η) — kablo ve motor koruma bununla seçilir.",
    desc: "Tip etiketindeki güç milden ALINAN mekanik güçtür. Şebekeden çekilen elektrik gücü verim kadar daha büyüktür; akım da buna göre. Kablo kesiti, motor koruma rölesi ayarı ve sigorta hep bu akımdan başlar.",
    note: "P'yi watt olarak gir (ya da birimi kW seç). Motor koruma rölesi genelde tam bu anma akımına ayarlanır.",
    vars: [
      vI({ name: "Hat akımı (anma)", de: "Bemessungsstrom", desc: "Motorun tam yükte şebekeden çektiği akım.", find: "Tip etiketinde de yazar — hesapla karşılaştır." }),
      vP({ name: "Mil gücü", de: "Bemessungsleistung (abgegeben)", desc: "Tip etiketindeki güç: milden alınan mekanik güç.", find: "Tip etiketi (kW)." }),
      vU({ name: "Hat gerilimi", de: "Leiterspannung" }),
      vCosPhi(),
      vEta(),
    ],
    base: "I",
    forms: {
      I: frac(v("P"), mul(SQRT3(), v("U"), v("cosphi"), v("eta"))),
      P: mul(SQRT3(), v("U"), v("I"), v("cosphi"), v("eta")),
      cosphi: frac(v("P"), mul(SQRT3(), v("U"), v("I"), v("eta"))),
      eta: frac(v("P"), mul(SQRT3(), v("U"), v("I"), v("cosphi"))),
    },
    keywords: ["bemessungsstrom", "motorstrom", "nennstrom", "motor akımı", "drehstrommotor"],
  },
  {
    id: "strombelastbarkeit",
    cat: "spannungsfall",
    title: "Akım Taşıma Kapasitesi (düzeltilmiş)",
    tagline: "I_z = I_r · f₁ · f₂ — tablo değeri ideal dünya içindir.",
    desc: "Tablodaki akım taşıma değeri (I_r) 30 °C ortam ve tek başına döşenmiş kablo içindir. Gerçekte kablolar demet halinde yatar ve tavan arası yazın 40 °C olur. Her olumsuz koşul bir düşürme faktörü getirir; çarpılınca kablonun GERÇEKTE taşıyabileceği akım (I_z) çıkar. Sonra kural: I_b ≤ I_n ≤ I_z.",
    note: "f₁: ortam sıcaklığı (ör. 40 °C → 0,87), f₂: demetleme (ör. 3 devre yan yana → 0,7). Değerler DIN VDE 0298-4 tablolarından.",
    vars: [
      { id: "Iz", sym: "I", sub: "z", name: "Düzeltilmiş taşıma akımı", de: "Strombelastbarkeit", units: U_A, desc: "Kablonun bu döşeme koşullarında sürekli taşıyabileceği akım.", find: "Bu formülle hesaplanır." },
      { id: "Ir", sym: "I", sub: "r", name: "Tablo değeri", de: "Bemessungswert der Strombelastbarkeit", units: U_A, desc: "Döşeme türü ve kesite göre tablodaki akım.", find: "DIN VDE 0298-4 tablosu (döşeme türü + kesit + yüklü damar sayısı)." },
      { id: "f1", sym: "f", sub: "1", name: "Sıcaklık faktörü", de: "Umrechnungsfaktor Umgebungstemperatur", unitNote: "birimsiz · 30 °C = 1", desc: "Ortam sıcaklığı 30 °C'den farklıysa.", find: "Tablo: 25 °C 1,06 · 35 °C 0,94 · 40 °C 0,87." },
      { id: "f2", sym: "f", sub: "2", name: "Demetleme faktörü", de: "Umrechnungsfaktor Häufung", unitNote: "birimsiz · tek devre = 1", desc: "Yan yana döşenen devre sayısına göre.", find: "Tablo: 2 devre 0,8 · 3 devre 0,7 · 4 devre 0,65." },
    ],
    base: "Iz",
    forms: {
      Iz: mul(v("Ir"), v("f1"), v("f2")),
      Ir: frac(v("Iz"), mul(v("f1"), v("f2"))),
    },
    keywords: ["strombelastbarkeit", "iz", "häufung", "umrechnungsfaktor", "kablo seçimi"],
  },
  // ── AC devreleri ──────────────────────────────────────────────────────────
  {
    id: "wirk-blindstrom",
    cat: "leistungsarten",
    title: "Aktif ve Reaktif Akım",
    tagline: "I_w = I · cos φ — akımın sadece bir kısmı iş yapar.",
    desc: "Ampermetre toplam (görünür) akımı gösterir. Bunun cos φ kadarı aktif akımdır (I_w) ve iş yapar; geri kalanı reaktif akımdır (I_b = I·sin φ) ve bobinle şebeke arasında gidip gelir. Kabloyu ikisi birlikte ısıtır — kompanzasyonun derdi tam olarak bu.",
    vars: [
      { id: "Iw", sym: "I", sub: "w", name: "Aktif akım", de: "Wirkstrom", units: U_A, desc: "Akımın gerilimle aynı fazdaki, iş yapan kısmı.", find: "Bu formülle hesaplanır." },
      vI({ name: "Görünür akım", de: "Scheinstrom", desc: "Ampermetrenin gösterdiği toplam akım.", find: "Pens ampermetreyle ölç." }),
      vCosPhi(),
    ],
    base: "Iw",
    forms: {
      Iw: mul(v("I"), v("cosphi")),
      I: frac(v("Iw"), v("cosphi")),
      cosphi: frac(v("Iw"), v("I")),
    },
    keywords: ["wirkstrom", "blindstrom", "aktif akım", "reaktif akım", "scheinstrom"],
  },
  {
    id: "impedanz",
    cat: "induktivitaet",
    title: "Empedans (seri R + X)",
    tagline: "Z = √(R² + X²) — dirençler AC'de Pisagor'la toplanır.",
    desc: "AC devresinde omik direnç ile reaktans aynı fazda değildir; düz toplanmazlar, dik üçgenin kenarları gibi birleşirler. Sonuç, devrenin AC'ye gösterdiği toplam direnç: empedans Z. I = U / Z ve cos φ = R / Z.",
    note: "Seri RL ve seri RC için geçerli. Hem bobin hem kondansatör varsa X = X_L − X_C al (biri diğerini götürür).",
    vars: [
      { id: "Z", sym: "Z", name: "Empedans", de: "Scheinwiderstand (Impedanz)", units: U_OHM, desc: "AC'deki toplam direnç.", find: "Z = U / I ile ölçümden ya da bu formülle." },
      vR(),
      vX,
    ],
    base: "Z",
    forms: {
      Z: sqrt(sum(plus(pow(v("R"), 2)), plus(pow(v("X"), 2)))),
      R: sqrt(sum(plus(pow(v("Z"), 2)), minus(pow(v("X"), 2)))),
      X: sqrt(sum(plus(pow(v("Z"), 2)), minus(pow(v("R"), 2)))),
    },
    keywords: ["impedanz", "scheinwiderstand", "empedans", "z", "rl"],
  },
  {
    id: "resonanzfrequenz",
    cat: "induktivitaet",
    title: "Rezonans Frekansı",
    tagline: "f₀ = 1 / (2π·√(L·C)) — X_L ile X_C'nin eşit olduğu an.",
    desc: "Frekans arttıkça X_L büyür, X_C küçülür. Bir noktada ikisi eşitlenir ve birbirini götürür: rezonans. Seri devrede empedans minimuma iner (akım tavan yapar), paralel devrede maksimuma çıkar. Radyo istasyonu seçmek de, kompanzasyon tesislerinde harmonik sorunları da buradan çıkar.",
    vars: [
      vF({ id: "f0", sub: "0", name: "Rezonans frekansı", de: "Resonanzfrequenz", desc: "X_L = X_C olduğu frekans.", find: "Bu formülle hesaplanır." }),
      vL(),
      vCap(),
    ],
    base: "f0",
    forms: {
      f0: frac(num(1), mul(num(2), PI(), sqrt(mul(v("L"), v("C"))))),
      L: frac(num(1), mul(pow(group(mul(num(2), PI(), v("f0"))), 2), v("C"))),
      C: frac(num(1), mul(pow(group(mul(num(2), PI(), v("f0"))), 2), v("L"))),
    },
    keywords: ["resonanz", "rezonans", "schwingkreis", "f0", "lc"],
  },
  {
    id: "zeitkonstante-rc",
    cat: "induktivitaet",
    title: "Zaman Sabiti (RC)",
    tagline: "τ = R · C — 5τ sonra kondansatör 'dolu' sayılır.",
    desc: "Kondansatör bir direnç üzerinden dolarken gerilimi üstel artar. τ kadar sürede son değerin %63'üne, 5τ'da %99'una ulaşır. Zaman rölelerinin, yumuşak kalkış devrelerinin ve filtrelerin hepsi bu süreye göre tasarlanır. Bobinde aynı mantık: τ = L / R.",
    vars: [
      vT({ id: "tau", sym: "τ", name: "Zaman sabiti", de: "Zeitkonstante", units: U_S, desc: "Dolma/boşalmanın hızı. 1τ → %63, 5τ → ~%100.", find: "Bu formülle hesaplanır; osiloskopla da ölçülür." }),
      vR(),
      vCap(),
    ],
    base: "tau",
    forms: {
      tau: mul(v("R"), v("C")),
      R: frac(v("tau"), v("C")),
      C: frac(v("tau"), v("R")),
    },
    keywords: ["zeitkonstante", "tau", "rc", "laden", "zaman sabiti"],
  },
  // ── Trafo ────────────────────────────────────────────────────────────────
  {
    id: "trafo-wirkungsgrad",
    cat: "trafo",
    title: "Trafo Verimi (kayıplarla)",
    tagline: "η = P₂ / (P₂ + P_Fe + P_Cu) — demir ve bakırın faturası.",
    desc: "Trafonun iki kaybı var: demir kaybı (P_Fe) çekirdekte, gerilim olduğu sürece hep vardır — yük olsun olmasın. Bakır kaybı (P_Cu) sargılarda, yük akımıyla artar. Verim, verilen gücün bunların toplamına oranıdır. Büyük trafolarda %98'i geçer; elektrikteki en verimli makineler bunlar.",
    vars: [
      vEta(),
      vP({ id: "P2", sub: "2", name: "Verilen güç", de: "abgegebene Leistung", desc: "Sekonderden yüke verilen aktif güç.", find: "Sekonder tarafta ölç: U₂ · I₂ · cos φ." }),
      vP({ id: "PFe", sub: "Fe", name: "Demir kaybı", de: "Eisenverluste", desc: "Çekirdekteki histerezis ve girdap akımı kayıpları — boşta da var.", find: "Boşta çalışma deneyi (Leerlaufversuch) / veri sayfası." }),
      vP({ id: "PCu", sub: "Cu", name: "Bakır kaybı", de: "Kupferverluste", desc: "Sargı dirençlerinde ısıya dönen güç — akımın karesiyle artar.", find: "Kısa devre deneyi (Kurzschlussversuch) / veri sayfası." }),
    ],
    base: "eta",
    forms: {
      eta: frac(v("P2"), sum(plus(v("P2")), plus(v("PFe")), plus(v("PCu")))),
    },
    keywords: ["transformator wirkungsgrad", "eisenverluste", "kupferverluste", "trafo verim"],
  },
  {
    id: "kupferverluste-last",
    cat: "trafo",
    title: "Yüke Göre Bakır Kaybı",
    tagline: "P_Cu = P_CuN · (S / S_N)² — yarı yükte dörtte bir kayıp.",
    desc: "Bakır kaybı akımın karesiyle değişir. Trafo yarı yükte çalışıyorsa bakır kaybı anma değerinin dörtte birine iner. Bu yüzden trafoların verimi tam yükte değil, genelde %40–60 yük civarında en yüksektir (bakır kaybı demir kaybına eşit olduğunda).",
    vars: [
      vP({ id: "PCu", sub: "Cu", name: "Bakır kaybı (anlık)", de: "Kupferverluste bei Teillast", desc: "O anki yükte sargılarda kaybolan güç.", find: "Bu formülle hesaplanır." }),
      vP({ id: "PCuN", sub: "CuN", name: "Anma bakır kaybı", de: "Kupferverluste bei Bemessungslast", desc: "Tam yükteki bakır kaybı.", find: "Veri sayfası / kısa devre deneyi." }),
      { id: "S", sym: "S", name: "O anki görünür güç", de: "Scheinleistung (aktuell)", units: U_VA, desc: "Trafonun şu an verdiği görünür güç.", find: "Ölç ya da hesapla: √3 · U · I." },
      { id: "SN", sym: "S", sub: "N", name: "Anma görünür gücü", de: "Bemessungsscheinleistung", units: U_VA, desc: "Trafonun etiket gücü.", find: "Tip etiketi (kVA)." },
    ],
    base: "PCu",
    forms: {
      PCu: mul(v("PCuN"), pow(group(frac(v("S"), v("SN"))), 2)),
      PCuN: frac(v("PCu"), pow(group(frac(v("S"), v("SN"))), 2)),
      S: mul(v("SN"), sqrt(frac(v("PCu"), v("PCuN")))),
    },
    keywords: ["kupferverluste", "teillast", "bakır kaybı", "trafo"],
  },
  // ── Bina tekniği & enerji ─────────────────────────────────────────────────
  {
    id: "energiekosten",
    cat: "gebaeude",
    title: "Enerji Maliyeti",
    tagline: "K = P · t · k — wattın cüzdandaki karşılığı.",
    desc: "Tüketilen enerji (kWh) ile birim fiyatın çarpımı. Bekleme modundaki 10 W'lık bir cihaz yılda 87,6 kWh yer — 30 ct/kWh ile ~26 €. 'Küçük şeyler' fatura üzerinde hiç de küçük değildir.",
    vars: [
      { id: "K", sym: "K", name: "Maliyet", de: "Energiekosten", units: U_EUR, desc: "Ödenecek tutar.", find: "Bu formülle hesaplanır." },
      vP({ units: U_KW, desc: "Cihazın çektiği güç.", find: "Tip etiketi ya da enerji ölçer priz." }),
      vT({ units: U_H_TIME, desc: "Çalışma süresi.", find: "Gün × saat. Yıl = 8760 h." }),
      { id: "k", sym: "k", name: "Birim fiyat", de: "Arbeitspreis", units: U_EUR_KWH, desc: "Bir kWh'in fiyatı.", find: "Elektrik faturası (ct/kWh)." },
    ],
    base: "K",
    forms: {
      K: mul(v("P"), v("t"), v("k")),
      t: frac(v("K"), mul(v("P"), v("k"))),
      P: frac(v("K"), mul(v("t"), v("k"))),
      k: frac(v("K"), mul(v("P"), v("t"))),
    },
    keywords: ["energiekosten", "stromkosten", "maliyet", "kwh", "fatura"],
  },
  {
    id: "gleichzeitigkeit",
    cat: "gebaeude",
    title: "Eş Zamanlılık Faktörü",
    tagline: "P_max = g · ΣP — her şey aynı anda açılmaz (umarız).",
    desc: "Bir binadaki tüm cihazların gücü toplanırsa absürt bir rakam çıkar; ama fırın, çamaşır makinesi, ısıtıcı ve kaynak makinesi aynı anda tam güçte çalışmaz. Eş zamanlılık faktörü g, gerçekte beklenen en yüksek gücü verir. Ana hat ve sayaç sigortası buna göre boyutlandırılır.",
    note: "Konutlarda g çoğunlukla 0,3–0,6. Daire sayısı arttıkça g düşer (DIN 18015-1 eğrileri).",
    vars: [
      vP({ id: "Pmax", sub: "max", name: "Beklenen en yüksek güç", de: "gleichzeitig benötigte Leistung", desc: "Aynı anda çekilmesi beklenen güç.", find: "Bu formülle hesaplanır." }),
      { id: "g", sym: "g", name: "Eş zamanlılık faktörü", de: "Gleichzeitigkeitsfaktor", unitNote: "birimsiz · 0 ile 1 arası", desc: "Kurulu gücün ne kadarının aynı anda çalıştığı.", find: "Normlar / deneyim değerleri (DIN 18015)." },
      vP({ id: "Pi", sub: "inst", name: "Kurulu toplam güç", de: "installierte Leistung", desc: "Tüm cihazların toplam gücü.", find: "Cihaz listesi topla." }),
    ],
    base: "Pmax",
    forms: {
      Pmax: mul(v("g"), v("Pi")),
      g: frac(v("Pmax"), v("Pi")),
      Pi: frac(v("Pmax"), v("g")),
    },
    keywords: ["gleichzeitigkeitsfaktor", "eş zamanlılık", "hausanschluss", "leistungsbedarf"],
  },
  {
    id: "aufheizzeit",
    cat: "gebaeude",
    title: "Su Isıtma Süresi",
    tagline: "t = m · c · Δϑ / (P · η) — boylerin sabır testi.",
    desc: "Boylerdeki suyu ısıtmak için gereken enerji m·c·Δϑ'dır; ısıtıcı gücüne (ve verime) bölünce süre çıkar. Su için c = 1,163 Wh/(kg·K): bir litre suyu 1 derece ısıtmak ~1,16 Wh ister. 80 litreyi 10'dan 60 °C'ye 2 kW ile ısıtmak ~2,5 saat sürer — sabah duşunu planlarken işe yarar.",
    vars: [
      vT({ units: U_H_TIME, name: "Isıtma süresi", de: "Aufheizzeit", desc: "Hedef sıcaklığa ulaşma süresi.", find: "Bu formülle hesaplanır." }),
      { id: "m", sym: "m", name: "Su kütlesi", de: "Masse des Wassers", units: U_KG, desc: "Isıtılacak su miktarı (1 litre ≈ 1 kg).", find: "Boyler hacmi." },
      { id: "c", sym: "c", name: "Özgül ısı", de: "spezifische Wärmekapazität", units: U_C_SPEC, desc: "Su için 1,163 Wh/(kg·K).", find: "Su: 1,163 — tablolardan." },
      { id: "dt", sym: "Δϑ", name: "Sıcaklık farkı", de: "Temperaturdifferenz", units: U_K, desc: "Son sıcaklık − ilk sıcaklık.", find: "Ör. 60 °C − 10 °C = 50 K." },
      vP({ units: U_W, desc: "Isıtıcının elektrik gücü.", find: "Tip etiketi." }),
      vEta({ desc: "Isıtma verimi (boylerde ~0,95).", find: "Veri sayfası; bilinmiyorsa 0,9–0,95." }),
    ],
    base: "t",
    forms: {
      t: frac(mul(v("m"), v("c"), v("dt")), mul(v("P"), v("eta"))),
      P: frac(mul(v("m"), v("c"), v("dt")), mul(v("t"), v("eta"))),
      m: frac(mul(v("t"), v("P"), v("eta")), mul(v("c"), v("dt"))),
      dt: frac(mul(v("t"), v("P"), v("eta")), mul(v("m"), v("c"))),
    },
    keywords: ["aufheizzeit", "warmwasser", "boyler", "wärmemenge", "speicher"],
  },
  {
    id: "pv-ertrag",
    cat: "gebaeude",
    title: "Güneş Paneli Yıllık Üretimi",
    tagline: "W = P_peak · y — kWp çarpı güneşin cömertliği.",
    desc: "PV sisteminin gücü kWp (kilowatt-peak) olarak verilir: standart test koşullarında (1000 W/m², 25 °C) verdiği güç. Yıllık üretimi bulmak için bunu bölgenin özgül verimiyle (kWh/kWp) çarp. Almanya'da güneye bakan bir çatıda yaklaşık 900–1100 kWh/kWp — yani 10 kWp'lik sistem yılda ~10.000 kWh.",
    vars: [
      { id: "W", sym: "W", name: "Yıllık üretim", de: "Jahresertrag", units: U_KWH, desc: "Bir yılda üretilen enerji.", find: "Bu formülle tahmin edilir; inverter ekranında gerçek değer." },
      { id: "Pp", sym: "P", sub: "peak", name: "Tepe güç", de: "Spitzenleistung (kWp)", units: U_KWP, desc: "Panellerin toplam STC gücü.", find: "Panel adedi × panel gücü (ör. 24 × 420 Wp = 10 kWp)." },
      { id: "y", sym: "y", name: "Özgül verim", de: "spezifischer Ertrag", units: U_YIELD, desc: "Konum, yön ve eğime bağlı yıllık verim.", find: "Güneş haritaları / PVGIS. Almanya ≈ 950 kWh/kWp." },
    ],
    base: "W",
    forms: {
      W: mul(v("Pp"), v("y")),
      Pp: frac(v("W"), v("y")),
      y: frac(v("W"), v("Pp")),
    },
    keywords: ["photovoltaik", "pv", "kwp", "ertrag", "güneş", "solar"],
  },
];
