// İngilizce içerik çevirileri. Anahtar = Türkçe kaynak metin (src/data, src/playground).
// Kaynak metin değişirse anahtar da güncellenmeli — `npm run i18n:check` eksik/eskimiş satırları listeler.
const dict: Record<string, string> = {
  "Temeller":
    "Basics",
  "Ohm kanunu, iş, yük — her şeyin başladığı yer. Bunlar oturmadan gerisi Jenga.":
    "Ohm's law, work, charge — where everything begins. Until these sit firmly, the rest is Jenga.",
  "Direnç":
    "Resistance",
  "İletken direnci, Leitwert ve sıcaklığın dirençle imtihanı.":
    "Conductor resistance, conductance (Leitwert) and what temperature does to a resistor.",
  "Seri Devre":
    "Series Circuit",
  "Tek sıra halinde: akım sabit, gerilim paylaştırılır, dirençler toplanır.":
    "Single file: the current stays the same, the voltage is shared out, the resistances add up.",
  "Paralel Devre":
    "Parallel Circuit",
  "Yollar çoğalır: gerilim sabit, akım bölüşülür, toplam direnç küçülür.":
    "More paths: the voltage stays the same, the current splits, the total resistance shrinks.",
  "Karma Devre":
    "Mixed Circuit",
  "Seri + paralel karışımı. Formülü yok, stratejisi var — sadeleştire sadeleştire çöz.":
    "A mix of series and parallel. No formula, but a strategy — simplify, simplify, solve.",
  "Kötü haber: Gruppenschaltung'un tek satırlık bir formülü yok. İyi haber: yeni bir şey öğrenmene de gerek yok — seri ve paralel kurallarını sırayla uygulamak yetiyor.":
    "Bad news: there is no one-line formula for a Gruppenschaltung (mixed circuit). Good news: there is nothing new to learn either — applying the series and parallel rules one after another is all it takes.",
  "Strateji şu: devrenin en içindeki, net olarak 'bunlar kesin paralel' ya da 'bunlar kesin seri' dediğin grubu bul. Onu tek bir eşdeğer dirence indir. Devreyi yeniden çiz (evet, gerçekten çiz — kafada tutmaya çalışanların anıtı her okulda vardır). Şimdi devre biraz sadeleşti; aynı işlemi tekrarla. Soğan soymak gibi: katman katman, ta ki elinde tek bir R_ges kalana kadar.":
    "Here is the strategy: find the innermost group where you can say for sure 'these are definitely in parallel' or 'these are definitely in series'. Reduce it to a single equivalent resistance. Redraw the circuit (yes, actually draw it — every school has a memorial to those who tried to keep it in their head). The circuit is now a bit simpler; repeat. Like peeling an onion: layer by layer, until a single R_ges (total resistance) is left in your hand.",
  "Sonra istersen geri sar: R_ges ve kaynak geriliminden toplam akımı bul (Ohm kanunu kartı hazır bekliyor), akımı ve gerilimleri katmanları geri açarak dağıt. Her adımda kullandığın formüller bu sitede zaten var — Seri Devre ve Paralel Devre kategorilerindeki kartlar senin alet çantan.":
    "Then rewind if you like: get the total current from R_ges and the source voltage (the Ohm's law card is waiting), and distribute currents and voltages by opening the layers back up. Every formula you need along the way is already on this site — the cards in the Series Circuit and Parallel Circuit categories are your toolbox.",
  "Pro ipucu: hangi elemanların paralel olduğunu anlamanın en sağlam yolu düğüm noktalarını (Knoten) işaretlemek. İki eleman aynı iki düğüm arasındaysa paraleldir — çizimde yan yana durmaları hiçbir şey ifade etmez. Şema çizerler bunu bilerek yapıyor, eminiz.":
    "Pro tip: the most reliable way to see which components are in parallel is to mark the nodes (Knoten). Two components are in parallel if they sit between the same two nodes — being drawn side by side means nothing at all. We're fairly sure the people who draw schematics do that on purpose.",
  "Güç":
    "Power",
  "P = U·I ailesi: gücün üç kılığı ve kabloların neden ısındığı.":
    "The P = U·I family: the three disguises of power, and why cables get warm.",
  "Verim":
    "Efficiency",
  "Giren, çıkan ve yolda ısıya dönüşen. η daima < 1; itirazlar termodinamiğe.":
    "What goes in, what comes out, and what turns into heat on the way. η is always < 1; complaints go to thermodynamics.",
  "Motorlar":
    "Motors",
  "Moment, senkron devir, kayma — dönen demirin matematiği.":
    "Torque, synchronous speed, slip — the mathematics of spinning iron.",
  "Alternatif Akım":
    "Alternating Current",
  "Tepe değer, periyot, açısal frekans: sinüsün kimlik bilgileri.":
    "Peak value, period, angular frequency: the sine wave's ID card.",
  "Bobin & Kondansatör":
    "Inductor & Capacitor",
  "X_L ve X_C: frekansla dans eden dirençler. Biri artarken öteki azalır.":
    "X_L and X_C: resistances that dance with the frequency. When one goes up, the other goes down.",
  "Trifaze":
    "Three-Phase",
  "Yıldız, üçgen, √3 ve 400 V dünyası. Endüstrinin ana dili.":
    "Star, delta, √3 and the world of 400 V. The native language of industry.",
  "Trafolar":
    "Transformers",
  "Sarım oranları ve güç dengesi: gerilimi büyüt, akımı küçült — ya da tersi.":
    "Turns ratios and power balance: raise the voltage, lower the current — or the other way round.",
  "Güç Türleri":
    "Types of Power",
  "P, Q, S ve güç üçgeni. Pisagor'un elektrikçi stajı.":
    "P, Q, S and the power triangle. Pythagoras doing his electrician's internship.",
  "Gerilim Düşümü & Kesit":
    "Voltage Drop & Cross-Section",
  "Kablo hesabının kalbi: düşümü hesapla, kesiti seç, %3'ü geçme.":
    "The heart of cable sizing: calculate the drop, choose the cross-section, stay under 3 %.",
  "Ohm Kanunu":
    "Ohm's Law",
  "Elektriğin anayasası. Gerisi detay.":
    "The constitution of electricity. Everything else is detail.",
  "Gerilim, akım ve direnç arasındaki kutsal üçgen: U = R · I. Bir devrede bu üçünden ikisini biliyorsan üçüncüsü kaçamaz. Georg Simon Ohm bunu 1827'de yayınladığında kimse ciddiye almadı; şimdi onsuz priz bile takamıyoruz. Formüldeki herhangi bir büyüklüğe tıkla — formül senin için onu yalnız bıraksın.":
    "The holy triangle of voltage, current and resistance: U = R · I. If you know two of the three in a circuit, the third has nowhere to hide. When Georg Simon Ohm published this in 1827, nobody took him seriously; today we can't even fit a socket without it. Click any quantity in the formula — it will isolate that quantity for you.",
  "Birimlere dikkat: mA girdiysen sonucu kΩ'da düşünmen gerekebilir. Neyse ki birim seçicilerimiz var — biz düşündük, sen yaşa.":
    "Watch the units: if you entered mA, you may need to think of the result in kΩ. Luckily there are unit selectors — we did the thinking, you get on with life.",
  "Gerilim":
    "Voltage",
  "Elektronları harekete zorlayan 'itiş'. Su borusundaki basınç gibi: basınç yoksa akış da yok, gerilim yoksa akım da yok.":
    "The 'push' that forces electrons to move. Like pressure in a water pipe: no pressure, no flow; no voltage, no current.",
  "Multimetreyle ölçülür — uçlar ölçülecek iki noktaya PARALEL bağlanır. Çoğu zaman zaten bellidir: priz 230 V, trifaze 400 V, ya da tip etiketinde / görev metninde yazar.":
    "Measured with a multimeter — the probes are connected IN PARALLEL across the two points. Most of the time it's known anyway: socket 230 V, three-phase 400 V, or it's on the rating plate or in the exercise text.",
  "Akıma 'dur bakalım, öyle kolay geçemezsin' diyen büyüklük. Her şeyin bir direnci var — kabloların, insanların, pazartesi sabahlarının.":
    "The quantity that tells the current 'hold on, you're not getting through that easily'. Everything has resistance — cables, people, Monday mornings.",
  "Ohmmetreyle GERİLİMSİZ devrede ölçülür (yoksa ölçtüğün direnç değil, multimetrenin son anıları olur), dirençlerde renk kodundan okunur ya da şemada yazar.":
    "Measured with an ohmmeter on a DE-ENERGISED circuit (otherwise you're not measuring resistance, you're recording your multimeter's last memories), read from the colour code on resistors, or given in the schematic.",
  "Akım":
    "Current",
  "Bir noktadan saniyede geçen yük miktarı; elektron trafiğinin yoğunluğu. Isıtan, çarpan ve sigorta attıran şey budur.":
    "The amount of charge passing a point per second; the density of electron traffic. This is what heats, shocks and trips the breaker.",
  "Ampermetre devreye SERİ bağlanır (devreyi kesip araya girersin) ya da pens ampermetreyle kablonun etrafından tembelce ölçülür. Tip etiketinde de yazar.":
    "An ammeter is connected IN SERIES (you open the circuit and go in between), or you measure lazily around the cable with a clamp meter. It's also on the rating plate.",
  "Elektriksel İş":
    "Electrical Work",
  "Faturanın matematiksel itirafı: W = P · t":
    "The mathematical confession of your bill: W = P · t",
  "Enerji = güç × zaman. 2 kW'lık ısıtıcıyı 3 saat çalıştırırsan 6 kWh yakarsın; sayaç döner, sen ödersin. Güç anlık 'hız', iş ise kat edilen toplam 'mesafe'dir. Sınavlarda en sevilen tuzak: saati saniyeye, kW'ı W'a çevirmeyi unutturmak.":
    "Energy = power × time. Run a 2 kW heater for 3 hours and you burn 6 kWh; the meter spins, you pay. Power is the instantaneous 'speed', work is the total 'distance' covered. The favourite exam trap: making you forget to convert hours to seconds and kW to W.",
  "1 kWh = 3,6 MJ = 3.600.000 Ws. Birim seçiciden kWh seçersen çevirmeyle uğraşmazsın.":
    "1 kWh = 3.6 MJ = 3,600,000 Ws. Pick kWh in the unit selector and you can skip the conversion.",
  "İş / Enerji":
    "Work / Energy",
  "Harcanan (ya da üretilen) toplam enerji. Güç bir hızsa, iş kat edilen mesafedir. Faturada kWh olarak karşına çıkar.":
    "The total energy consumed (or generated). If power is a speed, work is the distance covered. It shows up on your bill in kWh.",
  "Elektrik sayacından okunur ya da P·t ile hesaplanır. 1 kWh = 3,6 MJ — sınavda birim tuzağına düşme.":
    "Read from the electricity meter or calculated with P·t. 1 kWh = 3.6 MJ — don't fall into the unit trap in the exam.",
  "Cihazın çektiği güç. Tip etiketindeki değer — ısıtıcılarda kocaman, LED'de utangaç.":
    "The power the device draws. The value on the rating plate — huge on heaters, shy on LEDs.",
  "İlk bakılacak yer cihazın tip etiketi (Typenschild). Orada yoksa U ve I'dan hesaplanır. Görevlerde genelde verilir.":
    "First place to look: the device's rating plate (Typenschild). If it's not there, calculate it from U and I. In exercises it's usually given.",
  "Zaman":
    "Time",
  "Evrendeki tek yön bildiren büyüklük. Formülde saniye cinsinden çalışır ama biz sana min/h seçeneği de koyduk, hesap makinesi değiliz… dur, tam olarak oyuz.":
    "The only quantity in the universe that insists on a direction. The formula works in seconds, but we added min/h options for you — we're not a pocket calculator… wait, that's exactly what we are.",
  "Kronometre, saat ya da görev metni. 'Günde 3 saat çalışıyor' tarzı cümlelerde saklanır.":
    "A stopwatch, a clock or the exercise text. It hides in sentences like 'runs 3 hours a day'.",
  "Elektrik Yükü":
    "Electric Charge",
  "Q = I · t — pilin 'deposunda' ne var?":
    "Q = I · t — what's in the battery's 'tank'?",
  "Yük = akım × zaman. 1 saniyede 1 amper akarsa 1 coulomb (1 As) yük geçmiş demektir. Akülerdeki 'Ah' (amper-saat) tam olarak bu: 50 Ah'lik akü, 50 saat boyunca 1 A verebilir — ya da 1 saat boyunca 50 A, tercih senin (akünün değil).":
    "Charge = current × time. If 1 ampere flows for 1 second, 1 coulomb (1 As) of charge has passed. The 'Ah' (ampere-hours) on batteries is exactly this: a 50 Ah battery can deliver 1 A for 50 hours — or 50 A for 1 hour, your choice (not the battery's).",
  "Elektrik yükü":
    "Electric charge",
  "Geçen toplam elektron miktarının ölçüsü. Birimi Coulomb (C) = amper-saniye (As). Pil/akü kapasitesi olarak Ah cinsinden karşına çıkar.":
    "A measure of the total amount of electrons that passed. Its unit is the coulomb (C) = ampere-second (As). As battery capacity you'll meet it in Ah.",
  "Akü etiketinde Ah olarak yazar. Hesapta I·t'den çıkar.":
    "Printed on the battery label in Ah. In calculations it comes from I·t.",
  "İletken Direnci":
    "Conductor Resistance",
  "Kablo da bir dirençtir — sadece bunu itiraf etmez.":
    "A cable is a resistor too — it just won't admit it.",
  "Bir iletkenin direnci malzemesine (ρ), uzunluğuna (l) ve kesitine (A) bağlıdır: R = ρ·l / A. Uzun ve ince kablo = çok direnç; kısa ve kalın kablo = az direnç. Bahçe hortumuyla aynı mantık: uzadıkça ve inceldikçe su gelmez olur.":
    "The resistance of a conductor depends on its material (ρ), its length (l) and its cross-section (A): R = ρ·l / A. Long and thin cable = lots of resistance; short and thick cable = little. Same logic as a garden hose: the longer and thinner it gets, the less water arrives.",
  "Birimler bu formülde el ele: ρ [Ω·mm²/m], l [m], A [mm²] → R [Ω]. Hepsini SI'ya çevirmeye kalkma, bu üçlü zaten anlaşmış.":
    "The units in this formula go hand in hand: ρ [Ω·mm²/m], l [m], A [mm²] → R [Ω]. Don't try to convert everything to SI base units; these three have already agreed among themselves.",
  "İletkenin kendi direnci. Kısa devre hesaplarında ve gerilim düşümünde karşına çıkar — kablo masum değil.":
    "The conductor's own resistance. It shows up in short-circuit calculations and in voltage drop — the cable is not innocent.",
  "Öz direnç":
    "Resistivity",
  "Malzemenin karakteri: elektriği ne kadar gönülsüz ilettiği. Bakır 0,0178, alüminyum 0,0278 Ω·mm²/m. (γ iletkenliğin tersi: ρ = 1/γ.)":
    "The character of the material: how reluctantly it conducts electricity. Copper 0.0178, aluminium 0.0278 Ω·mm²/m. (The inverse of the conductivity γ: ρ = 1/γ.)",
  "Tablo kitabından (Tabellenbuch) — ezberleme, bak. Ama bakırınkini yine de ezberlemiş olacaksın, kabullen: 0,0178.":
    "From the table book (Tabellenbuch) — don't memorise, look it up. You'll end up knowing copper's by heart anyway, accept it: 0.0178.",
  "Uzunluk":
    "Length",
  "İletkenin uzunluğu. Gidiş-dönüş hattı hesaplıyorsan toplam tel uzunluğunu al (2·l).":
    "The length of the conductor. If you're calculating an out-and-back line, take the total wire length (2·l).",
  "Projeden okunur ya da şerit metreyle güzergâh boyunca ölçülür (dikkat: kuş uçuşu değil, kablonun gerçek yolu).":
    "Read from the plans or measured along the route with a tape measure (careful: not as the crow flies, but the cable's real path).",
  "Kesit":
    "Cross-section",
  "İletkenin kesit alanı — elektronların otoyolundaki şerit sayısı. Kesit büyüdükçe direnç düşer, cüzdan da hafifler.":
    "The cross-sectional area of the conductor — the number of lanes on the electrons' motorway. As the cross-section grows the resistance drops, and so does the weight of your wallet.",
  "Kablonun üzerinde yazar (ör. NYM-J 3×1,5), projede belirtilir. Standart değerler: 1,5 / 2,5 / 4 / 6 / 10 / 16 mm²…":
    "Printed on the cable (e.g. NYM-J 3×1.5) and specified in the plans. Standard values: 1.5 / 2.5 / 4 / 6 / 10 / 16 mm²…",
  "İletkenlik Değeri":
    "Conductance",
  "G = 1/R — direncin ayna evrendeki ikizi.":
    "G = 1/R — resistance's twin from the mirror universe.",
  "Leitwert (iletkenlik değeri) direncin tersidir. Direnç 'ne kadar zorlanıyor' derken, G 'ne kadar kolay geçiyor' der. Birimi Siemens (S). Paralel devre hesaplarında hayat kurtarır: paralelde G'ler toplanır, R'lerle kesir cambazlığı yapmak zorunda kalmazsın.":
    "Conductance (Leitwert) is the reciprocal of resistance. Where resistance says 'how hard is it', G says 'how easily does it get through'. Its unit is the siemens (S). A lifesaver in parallel circuits: in parallel the G values simply add up, so you don't have to juggle fractions with the R values.",
  "İletkenlik değeri":
    "Conductance",
  "Akımın ne kadar rahat geçtiğinin ölçüsü. Direnç kötümser, Leitwert iyimserdir — aynı gerçeğin iki yüzü.":
    "A measure of how comfortably current gets through. Resistance is the pessimist, conductance the optimist — two faces of the same truth.",
  "Genelde ölçülmez, 1/R'den hesaplanır. Ohmmetrede R'yi ölç, tersini al, bitti.":
    "Usually not measured but calculated from 1/R. Measure R with the ohmmeter, take the reciprocal, done.",
  "Direncin Sıcaklıkla Değişimi":
    "Resistance and Temperature",
  "Direnç de ısınınca huysuzlanır.":
    "Resistance gets grumpy when it heats up, too.",
  "Metal iletkenlerin direnci sıcaklıkla artar: R_w = R_k · (1 + α · Δθ). Soğuk direnç R_k, ısınınca R_w olur. α malzemenin sıcaklık katsayısı (bakır için ≈ 0,0039 1/K). Akkor ampulün soğukken ölçtüğün direncinin çalışırkenkinden neden 10 kat küçük olduğunun cevabı budur.":
    "The resistance of metal conductors rises with temperature: R_w = R_k · (1 + α · Δθ). The cold resistance R_k becomes R_w when warm. α is the material's temperature coefficient (for copper ≈ 0.0039 1/K). This is why the resistance of an incandescent bulb measured cold is about 10 times smaller than when it's lit.",
  "α bakır ve alüminyum için ≈ 0,004 1/K. NTC'lerde işaret tersine döner (ısındıkça direnç DÜŞER) — bu formül metaller içindir.":
    "α ≈ 0.004 1/K for copper and aluminium. With NTCs the sign flips (resistance DROPS as they heat up) — this formula is for metals.",
  "Sıcak direnç":
    "Warm resistance",
  "İletkenin çalışma (sıcak) durumundaki direnci.":
    "The resistance of the conductor in its operating (warm) state.",
  "Çalışma sıcaklığında ölçülür ya da bu formülle hesaplanır.":
    "Measured at operating temperature or calculated with this formula.",
  "Soğuk direnç":
    "Cold resistance",
  "İletkenin başlangıç (genelde 20 °C) sıcaklığındaki direnci.":
    "The resistance of the conductor at its starting temperature (usually 20 °C).",
  "Cihaz soğukken ohmmetreyle ölçülür.":
    "Measured with an ohmmeter while the device is cold.",
  "Sıcaklık katsayısı":
    "Temperature coefficient",
  "Malzemenin sıcaklık başına direnç değiştirme oranı. Bakır/alüminyum ≈ 0,0039–0,004 1/K.":
    "How much the material's resistance changes per degree. Copper/aluminium ≈ 0.0039–0.004 1/K.",
  "Tablo kitabından (Tabellenbuch).":
    "From the table book (Tabellenbuch).",
  "Sıcaklık farkı":
    "Temperature difference",
  "Son sıcaklık − başlangıç sıcaklığı. Kelvin ile °C farkı burada aynıdır (fark alınca birim dansı biter).":
    "Final temperature − starting temperature. A difference in kelvin and in °C is the same here (once you subtract, the unit dance is over).",
  "Termometreyle iki durumu ölç, farkını al.":
    "Measure both states with a thermometer and take the difference.",
  "Seri Devrede Toplam Direnç":
    "Total Resistance in Series",
  "Seri devre: herkes aynı kuyrukta bekler.":
    "Series circuit: everybody waits in the same queue.",
  "Seri bağlı dirençler düz toplama: R_ges = R₁ + R₂ + R₃. Akımın gidecek başka yolu yok, sırayla hepsinin içinden geçmek zorunda — dolayısıyla dirençler üst üste biner. Akım her yerde AYNIDIR (I = sabit), gerilim ise dirençlere paylaştırılır.":
    "Resistors in series simply add up: R_ges = R₁ + R₂ + R₃. The current has no other way to go; it has to pass through all of them in turn — so the resistances stack up. The current is THE SAME everywhere (I = constant), while the voltage is shared out among the resistors.",
  "İki dirençli devre için üçüncü kutuya 0 yaz, kimse alınmaz.":
    "For a circuit with two resistors, type 0 into the third box; nobody will be offended.",
  "Toplam direnç":
    "Total resistance",
  "Devrenin dışarıdan görünen tek eşdeğer direnci. Kaynak, üç direnci ayrı ayrı görmez — tek büyük direnç görür.":
    "The single equivalent resistance the circuit shows to the outside. The source doesn't see three separate resistors — it sees one big one.",
  "Hesapla ya da devre gerilimsizken uçlardan ohmmetreyle ölç.":
    "Calculate it, or measure across the ends with an ohmmeter while the circuit is de-energised.",
  "Seri Devrede Gerilimler":
    "Voltages in Series",
  "Gerilim pastası dilimlere ayrılır — büyük direnç büyük dilim kapar.":
    "The voltage cake is cut into slices — the big resistor grabs the big slice.",
  "Seri devrede kaynak gerilimi, dirençlerin üzerine bölüşülür: U_ges = U₁ + U₂ + U₃ (2. Kirchhoff kanunu / Maschenregel). Her direncin kaptığı pay kendi büyüklüğüyle orantılıdır. Toplam her zaman tutar; tutmuyorsa bir yerde ölçüm hatası ya da unutulmuş bir eleman vardır.":
    "In a series circuit the source voltage is shared out across the resistors: U_ges = U₁ + U₂ + U₃ (Kirchhoff's 2nd law / Maschenregel). Each resistor's share is proportional to its size. The sum always works out; if it doesn't, there's a measurement error or a forgotten component somewhere.",
  "Toplam gerilim":
    "Total voltage",
  "Kaynağın verdiği toplam gerilim — dağıtılacak pasta.":
    "The total voltage supplied by the source — the cake to be shared out.",
  "Kaynağın etiketi ya da uçlarından ölçüm.":
    "The source's label, or a measurement across its terminals.",
  "1. kısmi gerilim":
    "1st partial voltage",
  "2. kısmi gerilim":
    "2nd partial voltage",
  "3. kısmi gerilim":
    "3rd partial voltage",
  "Gerilim Bölücü Oranı":
    "Voltage Divider Ratio",
  "U₁/U₂ = R₁/R₂ — adalet vardır, orantılıdır.":
    "U₁/U₂ = R₁/R₂ — there is justice, and it's proportional.",
  "Seri devrede gerilimler dirençlerle aynı oranda bölüşülür. R₁ iki kat büyükse üzerine iki kat gerilim düşer. Bu oran kuralı, potansiyometrelerin ve sensör devrelerinin temelidir. Dört büyüklükten üçünü bil, dördüncüyü formül sana getirsin.":
    "In a series circuit the voltages split in the same ratio as the resistances. If R₁ is twice as big, twice the voltage drops across it. This ratio rule is the basis of potentiometers and sensor circuits. Know three of the four quantities and the formula hands you the fourth.",
  "R₁ üzerindeki gerilim":
    "Voltage across R₁",
  "R₂ üzerindeki gerilim":
    "Voltage across R₂",
  "İki Paralel Direnç":
    "Two Parallel Resistors",
  "Çarp, topla, böl — klasiklerden.":
    "Multiply, add, divide — a classic.",
  "İki paralel direnç için pratik formül: R_ges = (R₁·R₂)/(R₁+R₂). Paralel bağlantıda akıma yeni yollar açılır, bu yüzden toplam direnç HER ZAMAN en küçük dirençten bile küçüktür. İki eşit direnci paralel bağlarsan sonuç yarısıdır — sınavda 10 saniyelik kontrol imkânı.":
    "The handy formula for two resistors in parallel: R_ges = (R₁·R₂)/(R₁+R₂). A parallel connection opens new paths for the current, so the total resistance is ALWAYS smaller than even the smallest resistor. Connect two equal resistors in parallel and you get half — a 10-second sanity check in the exam.",
  "Sonuç R₁'den veya R₂'den büyük çıktıysa bir şeyler ters gitti. Paralel direnç küçültür, büyütmez.":
    "If the result is bigger than R₁ or R₂, something went wrong. Parallel resistance shrinks, it never grows.",
  "İki direncin birlikte gösterdiği eşdeğer direnç. Daima en küçük olandan daha küçüktür.":
    "The equivalent resistance the two resistors show together. Always smaller than the smaller of the two.",
  "Hesapla ya da gerilimsiz devrede uçlardan ölç.":
    "Calculate it, or measure across the ends on a de-energised circuit.",
  "Genel Paralel Formülü":
    "General Parallel Formula",
  "Terslerin toplamının tersi. Evet, üç kere 'ters' dedik.":
    "The reciprocal of the sum of the reciprocals. Yes, we said 'reciprocal' three times.",
  "Üç ve daha fazla paralel direnç için: 1/R_ges = 1/R₁ + 1/R₂ + 1/R₃. Yani iletkenlik değerleri (Leitwert) toplanır — her yeni paralel yol, akıma yeni bir kapı açar. Bu kart sadece R_ges'i çözer; tek tek dirençleri çözmek istiyorsan değerleri Leitwert'e çevirip toplamadan çıkarman gerekir (ya da bize güven, R_ges'i bul, gerisini iki-dirençli karttan yürüt).":
    "For three or more resistors in parallel: 1/R_ges = 1/R₁ + 1/R₂ + 1/R₃. In other words the conductances (Leitwert) add up — every new parallel path opens another door for the current. This card only solves for R_ges; to solve for an individual resistor you'd have to convert to conductances and subtract from the total (or trust us, find R_ges and carry on with the two-resistor card).",
  "İki direnç varsa üçüncü kutuya çok büyük bir değer yaz (ör. 999999999) — sonsuz dirençli kol, olmayan kol demektir. Ya da direkt 'İki Paralel Direnç' kartını kullan, o bunun için var.":
    "If you only have two resistors, type a very large value into the third box (e.g. 999999999) — a branch with infinite resistance is a branch that isn't there. Or just use the 'Two Parallel Resistors' card; that's what it's for.",
  "Tüm paralel kolların birlikte gösterdiği eşdeğer direnç.":
    "The equivalent resistance of all parallel branches together.",
  "Bu formülle hesaplanır — ya da ohmmetreyle, ama önce fişi çek.":
    "Calculated with this formula — or with an ohmmeter, but pull the plug first.",
  "n Adet Eşit Direnç":
    "n Equal Resistors",
  "Tembellik bir erdemdir: R_ges = R / n":
    "Laziness is a virtue: R_ges = R / n",
  "Aynı değerde n adet direnç paralel bağlanırsa toplam direnç R/n olur. 4 tane 100 Ω → 25 Ω. Isıtıcı rezistansları, LED dizileri ve 'aynı üründen çok var' senaryolarında kesirli formülle boğuşmana gerek yok.":
    "If n resistors of the same value are connected in parallel, the total resistance is R/n. Four of 100 Ω → 25 Ω. For heating elements, LED strings and other 'lots of the same thing' scenarios there's no need to wrestle with the fraction formula.",
  "Bu formülle. Bu kadar basit.":
    "With this formula. It's that simple.",
  "Tek bir direncin değeri (hepsi aynı olmak zorunda, formülün tek şartı bu).":
    "The value of one single resistor (they all have to be the same — the formula's only condition).",
  "Direnç adedi":
    "Number of resistors",
  "adet":
    "pcs",
  "Kaç tane eşit direnç paralel bağlı. Tam sayı olması beklenir; 2,5 direnç bağlayabiliyorsan bize de öğret.":
    "How many equal resistors are connected in parallel. An integer is expected; if you can connect 2.5 resistors, teach us how.",
  "Say. Gerçekten, sadece say.":
    "Count. Really, just count.",
  "Akım Bölücü Oranı":
    "Current Divider Ratio",
  "I₁/I₂ = R₂/R₁ — akım tembeldir, kolay yolu sever.":
    "I₁/I₂ = R₂/R₁ — current is lazy and likes the easy way.",
  "Paralel kollarda akım, dirençle TERS orantılı bölüşülür: küçük dirençli koldan büyük akım geçer. Oranın ters olmasına dikkat — I₁'in karşısında R₂ var. Sınavların 'bunu kesin karıştırırlar' klasiği.":
    "In parallel branches the current splits in INVERSE proportion to the resistance: the big current goes through the small resistance. Watch out for the inverted ratio — R₂ sits opposite I₁. An exam classic of the 'they're bound to mix this up' kind.",
  "Paralel devrede gerilim tüm kollarda AYNIDIR; bölüşülen şey akımdır. (Seri devrede tam tersi.)":
    "In a parallel circuit the voltage is THE SAME across all branches; what gets shared out is the current. (Exactly the other way round in a series circuit.)",
  "1. koldaki akım":
    "Current in branch 1",
  "2. koldaki akım":
    "Current in branch 2",
  "1. kolun direnci":
    "Resistance of branch 1",
  "2. kolun direnci":
    "Resistance of branch 2",
  "Elektriksel Güç":
    "Electrical Power",
  "P = U · I — volt çarpı amper, watt eder; fatura da faturayı eder.":
    "P = U · I — volts times amps makes watts; and watts make the bill.",
  "Güç, gerilim ile akımın çarpımıdır (DC ve saf omik yüklerde). 230 V'ta 10 A çeken ısıtıcı 2300 W harcar. Ohm kanunuyla birleştirince güç formülü ailesi doğar: P = I²·R ve P = U²/R — üçü de aynı gerçeğin farklı kılıkları.":
    "Power is the product of voltage and current (for DC and purely resistive loads). A heater drawing 10 A at 230 V uses 2300 W. Combine it with Ohm's law and the power formula family is born: P = I²·R and P = U²/R — all three are different disguises of the same truth.",
  "Birim zamanda çevrilen enerji — yani işin 'hızı'. Elektrik faturanın gerçek mimarı.":
    "The energy converted per unit of time — the 'speed' of work. The real architect of your electricity bill.",
  "Güç (Akım ve Direnç ile)":
    "Power (from Current and Resistance)",
  "P = I² · R — akımın karesi: kabloların neden ısındığının hikâyesi.":
    "P = I² · R — current squared: the story of why cables heat up.",
  "Gücü gerilimi bilmeden, akım ve dirençten hesapla. Akım KARESİYLE girdiği için iki kat akım = dört kat ısı demektir. Kablo kesitlerinin neden akıma göre seçildiğinin, gevşek klemenslerin neden yangın çıkardığının matematiksel özeti.":
    "Calculate power from current and resistance without knowing the voltage. Because the current goes in SQUARED, twice the current means four times the heat. The mathematical summary of why cable cross-sections are chosen by current, and why loose terminals start fires.",
  "Kayıp güç (Verlustleistung) hesaplarının baş aktörü. Hattaki kaybı bulmak için R yerine hat direncini koy.":
    "The star of power-loss (Verlustleistung) calculations. To find the loss in a line, put the line resistance in for R.",
  "Dirençte ısıya dönüşen güç. Bazen istenen şey (ısıtıcı), bazen düşman (hat kaybı).":
    "The power turned into heat in the resistor. Sometimes that's the goal (heater), sometimes the enemy (line loss).",
  "Güç (Gerilim ve Direnç ile)":
    "Power (from Voltage and Resistance)",
  "P = U² / R — akımı sormadan güç hesabı.":
    "P = U² / R — power without asking about the current.",
  "Elinde sadece gerilim ve direnç varsa: P = U²/R. Gerilim de karesiyle girer — bu yüzden 230 V'luk ampulü 115 V'ta yakarsan yarı parlaklık değil, ÇEYREK güç alırsın. Gerilim düşünce cihazların neden bu kadar dramatik tepki verdiğinin açıklaması.":
    "If all you have is voltage and resistance: P = U²/R. The voltage goes in squared as well — which is why a 230 V bulb run at 115 V doesn't give half brightness but a QUARTER of the power. That explains why devices react so dramatically when the voltage sags.",
  "η = P_ab / P_zu — verdiğinin ne kadarı geri geliyor?":
    "η = P_ab / P_zu — how much of what you put in comes back out?",
  "Verim, çıkan faydalı gücün giren güce oranıdır. Motora 1000 W verip milden 850 W alıyorsan η = 0,85 yani %85. Kalan 150 W kayıp değil aslında — ısınma olarak atölyeyi ısıtıyor, sadece senin istediğin iş bu değildi. η daima 1'in (yani %100'ün) altındadır; üstünde çıktıysa ya ölçüm hatası var ya da patent dairesine koşmalısın (koşma, ölçüm hatası).":
    "Efficiency is the ratio of useful output power to input power. Feed a motor 1000 W and get 850 W at the shaft: η = 0.85, i.e. 85 %. The remaining 150 W isn't really lost — it heats the workshop; it just isn't the job you wanted done. η is always below 1 (100 %); if yours comes out above, either there's a measurement error or you should run to the patent office (don't run, it's a measurement error).",
  "Verdiğin enerjinin ne kadarını işe dönüştürebildiğin. %100 yok — termodinamik pazarlık kabul etmiyor. Aradaki fark ısı olarak evrene bağışlanır.":
    "How much of the energy you put in you manage to turn into useful work. There is no 100 % — thermodynamics doesn't haggle. The difference is donated to the universe as heat.",
  "Tip etiketi veya veri sayfasından. Yoksa P_ab / P_zu oranından hesaplarsın. Yunan harfi η 'eta' diye okunur, 'n' değil!":
    "From the rating plate or the data sheet. Otherwise you calculate it from P_ab / P_zu. The Greek letter η is pronounced 'eta', not 'n'!",
  "Çıkan güç":
    "Output power",
  "Cihazın işe yarayan çıkışı: motorda mil gücü, trafoda sekonder güç.":
    "The useful output of the device: shaft power on a motor, secondary power on a transformer.",
  "Tip etiketinde motorlarda yazan güç genellikle ÇIKIŞ gücüdür (P_ab / P₂). Evet, bu bilgi sınavda hayat kurtarır.":
    "The power printed on a motor's rating plate is normally the OUTPUT power (P_ab / P₂). Yes, this piece of knowledge saves lives in exams.",
  "Giren güç":
    "Input power",
  "Şebekeden çekilen güç — faturaya yansıyan taraf.":
    "The power drawn from the supply — the side that ends up on the bill.",
  "Ölçü aletiyle şebeke tarafından ölçülür ya da P_ab/η ile hesaplanır.":
    "Measured on the supply side with a meter, or calculated with P_ab/η.",
  "Toplam Verim":
    "Overall Efficiency",
  "Kötü haber: verimler çarpılır, yani hep küçülür.":
    "Bad news: efficiencies multiply, so they only ever get smaller.",
  "Ard arda bağlı sistemlerde (motor → şanzıman → pompa) toplam verim, tek tek verimlerin ÇARPIMIDIR: η_ges = η₁ · η₂. %90 × %90 = %81 — iki tane 'gayet iyi' cihaz, birlikte 'eh işte' yapar. Zincir uzadıkça durum kötüleşir; mühendisliğin sessiz trajedisi.":
    "In systems connected one after another (motor → gearbox → pump) the overall efficiency is the PRODUCT of the individual efficiencies: η_ges = η₁ · η₂. 90 % × 90 % = 81 % — two 'pretty good' devices together make a 'meh'. The longer the chain, the worse it gets; the silent tragedy of engineering.",
  "Üç ve daha fazla kademe varsa çarpmaya devam et: sonucu al, üçüncü verimle bu kartta tekrar çarp.":
    "With three or more stages just keep multiplying: take the result and multiply it by the third efficiency on this card again.",
  "Toplam verim":
    "Overall efficiency",
  "Zincirin başından sonuna kalan fayda oranı. Zincirdeki en zayıf halkadan bile küçüktür.":
    "The share of benefit left from the start of the chain to the end. Smaller than even the weakest link in the chain.",
  "Kademelerin verimlerini çarparak bulunur.":
    "Found by multiplying the efficiencies of the stages.",
  "1. kademe verimi":
    "Efficiency of stage 1",
  "2. kademe verimi":
    "Efficiency of stage 2",
  "Döndürme Momenti":
    "Torque",
  "M = 9550 · P / n — sihirli sayı 9550'yle tanış.":
    "M = 9550 · P / n — meet the magic number 9550.",
  "Motorun milindeki döndürme kuvveti (tork). 9550 gökten inmedi: 60 / (2π) · 1000'den gelir — dakikayı saniyeye, kW'ı W'a çeviren sabitlerin paketlenmiş hali. Aynı güçte yavaş dönen motor daha çok moment üretir; bu yüzden matkap yavaş viteste daha 'güçlü' hisseder.":
    "The turning force at the motor shaft (torque). The 9550 didn't fall from the sky: it comes from 60 / (2π) · 1000 — the constants that convert minutes to seconds and kW to W, neatly packaged. At the same power, a slower motor produces more torque; that's why a drill feels 'stronger' in low gear.",
  "Bu formülde P KİLOWATT, n 1/min cinsindendir. 9550 sabiti bu ikiliye göre ayarlı — W girersen sonuç 1000 kat şaşar ve motorun kağıt üzerinde gemi çekmeye başlar.":
    "In this formula P is in KILOWATTS and n in 1/min. The constant 9550 is tuned to exactly that pair — enter watts and the result is off by a factor of 1000, and on paper your motor starts towing ships.",
  "Döndürme momenti":
    "Torque",
  "Milin döndürme kuvveti × kol uzunluğu. Newton-metre cinsinden 'burma' gücü.":
    "The turning force of the shaft × lever arm. 'Twisting' strength in newton-metres.",
  "Motor veri sayfasında yazar ya da bu formülle güç ve devirden hesaplanır.":
    "Given in the motor data sheet, or calculated from power and speed with this formula.",
  "Motorun mil gücü (P_ab). Bu formül kW ister — birim seçicide kW varsayılan, dokunma yeter.":
    "The motor's shaft power (P_ab). This formula wants kW — kW is the default in the unit selector, just leave it alone.",
  "Tip etiketindeki güç motorlarda mil gücüdür. kW cinsinden bırak.":
    "On motors, the rating-plate power is the shaft power. Leave it in kW.",
  "Devir sayısı":
    "Speed",
  "Milin dakikadaki tur sayısı. 1/min ya da rpm — aynı şeyin iki pasaportu.":
    "The number of shaft revolutions per minute. 1/min or rpm — two passports for the same thing.",
  "Tip etiketi (ör. 1450 1/min) ya da takometreyle ölçüm.":
    "Rating plate (e.g. 1450 1/min) or measured with a tachometer.",
  "Senkron Devir Sayısı":
    "Synchronous Speed",
  "n₀ = f · 60 / p — döner alanın hız limiti.":
    "n₀ = f · 60 / p — the speed limit of the rotating field.",
  "Stator döner alanının devri sadece şebeke frekansına ve kutup ÇİFTİ sayısına bağlıdır. 50 Hz'te: 2 kutuplu (p=1) → 3000, 4 kutuplu (p=2) → 1500, 6 kutuplu (p=3) → 1000 1/min. Asenkron motorun rotoru bu hıza asla tam yetişemez — yetişseydi indüksiyon biter, motor küser, dönmezdi.":
    "The speed of the stator's rotating field depends only on the supply frequency and the number of pole PAIRS. At 50 Hz: 2-pole (p=1) → 3000, 4-pole (p=2) → 1500, 6-pole (p=3) → 1000 1/min. The rotor of an asynchronous motor never quite reaches this speed — if it did, induction would stop, the motor would sulk and refuse to turn.",
  "p burada kutup sayısı DEĞİL, kutup ÇİFTİ sayısıdır (Polpaarzahl). 4 kutuplu motor → p = 2. Bu ayrımı karıştırmak, sınav kağıtlarının en klasik gözyaşı sebebidir.":
    "Here p is NOT the number of poles but the number of pole PAIRS (Polpaarzahl). 4-pole motor → p = 2. Mixing these up is the most classic cause of tears on exam papers.",
  "Senkron devir":
    "Synchronous speed",
  "Döner manyetik alanın devri — rotorun kovaladığı ama asla yakalayamadığı hedef.":
    "The speed of the rotating magnetic field — the target the rotor chases but never catches.",
  "Bu formülle hesaplanır. Tip etiketindeki devir bundan biraz KÜÇÜKTÜR (aradaki fark = kayma).":
    "Calculated with this formula. The speed on the rating plate is slightly SMALLER than this (the difference = slip).",
  "Frekans":
    "Frequency",
  "Şebeke frekansı. Avrupa'da 50 Hz; frekans konvertörü varsa onun çıkışı.":
    "The supply frequency. 50 Hz in Europe; if there's a frequency converter, its output.",
  "Şebeke için 50 Hz kabul edilir (ABD 60 Hz). Aksi belirtilmedikçe görev metninde yazar ya da frekansmetreyle ölçülür.":
    "For the mains, 50 Hz is assumed (USA: 60 Hz). Unless stated otherwise it's in the exercise text, or measured with a frequency meter.",
  "Kutup çifti sayısı":
    "Number of pole pairs",
  "adet (çift!)":
    "count (pairs!)",
  "Statordaki N-S kutup ÇİFTLERİNİN sayısı. Kutup sayısının yarısı: 2 kutup → p=1, 4 kutup → p=2.":
    "The number of N–S pole PAIRS in the stator. Half the number of poles: 2 poles → p=1, 4 poles → p=2.",
  "Motor veri sayfası; ya da etiketteki devirden geri hesapla (1450 → senkronu 1500 → p=2).":
    "Motor data sheet; or work backwards from the rated speed (1450 → synchronous 1500 → p=2).",
  "Kayma (Schlupf)":
    "Slip (Schlupf)",
  "Rotorun döner alana olan kibar mesafesi.":
    "The rotor's polite distance from the rotating field.",
  "Asenkron motorun rotoru, döner alandan hep biraz geride kalır — bu geriliğin yüzdesi kaymadır: s = (n₀−n)/n₀ · 100. Tipik değerler %3–8. Yük arttıkça motor biraz daha 'geriler', kayma büyür, moment artar. Kayma sıfır olsaydı rotor iletkenlerinde alan değişimi, dolayısıyla indüksiyon, dolayısıyla moment olmazdı.":
    "The rotor of an asynchronous motor always lags a little behind the rotating field — that lag as a percentage is the slip: s = (n₀−n)/n₀ · 100. Typical values are 3–8 %. As the load rises the motor 'falls back' a little more, slip grows, torque increases. If the slip were zero, there would be no field change in the rotor conductors, hence no induction, hence no torque.",
  "Kayma":
    "Slip",
  "Rotorun senkron devire göre yüzde geriliği. Motorun 'nefes payı'.":
    "How far the rotor lags behind synchronous speed, in percent. The motor's 'breathing room'.",
  "Etiketteki devirle senkron deviri karşılaştırarak hesaplanır.":
    "Calculated by comparing the rated speed with the synchronous speed.",
  "Döner alanın devri (f·60/p'den).":
    "The speed of the rotating field (from f·60/p).",
  "Senkron devir kartından hesapla: 50 Hz'te 3000/1500/1000/750…":
    "Work it out with the synchronous speed card: at 50 Hz 3000/1500/1000/750…",
  "Rotor devri":
    "Rotor speed",
  "Milin gerçek devri — etikette yazan, takometrenin gösterdiği.":
    "The real speed of the shaft — what the rating plate says and the tachometer shows.",
  "Tip etiketi ya da takometre.":
    "Rating plate or tachometer.",
  "Tepe Değeri":
    "Peak Value",
  "û = √2 · U — prizdeki 230 V aslında ara sıra 325 V'tur.":
    "û = √2 · U — the 230 V in your socket is actually 325 V every now and then.",
  "Multimetrenin gösterdiği 230 V, etkin değerdir (Effektivwert): aynı ısıtma işini yapan DC eşdeğeri. Sinüs dalgasının gerçek tepesi ise √2 kat yüksektir: 230 · 1,414 ≈ 325 V. İzolasyon ve yarı iletkenler bu tepe değere dayanmak zorundadır — 'ama ortalaması 230'du' savunması kondansatörde geçmez.":
    "The 230 V your multimeter shows is the RMS value (Effektivwert): the DC equivalent that does the same heating job. The real peak of the sine wave is √2 times higher: 230 · 1.414 ≈ 325 V. Insulation and semiconductors have to withstand this peak value — the defence 'but the average was 230' doesn't work on a capacitor.",
  "Tepe değeri":
    "Peak value",
  "Sinüs dalgasının ulaştığı en yüksek anlık değer. Osiloskopta gördüğün zirve.":
    "The highest instantaneous value the sine wave reaches. The summit you see on the oscilloscope.",
  "Osiloskopla ölçülür ya da etkin değerden √2 ile hesaplanır.":
    "Measured with an oscilloscope, or calculated from the RMS value with √2.",
  "Etkin değer":
    "RMS value",
  "Aynı gücü sağlayan DC eşdeğeri — multimetrelerin ve etiketlerin dili. 'Şebeke 230 V' derken kastedilen budur.":
    "The DC equivalent that delivers the same power — the language of multimeters and rating plates. This is what's meant by 'the mains is 230 V'.",
  "Multimetreyle (AC kademesinde) ölçülür; cihaz zaten etkin değer gösterir.":
    "Measured with a multimeter (on the AC range); the meter already shows the RMS value.",
  "Periyot Süresi":
    "Period",
  "T = 1/f — bir dalganın kendini tamamlama süresi.":
    "T = 1/f — the time a wave takes to complete itself.",
  "Frekans ile periyot birbirinin tersidir. 50 Hz'lik şebekede bir tam dalga 20 ms sürer. Osiloskopta zaman ekseninden T'yi okur, tersini alır, frekansı bulursun — cihazın otomatiği bozulduğunda hâlâ bilen kişi ol.":
    "Frequency and period are each other's reciprocal. On a 50 Hz supply one full wave takes 20 ms. On the oscilloscope you read T off the time axis, take the reciprocal and have the frequency — be the person who still knows how when the scope's automatic measurement breaks.",
  "Periyot süresi":
    "Period",
  "Bir tam salınımın süresi. 50 Hz → 20 ms; göz kırpmandan bile kısa.":
    "The duration of one full oscillation. 50 Hz → 20 ms; shorter than a blink of your eye.",
  "Osiloskopta bir tam dalganın yatay uzunluğunu oku.":
    "Read the horizontal length of one full wave on the oscilloscope.",
  "Saniyedeki tam dalga sayısı. Avrupa şebekesi 50 Hz — yani gerilim saniyede 50 kez fikir değiştirir ve buna 'kararlılık' deriz.":
    "The number of full waves per second. The European grid runs at 50 Hz — the voltage changes its mind 50 times a second and we call that 'stability'.",
  "Açısal Frekans":
    "Angular Frequency",
  "ω = 2π · f — frekansın matematik smokini giymiş hali.":
    "ω = 2π · f — frequency in its mathematical tuxedo.",
  "Sinüs hesaplarında frekans genelde ω (omega) olarak, radyan/saniye cinsinden gezer: ω = 2πf. 50 Hz → 314 1/s. X_L ve X_C formüllerinin içindeki 2πf paketinin ta kendisi. Ezberlemesen de olur ama tanımazsan formüller sana yabancı bakar.":
    "In sine-wave calculations the frequency usually travels as ω (omega), in radians per second: ω = 2πf. 50 Hz → 314 1/s. It is exactly the 2πf package inside the X_L and X_C formulas. You don't have to memorise it, but if you don't recognise it, the formulas will look at you like a stranger.",
  "Açısal frekans":
    "Angular frequency",
  "Saniyedeki radyan cinsinden dönüş hızı. Bir tam dalga = 2π radyan.":
    "Rotational speed in radians per second. One full wave = 2π radians.",
  "Hesaplanır: 2π·f. 50 Hz için ≈ 314 1/s — bu sayıyı görürsen 50 Hz kokusu al.":
    "Calculated: 2π·f. For 50 Hz ≈ 314 1/s — when you see that number, you should smell 50 Hz.",
  "İndüktif Reaktans":
    "Inductive Reactance",
  "X_L = 2π · f · L — bobinin AC'ye kestiği fatura.":
    "X_L = 2π · f · L — the bill the coil sends to AC.",
  "Bobin, alternatif akıma frekansla artan bir direnç gösterir: X_L = 2πfL. DC'de (f=0) bobin sadece bir tel parçasıdır; frekans yükseldikçe 'dur bakalım' demeye başlar. Bu yüzden şok bobinleri yüksek frekans gürültüsünü süzer ama 50 Hz'i rahat bırakır.":
    "A coil shows alternating current a resistance that grows with frequency: X_L = 2πfL. At DC (f=0) a coil is just a piece of wire; as the frequency rises it starts saying 'not so fast'. That's why chokes filter out high-frequency noise but leave 50 Hz alone.",
  "X_L gerçek direnç gibi ısı üretmez — enerjiyi manyetik alanda saklayıp geri verir. Bu yüzden adı 'reaktans', güç türü de 'reaktif'.":
    "X_L doesn't produce heat like a real resistance — it stores energy in the magnetic field and gives it back. Hence the name 'reactance', and the type of power 'reactive'.",
  "İndüktif reaktans":
    "Inductive reactance",
  "Bobinin AC'ye gösterdiği frekans bağımlı direnç. Akımı gerilimden 90° geride bıraktırır.":
    "The frequency-dependent resistance a coil shows to AC. It makes the current lag 90° behind the voltage.",
  "Hesaplanır; ya da U/I ölçümünden (saf bobin varsayımıyla) çıkarılır.":
    "Calculated; or derived from a U/I measurement (assuming an ideal coil).",
  "İndüktans":
    "Inductance",
  "Bobinin akım değişimine karşı gösterdiği inat. Akım değişmek istedikçe bobin 'acele etme' der. Birimi Henry (H).":
    "The coil's stubbornness against changes in current. Whenever the current wants to change, the coil says 'take your time'. Its unit is the henry (H).",
  "Bobinin/şok bobininin etiketi veya veri sayfası; LCR metreyle de ölçülür.":
    "The label or data sheet of the coil/choke; it can also be measured with an LCR meter.",
  "Kapasitif Reaktans":
    "Capacitive Reactance",
  "X_C = 1 / (2π·f·C) — kondansatör tam tersini yapar.":
    "X_C = 1 / (2π·f·C) — the capacitor does the exact opposite.",
  "Kondansatörün AC direnci frekansla TERS orantılıdır: frekans arttıkça X_C küçülür. DC'de (f=0) kondansatör duvardır (X_C → ∞), yüksek frekansta ise neredeyse kablodur. Bobinin ayna görüntüsü — biri artarken öteki azalır; ikisinin eşitlendiği yerde rezonans denen ilginç şeyler olur (o konu sonra 😏).":
    "A capacitor's AC resistance is INVERSELY proportional to frequency: as the frequency rises, X_C shrinks. At DC (f=0) a capacitor is a wall (X_C → ∞), at high frequency it's almost a piece of wire. The mirror image of the coil — when one goes up the other goes down; where the two are equal, interesting things called resonance happen (that topic comes later 😏).",
  "Kapasitif reaktans":
    "Capacitive reactance",
  "Kondansatörün AC'ye gösterdiği frekans bağımlı direnç. Akımı gerilimden 90° öne geçirtir.":
    "The frequency-dependent resistance a capacitor shows to AC. It makes the current lead the voltage by 90°.",
  "Hesaplanır: 1/(2πfC).":
    "Calculated: 1/(2πfC).",
  "Kapasite":
    "Capacitance",
  "Kondansatörün yük depolama kabiliyeti. Elektriğin küçük deposu; gerilim değişimine direnir. Birimi Farad — 1 F kocamandır, pratikte µF/nF görürsün.":
    "The capacitor's ability to store charge. Electricity's small storage tank; it resists changes in voltage. Its unit is the farad — 1 F is enormous, in practice you'll see µF/nF.",
  "Kondansatörün üzerinde yazar (ör. 4,7 µF / 450 V) ya da LCR metreyle ölçülür.":
    "Printed on the capacitor (e.g. 4.7 µF / 450 V) or measured with an LCR meter.",
  "Yıldız Bağlantı: Gerilimler":
    "Star Connection: Voltages",
  "U_L = √3 · U_Str — 230 ile 400'ün gizli akrabalığı.":
    "U_L = √3 · U_Str — the secret kinship between 230 and 400.",
  "Yıldız (Stern/Y) bağlantıda faz-nötr gerilimi (U_Str) ile faz-faz gerilimi (U_L) arasında √3 çarpanı vardır: 230 V · √3 ≈ 400 V. Prizindeki 230 ile trifaze hattın 400'ü aynı şebekenin iki farklı ölçüm noktası. Yıldızda akımlar ise eşittir: I_L = I_Str — akım için çevirme yok, rahatla.":
    "In a star (Stern/Y) connection there is a factor of √3 between the phase-to-neutral voltage (U_Str) and the phase-to-phase voltage (U_L): 230 V · √3 ≈ 400 V. The 230 at your socket and the 400 of the three-phase line are two measuring points on the same supply. The currents in star are equal: I_L = I_Str — no conversion for the current, relax.",
  "√3 ≈ 1,732. Drehstrom'da bir yerde √3 görmüyorsan muhtemelen bir şeyi unutmuşsundur.":
    "√3 ≈ 1.732. If you don't see a √3 somewhere in three-phase (Drehstrom), you've probably forgotten something.",
  "Hat gerilimi (faz-faz)":
    "Line voltage (phase-to-phase)",
  "İki faz iletkeni ARASINDAKİ gerilim. Avrupa şebekesinde 400 V.":
    "The voltage BETWEEN two phase conductors. 400 V on the European grid.",
  "İki faz arasında multimetreyle ölç: L1–L2, L2–L3, L3–L1 → hepsi 400 V olmalı.":
    "Measure between two phases with a multimeter: L1–L2, L2–L3, L3–L1 → all should be 400 V.",
  "Yıldız gerilimi (faz-nötr)":
    "Star voltage (phase-to-neutral)",
  "Bir faz ile nötr (yıldız noktası) arasındaki gerilim. Bildiğin priz gerilimi: 230 V.":
    "The voltage between one phase and neutral (the star point). The socket voltage you know: 230 V.",
  "Faz ile N arasında ölç: L1–N → 230 V.":
    "Measure between a phase and N: L1–N → 230 V.",
  "Üçgen Bağlantı: Akımlar":
    "Delta Connection: Currents",
  "I_L = √3 · I_Str — üçgende √3, akım tarafına geçer.":
    "I_L = √3 · I_Str — in delta the √3 moves over to the current side.",
  "Üçgen (Dreieck/Δ) bağlantıda sargılar fazlar ARASINA bağlanır: sargı gerilimi = hat gerilimi (U_Str = U_L = 400 V), ama hat akımı sargı akımının √3 katıdır. Yıldızın tam simetriği: yıldızda √3 gerilimde, üçgende akımdadır. Motorların yıldız-üçgen yol vermesinin bütün sırrı bu iki karttadır.":
    "In a delta (Dreieck/Δ) connection the windings are connected BETWEEN the phases: winding voltage = line voltage (U_Str = U_L = 400 V), but the line current is √3 times the winding current. The exact mirror of star: in star the √3 is in the voltage, in delta it's in the current. The whole secret of star-delta starting of motors is in these two cards.",
  "Aynı motor üçgende, yıldıza göre 3 KAT güç çeker. Yıldız-üçgen yol verme, kalkışta bu farkı kullanarak şebekeyi korur.":
    "The same motor draws 3 TIMES the power in delta compared with star. Star-delta starting uses that difference to go easy on the supply during start-up.",
  "Hat akımı":
    "Line current",
  "Besleme hattından (L1, L2, L3) akan akım — sigortanın ve kablonun gördüğü akım.":
    "The current flowing in the supply line (L1, L2, L3) — the current the fuse and the cable see.",
  "Pens ampermetreyle faz iletkeninden ölç.":
    "Measure on the phase conductor with a clamp meter.",
  "Sargı akımı":
    "Winding current",
  "Motor/yük sargısının İÇİNDEN akan akım. Hat akımından küçüktür (üçgende).":
    "The current flowing THROUGH the motor/load winding. Smaller than the line current (in delta).",
  "Sargı koluna seri ampermetre — pratikte genelde hesaplanır.":
    "An ammeter in series with the winding — in practice it's usually calculated.",
  "Trifaze Güç":
    "Three-Phase Power",
  "P = √3 · U · I · cos φ — endüstrinin ekmek teknesi formülü.":
    "P = √3 · U · I · cos φ — industry's bread-and-butter formula.",
  "Trifaze sistemin aktif gücü. U hat gerilimi (400 V), I hat akımı — bağlantı yıldız da olsa üçgen de olsa BU formül aynen çalışır, √3 farkları kendi içinde halleder (kibarlığına bak). Motor etiketindeki değerlerle motorun şebekeden ne çektiğini bulmanın standart yolu.":
    "The active power of a three-phase system. U is the line voltage (400 V), I the line current — whether the connection is star or delta, THIS formula works unchanged; it sorts out the √3 differences internally (how polite). The standard way to find what a motor draws from the supply using its rating-plate values.",
  "U = hat gerilimi (400 V), I = hat akımı. Strang değerleriyle karıştırırsan √3 sana iki kere güler.":
    "U = line voltage (400 V), I = line current. Mix them up with the winding (Strang) values and √3 will laugh at you twice.",
  "Üç fazın toplam aktif gücü — işe dönüşen kısım.":
    "The total active power of the three phases — the part that turns into work.",
  "Hat gerilimi":
    "Line voltage",
  "Fazlar arası gerilim; Avrupa'da 400 V.":
    "The voltage between phases; 400 V in Europe.",
  "İki faz arasından ölç ya da 400 V kabul et.":
    "Measure between two phases or assume 400 V.",
  "Faz iletkeninden akan akım.":
    "The current flowing in the phase conductor.",
  "Pens ampermetre ya da motor etiketi.":
    "Clamp meter or the motor's rating plate.",
  "Güç faktörü":
    "Power factor",
  "birimsiz, 0–1 arası":
    "dimensionless, between 0 and 1",
  "Gerilimle akımın arasının ne kadar iyi olduğunun ölçüsü. 1 = mükemmel uyum (saf omik yük), 0 = küslük (saf reaktif yük). Motorlarda tipik 0,8 civarı.":
    "A measure of how well voltage and current get along. 1 = perfect harmony (purely resistive load), 0 = not on speaking terms (purely reactive load). Typically around 0.8 for motors.",
  "Motorun tip etiketinde yazar (cos φ 0,82 gibi) ya da P/S oranından hesaplanır. Ölçü cihazlarının çoğu doğrudan gösterir.":
    "Printed on the motor's rating plate (e.g. cos φ 0.82) or calculated from the ratio P/S. Most measuring instruments show it directly.",
  "Dönüştürme Oranı":
    "Transformation Ratio",
  "ü = U₁/U₂ — trafonun kimlik numarası.":
    "ü = U₁/U₂ — the transformer's ID number.",
  "Übersetzungsverhältnis: primer gerilimin sekondere oranı. ü = 10 ise trafo gerilimi 10'a böler (230 V → 23 V). İdeal trafoda bu oran aynı zamanda sarım oranına eşittir. Trafo hakkında tek bir sayı bilecek olsan, bu olurdu.":
    "Übersetzungsverhältnis: the ratio of primary to secondary voltage. If ü = 10, the transformer divides the voltage by 10 (230 V → 23 V). In an ideal transformer this ratio is also equal to the turns ratio. If you were to know just one number about a transformer, it would be this one.",
  "Dönüştürme oranı":
    "Transformation ratio",
  "birimsiz":
    "dimensionless",
  "U₁/U₂ = N₁/N₂. 1'den büyükse düşürücü, küçükse yükseltici trafo.":
    "U₁/U₂ = N₁/N₂. Greater than 1: step-down transformer; less than 1: step-up transformer.",
  "Gerilimleri ölç ve oranla; ya da veri sayfasına bak.":
    "Measure the voltages and take the ratio; or check the data sheet.",
  "Primer gerilim":
    "Primary voltage",
  "Giriş tarafının gerilimi — şebekeye bakan yüz.":
    "The voltage on the input side — the face turned towards the supply.",
  "Tip etiketi (ör. 230 V) ya da giriş uçlarından ölçüm.":
    "Rating plate (e.g. 230 V) or a measurement at the input terminals.",
  "Sekonder gerilim":
    "Secondary voltage",
  "Çıkış tarafının gerilimi — yüke giden taraf.":
    "The voltage on the output side — the side going to the load.",
  "Tip etiketi ya da çıkış uçlarından (boşta) ölçüm.":
    "Rating plate or a measurement at the output terminals (no load).",
  "Gerilim ↔ Sarım Sayısı":
    "Voltage ↔ Number of Turns",
  "U₁/U₂ = N₁/N₂ — kim çok sarmışsa gerilim onda.":
    "U₁/U₂ = N₁/N₂ — whoever has more turns gets the voltage.",
  "İdeal trafoda gerilimler sarım sayılarıyla DOĞRU orantılıdır. Sekondere iki kat sarım = iki kat gerilim. Dört büyüklükten üçünü bil, dördüncüyü bul — trafo hesabının ekmek kapısı.":
    "In an ideal transformer the voltages are DIRECTLY proportional to the numbers of turns. Twice the turns on the secondary = twice the voltage. Know three of the four quantities, find the fourth — the bread and butter of transformer calculations.",
  "Primer sarım sayısı":
    "Primary turns",
  "sarım (adet)":
    "turns (count)",
  "Sargının tur sayısı. Trafonun bütün karakteri bu oranda saklı — kim daha çok sarmışsa gerilim ondan yana.":
    "The number of turns of the winding. The transformer's whole character is hidden in this ratio — whoever has more turns gets the voltage.",
  "Veri sayfasından; pratikte sayamazsın (denemeni de önermeyiz, sarımlar dar alanda yaşar).":
    "From the data sheet; in practice you can't count them (and we don't recommend trying — windings live in tight spaces).",
  "Sekonder sarım sayısı":
    "Secondary turns",
  "Gerilim ↔ Akım (Güç Dengesi)":
    "Voltage ↔ Current (Power Balance)",
  "U₁·I₁ = U₂·I₂ — bedava güç yok, sadece takas var.":
    "U₁·I₁ = U₂·I₂ — no free power, only a trade.",
  "İdeal trafoda giren güç = çıkan güç. Gerilimi 10'a düşüren trafo, akımı 10'la çarpar. Kaynak makinelerinin nasıl yüzlerce amper verebildiğinin ve yüksek gerilim hatlarının neden yüksek gerilimli olduğunun tek satırlık cevabı: aynı gücü az akımla taşı, kayıpları (I²R!) küçük tut.":
    "In an ideal transformer, power in = power out. A transformer that divides the voltage by 10 multiplies the current by 10. The one-line answer to how welding machines deliver hundreds of amps and why high-voltage lines are high-voltage: carry the same power with little current and keep the losses (I²R!) small.",
  "Akım oranının TERS olduğuna dikkat: U₁/U₂ = I₂/I₁. Gerilim kimde çoksa akım onda azdır — trafo dünyasının denge yasası.":
    "Note that the current ratio is INVERTED: U₁/U₂ = I₂/I₁. Whoever has more voltage has less current — the law of balance in the transformer world.",
  "Primer akım":
    "Primary current",
  "Giriş tarafından çekilen akım.":
    "The current drawn on the input side.",
  "Giriş hattından pens ampermetreyle.":
    "With a clamp meter on the input line.",
  "Sekonder akım":
    "Secondary current",
  "Çıkış tarafının yüke verdiği akım.":
    "The current the output side delivers to the load.",
  "Çıkış hattından pens ampermetreyle ya da etiketten.":
    "With a clamp meter on the output line, or from the rating plate.",
  "Aktif Güç (AC, 1 faz)":
    "Active Power (AC, single-phase)",
  "P = U · I · cos φ — işe yarayan kısım.":
    "P = U · I · cos φ — the part that's actually useful.",
  "Alternatif akımda gerilimle akım her zaman aynı anda zirve yapmaz; aradaki faz kayması (φ) yüzünden çarpımın sadece cos φ'lik kısmı gerçek işe dönüşür. Motor, bobin ve floresan gibi endüktif yüklerde cos φ < 1'dir. Rezistif yüklerde (ısıtıcı, akkor ampul) cos φ = 1 — ne alırsan iş.":
    "With alternating current, voltage and current don't always peak at the same moment; because of the phase shift (φ) between them, only the cos φ share of the product becomes real work. For inductive loads such as motors, coils and fluorescent lamps, cos φ < 1. For resistive loads (heater, incandescent bulb) cos φ = 1 — everything you draw is work.",
  "Aktif güç":
    "Active power",
  "Isıya, harekete, ışığa dönüşen 'gerçek' güç. Sayacın saydığı ve faturalandırılan kısım.":
    "The 'real' power that turns into heat, motion and light. The part the meter counts and you are billed for.",
  "Görünür Güç (1 faz)":
    "Apparent Power (single-phase)",
  "S = U · I — şebekenin sırtındaki toplam yük.":
    "S = U · I — the total load on the supply's back.",
  "Faz açısını hiç sormadan gerilim çarpı akım: görünür güç. Birimi bilerek VA'dır, W değil — çünkü hepsi 'iş' değil. Trafolar ve jeneratörler VA/kVA ile etiketlenir; onların derdi taşımak, işin ne kadarının 'gerçek' olduğu yükün bileceği iş.":
    "Voltage times current without ever asking about the phase angle: apparent power. Its unit is deliberately VA, not W — because not all of it is 'work'. Transformers and generators are rated in VA/kVA; their job is to carry it, and how much of it is 'real' is the load's business.",
  "Görünür güç":
    "Apparent power",
  "Şebekenin taşımak zorunda olduğu toplam güç: U·I. Aktif ve reaktif gücün vektörel toplamı. Kablolar ve trafolar buna göre boyutlandırılır — şebeke 'ne iş yaptığına' değil 'ne taşıdığına' bakar.":
    "The total power the supply has to carry: U·I. The vector sum of active and reactive power. Cables and transformers are sized by it — the supply doesn't care 'how much work you do', only 'how much it has to carry'.",
  "U ve I ölçümünden (S = U·I) ya da güç üçgeninden.":
    "From measuring U and I (S = U·I) or from the power triangle.",
  "Görünür Güç (trifaze)":
    "Apparent Power (three-phase)",
  "S = √3 · U · I — üç fazlı versiyonu, √3 dahil.":
    "S = √3 · U · I — the three-phase version, √3 included.",
  "Trifaze sistemde görünür güç. U hat gerilimi (400 V), I hat akımı. Trafo boyutlandırırken, jeneratör seçerken, 'bu hat kaç amper taşır' sorusunu cevaplandırırken kullanılır.":
    "Apparent power in a three-phase system. U is the line voltage (400 V), I the line current. Used when sizing a transformer, choosing a generator, or answering 'how many amps does this line carry?'.",
  "Üç fazın toplam görünür gücü. Trafoların etiketindeki kVA budur.":
    "The total apparent power of the three phases. This is the kVA on a transformer's rating plate.",
  "Fazlar arasından ölç ya da 400 V al.":
    "Measure between phases or take 400 V.",
  "Güç Üçgeni":
    "Power Triangle",
  "S² = P² + Q² — Pisagor, elektrikçilikte de mesai yapıyor.":
    "S² = P² + Q² — Pythagoras works shifts in the electrical trade too.",
  "Aktif güç (P), reaktif güç (Q) ve görünür güç (S) bir dik üçgen oluşturur: S hipotenüs, P ve Q dik kenarlar. Reaktif güç 'boşuna' gidip gelen enerjidir — iş yapmaz ama hatları meşgul eder. Kompanzasyonun (kondansatör bankalarının) bütün amacı Q'yu küçültüp üçgeni yatırmaktır.":
    "Active power (P), reactive power (Q) and apparent power (S) form a right-angled triangle: S is the hypotenuse, P and Q the two legs. Reactive power is energy that travels back and forth 'for nothing' — it does no work but keeps the lines busy. The whole point of compensation (capacitor banks) is to shrink Q and flatten the triangle.",
  "S her zaman en uzun kenardır. P > S çıkıyorsa üçgen değil, ölçüm hatası çizmişsin demektir.":
    "S is always the longest side. If you get P > S, you haven't drawn a triangle, you've drawn a measurement error.",
  "Üçgenin yatay kenarı: gerçek işe dönüşen güç (W).":
    "The horizontal side of the triangle: the power that turns into real work (W).",
  "Reaktif güç":
    "Reactive power",
  "Manyetik/elektrik alan kurmak için gidip gelen güç. İş yapmaz ama hat kapasitesi yer; birimi var. Şebekenin 'boş koltukta seyahat eden yolcusu'.":
    "The power that travels back and forth to build up magnetic/electric fields. It does no work but eats line capacity; it has its own unit. The supply's 'passenger travelling on an empty seat'.",
  "Ölçü cihazından ya da üçgenden: Q = √(S²−P²).":
    "From a measuring instrument or from the triangle: Q = √(S²−P²).",
  "Güç Faktörü":
    "Power Factor",
  "cos φ = P / S — üçgenin özet istatistiği.":
    "cos φ = P / S — the triangle's summary statistic.",
  "Güç faktörü, görünür gücün ne kadarının işe dönüştüğünü söyler. cos φ = 0,8 ise şebekeden çektiğinin %80'i iş, %20'si 'alan kurma servisi'. Endüstride düşük cos φ cezalıdır — elektrik dağıtıcısı, boşuna taşıdığı reaktif gücün faturasını kibarca sana keser.":
    "The power factor tells you how much of the apparent power turns into work. With cos φ = 0.8, 80 % of what you draw from the supply is work and 20 % is 'field-building service'. In industry a low cos φ is penalised — the network operator politely bills you for the reactive power it carried for nothing.",
  "Gerilim Düşümü (1 faz)":
    "Voltage Drop (single-phase)",
  "Kablo uzadıkça gerilim eriyecek — fizik, pazarlık yapmaz.":
    "The longer the cable, the more the voltage melts away — physics doesn't haggle.",
  "Tek fazlı hatta gerilim düşümü: Δu = (2·l·I·cosφ)/(γ·A). Baştaki 2, akımın gidiş VE dönüş yolunu sayar (faz + nötr). Uzun hat, yüksek akım, ince kesit = büyük düşüm. Kesiti (A) tıklarsan bu formül kesit hesabına dönüşür — Querschnitt formülü diye ezberletilen şey, bunun umstellen halidir. Sürpriz!":
    "Voltage drop on a single-phase line: Δu = (2·l·I·cosφ)/(γ·A). The 2 at the front counts the current's way out AND back (phase + neutral). Long line, high current, thin cross-section = large drop. Click the cross-section (A) and this formula turns into the cross-section calculation — what you were made to memorise as the Querschnitt formula is just this one rearranged. Surprise!",
  "γ bakır için 56, alüminyum için 35 m/(Ω·mm²). l TEK YÖN uzunluğu — 2 çarpanı dönüşü zaten hallediyor.":
    "γ is 56 for copper and 35 for aluminium, in m/(Ω·mm²). l is the ONE-WAY length — the factor 2 already takes care of the return path.",
  "Gerilim düşümü":
    "Voltage drop",
  "Kablonun kendi direncinde 'kaybolan' gerilim. Sen 230 V yollarsın, hat ucuna 225 V varır — aradaki 5 V kabloda ısı olarak buharlaşmıştır.":
    "The voltage that 'gets lost' in the cable's own resistance. You send 230 V, 225 V arrive at the end of the line — the 5 V in between evaporated as heat in the cable.",
  "Hat başı ile hat sonu gerilimlerini ölçüp fark alırsın — ya da bu formülle önceden hesaplayıp hiç sürprizle karşılaşmazsın.":
    "Measure the voltage at the start and the end of the line and take the difference — or calculate it in advance with this formula and never be surprised.",
  "Hattın TEK YÖN uzunluğu. Gidiş-dönüşü sen hesaplama — tek fazlı formüldeki 2 çarpanı dönüş yolunu zaten sayıyor.":
    "The ONE-WAY length of the line. Don't work out the round trip yourself — the factor 2 in the single-phase formula already counts the return path.",
  "Hattan geçen işletme akımı. Yükün çektiği akımı bilmeden kablo hesabı yapılmaz.":
    "The operating current flowing through the line. No cable calculation without knowing the current the load draws.",
  "Yükün güç faktörü. Priz devreleri ve omik yükler için 1 alınır; motor besliyorsan etiketine bak.":
    "The power factor of the load. Taken as 1 for socket circuits and resistive loads; if you're feeding a motor, check its rating plate.",
  "İletkenlik":
    "Conductivity",
  "Öz direncin tersi (γ = 1/ρ): malzeme elektriği ne kadar severek iletiyor. Bakır 56, alüminyum 35 m/(Ω·mm²).":
    "The reciprocal of resistivity (γ = 1/ρ): how willingly the material conducts electricity. Copper 56, aluminium 35 m/(Ω·mm²).",
  "Tablo kitabından. Pratik değerler: Cu = 56, Al = 35. Kappa (κ) olarak da gösterilir, panik yok, aynı şey.":
    "From the table book. Practical values: Cu = 56, Al = 35. Also written as kappa (κ) — no panic, same thing.",
  "Gerilim Düşümü (trifaze)":
    "Voltage Drop (three-phase)",
  "Aynı hikâye, ama 2 yerine √3 — trifaze nötrden dönmez.":
    "Same story, but √3 instead of 2 — three-phase doesn't return through the neutral.",
  "Üç fazlı yüklü hatta gerilim düşümü: Δu = (√3·l·I·cosφ)/(γ·A). Simetrik yükte nötrden akım dönmediği için gidiş-dönüş çarpanı 2 değil √3'tür — trifazenin küçük ikramı. Kesit için A'yı tıkla: üç fazlı Querschnitt formülü hazır.":
    "Voltage drop on a loaded three-phase line: Δu = (√3·l·I·cosφ)/(γ·A). With a balanced load no current returns through the neutral, so the out-and-back factor is √3 instead of 2 — a small treat from three-phase. Click A for the cross-section: the three-phase Querschnitt formula is ready.",
  "Yine: l tek yön, γ = 56 (Cu). Sonucu hat gerilimine (400 V) oranlayıp %'ye çevirmek için alttaki 'Yüzdesel Gerilim Düşümü' kartını kullan.":
    "Again: l is one-way, γ = 56 (Cu). To relate the result to the line voltage (400 V) and turn it into a percentage, use the 'Percentage Voltage Drop' card below.",
  "Yüzdesel Gerilim Düşümü":
    "Percentage Voltage Drop",
  "Voltlar güzel, ama norm senden yüzde ister.":
    "Volts are nice, but the standard wants a percentage.",
  "Hesapladığın Δu'yu anlamlandırmanın yolu, anma gerilimine oranlamak: Δu% = Δu/U_n · 100. DIN 18015'e göre sayaçtan son prize kadar önerilen sınır %3'tür. 400 V hatta 12 V düşüm 'çok mu?' diye düşünme — %3, tam sınırda diye oku.":
    "The way to make sense of the Δu you calculated is to relate it to the nominal voltage: Δu% = Δu/U_n · 100. According to DIN 18015 the recommended limit from the meter to the last socket is 3 %. Don't wonder whether a 12 V drop on a 400 V line is 'a lot' — read it as 3 %, right at the limit.",
  "Tek fazda U_n = 230 V, trifazede 400 V ile oranla. Sınır değerler: DIN 18015 → %3 (konut, sayaç sonrası); DIN VDE 0100-520 tavsiyesi → aydınlatma %3, diğer %5.":
    "Use U_n = 230 V for single-phase and 400 V for three-phase. Limits: DIN 18015 → 3 % (dwellings, after the meter); DIN VDE 0100-520 recommendation → lighting 3 %, other circuits 5 %.",
  "Yüzdesel düşüm":
    "Percentage drop",
  "Gerilim düşümünün anma gerilimine oranı. Normların konuştuğu dil.":
    "The ratio of the voltage drop to the nominal voltage. The language the standards speak.",
  "Bu formülle hesaplanır; sınır değerlerle karşılaştırılır.":
    "Calculated with this formula and compared with the limits.",
  "Üstteki gerilim düşümü kartlarından hesapla ya da ölç.":
    "Calculate it with the voltage drop cards above, or measure it.",
  "Anma gerilimi":
    "Nominal voltage",
  "Sistemin nominal gerilimi: 1 fazda 230 V, trifazede 400 V.":
    "The nominal voltage of the system: 230 V single-phase, 400 V three-phase.",
  "Sistemine göre 230 ya da 400 V.":
    "230 or 400 V, depending on your system.",
  "Klemens Gerilimi & İç Direnç":
    "Terminal Voltage & Internal Resistance",
  "U_K = U₀ − I·R_i — pil neden yük altında 'yoruluyor'?":
    "U_K = U₀ − I·R_i — why does a battery 'get tired' under load?",
  "Hiçbir kaynak mükemmel değildir: her pilin, akünün, trafonun bir iç direnci (R_i) vardır. Yük akımı arttıkça iç dirençte gerilim düşer ve klemenslerde kalan gerilim azalır: U_K = U₀ − I·R_i. Marşa basınca farların kısılması, tam olarak bu formülün canlı yayınıdır. Boşta ölçtüğün gerilim U₀'dır (akım yok → düşüm yok); gerçek hayat yük altında başlar.":
    "No source is perfect: every battery, accumulator and transformer has an internal resistance (R_i). As the load current rises, voltage drops across the internal resistance and less is left at the terminals: U_K = U₀ − I·R_i. Headlights dimming when you hit the starter is this formula broadcast live. The voltage you measure with no load is U₀ (no current → no drop); real life starts under load.",
  "İç direnci ölçmenin pratik yolu: boşta U₀'ı, yük altında U_K ve I'yı ölç → R_i = (U₀−U_K)/I. Kaynak yaşlandıkça R_i büyür — pilin 'yaşlılık belgesi'.":
    "The practical way to measure internal resistance: measure U₀ with no load, then U_K and I under load → R_i = (U₀−U_K)/I. As a source ages, R_i grows — the battery's 'certificate of old age'.",
  "Klemens gerilimi":
    "Terminal voltage",
  "Kaynağın uçlarında YÜK ALTINDA ölçülen gerilim. İç dirençteki düşüm kadar U₀'dan küçüktür.":
    "The voltage measured at the source's terminals UNDER LOAD. Smaller than U₀ by the drop across the internal resistance.",
  "Yük bağlıyken kaynağın uçlarından multimetreyle ölç.":
    "Measure at the source's terminals with a multimeter while the load is connected.",
  "Kaynak gerilimi (boşta)":
    "Source voltage (no load)",
  "Kaynağın 'ideal' gerilimi — akım akmazken klemenslerde görünen değer.":
    "The 'ideal' voltage of the source — what appears at the terminals when no current flows.",
  "Yükü ayır, boşta ölç. Akım yok → iç düşüm yok → gördüğün şey U₀.":
    "Disconnect the load and measure. No current → no internal drop → what you see is U₀.",
  "Yükün çektiği akım. Bu arttıkça iç dirençteki kayıp da artar — bedava öğle yemeği yok.":
    "The current the load draws. As it rises, so does the loss in the internal resistance — there's no free lunch.",
  "İç direnç":
    "Internal resistance",
  "Kaynağın kendi içindeki kaçınılmaz direnç. Küçük olması iyidir; sıfır olması efsanedir.":
    "The unavoidable resistance inside the source itself. Small is good; zero is a myth.",
  "Doğrudan ölçülmez — boşta ve yük altındaki gerilim farkından hesaplanır.":
    "Not measured directly — calculated from the voltage difference between no load and load.",
  "Kondansatör Yükü":
    "Capacitor Charge",
  "Q = C · U — kapasite kadar depola, gerilim kadar doldur.":
    "Q = C · U — store as much as the capacitance, fill as much as the voltage.",
  "Kondansatörün depoladığı yük, kapasitesi ile üzerindeki gerilimin çarpımıdır. 100 µF'lik kondansatörü 10 V'a şarj edersen 1 mC (milicoulomb) yük tutar. Gerilimi iki katına çıkar, yük de ikiye katlanır — kapasite değişmez, o kondansatörün karakteridir.":
    "The charge a capacitor stores is its capacitance times the voltage across it. Charge a 100 µF capacitor to 10 V and it holds 1 mC (millicoulomb). Double the voltage and the charge doubles too — the capacitance doesn't change; it's the capacitor's character.",
  "Kondansatörler fişten çekilince de dolu kalabilir! Büyük kondansatörlü cihazlarda (mikrodalga, sürücüler) önce deşarj, sonra dokunma — bu formül orada 'sürpriz' üretir.":
    "Capacitors can stay charged even after you pull the plug! On devices with large capacitors (microwave ovens, drives): discharge first, then touch — this is where this formula produces 'surprises'.",
  "Kondansatörün plakalarında biriken yük miktarı.":
    "The amount of charge accumulated on the capacitor's plates.",
  "Ölçülmez, hesaplanır: C·U. (Deşarj akımını entegre eden de var ama biz normal insanlarız.)":
    "Not measured but calculated: C·U. (Some people integrate the discharge current, but we're normal people.)",
  "Kondansatörün üzerindeki gerilim. Etiketteki değer MAKSİMUM dayanma gerilimi — onu aşarsan kondansatör kısa ve gürültülü bir kariyer yapar.":
    "The voltage across the capacitor. The value on the label is the MAXIMUM withstand voltage — exceed it and the capacitor has a short and noisy career.",
  "Kondansatörde Depolanan Enerji":
    "Energy Stored in a Capacitor",
  "W = ½ · C · U² — küçük kutu, sürpriz tokat.":
    "W = ½ · C · U² — small can, surprising slap.",
  "Kondansatörün elektrik alanında depolanan enerji. Gerilim KARESİYLE girer: 450 V'luk bir ara devre kondansatörü, görünüşünün aksine ciddi enerji taşır. Fotoğraf flaşının 'şak' diye verdiği enerji, tam olarak bu formülle önceden istiflenmiştir.":
    "The energy stored in the capacitor's electric field. The voltage goes in SQUARED: a 450 V DC-link capacitor carries serious energy, contrary to its looks. The energy a camera flash releases with a 'pop' was stockpiled in advance by exactly this formula.",
  "Depolanan enerji":
    "Stored energy",
  "Elektrik alanında bekleyen enerji. Deşarjda ısıya, ışığa ya da (dikkatsizsen) kötü anılara dönüşür.":
    "Energy waiting in the electric field. On discharge it turns into heat, light or (if you're careless) bad memories.",
  "Hesaplanır: ½·C·U².":
    "Calculated: ½·C·U².",
  "Bobinde Depolanan Enerji":
    "Energy Stored in a Coil",
  "W = ½ · L · I² — manyetik alandaki gizli hazine.":
    "W = ½ · L · I² — the hidden treasure in the magnetic field.",
  "Bobin enerjiyi manyetik alanında, akım cinsinden depolar (kondansatörün ayna ikizi: o gerilimle, bu akımla çalışır). Akım kesilince bu enerji BİR YERE gitmek zorundadır — gidecek yer bulamazsa endüksiyon piki olarak kontaklarında ark yapar. Rölelerin bobinlerine neden 'Freilaufdiode' (serbest geçiş diyotu) konduğunun cevabı bu formüldür.":
    "A coil stores energy in its magnetic field, in terms of current (the capacitor's mirror twin: that one works with voltage, this one with current). When the current is cut, this energy HAS to go somewhere — if it finds nowhere to go, it arcs across the contacts as an induction spike. This formula is the reason relay coils get a 'Freilaufdiode' (freewheeling diode).",
  "Kontaktör bobinini süren transistörlü devrede diyot unutulursa, transistör bu enerjiyi 'yüzüne yiyerek' öğrenir. Diyotu unutma.":
    "If the diode is forgotten in a transistor circuit driving a contactor coil, the transistor learns about this energy the hard way. Don't forget the diode.",
  "Manyetik alanda bekleyen enerji. Akım kesildiğinde tahsilata çıkar.":
    "Energy waiting in the magnetic field. It comes to collect when the current is cut.",
  "Hesaplanır: ½·L·I².":
    "Calculated: ½·L·I².",
  "Bobinden geçen akım. Karesiyle girer: akımı ikiye katla, depolanan enerji dörde katlansın.":
    "The current through the coil. It goes in squared: double the current and the stored energy quadruples.",
  "Şebeke Sistemleri":
    "Earthing Systems",
  "TN, TT, IT — topraklamanın aile ağacı.":
    "TN, TT, IT — the family tree of earthing.",
  "Şebeke sistemleri, 'toprak ile şebekenin ilişkisi nasıl kurulmuş?' sorusunun cevabıdır. İsimlendirme şifre gibi görünür ama mantığı basit: İLK harf şebekenin (trafonun) toprakla ilişkisi, İKİNCİ harf cihaz gövdelerinin toprakla ilişkisi. T = Terre (toprak, doğrudan topraklı), N = Nötr üzerinden şebekeye bağlı, I = İzole (toprakla arası mesafeli).":
    "Earthing systems (Netzsysteme) answer the question 'how is the relationship between earth and the supply set up?'. The naming looks like a cipher, but the logic is simple: the FIRST letter is the supply's (the transformer's) relationship to earth, the SECOND letter is the relationship of the equipment casings to earth. T = Terre (earth, directly earthed), N = connected to the supply via the neutral, I = isolated (keeps its distance from earth).",
  "TN-C — eski toprak, tek kablo":
    "TN-C — old-style earth, one conductor",
  "Koruma iletkeni (PE) ile nötr (N) tek iletkende birleşik: PEN. Eski binaların klasiği. Ekonomik ama riskli: PEN koparsa cihaz gövdeleri şebeke potansiyeline gelebilir — yani buzdolabının kapısı aniden 'sürpriz' moduna geçer. Bu yüzden yeni tesisatlarda 10 mm²'nin altında yasak. Şemada gör: yeşil-sarı PEN hattı trafodan cihaza kadar tek başına gidiyor.":
    "The protective conductor (PE) and the neutral (N) are combined in a single conductor: PEN. A classic in old buildings. Economical but risky: if the PEN breaks, equipment casings can rise to mains potential — your fridge door suddenly switches to 'surprise' mode. That's why it's forbidden below 10 mm² in new installations. See the diagram: the green-yellow PEN runs alone all the way from the transformer to the device.",
  "TN-S — modern ve medeni":
    "TN-S — modern and civilised",
  "PE ve N baştan sona ayrı yürür. Beş iletkenli sistem (L1, L2, L3, N, PE). Güvenli, EMC dostu, FI/RCD ile mükemmel anlaşır. Yeni tesisatın standardı. Şemada mavi N ile yeşil-sarı PE'nin trafodan itibaren ayrı yürüdüğüne dikkat.":
    "PE and N run separately from start to finish. A five-conductor system (L1, L2, L3, N, PE). Safe, EMC-friendly, gets along perfectly with FI/RCDs. The standard for new installations. In the diagram, note how the blue N and the green-yellow PE run separately from the transformer onwards.",
  "TN-C-S — ortada tanışıp ayrılanlar":
    "TN-C-S — met in the middle, then split up",
  "Şebekeden binaya kadar PEN (TN-C), bina girişinden itibaren PE ve N ayrılır (TN-S). Almanya'daki tipik ev bağlantısı budur. Şemadaki sarı nokta ayrım noktası: PEN, Hausanschlusskasten'e kadar gelir ve orada N ile PE'ye ayrılır. Önemli kural: bir kez ayrıldılar mı bir daha ASLA birleşemezler — elektrik tesisatının en katı ayrılık hikâyesi.":
    "PEN (TN-C) from the network to the building; from the building entry onwards PE and N are separate (TN-S). This is the typical house connection in Germany. The yellow dot in the diagram is the split point: the PEN comes as far as the Hausanschlusskasten (service entrance box) and is split into N and PE there. Important rule: once separated, they may NEVER be joined again — the strictest break-up story in electrical installation.",
  "TT — herkes kendi toprağına":
    "TT — everyone to their own earth",
  "Trafo kendi topraklamasına sahip, senin binanın da KENDİ toprak elektrodu var (Anlagenerder); ikisi arasında metalik bağlantı yok, hata akımı toprak üzerinden döner. Toprak geçiş dirençleri yüksek olabileceğinden hata akımları küçük kalır — bu yüzden TT sisteminde RCD pratikte zorunlu hayat sigortasıdır. Şemada dikkat: trafodan PE GELMİYOR, gövde binanın kendi toprağına bağlı. Kırsal bölgelerde ve bazı ülkelerde (merhaba Fransa 🥖) yaygın.":
    "The transformer has its own earthing, and your building has ITS OWN earth electrode (Anlagenerder); there is no metallic connection between the two, and fault current returns through the ground. Because earth resistances can be high, fault currents stay small — which is why in a TT system the RCD is, in practice, mandatory life insurance. Note in the diagram: NO PE comes from the transformer; the casing is connected to the building's own earth. Common in rural areas and in some countries (hello France 🥖).",
  "IT — inatçı ve kesintisiz":
    "IT — stubborn and uninterrupted",
  "Şebeke toprağa bağlı DEĞİL (ya da yüksek empedansla bağlı — şemadaki Z kutusu). İlk hata olduğunda kısa devre akımı akacak yol bulamaz → sistem çalışmaya DEVAM eder, sadece izolasyon izleme cihazı (Isolationswächter) alarm verir. İkinci hata gelmeden birinciyi bulman beklenir. Ameliyathaneler ve kesintinin felaket olduğu endüstri tesisleri için: 'ışık sönmesin, alarm ötsün' felsefesi.":
    "The supply is NOT connected to earth (or only through a high impedance — the Z box in the diagram). When the first fault occurs, the short-circuit current finds no path → the system KEEPS running; only the insulation monitoring device (Isolationswächter) raises an alarm. You're expected to find the first fault before the second one arrives. For operating theatres and industrial plants where an outage would be a disaster: the 'keep the lights on, sound the alarm' philosophy.",
  "🚧 Yakında":
    "🚧 Coming soon",
  "Hata senaryosu animasyonları ('PEN koptu, şimdi ne olacak?') ve 'hangi sistemde RCD nasıl davranır' interaktifleri yolda. Şemalar artık burada — animasyonları da Playground motoruyla evlendireceğiz.":
    "Fault scenario animations ('the PEN has broken, now what?') and interactive 'how does the RCD behave in which system' pieces are on the way. The diagrams are here now — we'll marry the animations to the Playground engine too.",
  "Kaçak Akım Koruması":
    "Residual Current Protection",
  "Giden akım dönmüyorsa, biri fazla bilgi sahibi oluyor demektir.":
    "If the current that goes out doesn't come back, someone is learning more than they wanted to.",
  "RCD (Residual Current Device, Almanca kültüründe FI-Schalter) tek bir soruyu takıntı halinde sorar: 'Giden akım, dönen akıma eşit mi?' Normalde fazdan giden her miliamper nötrden geri döner. Dönmüyorsa, akım başka bir yol bulmuş demektir — ve o yol bazen bir insandır. Fark, eşik değeri (ör. 30 mA) aşarsa RCD milisaniyeler içinde devreyi keser.":
    "The RCD (residual current device, known in German as the FI-Schalter) obsessively asks one single question: 'Is the outgoing current equal to the returning current?' Normally every milliamp leaving through the phase returns through the neutral. If it doesn't, the current has found another path — and sometimes that path is a person. If the difference exceeds the threshold (e.g. 30 mA), the RCD cuts the circuit within milliseconds.",
  "30 mA neden 30 mA?":
    "Why is 30 mA 30 mA?",
  "İnsan kalbi için tehlike sınırı kabaca 50 mA civarında başlar (ventriküler fibrilasyon riski). 30 mA'lik RCD bu sınırın altında, üstelik hızlı davranır — bu yüzden İNSAN koruması (Zusatzschutz) için standart budur. 300 mA'lik olanlar ise insan değil YANGIN korumasıdır: 'seni değil, çatını koruyorum' der.":
    "The danger threshold for the human heart begins at roughly 50 mA (risk of ventricular fibrillation). A 30 mA RCD stays below that and reacts fast — which is why it is the standard for protecting PEOPLE (Zusatzschutz, additional protection). The 300 mA ones are FIRE protection, not personal protection: 'I'm not protecting you, I'm protecting your roof.'",
  "Tipler: A, B, F, AC":
    "Types: A, B, F, AC",
  "Tip AC yalnızca sinüs kaçağı görür (Almanya'da tek başına yeterli değil). Tip A, pulslu DC bileşenleri de görür — standart tercih. Tip F frekans konvertörlü cihazlara, Tip B düz DC kaçağı da görebildiği için wallbox/fotovoltaik gibi işlere. Yanlış tip seçersen RCD orada durur, görevi 'süs' olur.":
    "Type AC only detects sinusoidal residual currents (not sufficient on its own in Germany). Type A also detects pulsating DC components — the standard choice. Type F is for equipment with frequency converters, Type B can also see smooth DC residual currents and is used for things like wallboxes and photovoltaics. Choose the wrong type and the RCD just sits there as decoration.",
  "Test butonu":
    "Test button",
  "Üzerindeki T butonu yapay bir kaçak üretir. Ayda bir basılması önerilir; gerçekte çoğu insan hayatında bir kez, o da yanlışlıkla basar. Sen çoğu insan olma — mekanizma yıllarca hareket etmezse yapışabilir.":
    "The T button on it creates an artificial residual current. Pressing it once a month is recommended; in reality most people press it once in their lives, and that by accident. Don't be most people — if the mechanism doesn't move for years, it can stick.",
  "Auslösekarakteristik detayları, seçicilik (Selektivität), bağlantı şemaları ve 'RCD neden ikide bir atıyor' rehberi.":
    "Details of the tripping characteristic, selectivity (Selektivität), wiring diagrams and a 'why does my RCD keep tripping' guide.",
  "Otomat Sigortalar":
    "Circuit Breakers",
  "B, C, D — sigortanın sabır katsayısı.":
    "B, C, D — the breaker's patience factor.",
  "LS-Schalter (Leitungsschutzschalter) iki ayrı reflekse sahiptir. Termik açma: bimetal şerit, uzun süreli hafif aşırı yükte yavaşça ısınıp devreyi keser — 'sabırlı ama unutmaz'. Manyetik açma: kısa devrede bobin, akımı milisaniyede keser — 'düşünmez, atar'. Karakteristik harfi (B/C/D), manyetik refleksin NE ZAMAN devreye gireceğini söyler.":
    "An MCB (LS-Schalter, Leitungsschutzschalter) has two separate reflexes. Thermal tripping: a bimetal strip warms up slowly under a prolonged slight overload and opens the circuit — 'patient, but never forgets'. Magnetic tripping: on a short circuit a coil cuts the current within milliseconds — 'doesn't think, just trips'. The characteristic letter (B/C/D) tells you WHEN the magnetic reflex kicks in.",
  "B tipi: 3–5 × In":
    "Type B: 3–5 × In",
  "Anma akımının 3–5 katında ani açar. Konutların standardı: prizler, aydınlatma. B16 → yaklaşık 48–80 A'de anında keser.":
    "Trips instantly at 3–5 times the rated current. The standard in homes: sockets, lighting. B16 → cuts immediately at roughly 48–80 A.",
  "C tipi: 5–10 × In":
    "Type C: 5–10 × In",
  "Kalkış akımı çeken yüklere tolerans tanır: motorlar, floresan grupları, küçük trafolar. 'Motor kalkarken 7 kat akım çekiyor diye elektriği kesmek olmaz' diyen tip.":
    "Tolerates loads with an inrush current: motors, groups of fluorescent lamps, small transformers. The type that says 'you can't cut the power just because the motor draws 7 times its current while starting'.",
  "D tipi: 10–20 × In":
    "Type D: 10–20 × In",
  "En sabırlısı: kaynak makineleri, büyük trafolar, aşırı kalkış akımlı endüstriyel yükler. Dikkat: sabır arttıkça hat sonundaki kısa devre akımının yine de açtırabilecek kadar büyük olması gerekir — kablo hesabıyla el ele gider.":
    "The most patient one: welding machines, large transformers, industrial loads with extreme inrush currents. Careful: the more patience, the more the short-circuit current at the end of the line still has to be large enough to trip it — this goes hand in hand with the cable calculation.",
  "Zaman-akım eğrileri (interaktif!), seçicilik, hat koruması hesabıyla bağlantısı ve karakteristik seçim rehberi.":
    "Time-current curves (interactive!), selectivity, the link to line protection calculations and a guide to choosing the characteristic.",
  "Koruma Sınıfları":
    "Protection Classes",
  "Cihazlar kendilerini nasıl savunur: üç ekol.":
    "How devices defend themselves: three schools of thought.",
  "Koruma sınıfı (Schutzklasse), bir cihazın elektrik çarpmasına karşı hangi felsefeyle korunduğunu söyler. IP koruma türüyle (toz/su) karıştırılmasın — o başka bir hikâye (o da yakında).":
    "The protection class (Schutzklasse) tells you with which philosophy a device is protected against electric shock. Not to be confused with the IP rating (dust/water) — that's another story (also coming soon).",
  "Sınıf I — koruma iletkenine güven":
    "Class I — trust the protective conductor",
  "Metal gövde PE'ye bağlıdır. İzolasyon hatasında gövdeye kaçan akım PE üzerinden kaçar, sigorta/RCD atar. Sembolü yandaki toprak işareti — tip etiketinde bunu görürsen 'bu cihazın PE'si boşa bağlanmamış' demektir. Çamaşır makinesi, fırın, ütü — mutfağın ağır abileri genelde Sınıf I. Fişinde toprak kontağı olmak ZORUNDADIR.":
    "The metal casing is connected to PE. On an insulation fault, the current leaking to the casing escapes via the PE and the fuse/RCD trips. Its symbol is the earth sign next to this text — if you see it on a rating plate, it means 'this device's PE isn't connected for nothing'. Washing machine, oven, iron — the heavyweights of the household are usually Class I. Its plug MUST have an earth contact.",
  "Sınıf II — çifte zırh":
    "Class II — double armour",
  "Koruma iletkeni yok; onun yerine çift veya güçlendirilmiş izolasyon. Sembolü yandaki iç içe iki kare — sınavda 'doppelte Isolierung' dendiğinde aklına bu kutu içinde kutu gelsin. Matkaplar, saç kurutucular, çoğu şarj adaptörü. Fişinde toprak kontağı olmamasına şaşırma — ihtiyacı yok, zırhı kendinden.":
    "No protective conductor; double or reinforced insulation instead. Its symbol is the two nested squares next to this text — when the exam says 'doppelte Isolierung', think of that box inside a box. Drills, hair dryers, most chargers. Don't be surprised that its plug has no earth contact — it doesn't need one, the armour is built in.",
  "Sınıf III — baştan tehlikesiz":
    "Class III — harmless from the start",
  "Yalnızca SELV/PELV güvenlik küçük gerilimiyle çalışır (AC ≤ 50 V, DC ≤ 120 V). Tehlikeli gerilim cihaza hiç girmez; koruma, kaynağın (güvenlik trafosunun) kendisidir. Oyuncaklar, bahçe aydınlatması, gömme spotlar. Sembolü yandaki romen rakamı III'lü eşkenar dörtgen.":
    "Operates only on SELV/PELV safety extra-low voltage (AC ≤ 50 V, DC ≤ 120 V). Dangerous voltage never enters the device; the protection is the source itself (the safety transformer). Toys, garden lighting, recessed spotlights. Its symbol is the diamond with the Roman numeral III next to this text.",
  "Koruma Önlemleri":
    "Protective Measures",
  "Basis, Fehler, Zusatz — savunmanın üç hattı.":
    "Basis, Fehler, Zusatz — the three lines of defence.",
  "DIN VDE 0100-410'un dünyası. Mantık, soğan modeli gibidir: her katman bir öncekinin başarısız olma ihtimaline karşı vardır.":
    "The world of DIN VDE 0100-410. The logic is like the onion model: each layer exists in case the previous one fails.",
  "1. Basisschutz (temel koruma)":
    "1. Basisschutz (basic protection)",
  "Normal işletmede gerilimli kısımlara dokunamamalısın: izolasyon, kapaklar, muhafazalar, mesafe. Kısacası 'çıplak iletken ortada gezmesin'. Buna eskiden 'doğrudan dokunmaya karşı koruma' denirdi.":
    "In normal operation you must not be able to touch live parts: insulation, covers, enclosures, distance. In short, 'no bare conductors lying around'. This used to be called 'protection against direct contact'.",
  "2. Fehlerschutz (hata koruması)":
    "2. Fehlerschutz (fault protection)",
  "İzolasyon hatası OLDUĞUNDA seni koruyacak katman: otomatik kapama (Abschaltung — sigorta/RCD hata akımını kesmeli, TN'de 0,4 s içinde), çift izolasyon (Sınıf II) veya koruyucu ayırma. 'Hata olursa' değil, 'hata olduğunda' — çünkü olur.":
    "The layer that protects you WHEN there is an insulation fault: automatic disconnection (Abschaltung — the fuse/RCD must cut the fault current, within 0.4 s in TN), double insulation (Class II) or protective separation. Not 'if a fault happens' but 'when a fault happens' — because it will.",
  "3. Zusatzschutz (ek koruma)":
    "3. Zusatzschutz (additional protection)",
  "İlk iki katman da bir şekilde delinirse: 30 mA RCD. İnsan davranışının öngörülemezliğine karşı sigorta — kırılan fişler, kemirilen kablolar, 'bir saniye şuraya uzanayım' anları için. Priz devrelerinde ve banyoda zorunlu.":
    "If the first two layers are somehow breached as well: a 30 mA RCD. Insurance against the unpredictability of human behaviour — for broken plugs, gnawed cables and 'let me just reach over there for a second' moments. Mandatory for socket circuits and in the bathroom.",
  "Abschaltzeiten tabloları, ölçüm ve doğrulama (Erstprüfung), Potentialausgleich ve senaryo bazlı interaktif quiz.":
    "Tables of disconnection times (Abschaltzeiten), measuring and verification (Erstprüfung), equipotential bonding (Potentialausgleich) and a scenario-based interactive quiz.",
  "5 Güvenlik Kuralı":
    "The 5 Safety Rules",
  "Beş parmak, beş kural — sıralaması ezber değil, hayat sigortası.":
    "Five fingers, five rules — the order isn't rote learning, it's life insurance.",
  "DIN VDE 0105-100'ün en ünlü beşlisi. Gerilimli tesiste ÇALIŞMAYA BAŞLAMADAN önce, bu sırayla uygulanır — sıra önemlidir, çünkü her kural bir sonrakinin güvenli yapılabilmesinin ön şartıdır. İş bitince de TERS SIRAYLA geri alınır (önce örtüleri kaldır, en son gerilimi ver). Elektrikçilerin 'içgüdü' haline getirdiği tek ezber buysa, sebebi var: bu beş adım her yıl insanların hayatını kurtarıyor.":
    "The most famous five of DIN VDE 0105-100. They are applied in this order BEFORE STARTING WORK on an installation — the order matters, because each rule is the precondition for carrying out the next one safely. When the work is done, they are undone in REVERSE ORDER (first remove the covers, switch the voltage back on last). If this is the one thing electricians have drilled until it became 'instinct', there's a reason: these five steps save lives every year.",
  "1️⃣ Freischalten — gerilimi kes / ayır":
    "1️⃣ Freischalten — disconnect / isolate",
  "Tesisatı TÜM kutuplardan besleyen her yerden ayır: LS'yi indir, sigortaları çek, fişi çek, şalteri aç. 'Ben lambadan anladım, kapalıydı' bir ayırma yöntemi değildir — lambanın patlak olma ihtimali senin hayatından daha olası. Birden fazla besleme olabileceğini unutma (merhaba, ikinci hattan beslenen priz).":
    "Disconnect the installation at ALL poles and from every point that feeds it: switch off the MCB, pull the fuses, pull the plug, open the switch. 'I could tell from the lamp, it was off' is not a method of isolation — the lamp being blown is more likely than you'd want to bet your life on. Don't forget there may be more than one supply (hello, socket fed from a second circuit).",
  "2️⃣ Gegen Wiedereinschalten sichern — tekrar açılmaya karşı emniyete al":
    "2️⃣ Gegen Wiedereinschalten sichern — secure against re-energising",
  "Kestiğin şalteri kilitle, uyarı levhası as ('Çalışılıyor — açma!'), çektiğin sigortayı CEBİNE koy. Klasik kaza senaryosu: sen bodrumda kablodayken, iyi niyetli bir meslektaş 'kim kapattı bunu?' deyip şalteri kaldırır. Levha ve kilit, o iyi niyeti durduran tek şeydir.":
    "Lock the switch you opened, hang up a warning sign ('Work in progress — do not switch on!'), put the fuse you pulled IN YOUR POCKET. The classic accident scenario: you're in the basement with your hands on the cable while a well-meaning colleague says 'who switched this off?' and flips it back on. The sign and the lock are the only things that stop that good intention.",
  "3️⃣ Spannungsfreiheit feststellen — gerilimsizliği DOĞRULA":
    "3️⃣ Spannungsfreiheit feststellen — VERIFY the absence of voltage",
  "İki kutuplu gerilim test cihazıyla (Duspol tarzı) tüm iletkenler arasında ölç: L-N, L-PE, N-PE, fazlar arası. Önemli ritüel: test cihazını ölçümden ÖNCE ve SONRA bilinen gerilimli bir noktada dene — cihaz bozuksa 'gerilim yok' göstermesi seni teselli etmez. Multimetre bu iş için uygun DEĞİLDİR (yanlış kademe, bozuk problar… gerilim test cihazı bu yüzden var).":
    "Measure between all conductors with a two-pole voltage tester (Duspol-style): L–N, L–PE, N–PE, phase to phase. The important ritual: try the tester on a known live point BEFORE and AFTER the measurement — if the tester is broken, its 'no voltage' reading is no comfort. A multimeter is NOT suitable for this job (wrong range, broken leads… that's why voltage testers exist).",
  "4️⃣ Erden und kurzschließen — toprakla ve kısa devre et":
    "4️⃣ Erden und kurzschließen — earth and short-circuit",
  "Önce toprakla, sonra kısa devre et — bu sırayla. Böylece biri yanlışlıkla gerilim verirse enerji senin üzerinden değil, hazırladığın kısa devre yolundan akar ve sigortayı attırır. 1 kV üzeri tesislerde ZORUNLU; alçak gerilimde her durumda değil ama örneğin geri besleme riski (jeneratör, PV!) varsa hayati.":
    "First earth, then short-circuit — in that order. If someone energises the installation by mistake, the energy then flows through the short-circuit path you prepared, not through you, and trips the fuse. MANDATORY on installations above 1 kV; at low voltage not in every case, but vital wherever there is a risk of back-feed (generator, PV!).",
  "5️⃣ Benachbarte, unter Spannung stehende Teile abdecken — komşu gerilimli kısımları ört/ayır":
    "5️⃣ Benachbarte, unter Spannung stehende Teile abdecken — cover or screen off adjacent live parts",
  "Her şeyi kapatamadığın durumlar olur: yandaki bara gerilimli kalmak zorunda. O zaman izolasyon örtüleri, lastik paspaslar, bariyerler devreye girer. Mantık basit: dokunamayacağın şey seni çarpamaz. 'Dikkat ederim' bir koruma önlemi değildir — yorgun bir elin nereye uzanacağını kimse bilemez.":
    "There are situations where you can't switch everything off: the busbar next door has to stay live. That's when insulating covers, rubber mats and barriers come in. The logic is simple: what you can't touch can't shock you. 'I'll be careful' is not a protective measure — nobody knows where a tired hand will reach.",
  "Bonus: geri dönüş":
    "Bonus: the way back",
  "İş bitti, herkes uzaklaştı, aletler toplandı → kurallar TERS sırayla kaldırılır: örtüler kalkar, topraklama sökülür, levhalar alınır, kilit açılır ve en son gerilim verilir. Gerilimi verip SONRA topraklamayı sökmeye çalışan kişinin o günü çok kötü geçer — bu cümleyi bir daha oku.":
    "Work done, everyone clear, tools collected → the rules are undone in REVERSE order: covers come off, earthing is removed, signs are taken down, the lock is opened and only at the very end is the voltage switched back on. Anyone who switches on first and THEN tries to remove the earthing is going to have a very bad day — read that sentence once more.",
  "Mantık Fonksiyonları":
    "Logic Functions",
  "UND, ODER, NICHT & arkadaşları — kararların matematiği.":
    "UND, ODER, NICHT & friends — the mathematics of decisions.",
  "Kumanda tekniğinin tamamı aslında tek bir soruya cevap verir: 'Hangi şartlarda çıkış aktif olsun?' Bu şartların dili mantık fonksiyonlarıdır. İyi haber: bunları zaten biliyorsun — seri bağlı kontaklar UND'dir, paralel kontaklar ODER, Öffner ise NICHT. Kapı sembolleri (DIN EN 60617: kutu + işaret) aynı fikrin elektronik/SPS dünyasındaki yazılışıdır. Aşağıdaki her fonksiyonu Playground'ın Logik modunda canlı kurabilirsin.":
    "All of control engineering really answers one question: 'Under which conditions should the output be active?' The language of those conditions is logic functions. Good news: you already know them — contacts in series are UND (AND), contacts in parallel are ODER (OR), and an Öffner (break contact) is NICHT (NOT). The gate symbols (DIN EN 60617: box + sign) are the same idea written the way the electronics/PLC world writes it. You can build every function below live in the Playground's logic mode.",
  "UND (AND) — hepsi, yoksa hiç":
    "UND (AND) — all or nothing",
  "Bütün girişler 1 ise çıkış 1. Kontak karşılığı: seri bağlantı. Klasik örnek: pres makinesinin iki el kumandası — iki buton BİRDEN basılı değilse pres inmez, çünkü tek elin nerede olduğu belli olmalı. Kutudaki işaret: &.":
    "The output is 1 if all inputs are 1. Contact equivalent: series connection. Classic example: the two-hand control of a press — unless BOTH buttons are pressed, the press doesn't come down, because it must be clear where each hand is. The sign in the box: &.",
  "Çıkış":
    "Output",
  "ODER (OR) — herhangi biri yeter":
    "ODER (OR) — any one will do",
  "Girişlerden en az biri 1 ise çıkış 1. Kontak karşılığı: paralel bağlantı. Örnek: kapı zili — alt kapıdaki buton da üst kapıdaki de zili çaldırır. İşaret: ≥1 ('bir veya daha fazlası aktifse' demenin matematikçe kısaltması).":
    "The output is 1 if at least one input is 1. Contact equivalent: parallel connection. Example: a doorbell — the button at the lower door rings it and so does the one at the upper door. Sign: ≥1 (mathematician's shorthand for 'if one or more is active').",
  "NICHT (NOT) — tersine çevirici":
    "NICHT (NOT) — the inverter",
  "Girişi ters çevirir: 1 → 0, 0 → 1. Kontak karşılığı: Öffner. Çıkıştaki küçük yuvarlak 'değil' işaretidir — nerede görürsen orada bir tersleme var demektir. Motor çalışMIYORken yanan 'hazır' lambası tam olarak budur.":
    "Inverts the input: 1 → 0, 0 → 1. Contact equivalent: Öffner (break contact). The small circle at the output is the 'not' sign — wherever you see it, something is being inverted. The 'ready' lamp that's lit while the motor is NOT running is exactly this.",
  "NAND — UND'un ters kardeşi":
    "NAND — AND's contrary sibling",
  "UND + NICHT: yalnızca TÜM girişler 1 olduğunda çıkış 0, diğer her durumda 1. Neden bu kadar önemli? Çünkü NAND üniversal kapıdır: sadece NAND'lerle UND da, ODER de, NICHT de kurulabilir — yani teoride her devre. Çip üreticilerinin gözdesi; elektroniğin İsviçre çakısı.":
    "UND + NICHT: the output is 0 only when ALL inputs are 1, and 1 in every other case. Why does it matter so much? Because NAND is a universal gate: UND, ODER and NICHT can all be built from NANDs alone — so in theory any circuit. The chip makers' favourite; the Swiss army knife of electronics.",
  "NOR — ODER'in ters kardeşi":
    "NOR — OR's contrary sibling",
  "ODER + NICHT: herhangi bir giriş 1 olduğu anda çıkış 0; ancak HİÇBİRİ aktif değilse 1. O da üniversaldir. Asıl şöhreti: iki NOR'u çapraz bağlarsan RS-Flipflop elde edersin — Selbsthaltung'un dijital atası. Playground'da dene: her kapının çıkışını diğerinin girişine bağla, butonlarla Set/Reset yap.":
    "ODER + NICHT: the moment any input is 1 the output is 0; it's 1 only when NONE is active. It is universal too. Its real claim to fame: cross-couple two NORs and you get an RS flip-flop — the digital ancestor of Selbsthaltung (latching). Try it in the Playground: connect each gate's output to the other's input and Set/Reset with the buttons.",
  "XOR (Antivalenz) — ya o, ya bu; ikisi değil":
    "XOR (Antivalenz) — either this or that; not both",
  "Girişler FARKLIYSA çıkış 1, aynıysa 0. İşaret: =1 ('tam olarak bir tanesi aktif'). Bunu yıllardır kullanıyorsun: koridorun iki ucundaki Wechselschalter'ler. Hangi şalteri çevirirsen çevir lambanın durumu değişir — çünkü lamba, şalter konumlarının XOR'udur. (Aynıysa 1 veren kardeşi XNOR/Äquivalenz da vardır, o da =1 kutusunun çıkışına yuvarlak takılmış hali.)":
    "The output is 1 if the inputs are DIFFERENT, 0 if they're the same. Sign: =1 ('exactly one is active'). You've been using this for years: the two-way switches (Wechselschalter) at either end of a hallway. Whichever switch you flip, the lamp changes state — because the lamp is the XOR of the switch positions. (It also has a sibling that gives 1 when the inputs are the same, XNOR/Äquivalenz: the =1 box with a circle on its output.)",
  "Kontak tekniği ↔ Logik sözlüğü":
    "Contact logic ↔ logic dictionary",
  "İki dünya aynı dili konuşur, sadece aksanları farklı. Sınavda 'kontak planını mantık planına çevir' tarzı sorular tam buradan çıkar:":
    "The two worlds speak the same language, just with different accents. Exam questions of the 'convert this contact plan into a logic diagram' kind come from right here:",
  "Kontak tekniği":
    "Contact logic",
  "Logik karşılığı":
    "Logic equivalent",
  "Seri bağlı kapayıcılar":
    "Make contacts in series",
  "Paralel bağlı kapayıcılar":
    "Make contacts in parallel",
  "Öffner (açıcı kontak)":
    "Öffner (break contact)",
  "NICHT (tersleme)":
    "NICHT (inversion)",
  "Seri bağlı açıcılar":
    "Break contacts in series",
  "NOR (hiçbiri basılı değilse 1)":
    "NOR (1 if none is pressed)",
  "Paralel bağlı açıcılar":
    "Break contacts in parallel",
  "NAND (ikisi birden basılı değilse 1)":
    "NAND (1 unless both are pressed)",
  "Selbsthaltung (mühürleme)":
    "Selbsthaltung (latching)",
  "RS-Flipflop (2 × NOR)":
    "RS flip-flop (2 × NOR)",
  "Wechselschaltung (koridor)":
    "Wechselschaltung (two-way switching)",
  "Devre Sembolleri":
    "Circuit Symbols",
  "Elektrikçinin hiyeroglifleri.":
    "The electrician's hieroglyphs.",
  "Şemalar, elektrikçilerin ortak dili — ve her dilde olduğu gibi, alfabeyi bilmeyen cümleyi de okuyamaz. Öffner mi Schließer mi, Taster mı Schalter mı; hangi kutu bobin, hangi çizgi PE… Aşağıda en sık karşılaşacağın semboller, şema türleri ve harf kodları var. Sembollerin hepsi Playground'da canlı: sürükle, bağla, çalıştır.":
    "Schematics are the common language of electricians — and as in any language, if you don't know the alphabet you can't read the sentence. Öffner or Schließer, Taster or Schalter; which box is a coil, which line is the PE… Below are the symbols you'll meet most often, the types of diagram and the letter codes. All the symbols are alive in the Playground: drag, connect, run.",
  "Şema türleri":
    "Types of diagram",
  "Aynı tesisat üç farklı şekilde çizilir; hangisine baktığını bilmezsen yanlış soruya cevap ararsın. Sınavda da işte de en çok Stromlaufplan okursun.":
    "The same installation is drawn in three different ways; if you don't know which one you're looking at, you'll be looking for the answer to the wrong question. In the exam and on the job, the one you'll read most is the Stromlaufplan (circuit diagram).",
  "Şema":
    "Diagram",
  "Ne gösterir?":
    "What does it show?",
  "Ne zaman kullanılır?":
    "When is it used?",
  "Übersichtsschaltplan":
    "Übersichtsschaltplan",
  "Tek hatlı, sadeleştirilmiş genel bakış; iletken sayısı çentiklerle belirtilir":
    "Single-line, simplified overview; the number of conductors is marked with strokes",
  "Dağıtım panosu, tesisin bütünü":
    "Distribution board, the installation as a whole",
  "Stromlaufplan (aufgelöste Darstellung)":
    "Stromlaufplan (aufgelöste Darstellung)",
  "Her akım yolu ayrı ayrı, yukarıdan aşağıya; bobin ve kontakları ayrı yerlerde çizilir":
    "Each current path separately, top to bottom; a coil and its contacts are drawn in different places",
  "Kontaktör devreleri, arıza arama":
    "Contactor circuits, fault finding",
  "Stromlaufplan (zusammenhängende Darstellung)":
    "Stromlaufplan (zusammenhängende Darstellung)",
  "Cihazlar bütün halinde, tüm bağlantılarıyla":
    "Devices drawn as a whole, with all their connections",
  "Basit tesisat devreleri":
    "Simple installation circuits",
  "Installationsplan":
    "Installationsplan",
  "Kat planı üzerinde priz, şalter ve lamba konumları":
    "Positions of sockets, switches and lamps on the floor plan",
  "Şantiye: neyin nereye monte edileceği":
    "On site: what gets mounted where",
  "Şalterler ve butonlar":
    "Switches and push-buttons",
  "Schließer (kapayıcı) basılınca devreyi kapatır, Öffner (açıcı) basılınca açar. Schalter konumunda kalır; Taster yaylıdır, bırakınca geri döner. Semboller her zaman BASILMAMIŞ ve GERİLİMSİZ halde çizilir — şemayı okurken ilk kural budur. Kontak numaraları da konuşur: sonu 3-4 ile biten (13-14, 23-24) kapayıcı, 1-2 ile biten (11-12, 21-22) açıcıdır.":
    "A Schließer (make contact, NO) closes the circuit when actuated, an Öffner (break contact, NC) opens it. A Schalter (switch) stays in position; a Taster (push-button) is spring-loaded and returns when released. Symbols are always drawn UNACTUATED and DE-ENERGISED — that's the first rule when reading a schematic. The contact numbers talk too: those ending in 3-4 (13-14, 23-24) are make contacts, those ending in 1-2 (11-12, 21-22) are break contacts.",
  "Kontaktör ve zaman rölesi":
    "Contactor and time relay",
  "Bobin (A1–A2) gerilim alınca çeker ve aynı etiketi taşıyan bütün kontakları birlikte oynatır. Aufgelöste Darstellung'da bobin bir akım yolunda, kontakları bambaşka yollarda durur; onları birbirine bağlayan tek şey etikettir (K1). Zaman kontaklarındaki yarım daire gecikmeyi gösterir.":
    "When the coil (A1–A2) is energised it pulls in and moves all contacts carrying the same label together. In the aufgelöste Darstellung the coil sits in one current path and its contacts in completely different ones; the only thing linking them is the label (K1). The semicircle on timed contacts indicates the delay.",
  "Yükler ve kaynak":
    "Loads and source",
  "Devrenin işi yapan kısmı. Lamba çarpı işaretli daire, motor içinde M yazan dairedir. Yük olmadan L'den N'ye giden her yol kısa devredir — şemada bunu görebilmek, sigortadan önce senin işin.":
    "The part of the circuit that does the work. A lamp is a circle with a cross, a motor is a circle with an M inside. Every path from L to N without a load is a short circuit — spotting that in the schematic is your job, before it becomes the fuse's.",
  "Harf kodları (Betriebsmittelkennzeichnung)":
    "Letter codes (Betriebsmittelkennzeichnung)",
  "Her elemanın yanındaki harf, onun ne iş yaptığını söyler (DIN EN 81346-2). Eski şemalarda ve birçok okul kitabında hâlâ eski harfler geçer: sinyal lambası için H, ana kontaktör için K. İkisini de tanımak zorundasın; sınav hangisini kullanıyorsa onu yaz.":
    "The letter next to each component tells you what it does (DIN EN 81346-2). Old schematics and many school books still use the old letters: H for a signal lamp, K for a main contactor. You need to recognise both; write whichever your exam uses.",
  "Harf":
    "Letter",
  "Görev":
    "Function",
  "Örnek":
    "Example",
  "Fiziksel büyüklüğü sinyale çevirir":
    "Converts a physical quantity into a signal",
  "Sensör, hareket dedektörü, termostat":
    "Sensor, motion detector, thermostat",
  "Işık veya ısı üretir":
    "Produces light or heat",
  "Aydınlatma lambası, ısıtıcı":
    "Lighting, heater",
  "Korur":
    "Protects",
  "Sigorta, LS-Schalter, RCD, motor koruma":
    "Fuse, MCB (LS-Schalter), RCD, motor protection",
  "Enerji üretir":
    "Generates energy",
  "Jeneratör, akü, güç kaynağı":
    "Generator, battery, power supply",
  "Sinyal işler":
    "Processes signals",
  "Yardımcı kontaktör, röle, zaman rölesi":
    "Auxiliary contactor, relay, time relay",
  "Mekanik hareket üretir":
    "Produces mechanical motion",
  "Motor":
    "Motor",
  "Bilgi gösterir":
    "Presents information",
  "Sinyal lambası, sayaç, ölçü aleti (eski: H)":
    "Signal lamp, meter, measuring instrument (old: H)",
  "Enerji akışını anahtarlar":
    "Switches the flow of energy",
  "Ana kontaktör, güç şalteri (eski: K)":
    "Main contactor, circuit breaker (old: K)",
  "El hareketini sinyale çevirir":
    "Converts manual operation into a signal",
  "Şalter, buton":
    "Switch, push-button",
  "Enerjiyi dönüştürür":
    "Converts energy",
  "Trafo, frekans konvertörü":
    "Transformer, frequency converter",
  "Enerji veya sinyal iletir":
    "Conducts energy or signals",
  "Kablo, bara":
    "Cable, busbar",
  "Bağlar":
    "Connects",
  "Klemens, priz, fiş":
    "Terminal, socket, plug",
  "Döşeme Türleri":
    "Installation Methods",
  "Kablonun nerede yattığı, ne kadar taşıyacağını belirler.":
    "Where the cable lies decides how much it can carry.",
  "Aynı kablo, duvarın içinde başka, kablo kanalında başka, açık havada bambaşka akım taşır — mesele ısının kaçıp kaçamadığıdır. DIN VDE 0298-4 bunu harflerle sınıflandırır. Harf ilerledikçe kablo nefes alır, taşıyabildiği akım (Strombelastbarkeit, I_z) artar.":
    "The same cable carries one current inside a wall, another in trunking and yet another in free air — it all comes down to whether the heat can escape. DIN VDE 0298-4 classifies this with letters. The further along the alphabet, the better the cable can breathe and the higher its current-carrying capacity (Strombelastbarkeit, I_z).",
  "Referans döşeme türleri":
    "Reference installation methods",
  "Tabloda aradığın şey kablonun KENDİSİ değil, etrafındaki ortamdır. Bir hat yolu boyunca birden fazla tür varsa en kötüsü belirleyicidir: 20 metre duvar üstünden gidip 1 metre yalıtımın içinden geçen kablo, A türüne göre hesaplanır.":
    "What you look up in the table is not the cable ITSELF but its surroundings. If there are several methods along a cable route, the worst one decides: a cable that runs 20 metres on the wall and 1 metre through insulation is calculated as method A.",
  "Tür":
    "Method",
  "Nasıl döşenir?":
    "How is it installed?",
  "Tipik örnek":
    "Typical example",
  "Tek damarlı iletkenler, ısı yalıtımlı duvar içindeki boruda":
    "Single-core conductors in conduit inside a thermally insulated wall",
  "Ahşap karkas / alçıpan duvarda boru içinde H07V-U":
    "H07V-U in conduit in a timber-frame / plasterboard wall",
  "Çok damarlı kablo, ısı yalıtımlı duvar içindeki boruda":
    "Multi-core cable in conduit inside a thermally insulated wall",
  "Yalıtımlı duvarda boru içinde NYM":
    "NYM in conduit in an insulated wall",
  "Tek damarlı iletkenler, duvar üstü boru veya kanalda":
    "Single-core conductors in surface-mounted conduit or trunking",
  "Sıva üstü boruda H07V-U":
    "H07V-U in surface-mounted conduit",
  "Çok damarlı kablo, duvar üstü boru veya kanalda":
    "Multi-core cable in surface-mounted conduit or trunking",
  "Kablo kanalında NYM":
    "NYM in cable trunking",
  "Doğrudan duvarın üstünde veya sıvanın içinde":
    "Directly on the wall or embedded in plaster",
  "Sıva altı NYM, kroşeyle sıva üstü NYM":
    "NYM under plaster, NYM clipped on the surface",
  "Toprak altında (boru içinde veya doğrudan)":
    "In the ground (in a duct or buried direct)",
  "Bahçe hattı, NYY":
    "Garden supply, NYY",
  "Çok damarlı kablo, havada serbest (duvardan mesafeli)":
    "Multi-core cable in free air (spaced from the wall)",
  "Kablo rafında NYM / NYY":
    "NYM / NYY on a cable tray",
  "Tek damarlı kablolar, havada (F: birbirine değerek, G: aralıklı)":
    "Single-core cables in free air (F: touching, G: spaced)",
  "Endüstride büyük kesitli besleme hatları":
    "Large supply cables in industry",
  "Akım taşıma kapasitesi I_z (A)":
    "Current-carrying capacity I_z (A)",
  "Bakır iletken, PVC yalıtım (izin verilen iletken sıcaklığı 70 °C), ortam sıcaklığı 30 °C. Her hücrede ilk değer 2 yüklü damar (tek fazlı devre), ikinci değer 3 yüklü damar (trifaze devre) içindir. PE yüklü damar sayılmaz.":
    "Copper conductor, PVC insulation (permissible conductor temperature 70 °C), ambient temperature 30 °C. In each cell the first value is for 2 loaded conductors (single-phase circuit), the second for 3 loaded conductors (three-phase circuit). The PE does not count as a loaded conductor.",
  "mm²":
    "mm²",
  "Düzeltme faktörleri":
    "Correction factors",
  "Tablo değerleri ideal koşullar içindir. Ortam 30 °C'den sıcaksa ya da aynı boruda/kanalda birden fazla devre yan yana ısınıyorsa, tablo değeri faktörlerle çarpılır: I_z = I_tablo · f_sıcaklık · f_yığılma. İkisi birden geçerliyse ikisi de çarpılır — kablo için kötü günler üst üste gelir.":
    "The table values are for ideal conditions. If the surroundings are warmer than 30 °C, or several circuits heat each other up in the same conduit/trunking, the table value is multiplied by factors: I_z = I_table · f_temperature · f_grouping. If both apply, both are multiplied — for a cable, bad days come in pairs.",
  "Ortam sıcaklığı (PVC)":
    "Ambient temperature (PVC)",
  "Sıcaklık faktörü":
    "Temperature factor",
  "Yan yana devre sayısı":
    "Number of circuits side by side",
  "Yığılma faktörü":
    "Grouping factor",
  "Seçim zinciri: I_b ≤ I_n ≤ I_z":
    "The selection chain: I_b ≤ I_n ≤ I_z",
  "Önce yükün çektiği akım (I_b), sonra onu karşılayan sigorta (I_n), en son da o sigortayı taşıyabilen kablo (I_z). Sigorta kabloyu korur, tersi değil. Örnek: 3 yüklü damar, 1,5 mm². C türünde I_z = 17,5 A → B16 uygun. Aynı kablo A1 türünde yalnızca 13,5 A taşır → B16 OLMAZ; ya B13'e inersin ya da 2,5 mm²'ye çıkarsın (18 A). Kesiti seçtikten sonra iş bitmez: uzun hatlarda gerilim düşümünü de kontrol et — Spannungsfall kartları bunun için var.":
    "First the current the load draws (I_b), then the protective device that covers it (I_n), and finally the cable that can carry that device's rating (I_z). The fuse protects the cable, not the other way round. Example: 3 loaded conductors, 1.5 mm². With method C, I_z = 17.5 A → B16 is fine. The same cable with method A1 carries only 13.5 A → B16 is NOT allowed; either go down to B13 or up to 2.5 mm² (18 A). Choosing the cross-section isn't the end of it: on long runs check the voltage drop too — that's what the Spannungsfall cards are for.",
  "⚠️ Bu tablolar ne kadar bağlayıcı?":
    "⚠️ How binding are these tables?",
  "Buradaki değerler öğrenmek ve hızlı kontrol içindir; sık kullanılan kesitleri ve türleri kapsar. Gerçek projede ve sınavda güncel norm (DIN VDE 0298-4, DIN VDE 0100-520) ile elindeki Tabellenbuch geçerlidir. Farklı yalıtım (ör. VPE/XLPE, 90 °C), alüminyum iletken veya toprak altı döşemede değerler değişir.":
    "The values here are for learning and quick checks; they cover the commonly used cross-sections and methods. In a real project and in the exam, the current standard (DIN VDE 0298-4, DIN VDE 0100-520) and your own Tabellenbuch apply. With different insulation (e.g. VPE/XLPE, 90 °C), aluminium conductors or buried cables the values change.",
  "Kaynak (yatay)":
    "Source (horizontal)",
  "Kaynak (dikey)":
    "Source (vertical)",
  "Ray L":
    "Rail L",
  "Ray N":
    "Rail N",
  "Knotenpunkt":
    "Knotenpunkt (junction)",
  "Şalter (kapayıcı)":
    "Switch (make contact)",
  "Şalter (açıcı)":
    "Switch (break contact)",
  "Buton (kapayıcı)":
    "Push-button (make contact)",
  "Buton (açıcı)":
    "Push-button (break contact)",
  "Eş kontak (kapayıcı)":
    "Linked contact (make)",
  "Eş kontak (açıcı)":
    "Linked contact (break)",
  "Lamba":
    "Lamp",
  "Kontaktör bobini":
    "Contactor coil",
  "Kontak (kapayıcı)":
    "Contact (make)",
  "Kontak (açıcı)":
    "Contact (break)",
  "Zaman rölesi":
    "Time relay",
  "Zaman kontağı (kapayıcı)":
    "Timed contact (make)",
  "Zaman kontağı (açıcı)":
    "Timed contact (break)",
  "Gerilim kaynağı (şebeke). Gerilimi panelden değiştir; simülasyonda üzerine tıklayarak aç/kapa.":
    "Voltage source (mains). Change the voltage in the panel; click it during the simulation to switch it on/off.",
  "Dikey kaynak: L üstte, N altta. Panelden veya simülasyonda tıklayarak aktif/deaktif edilebilir.":
    "Vertical source: L at the top, N at the bottom. Can be enabled/disabled in the panel or by clicking it during the simulation.",
  "L rayı (Sammelschiene): fiziksel modda faz, Logik modunda mantık 1. Sabittir, silinmez.":
    "L rail (Sammelschiene): the phase in physical mode, logic 1 in logic mode. It is fixed and cannot be deleted.",
  "N rayı: dönüş / mantık 0. Devrenin bittiği yer.":
    "N rail: return path / logic 0. Where the circuit ends.",
  "Knotenpunkt: kablo dallanma noktası. Kablo çekerken boş alana tıklayınca otomatik oluşur; buradan istediğin kadar kol ayır.":
    "Knotenpunkt: a branching point for wires. Created automatically when you click empty space while wiring; branch off from here as often as you like.",
  "Kalıcı şalter, kapayıcı (Schließer). Simülasyonda tıkla: konum değiştirir ve orada kalır.":
    "Latching switch, make contact (Schließer). Click it in the simulation: it changes position and stays there.",
  "Kalıcı şalter, açıcı (Öffner). Normalde KAPALI, tıklayınca açar.":
    "Latching switch, break contact (Öffner). Normally CLOSED, opens when clicked.",
  "Yaylı buton, kapayıcı (Taster). Sadece BASILI TUTTUĞUN sürece kapalı — zil butonu mantığı.":
    "Spring-return push-button, make contact (Taster). Closed only for AS LONG AS YOU HOLD IT — doorbell logic.",
  "Yaylı buton, açıcı. Normalde kapalı, bastığın sürece açık. Acil stoplar bu yüzden hep açıcıdır.":
    "Spring-return push-button, break contact. Normally closed, open while you press it. That's why emergency stops are always break contacts.",
  "Eş kontak (kapayıcı): panelden seçtiğin şalterin/butonun İKİNCİ kontağı. Aynı düğmeye basınca bu da onunla birlikte hareket eder. Her düğmenin 1 kapayıcı + 1 açıcı eş kontağı olabilir — gerçek düğmede daha fazlasına yer yok 😄":
    "Linked contact (make): the SECOND contact of the switch/button you pick in the panel. When that button is pressed, this one moves with it. Each button can have 1 make + 1 break linked contact — a real button has no room for more 😄",
  "Eş kontak (açıcı): seçtiğin düğme basılınca BU AÇILIR. Tasterverriegelung'un anahtarı: S1'in açıcısını S2'nin yoluna koy, ikisi aynı anda çalışamasın. Turkuaz kesik çizgi = mekanik bağ işareti.":
    "Linked contact (break): THIS OPENS when the selected button is pressed. The key to Tasterverriegelung (push-button interlock): put S1's break contact in S2's path so the two can't run at the same time. Turquoise dashed line = mechanical link.",
  "Lamba (H). Tam gerilimde parlar, seri bölünmüş gerilimde loş yanar. Logik modunda: giriş 1 ise yanar.":
    "Lamp (H). Shines at full voltage, glows dimly when the voltage is shared in series. In logic mode: lit when the input is 1.",
  "Motor (M). Tam gerilim alınca döner (mavi ışıma), yarım gerilimde 'zayıf!' diye sızlanır.":
    "Motor (M). Turns when it gets full voltage (blue glow); at half voltage it whines 'too weak!'.",
  "Kontaktör bobini (Schütz, K). A1–A2 gerilim görünce çeker ve aynı etiketli TÜM kontakları oynatır.":
    "Contactor coil (Schütz, K). Pulls in when A1–A2 see voltage and moves ALL contacts with the same label.",
  "Kontaktör kontağı, kapayıcı. Panelden hangi bobini (K1…) takip edeceğini seç.":
    "Contactor contact, make. Choose in the panel which coil (K1…) it follows.",
  "Kontaktör kontağı, açıcı. Bobin çekince AÇILIR — kilitleme (Verriegelung) bununla yapılır.":
    "Contactor contact, break. OPENS when the coil pulls in — this is how interlocking (Verriegelung) is done.",
  "Zaman rölesi (KT). Panelden modunu seç: EIN-verzögert (çekmede gecikme), AUS-verzögert (bırakmada gecikme), IMPULS (tek darbe), TAKT (yanıp sönme). Süre de ayarlanır.":
    "Time relay (KT). Pick its mode in the panel: EIN-verzögert (on-delay), AUS-verzögert (off-delay), IMPULS (single pulse), TAKT (flashing). The time is adjustable too.",
  "Zaman kontağı, kapayıcı: bağlı rölenin moduna göre hareket eder. Yarım daire = zaman işareti.":
    "Timed contact, make: moves according to the mode of its relay. Semicircle = timing mark.",
  "Zaman kontağı, açıcı: röle 'aktif' sayıldığında açılır.":
    "Timed contact, break: opens when the relay counts as 'active'.",
  "UND (&): bütün girişler 1 ise çıkış 1. Seri kontakların elektronik ruh ikizi. Presin iki el butonu: ikisi birden basılı değilse inmez.":
    "UND (&): the output is 1 if all inputs are 1. The electronic soulmate of contacts in series. The two-hand buttons of a press: it won't come down unless both are pressed.",
  "ODER (≥1): girişlerden HERHANGİ biri 1 ise çıkış 1. Paralel kontaklar. Kapı zili: alt kapı da üst kapı da çaldırır.":
    "ODER (≥1): the output is 1 if ANY input is 1. Contacts in parallel. A doorbell: the lower door rings it and so does the upper one.",
  "NICHT: girişi ters çevirir. Öffner'in elektronik hali. Çıkıştaki yuvarlak = 'değil' şapkası.":
    "NICHT: inverts the input. The electronic version of an Öffner. The circle at the output = the 'not' hat.",
  "NAND: UND + değil. Üniversal kapı — sadece NAND'lerle her devre kurulabilir; elektroniğin İsviçre çakısı.":
    "NAND: UND + not. The universal gate — any circuit can be built from NANDs alone; the Swiss army knife of electronics.",
  "NOR: ODER + değil. İki NOR'u çaprazlarsan RS-Flipflop olur — Selbsthaltung'un dijital dedesi. Dene!":
    "NOR: ODER + not. Cross-couple two NORs and you get an RS flip-flop — the digital grandfather of Selbsthaltung. Try it!",
  "XOR / Antivalenz (=1): girişler FARKLIYSA 1. Koridordaki iki Wechselschalter tam olarak budur.":
    "XOR / Antivalenz (=1): 1 if the inputs are DIFFERENT. That's exactly what the two Wechselschalter in a hallway are.",
  "Lamba + Şalter":
    "Lamp + switch",
  "Tasterverriegelung (eş kontaklarla)":
    "Tasterverriegelung (with linked contacts)",
  "Zaman rölesi (gecikmeli lamba)":
    "Time relay (delayed lamp)",
  "Kontaktör kilitleme (Verriegelung)":
    "Contactor interlock (Verriegelung)",
  "Kısa devre (bilerek 💥)":
    "Short circuit (on purpose 💥)",
  "UND — iki el kumandası":
    "UND — two-hand control",
  "ODER — kapı zili":
    "ODER — doorbell",
  "XOR — koridor lambası":
    "XOR — hallway light",
  "NAND — üniversal kapı":
    "NAND — universal gate",
};

export default dict;
