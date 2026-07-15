# OHM MY GOD ⚡

Elektrik Ausbildung'u için interaktif formül ve bilgi üssü. Formüle tıkla, istediğin büyüklük
için kendini yeniden yazsın (Umstellen), değerleri gir, sonucu al.

## Özellikler

- **İnteraktif formüller** — denklemdeki herhangi bir büyüklüğe tıkla; formül animasyonla o
  büyüklük için çözülür (token'lar `motion` layoutId ile yeni yerlerine süzülür).
- **Her değişkenin kimliği var** — ne olduğu, birimi, Almanca terimi ve "nereden bulurum?"
  açıklaması, tıklayınca panelde belirir.
- **Yerleşik hesap makinesi** — kalan değerleri gir (virgül de nokta da olur), birim seç
  (mV/V/kV, s/min/h, kWh…), sonuç en okunaklı birimle gelir.
- **Konu rehberleri** — Netzsysteme, RCD/FI, LS karakteristikleri, Schutzklassen,
  Schutzmaßnahmen… profesyonel içerik, ironik anlatım. Netzsysteme'de her sistem için
  übersicht şeması var (trafo → Erdung → PEN ayrım noktası → cihaz).
- **🎛️ Playground** — sürükle-bırak devre kurucu + gerçek zamanlı simülasyon:
  şalterler, butonlar, lambalar, motorlar, kontaktörler (Schütz) ve zaman röleleri.
  Akımın hangi hattan geçtiği animasyonla gösterilir; kısa devre ve röle kararsızlığı
  (flatter) tespiti vardır. Hazır devreler: Selbsthaltung, Verriegelung, Zeitrelais…
  Kablolar A* ile parçaların etrafından otomatik dolanır; istersen köşe noktaları
  koyarak kendi yolunu çizersin. Knotenpunkt ile dallanma/köprü (çift tık = böl),
  zoom (+/−) ve sağ-tık-sürükle ile pan, aç/kapa yapılabilen kaynaklar (yatay + dikey ray).
- **Büyüklük bazlı arama** — ana sayfada "hangi değeri arıyorsun?": `Frequenz`, `f`,
  `Hz`, `Volt`… yaz ya da chip tablosundan seç; o büyüklüğü içeren tüm formüller kart
  feed'i olarak gelir (hangi değişkenle eşleştiği rozetle gösterilir).

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tip kontrolü + prod build (dist/)
```

## Mimari

- **Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 + motion (Framer Motion) + React Router
- `src/lib/expr.ts` — formül ifade ağacı (AST): tanım hem ekrana çizilir hem hesaplanır.
- `src/components/Equation.tsx` — AST'yi matematik dizgisiyle çizer; değişken token'ları
  `layoutId` taşıdığı için form değişince morph animasyonu kendiliğinden olur.
- `src/data/f-*.ts` — formül tanımları. Her formülün `forms` alanında, çözülebilen her
  değişken için elle türetilmiş (dolayısıyla garantili doğru) form bulunur.
- `src/data/vars.ts` — ortak değişken tanımları (açıklama + birim seçenekleri), formüller
- 
  bunları özelleştirerek kullanır.
- `src/playground/` — devre simülatörü. `sim.ts` devreyi iletkenlik ağı olarak kurar
  (kablolar/kapalı kontaklar G=10⁴, yükler G=1), Gauss eliminasyonuyla düğüm gerilimlerini
  çözer ve bobin durumları sabitlenene kadar yineler (Selbsthaltung bu sayede çalışır).
  Kısa devre = kaynaktan çekilen etkin iletkenlik eşiği. Yeni parça eklemek için:
  `types.ts`'e tip + SPEC, `parts.tsx`'e sembol, gerekiyorsa `sim.ts`'te davranış.
- `src/components/NetzDiagram.tsx` — TN-C / TN-S / TN-C-S / TT / IT übersicht şemaları;
  konu bölümlerine `diagram` alanıyla bağlanır.

## Yeni formül eklemek

Eğer aradığınız formül yoksa, 'istek/yardım kısmından istediğiniz formülü/konuyu bana yazabilirsiniz'.

Formu olmayan değişkene tıklanınca site kibarca "bu kart bunun için çözmüyor" der — yani
kısmi tanımlar da geçerlidir.

## Yol haritası

Almanca/İngilizce çeviri · AI asistan · Netzwerk konuları · interaktif sembol kütüphanesi ·
Verlegearten tabloları · quiz modu · katkı sistemi.

> Bu site bir hobi/öğrenme projesidir; bağlayıcı teknik doküman değildir. Gerçek tesisatta
> normlar (VDE) ve ustan konuşur.
