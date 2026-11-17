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
  and: "UND (&): bütün girişler 1 ise çıkış 1. Seri kontakların elektronik ruh ikizi. Presin iki el butonu: ikisi birden basılı değilse inmez.",
  or: "ODER (≥1): girişlerden HERHANGİ biri 1 ise çıkış 1. Paralel kontaklar. Kapı zili: alt kapı da üst kapı da çaldırır.",
  not: "NICHT: girişi ters çevirir. Öffner'in elektronik hali. Çıkıştaki yuvarlak = 'değil' şapkası.",
  nand: "NAND: UND + değil. Üniversal kapı — sadece NAND'lerle her devre kurulabilir; elektroniğin İsviçre çakısı.",
  nor: "NOR: ODER + değil. İki NOR'u çaprazlarsan RS-Flipflop olur — Selbsthaltung'un dijital dedesi. Dene!",
  xor: "XOR / Antivalenz (=1): girişler FARKLIYSA 1. Koridordaki iki Wechselschalter tam olarak budur.",
};
