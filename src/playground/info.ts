import type { PartType } from "./types";

// Parça açıklamaları: Playground özellik panelinde ve "Devre Sembolleri" konusunda gösterilir.
export const PART_INFO: Record<PartType, string> = {
  source:
    "Gerilim kaynağı (şebeke). Gerilimi panelden değiştir; simülasyonda üzerine tıklayarak aç/kapa.",
  source2:
    "Dikey kaynak: L üstte, N altta. Panelden veya simülasyonda tıklayarak aktif/deaktif edilebilir.",
  rail_l: "L rayı (Sammelschiene): fiziksel modda faz, Logik modunda mantık 1. Sabittir, silinmez.",
  rail_n: "N rayı: dönüş / mantık 0. Devrenin bittiği yer.",
  node: "Knotenpunkt: kablo dallanma noktası. Kablo çekerken boş alana tıklayınca otomatik oluşur; buradan istediğin kadar kol ayır.",
  switch_no:
    "Kalıcı şalter, kapayıcı (Schließer). Simülasyonda tıkla: konum değiştirir ve orada kalır.",
  switch_nc: "Kalıcı şalter, açıcı (Öffner). Normalde KAPALI, tıklayınca açar.",
  taster_no:
    "Yaylı buton, kapayıcı (Taster). Sadece BASILI TUTTUĞUN sürece kapalı — zil butonu mantığı.",
  taster_nc:
    "Yaylı buton, açıcı. Normalde kapalı, bastığın sürece açık. Acil stoplar bu yüzden hep açıcıdır.",
  pairc_no:
    "Eş kontak (kapayıcı): panelden seçtiğin şalterin/butonun İKİNCİ kontağı. Aynı düğmeye basınca bu da onunla birlikte hareket eder. Her düğmenin 1 kapayıcı + 1 açıcı eş kontağı olabilir — gerçek düğmede daha fazlasına yer yok 😄",
  pairc_nc:
    "Eş kontak (açıcı): seçtiğin düğme basılınca BU AÇILIR. Tasterverriegelung'un anahtarı: S1'in açıcısını S2'nin yoluna koy, ikisi aynı anda çalışamasın. Turkuaz kesik çizgi = mekanik bağ işareti.",
  lamp: "Lamba (H). Tam gerilimde parlar, seri bölünmüş gerilimde loş yanar. Logik modunda: giriş 1 ise yanar.",
  motor: "Motor (M). Tam gerilim alınca döner (mavi ışıma), yarım gerilimde 'zayıf!' diye sızlanır.",
  coil: "Kontaktör bobini (Schütz, K). A1–A2 gerilim görünce çeker ve aynı etiketli TÜM kontakları oynatır.",
  contact_no: "Kontaktör kontağı, kapayıcı. Panelden hangi bobini (K1…) takip edeceğini seç.",
  contact_nc: "Kontaktör kontağı, açıcı. Bobin çekince AÇILIR — kilitleme (Verriegelung) bununla yapılır.",
  tcoil:
    "Zaman rölesi (KT). Panelden modunu seç: EIN-verzögert (çekmede gecikme), AUS-verzögert (bırakmada gecikme), IMPULS (tek darbe), TAKT (yanıp sönme). Süre de ayarlanır.",
  tcontact_no: "Zaman kontağı, kapayıcı: bağlı rölenin moduna göre hareket eder. Yarım daire = zaman işareti.",
  tcontact_nc: "Zaman kontağı, açıcı: röle 'aktif' sayıldığında açılır.",
  contact_co:
    "Wechsler (11-12-14): ortak uç 11 bobin düşükken 12'ye, bobin çekince 14'e bağlanır. Tek kontakla iki yolu birden yönetir — 'ya şu ya bu' kontağı.",
  relay_ss:
    "Darbe rölesi (Stromstoßrelais / Eltako): her kısa darbede konum değiştirir ve orada kalır. Koridordaki 5 butondan hangisine basarsan bas lamba aç/kapa — kablo yığını yerine tek röle. Kontakları panelden onu seçerek bağla.",
  ol_nc:
    "Motor koruma rölesinin açıcı kontağı (95-96). Motor aşırı akım çekip termik röle (F) atınca AÇILIR ve kontaktörün bobinini düşürür. Kumanda devresine, durdurma butonuyla seri koy.",
  ol_no: "Motor koruma rölesinin kapayıcı kontağı (97-98): röle atınca kapanır. Genelde 'arıza' ikaz lambası buna bağlanır.",
  led: "LED (Leuchtdiode). Rengini panelden seç. Az akımla parlak ışık; gerçekte ön direnç ister ve yönü önemlidir — burada şebeke dostu bir LED lamba gibi davranır.",
  fluo:
    "Floresan lamba (Leuchtstofflampe). Açılınca starter yüzünden birkaç kez titrer, sonra sabit yanar — ofis tavanlarının klasik açılış dansı.",
  netz3:
    "Trifaze şebeke: L1, L2, L3 aralarında 120° kaymalı, her biri N'ye karşı 230 V, birbirine karşı 400 V. Laststromkreis buradan beslenir. Simülasyonda tıkla: şebekeyi kes/aç.",
  q3: "Motor koruma şalteri / ana şalter (Q, 3 kutup). Baştan devrede; simülasyonda tıklayınca üç fazı birden keser. Sembolde I> = kısa devre korumalı.",
  contact3:
    "Kontaktörün ana kontakları (1-2, 3-4, 5-6). Kumanda devresindeki aynı etiketli bobin (K1…) çekince üç kutup birden kapanır. Panelden hangi bobine ait olduğunu seç.",
  ol3: "Motor koruma rölesi (F, bimetal). Ana akım içinden geçer; aşırı yükte bimetaller bükülür ve yardımcı kontakları (95-96 / 97-98) oynatır. Simülasyonda TIKLA = aşırı yük, tekrar tıkla = reset.",
  motor3:
    "Trifaze asenkron motor, 6 uçlu klemens (U1 V1 W1 / U2 V2 W2). Klemens köprüsünü panelden seç: yıldız (Y, sargı başına 230 V) ya da üçgen (Δ, 400 V). Stern-Dreieck için köprüsüz bırak, köprüyü kontaktörler kursun. İki fazı çaprazlarsan ters döner; bir faz eksikse vınlar ama dönmez.",
  bus_l:
    "Üst ray: L (elektrikte faz) ya da +U (elektronikte). Tıkla → özelliklerden gerilim, AC/DC ve frekans ayarlanır. İçinde 16 A'lik bir LS var: kısa devrede atar, simülasyonda üstüne tıklayınca yeniden kurulur.",
  bus_n: "Alt ray: N / 0 V (toprak referansı). Devreler L'den başlar, buraya dönerek biter.",
  fuse:
    "Sigorta / LS-Schalter. Anma akımını ve karakteristiği seç: B (5× anında), C (10×), eriyen telli gG ya da hızlı cam sigorta F. Aşırı akımda ısınıp atar; simülasyonda tıkla = yenisini tak.",
  heater: "Isıtıcı direnç (Heizwiderstand). Anma gerilimi ve gücü ayarlanır; ısındıkça kızarır. Çok yüksek gerilimde teli kopar.",
  res: "Direnç. Değeri (4,7k, 220, 1M …) ve güç değeri (W) ayarlanır. Gücünün üstünde zorlarsan ısınır, 350 °C'yi geçince duman çıkarır ve açık devre olur. Elektronikçi kokusu.",
  pot: "Potansiyometre: üç uçlu ayarlı direnç. Sürgüyü özelliklerden kaydır — simülasyon çalışırken de. Gerilim bölücü, ses ayarı, LED kısma.",
  cap: "Kondansatör. Gerilimin değişmesine direnir: yük depolar, AC'yi geçirir DC'yi tutar. Dayanım geriliminin üstüne çıkarsan delinir.",
  ecap: "Elektrolitik kondansatör (Elko). Büyük kapasite, ama kutuplu: + ucu daha pozitif olmalı. Ters bağlarsan ya da gerilimini aşarsan… 💥 Doğrultucu çıkışında filtre olarak kullanılır.",
  ind: "Bobin / şok bobini. Akımın değişmesine direnir. DC'de kısa devre gibidir, AC'de frekansla artan direnç (X_L) gösterir.",
  diode: "Diyot (1N4007). Akımı tek yönde geçirir: anottan (üst) katoda (alt, çizgili uç). İletimde ~0,7 V düşer. Ters bağlarsan kapıyı kapatır.",
  zener: "Zener diyot. Ters yönde Vz geriliminde 'bırakır' ve gerilimi sabit tutar — basit gerilim sabitleyici. Seri direnç unutulursa yanar.",
  led_d: "LED (ışık yayan diyot). İletim gerilimi ~2 V, akımı ~20 mA. Ön direnç şart: 12 V'a direkt bağlarsan ilk ve son kez parlar. Rengi ve değerleri ayarlanır.",
  bridge: "Köprü doğrultucu (B2U, 4 diyot). İki ~ ucuna AC girer, + ve − uçlarından titreşimli DC çıkar. Arkasına Elko koy, düzelsin.",
  npn: "NPN transistör (BC547). Tabana (B) küçük bir akım verince kolektörden (C) emitere (E) β kat büyük akım akar — elektronik anahtar ve yükselteç. Taban direnci unutma.",
  pnp: "PNP transistör: NPN'in ayna görüntüsü. Emiter + tarafta; taban emitere göre NEGATİF olunca iletir.",
  nmos: "N-kanallı MOSFET. Kapıya (G) eşik geriliminin üstünde gerilim verince D–S arası iletir; kapı akım çekmez. Büyük yükleri anahtarlamanın modern yolu.",
  reg: "Gerilim regülatörü (78xx). Girişe en az Uo + 2 V ver, çıkışta sabit Uo al. Fark ısıya dönüşür: soğutucusuz çok yüklersen ısınır ve kendini kapatır (termik koruma).",
  xfmr: "Trafo. Primer ve sekonder gerilimini (ör. 230 V / 12 V) ve gücü ayarla. Sadece AC ile çalışır — DC verirsen primer kısa devre gibi davranır ve sigorta atar.",
  opamp: "İşlemsel yükselteç (op-amp). Çıkış, (+) ve (−) girişleri arasındaki farkı on binlerce kez yükseltir; besleme (V+ / V−) sınırlarına dayanır. Karşılaştırıcı, yükselteç, filtre.",
  mcu: "Mikrodenetleyici (Arduino tarzı). VCC (≥ 3,5 V) ve GND bağla, programı seç: yanıp sönme, buton, yürüyen ışık, trafik lambası, PWM, eşik. Pin çıkışları ~25 Ω iç dirençlidir — LED'e ön direnç yine şart.",
  fgen: "Sinyal üreteci: sinüs, kare, üçgen ya da DC. Genlik ve frekansı simülasyon sırasında da değiştir; ölçü aletiyle osiloskop izini izle.",
  ldr: "LDR (fotodirenç). Işık arttıkça direnci düşer. Işık seviyesini özelliklerden kaydır — alacakaranlık şalteri yapmak için birebir.",
  ntc: "NTC (sıcaklıkla direnci düşen direnç). Sıcaklığı özelliklerden kaydır. Termostat ve sıcaklık ölçümü devrelerinin klasiği.",
  dcmotor: "DC motor. Gerilimle hızlanır, ters bağlarsan ters döner. Kalkışta ve sıkışınca çok akım çeker; uzun süre zorlanırsa yanar.",
  and: "UND (&): bütün girişler 1 ise çıkış 1. Seri kontakların elektronik ruh ikizi. Presin iki el butonu: ikisi birden basılı değilse inmez.",
  or: "ODER (≥1): girişlerden HERHANGİ biri 1 ise çıkış 1. Paralel kontaklar. Kapı zili: alt kapı da üst kapı da çaldırır.",
  not: "NICHT: girişi ters çevirir. Öffner'in elektronik hali. Çıkıştaki yuvarlak = 'değil' şapkası.",
  nand: "NAND: UND + değil. Üniversal kapı — sadece NAND'lerle her devre kurulabilir; elektroniğin İsviçre çakısı.",
  nor: "NOR: ODER + değil. İki NOR'u çaprazlarsan RS-Flipflop olur — Selbsthaltung'un dijital dedesi. Dene!",
  xor: "XOR / Antivalenz (=1): girişler FARKLIYSA 1. Koridordaki iki Wechselschalter tam olarak budur.",
};
