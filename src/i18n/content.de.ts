// Almanca içerik çevirileri. Anahtar = Türkçe kaynak metin (src/data, src/playground).
// Kaynak metin değişirse anahtar da güncellenmeli — `npm run i18n:check` eksik/eskimiş satırları listeler.
const dict: Record<string, string> = {
  "Temeller":
    "Grundlagen",
  "Ohm kanunu, iş, yük — her şeyin başladığı yer. Bunlar oturmadan gerisi Jenga.":
    "Ohmsches Gesetz, Arbeit, Ladung — hier fängt alles an. Solange das nicht sitzt, ist der Rest Jenga.",
  "Direnç":
    "Widerstand",
  "İletken direnci, Leitwert ve sıcaklığın dirençle imtihanı.":
    "Leiterwiderstand, Leitwert und was die Temperatur mit dem Widerstand anstellt.",
  "Seri Devre":
    "Reihenschaltung",
  "Tek sıra halinde: akım sabit, gerilim paylaştırılır, dirençler toplanır.":
    "Alle in einer Reihe: Der Strom bleibt gleich, die Spannung teilt sich auf, die Widerstände addieren sich.",
  "Paralel Devre":
    "Parallelschaltung",
  "Yollar çoğalır: gerilim sabit, akım bölüşülür, toplam direnç küçülür.":
    "Mehr Wege: Die Spannung bleibt gleich, der Strom teilt sich auf, der Gesamtwiderstand wird kleiner.",
  "Karma Devre":
    "Gruppenschaltung",
  "Seri + paralel karışımı. Formülü yok, stratejisi var — sadeleştire sadeleştire çöz.":
    "Reihe und parallel gemischt. Keine Formel, dafür eine Strategie — vereinfachen, vereinfachen, lösen.",
  "Kötü haber: Gruppenschaltung'un tek satırlık bir formülü yok. İyi haber: yeni bir şey öğrenmene de gerek yok — seri ve paralel kurallarını sırayla uygulamak yetiyor.":
    "Die schlechte Nachricht: Für die Gruppenschaltung gibt es keine Formel in einer Zeile. Die gute: Du musst auch nichts Neues lernen — es reicht, die Regeln für Reihe und Parallel nacheinander anzuwenden.",
  "Strateji şu: devrenin en içindeki, net olarak 'bunlar kesin paralel' ya da 'bunlar kesin seri' dediğin grubu bul. Onu tek bir eşdeğer dirence indir. Devreyi yeniden çiz (evet, gerçekten çiz — kafada tutmaya çalışanların anıtı her okulda vardır). Şimdi devre biraz sadeleşti; aynı işlemi tekrarla. Soğan soymak gibi: katman katman, ta ki elinde tek bir R_ges kalana kadar.":
    "Die Strategie: Such die innerste Gruppe, bei der du sicher sagen kannst „die sind eindeutig parallel“ oder „die sind eindeutig in Reihe“. Fass sie zu einem einzigen Ersatzwiderstand zusammen. Zeichne die Schaltung neu (ja, wirklich zeichnen — für alle, die es im Kopf behalten wollten, steht in jeder Berufsschule ein Denkmal). Jetzt ist die Schaltung etwas einfacher; wiederhol das Ganze. Wie Zwiebelschälen: Schicht für Schicht, bis nur noch ein einziges R_ges übrig ist.",
  "Sonra istersen geri sar: R_ges ve kaynak geriliminden toplam akımı bul (Ohm kanunu kartı hazır bekliyor), akımı ve gerilimleri katmanları geri açarak dağıt. Her adımda kullandığın formüller bu sitede zaten var — Seri Devre ve Paralel Devre kategorilerindeki kartlar senin alet çantan.":
    "Danach geht es bei Bedarf rückwärts: Aus R_ges und der Quellenspannung den Gesamtstrom bestimmen (die Karte zum ohmschen Gesetz wartet schon), dann Ströme und Spannungen verteilen, indem du die Schichten wieder aufklappst. Alle Formeln, die du dabei brauchst, gibt es hier schon — die Karten in den Kategorien Reihenschaltung und Parallelschaltung sind dein Werkzeugkoffer.",
  "Pro ipucu: hangi elemanların paralel olduğunu anlamanın en sağlam yolu düğüm noktalarını (Knoten) işaretlemek. İki eleman aynı iki düğüm arasındaysa paraleldir — çizimde yan yana durmaları hiçbir şey ifade etmez. Şema çizerler bunu bilerek yapıyor, eminiz.":
    "Profi-Tipp: Am sichersten erkennst du parallele Bauteile, wenn du die Knoten markierst. Zwei Bauteile sind parallel, wenn sie zwischen denselben zwei Knoten liegen — dass sie in der Zeichnung nebeneinanderstehen, bedeutet gar nichts. Wir sind ziemlich sicher, dass Schaltplanzeichner das mit Absicht machen.",
  "Güç":
    "Leistung",
  "P = U·I ailesi: gücün üç kılığı ve kabloların neden ısındığı.":
    "Die Familie P = U·I: die drei Verkleidungen der Leistung — und warum Leitungen warm werden.",
  "Verim":
    "Wirkungsgrad",
  "Giren, çıkan ve yolda ısıya dönüşen. η daima < 1; itirazlar termodinamiğe.":
    "Was reingeht, was rauskommt und was unterwegs zu Wärme wird. η ist immer < 1; Beschwerden bitte an die Thermodynamik.",
  "Motorlar":
    "Motoren",
  "Moment, senkron devir, kayma — dönen demirin matematiği.":
    "Drehmoment, synchrone Drehzahl, Schlupf — die Mathematik des drehenden Eisens.",
  "Alternatif Akım":
    "Wechselstrom",
  "Tepe değer, periyot, açısal frekans: sinüsün kimlik bilgileri.":
    "Scheitelwert, Periodendauer, Kreisfrequenz: der Personalausweis der Sinuskurve.",
  "Bobin & Kondansatör":
    "Spule & Kondensator",
  "X_L ve X_C: frekansla dans eden dirençler. Biri artarken öteki azalır.":
    "X_L und X_C: Widerstände, die mit der Frequenz tanzen. Steigt der eine, sinkt der andere.",
  "Trifaze":
    "Drehstrom",
  "Yıldız, üçgen, √3 ve 400 V dünyası. Endüstrinin ana dili.":
    "Stern, Dreieck, √3 und die Welt der 400 V. Die Muttersprache der Industrie.",
  "Trafolar":
    "Transformatoren",
  "Sarım oranları ve güç dengesi: gerilimi büyüt, akımı küçült — ya da tersi.":
    "Windungsverhältnisse und Leistungsbilanz: Spannung rauf, Strom runter — oder umgekehrt.",
  "Güç Türleri":
    "Leistungsarten",
  "P, Q, S ve güç üçgeni. Pisagor'un elektrikçi stajı.":
    "P, Q, S und das Leistungsdreieck. Pythagoras im Elektriker-Praktikum.",
  "Gerilim Düşümü & Kesit":
    "Spannungsfall & Querschnitt",
  "Kablo hesabının kalbi: düşümü hesapla, kesiti seç, %3'ü geçme.":
    "Das Herz der Leitungsberechnung: Spannungsfall berechnen, Querschnitt wählen, unter 3 % bleiben.",
  "Ohm Kanunu":
    "Ohmsches Gesetz",
  "Elektriğin anayasası. Gerisi detay.":
    "Das Grundgesetz der Elektrotechnik. Der Rest sind Details.",
  "Gerilim, akım ve direnç arasındaki kutsal üçgen: U = R · I. Bir devrede bu üçünden ikisini biliyorsan üçüncüsü kaçamaz. Georg Simon Ohm bunu 1827'de yayınladığında kimse ciddiye almadı; şimdi onsuz priz bile takamıyoruz. Formüldeki herhangi bir büyüklüğe tıkla — formül senin için onu yalnız bıraksın.":
    "Das heilige Dreieck aus Spannung, Strom und Widerstand: U = R · I. Kennst du in einem Stromkreis zwei der drei Größen, kann dir die dritte nicht entwischen. Als Georg Simon Ohm das 1827 veröffentlichte, nahm ihn niemand ernst; heute können wir ohne ihn nicht einmal eine Steckdose setzen. Klick auf eine beliebige Größe in der Formel — sie wird für dich danach umgestellt.",
  "Birimlere dikkat: mA girdiysen sonucu kΩ'da düşünmen gerekebilir. Neyse ki birim seçicilerimiz var — biz düşündük, sen yaşa.":
    "Achte auf die Einheiten: Wenn du mA eingibst, musst du beim Ergebnis vielleicht in kΩ denken. Zum Glück gibt es die Einheitenauswahl — wir haben mitgedacht, du darfst leben.",
  "Gerilim":
    "Spannung",
  "Elektronları harekete zorlayan 'itiş'. Su borusundaki basınç gibi: basınç yoksa akış da yok, gerilim yoksa akım da yok.":
    "Der „Schub“, der die Elektronen in Bewegung zwingt. Wie der Druck in einer Wasserleitung: kein Druck, kein Durchfluss; keine Spannung, kein Strom.",
  "Multimetreyle ölçülür — uçlar ölçülecek iki noktaya PARALEL bağlanır. Çoğu zaman zaten bellidir: priz 230 V, trifaze 400 V, ya da tip etiketinde / görev metninde yazar.":
    "Wird mit dem Multimeter gemessen — die Messspitzen kommen PARALLEL an die beiden Messpunkte. Meistens ist sie ohnehin bekannt: Steckdose 230 V, Drehstrom 400 V, oder sie steht auf dem Typenschild bzw. in der Aufgabe.",
  "Akıma 'dur bakalım, öyle kolay geçemezsin' diyen büyüklük. Her şeyin bir direnci var — kabloların, insanların, pazartesi sabahlarının.":
    "Die Größe, die zum Strom sagt: „Moment mal, so einfach kommst du hier nicht durch.“ Alles hat einen Widerstand — Leitungen, Menschen, Montagmorgen.",
  "Ohmmetreyle GERİLİMSİZ devrede ölçülür (yoksa ölçtüğün direnç değil, multimetrenin son anıları olur), dirençlerde renk kodundan okunur ya da şemada yazar.":
    "Wird mit dem Ohmmeter im SPANNUNGSFREIEN Stromkreis gemessen (sonst misst du keinen Widerstand, sondern die letzten Erinnerungen deines Multimeters), bei Widerständen am Farbcode abgelesen oder steht im Schaltplan.",
  "Akım":
    "Strom",
  "Bir noktadan saniyede geçen yük miktarı; elektron trafiğinin yoğunluğu. Isıtan, çarpan ve sigorta attıran şey budur.":
    "Die Ladungsmenge, die pro Sekunde an einer Stelle vorbeifließt; die Verkehrsdichte der Elektronen. Er ist es, der erwärmt, einen Schlag verpasst und die Sicherung fliegen lässt.",
  "Ampermetre devreye SERİ bağlanır (devreyi kesip araya girersin) ya da pens ampermetreyle kablonun etrafından tembelce ölçülür. Tip etiketinde de yazar.":
    "Das Amperemeter wird IN REIHE geschaltet (Stromkreis auftrennen und dazwischengehen) — oder du misst ganz bequem mit der Stromzange um die Leitung herum. Steht außerdem auf dem Typenschild.",
  "Elektriksel İş":
    "Elektrische Arbeit",
  "Faturanın matematiksel itirafı: W = P · t":
    "Das mathematische Geständnis der Stromrechnung: W = P · t",
  "Enerji = güç × zaman. 2 kW'lık ısıtıcıyı 3 saat çalıştırırsan 6 kWh yakarsın; sayaç döner, sen ödersin. Güç anlık 'hız', iş ise kat edilen toplam 'mesafe'dir. Sınavlarda en sevilen tuzak: saati saniyeye, kW'ı W'a çevirmeyi unutturmak.":
    "Energie = Leistung × Zeit. Läuft ein 2-kW-Heizgerät 3 Stunden, verbrauchst du 6 kWh; der Zähler dreht sich, du zahlst. Leistung ist die momentane „Geschwindigkeit“, Arbeit die insgesamt zurückgelegte „Strecke“. Die beliebteste Prüfungsfalle: dich vergessen zu lassen, Stunden in Sekunden und kW in W umzurechnen.",
  "1 kWh = 3,6 MJ = 3.600.000 Ws. Birim seçiciden kWh seçersen çevirmeyle uğraşmazsın.":
    "1 kWh = 3,6 MJ = 3.600.000 Ws. Wenn du in der Einheitenauswahl kWh wählst, sparst du dir das Umrechnen.",
  "İş / Enerji":
    "Arbeit / Energie",
  "Harcanan (ya da üretilen) toplam enerji. Güç bir hızsa, iş kat edilen mesafedir. Faturada kWh olarak karşına çıkar.":
    "Die insgesamt verbrauchte (oder erzeugte) Energie. Wenn Leistung eine Geschwindigkeit ist, dann ist Arbeit die zurückgelegte Strecke. Auf der Rechnung begegnet sie dir in kWh.",
  "Elektrik sayacından okunur ya da P·t ile hesaplanır. 1 kWh = 3,6 MJ — sınavda birim tuzağına düşme.":
    "Wird am Stromzähler abgelesen oder mit P·t berechnet. 1 kWh = 3,6 MJ — tapp in der Prüfung nicht in die Einheitenfalle.",
  "Cihazın çektiği güç. Tip etiketindeki değer — ısıtıcılarda kocaman, LED'de utangaç.":
    "Die Leistung, die das Gerät aufnimmt. Der Wert auf dem Typenschild — bei Heizgeräten riesig, bei LEDs schüchtern.",
  "İlk bakılacak yer cihazın tip etiketi (Typenschild). Orada yoksa U ve I'dan hesaplanır. Görevlerde genelde verilir.":
    "Der erste Blick gilt dem Typenschild des Geräts. Steht sie dort nicht, wird sie aus U und I berechnet. In Aufgaben ist sie meist gegeben.",
  "Zaman":
    "Zeit",
  "Evrendeki tek yön bildiren büyüklük. Formülde saniye cinsinden çalışır ama biz sana min/h seçeneği de koyduk, hesap makinesi değiliz… dur, tam olarak oyuz.":
    "Die einzige Größe im Universum, die auf einer Richtung besteht. Die Formel rechnet in Sekunden, aber wir haben dir auch min/h eingebaut — wir sind ja kein Taschenrechner … Moment, genau das sind wir.",
  "Kronometre, saat ya da görev metni. 'Günde 3 saat çalışıyor' tarzı cümlelerde saklanır.":
    "Stoppuhr, Uhr oder Aufgabentext. Versteckt sich gern in Sätzen wie „läuft täglich 3 Stunden“.",
  "Elektrik Yükü":
    "Elektrische Ladung",
  "Q = I · t — pilin 'deposunda' ne var?":
    "Q = I · t — was steckt im „Tank“ der Batterie?",
  "Yük = akım × zaman. 1 saniyede 1 amper akarsa 1 coulomb (1 As) yük geçmiş demektir. Akülerdeki 'Ah' (amper-saat) tam olarak bu: 50 Ah'lik akü, 50 saat boyunca 1 A verebilir — ya da 1 saat boyunca 50 A, tercih senin (akünün değil).":
    "Ladung = Strom × Zeit. Fließt 1 Sekunde lang 1 Ampere, ist 1 Coulomb (1 As) Ladung geflossen. Die Angabe „Ah“ (Amperestunden) auf Akkus ist genau das: Ein Akku mit 50 Ah kann 50 Stunden lang 1 A liefern — oder 1 Stunde lang 50 A, die Wahl liegt bei dir (nicht beim Akku).",
  "Elektrik yükü":
    "Elektrische Ladung",
  "Geçen toplam elektron miktarının ölçüsü. Birimi Coulomb (C) = amper-saniye (As). Pil/akü kapasitesi olarak Ah cinsinden karşına çıkar.":
    "Das Maß für die insgesamt geflossene Elektronenmenge. Einheit: Coulomb (C) = Amperesekunde (As). Als Akku- bzw. Batteriekapazität begegnet sie dir in Ah.",
  "Akü etiketinde Ah olarak yazar. Hesapta I·t'den çıkar.":
    "Steht in Ah auf dem Akku. In der Rechnung ergibt sie sich aus I·t.",
  "İletken Direnci":
    "Leiterwiderstand",
  "Kablo da bir dirençtir — sadece bunu itiraf etmez.":
    "Auch eine Leitung ist ein Widerstand — sie gibt es nur nicht zu.",
  "Bir iletkenin direnci malzemesine (ρ), uzunluğuna (l) ve kesitine (A) bağlıdır: R = ρ·l / A. Uzun ve ince kablo = çok direnç; kısa ve kalın kablo = az direnç. Bahçe hortumuyla aynı mantık: uzadıkça ve inceldikçe su gelmez olur.":
    "Der Widerstand eines Leiters hängt vom Werkstoff (ρ), von der Länge (l) und vom Querschnitt (A) ab: R = ρ·l / A. Lange, dünne Leitung = viel Widerstand; kurze, dicke Leitung = wenig. Dieselbe Logik wie beim Gartenschlauch: Je länger und dünner, desto weniger kommt an.",
  "Birimler bu formülde el ele: ρ [Ω·mm²/m], l [m], A [mm²] → R [Ω]. Hepsini SI'ya çevirmeye kalkma, bu üçlü zaten anlaşmış.":
    "Die Einheiten gehen in dieser Formel Hand in Hand: ρ [Ω·mm²/m], l [m], A [mm²] → R [Ω]. Versuch nicht, alles in SI-Basiseinheiten umzurechnen — die drei haben sich längst geeinigt.",
  "İletkenin kendi direnci. Kısa devre hesaplarında ve gerilim düşümünde karşına çıkar — kablo masum değil.":
    "Der Eigenwiderstand des Leiters. Begegnet dir bei der Kurzschlussberechnung und beim Spannungsfall — die Leitung ist nicht unschuldig.",
  "Öz direnç":
    "Spezifischer Widerstand",
  "Malzemenin karakteri: elektriği ne kadar gönülsüz ilettiği. Bakır 0,0178, alüminyum 0,0278 Ω·mm²/m. (γ iletkenliğin tersi: ρ = 1/γ.)":
    "Der Charakter des Werkstoffs: wie widerwillig er Strom leitet. Kupfer 0,0178, Aluminium 0,0278 Ω·mm²/m. (Kehrwert der Leitfähigkeit γ: ρ = 1/γ.)",
  "Tablo kitabından (Tabellenbuch) — ezberleme, bak. Ama bakırınkini yine de ezberlemiş olacaksın, kabullen: 0,0178.":
    "Aus dem Tabellenbuch — nicht auswendig lernen, nachschlagen. Den Wert für Kupfer kannst du am Ende trotzdem auswendig, find dich damit ab: 0,0178.",
  "Uzunluk":
    "Länge",
  "İletkenin uzunluğu. Gidiş-dönüş hattı hesaplıyorsan toplam tel uzunluğunu al (2·l).":
    "Die Länge des Leiters. Bei Hin- und Rückleiter nimmst du die gesamte Drahtlänge (2·l).",
  "Projeden okunur ya da şerit metreyle güzergâh boyunca ölçülür (dikkat: kuş uçuşu değil, kablonun gerçek yolu).":
    "Wird aus dem Plan abgelesen oder mit dem Maßband entlang des Leitungswegs gemessen (Achtung: nicht Luftlinie, sondern der tatsächliche Weg der Leitung).",
  "Kesit":
    "Querschnitt",
  "İletkenin kesit alanı — elektronların otoyolundaki şerit sayısı. Kesit büyüdükçe direnç düşer, cüzdan da hafifler.":
    "Die Querschnittsfläche des Leiters — die Anzahl der Fahrspuren auf der Elektronen-Autobahn. Je größer der Querschnitt, desto kleiner der Widerstand; der Geldbeutel wird dabei allerdings auch leichter.",
  "Kablonun üzerinde yazar (ör. NYM-J 3×1,5), projede belirtilir. Standart değerler: 1,5 / 2,5 / 4 / 6 / 10 / 16 mm²…":
    "Steht auf der Leitung (z. B. NYM-J 3×1,5) und im Plan. Normquerschnitte: 1,5 / 2,5 / 4 / 6 / 10 / 16 mm² …",
  "İletkenlik Değeri":
    "Leitwert",
  "G = 1/R — direncin ayna evrendeki ikizi.":
    "G = 1/R — der Zwilling des Widerstands aus dem Spiegeluniversum.",
  "Leitwert (iletkenlik değeri) direncin tersidir. Direnç 'ne kadar zorlanıyor' derken, G 'ne kadar kolay geçiyor' der. Birimi Siemens (S). Paralel devre hesaplarında hayat kurtarır: paralelde G'ler toplanır, R'lerle kesir cambazlığı yapmak zorunda kalmazsın.":
    "Der Leitwert ist der Kehrwert des Widerstands. Der Widerstand sagt, „wie schwer es der Strom hat“, G sagt, „wie leicht er durchkommt“. Einheit: Siemens (S). In der Parallelschaltung ein Lebensretter: Dort addieren sich die Leitwerte einfach, und du musst mit den Widerständen keine Bruchakrobatik betreiben.",
  "İletkenlik değeri":
    "Leitwert",
  "Akımın ne kadar rahat geçtiğinin ölçüsü. Direnç kötümser, Leitwert iyimserdir — aynı gerçeğin iki yüzü.":
    "Das Maß dafür, wie bequem der Strom durchkommt. Der Widerstand ist der Pessimist, der Leitwert der Optimist — zwei Seiten derselben Wahrheit.",
  "Genelde ölçülmez, 1/R'den hesaplanır. Ohmmetrede R'yi ölç, tersini al, bitti.":
    "Wird meist nicht gemessen, sondern aus 1/R berechnet. R mit dem Ohmmeter messen, Kehrwert bilden, fertig.",
  "Direncin Sıcaklıkla Değişimi":
    "Widerstand und Temperatur",
  "Direnç de ısınınca huysuzlanır.":
    "Auch ein Widerstand wird launisch, wenn ihm warm wird.",
  "Metal iletkenlerin direnci sıcaklıkla artar: R_w = R_k · (1 + α · Δθ). Soğuk direnç R_k, ısınınca R_w olur. α malzemenin sıcaklık katsayısı (bakır için ≈ 0,0039 1/K). Akkor ampulün soğukken ölçtüğün direncinin çalışırkenkinden neden 10 kat küçük olduğunun cevabı budur.":
    "Der Widerstand metallischer Leiter steigt mit der Temperatur: R_w = R_k · (1 + α · Δθ). Aus dem Kaltwiderstand R_k wird im warmen Zustand R_w. α ist der Temperaturbeiwert des Werkstoffs (für Kupfer ≈ 0,0039 1/K). Das ist die Erklärung dafür, warum der kalt gemessene Widerstand einer Glühlampe rund 10-mal kleiner ist als im Betrieb.",
  "α bakır ve alüminyum için ≈ 0,004 1/K. NTC'lerde işaret tersine döner (ısındıkça direnç DÜŞER) — bu formül metaller içindir.":
    "Für Kupfer und Aluminium gilt α ≈ 0,004 1/K. Bei NTC-Widerständen kehrt sich das Vorzeichen um (der Widerstand SINKT bei Erwärmung) — diese Formel gilt für Metalle.",
  "Sıcak direnç":
    "Warmwiderstand",
  "İletkenin çalışma (sıcak) durumundaki direnci.":
    "Der Widerstand des Leiters im (warmen) Betriebszustand.",
  "Çalışma sıcaklığında ölçülür ya da bu formülle hesaplanır.":
    "Wird bei Betriebstemperatur gemessen oder mit dieser Formel berechnet.",
  "Soğuk direnç":
    "Kaltwiderstand",
  "İletkenin başlangıç (genelde 20 °C) sıcaklığındaki direnci.":
    "Der Widerstand des Leiters bei Anfangstemperatur (meist 20 °C).",
  "Cihaz soğukken ohmmetreyle ölçülür.":
    "Wird im kalten Zustand mit dem Ohmmeter gemessen.",
  "Sıcaklık katsayısı":
    "Temperaturbeiwert",
  "Malzemenin sıcaklık başına direnç değiştirme oranı. Bakır/alüminyum ≈ 0,0039–0,004 1/K.":
    "Gibt an, wie stark sich der Widerstand des Werkstoffs je Kelvin ändert. Kupfer/Aluminium ≈ 0,0039–0,004 1/K.",
  "Tablo kitabından (Tabellenbuch).":
    "Aus dem Tabellenbuch.",
  "Sıcaklık farkı":
    "Temperaturdifferenz",
  "Son sıcaklık − başlangıç sıcaklığı. Kelvin ile °C farkı burada aynıdır (fark alınca birim dansı biter).":
    "Endtemperatur − Anfangstemperatur. Eine Differenz in Kelvin und in °C ist hier dasselbe (beim Abziehen ist der Einheitentanz vorbei).",
  "Termometreyle iki durumu ölç, farkını al.":
    "Beide Zustände mit dem Thermometer messen und die Differenz bilden.",
  "Seri Devrede Toplam Direnç":
    "Gesamtwiderstand der Reihenschaltung",
  "Seri devre: herkes aynı kuyrukta bekler.":
    "Reihenschaltung: Alle stehen in derselben Schlange.",
  "Seri bağlı dirençler düz toplama: R_ges = R₁ + R₂ + R₃. Akımın gidecek başka yolu yok, sırayla hepsinin içinden geçmek zorunda — dolayısıyla dirençler üst üste biner. Akım her yerde AYNIDIR (I = sabit), gerilim ise dirençlere paylaştırılır.":
    "In Reihe geschaltete Widerstände werden einfach addiert: R_ges = R₁ + R₂ + R₃. Der Strom hat keinen anderen Weg, er muss nacheinander durch alle hindurch — die Widerstände summieren sich also. Der Strom ist überall GLEICH (I = konstant), die Spannung teilt sich auf die Widerstände auf.",
  "İki dirençli devre için üçüncü kutuya 0 yaz, kimse alınmaz.":
    "Bei einer Schaltung mit zwei Widerständen trägst du ins dritte Feld 0 ein — niemand ist beleidigt.",
  "Toplam direnç":
    "Gesamtwiderstand",
  "Devrenin dışarıdan görünen tek eşdeğer direnci. Kaynak, üç direnci ayrı ayrı görmez — tek büyük direnç görür.":
    "Der eine Ersatzwiderstand, den die Schaltung nach außen zeigt. Die Quelle sieht nicht drei einzelne Widerstände — sie sieht einen großen.",
  "Hesapla ya da devre gerilimsizken uçlardan ohmmetreyle ölç.":
    "Berechnen oder im spannungsfreien Zustand an den Enden mit dem Ohmmeter messen.",
  "Seri Devrede Gerilimler":
    "Spannungen in der Reihenschaltung",
  "Gerilim pastası dilimlere ayrılır — büyük direnç büyük dilim kapar.":
    "Der Spannungskuchen wird aufgeteilt — der große Widerstand schnappt sich das große Stück.",
  "Seri devrede kaynak gerilimi, dirençlerin üzerine bölüşülür: U_ges = U₁ + U₂ + U₃ (2. Kirchhoff kanunu / Maschenregel). Her direncin kaptığı pay kendi büyüklüğüyle orantılıdır. Toplam her zaman tutar; tutmuyorsa bir yerde ölçüm hatası ya da unutulmuş bir eleman vardır.":
    "In der Reihenschaltung teilt sich die Quellenspannung auf die Widerstände auf: U_ges = U₁ + U₂ + U₃ (2. kirchhoffsches Gesetz / Maschenregel). Der Anteil jedes Widerstands ist proportional zu seiner Größe. Die Summe geht immer auf; wenn nicht, gibt es irgendwo einen Messfehler oder ein vergessenes Bauteil.",
  "Toplam gerilim":
    "Gesamtspannung",
  "Kaynağın verdiği toplam gerilim — dağıtılacak pasta.":
    "Die gesamte Spannung, die die Quelle liefert — der Kuchen, der verteilt wird.",
  "Kaynağın etiketi ya da uçlarından ölçüm.":
    "Angabe auf der Quelle oder Messung an ihren Klemmen.",
  "1. kısmi gerilim":
    "1. Teilspannung",
  "2. kısmi gerilim":
    "2. Teilspannung",
  "3. kısmi gerilim":
    "3. Teilspannung",
  "Gerilim Bölücü Oranı":
    "Spannungsteiler-Verhältnis",
  "U₁/U₂ = R₁/R₂ — adalet vardır, orantılıdır.":
    "U₁/U₂ = R₁/R₂ — es gibt Gerechtigkeit, und sie ist proportional.",
  "Seri devrede gerilimler dirençlerle aynı oranda bölüşülür. R₁ iki kat büyükse üzerine iki kat gerilim düşer. Bu oran kuralı, potansiyometrelerin ve sensör devrelerinin temelidir. Dört büyüklükten üçünü bil, dördüncüyü formül sana getirsin.":
    "In der Reihenschaltung verhalten sich die Spannungen wie die Widerstände. Ist R₁ doppelt so groß, fällt an ihm die doppelte Spannung ab. Diese Verhältnisregel ist die Grundlage von Potentiometern und Sensorschaltungen. Kennst du drei der vier Größen, liefert dir die Formel die vierte.",
  "R₁ üzerindeki gerilim":
    "Spannung an R₁",
  "R₂ üzerindeki gerilim":
    "Spannung an R₂",
  "İki Paralel Direnç":
    "Zwei parallele Widerstände",
  "Çarp, topla, böl — klasiklerden.":
    "Malnehmen, addieren, teilen — ein Klassiker.",
  "İki paralel direnç için pratik formül: R_ges = (R₁·R₂)/(R₁+R₂). Paralel bağlantıda akıma yeni yollar açılır, bu yüzden toplam direnç HER ZAMAN en küçük dirençten bile küçüktür. İki eşit direnci paralel bağlarsan sonuç yarısıdır — sınavda 10 saniyelik kontrol imkânı.":
    "Die praktische Formel für zwei parallele Widerstände: R_ges = (R₁·R₂)/(R₁+R₂). Die Parallelschaltung öffnet dem Strom neue Wege, deshalb ist der Gesamtwiderstand IMMER kleiner als der kleinste Einzelwiderstand. Schaltest du zwei gleiche Widerstände parallel, kommt die Hälfte heraus — eine 10-Sekunden-Kontrolle für die Prüfung.",
  "Sonuç R₁'den veya R₂'den büyük çıktıysa bir şeyler ters gitti. Paralel direnç küçültür, büyütmez.":
    "Ist das Ergebnis größer als R₁ oder R₂, ist etwas schiefgelaufen. Parallelschalten macht den Widerstand kleiner, nie größer.",
  "İki direncin birlikte gösterdiği eşdeğer direnç. Daima en küçük olandan daha küçüktür.":
    "Der Ersatzwiderstand, den beide Widerstände zusammen zeigen. Immer kleiner als der kleinere von beiden.",
  "Hesapla ya da gerilimsiz devrede uçlardan ölç.":
    "Berechnen oder im spannungsfreien Stromkreis an den Enden messen.",
  "Genel Paralel Formülü":
    "Allgemeine Parallelformel",
  "Terslerin toplamının tersi. Evet, üç kere 'ters' dedik.":
    "Der Kehrwert der Summe der Kehrwerte. Ja, wir haben dreimal „Kehrwert“ gesagt.",
  "Üç ve daha fazla paralel direnç için: 1/R_ges = 1/R₁ + 1/R₂ + 1/R₃. Yani iletkenlik değerleri (Leitwert) toplanır — her yeni paralel yol, akıma yeni bir kapı açar. Bu kart sadece R_ges'i çözer; tek tek dirençleri çözmek istiyorsan değerleri Leitwert'e çevirip toplamadan çıkarman gerekir (ya da bize güven, R_ges'i bul, gerisini iki-dirençli karttan yürüt).":
    "Für drei und mehr parallele Widerstände: 1/R_ges = 1/R₁ + 1/R₂ + 1/R₃. Es addieren sich also die Leitwerte — jeder neue Parallelzweig öffnet dem Strom eine weitere Tür. Diese Karte stellt nur nach R_ges um; für einen einzelnen Widerstand müsstest du in Leitwerte umrechnen und von der Summe abziehen (oder du vertraust uns, bestimmst R_ges und machst mit der Karte für zwei Widerstände weiter).",
  "İki direnç varsa üçüncü kutuya çok büyük bir değer yaz (ör. 999999999) — sonsuz dirençli kol, olmayan kol demektir. Ya da direkt 'İki Paralel Direnç' kartını kullan, o bunun için var.":
    "Bei nur zwei Widerständen trägst du ins dritte Feld einen sehr großen Wert ein (z. B. 999999999) — ein Zweig mit unendlichem Widerstand ist ein Zweig, den es nicht gibt. Oder du nimmst gleich die Karte „Zwei parallele Widerstände“, dafür ist sie da.",
  "Tüm paralel kolların birlikte gösterdiği eşdeğer direnç.":
    "Der Ersatzwiderstand aller Parallelzweige zusammen.",
  "Bu formülle hesaplanır — ya da ohmmetreyle, ama önce fişi çek.":
    "Wird mit dieser Formel berechnet — oder mit dem Ohmmeter gemessen, aber vorher den Stecker ziehen.",
  "n Adet Eşit Direnç":
    "n gleiche Widerstände",
  "Tembellik bir erdemdir: R_ges = R / n":
    "Faulheit ist eine Tugend: R_ges = R / n",
  "Aynı değerde n adet direnç paralel bağlanırsa toplam direnç R/n olur. 4 tane 100 Ω → 25 Ω. Isıtıcı rezistansları, LED dizileri ve 'aynı üründen çok var' senaryolarında kesirli formülle boğuşmana gerek yok.":
    "Werden n gleich große Widerstände parallel geschaltet, ist der Gesamtwiderstand R/n. Vier Stück mit 100 Ω → 25 Ω. Bei Heizwiderständen, LED-Ketten und allen „viel vom Gleichen“-Fällen musst du dich nicht mit der Bruchformel herumschlagen.",
  "Bu formülle. Bu kadar basit.":
    "Mit dieser Formel. So einfach ist das.",
  "Tek bir direncin değeri (hepsi aynı olmak zorunda, formülün tek şartı bu).":
    "Der Wert eines einzelnen Widerstands (alle müssen gleich sein — die einzige Bedingung der Formel).",
  "Direnç adedi":
    "Anzahl der Widerstände",
  "adet":
    "Stück",
  "Kaç tane eşit direnç paralel bağlı. Tam sayı olması beklenir; 2,5 direnç bağlayabiliyorsan bize de öğret.":
    "Wie viele gleiche Widerstände parallel geschaltet sind. Erwartet wird eine ganze Zahl; wenn du 2,5 Widerstände anschließen kannst, bring es uns bei.",
  "Say. Gerçekten, sadece say.":
    "Zählen. Wirklich, einfach zählen.",
  "Akım Bölücü Oranı":
    "Stromteiler-Verhältnis",
  "I₁/I₂ = R₂/R₁ — akım tembeldir, kolay yolu sever.":
    "I₁/I₂ = R₂/R₁ — Strom ist faul und nimmt gern den leichten Weg.",
  "Paralel kollarda akım, dirençle TERS orantılı bölüşülür: küçük dirençli koldan büyük akım geçer. Oranın ters olmasına dikkat — I₁'in karşısında R₂ var. Sınavların 'bunu kesin karıştırırlar' klasiği.":
    "In parallelen Zweigen teilt sich der Strom UMGEKEHRT proportional zum Widerstand auf: Durch den kleinen Widerstand fließt der große Strom. Achte auf das umgekehrte Verhältnis — I₁ steht R₂ gegenüber. Ein Prüfungsklassiker der Sorte „das verwechseln sie garantiert“.",
  "Paralel devrede gerilim tüm kollarda AYNIDIR; bölüşülen şey akımdır. (Seri devrede tam tersi.)":
    "In der Parallelschaltung ist die Spannung an allen Zweigen GLEICH; aufgeteilt wird der Strom. (In der Reihenschaltung ist es genau umgekehrt.)",
  "1. koldaki akım":
    "Strom im 1. Zweig",
  "2. koldaki akım":
    "Strom im 2. Zweig",
  "1. kolun direnci":
    "Widerstand des 1. Zweigs",
  "2. kolun direnci":
    "Widerstand des 2. Zweigs",
  "Elektriksel Güç":
    "Elektrische Leistung",
  "P = U · I — volt çarpı amper, watt eder; fatura da faturayı eder.":
    "P = U · I — Volt mal Ampere ergibt Watt; und Watt ergibt die Rechnung.",
  "Güç, gerilim ile akımın çarpımıdır (DC ve saf omik yüklerde). 230 V'ta 10 A çeken ısıtıcı 2300 W harcar. Ohm kanunuyla birleştirince güç formülü ailesi doğar: P = I²·R ve P = U²/R — üçü de aynı gerçeğin farklı kılıkları.":
    "Leistung ist das Produkt aus Spannung und Strom (bei Gleichstrom und rein ohmschen Verbrauchern). Ein Heizgerät, das an 230 V 10 A aufnimmt, setzt 2300 W um. Zusammen mit dem ohmschen Gesetz entsteht die Familie der Leistungsformeln: P = I²·R und P = U²/R — alle drei sind verschiedene Verkleidungen derselben Wahrheit.",
  "Birim zamanda çevrilen enerji — yani işin 'hızı'. Elektrik faturanın gerçek mimarı.":
    "Die pro Zeiteinheit umgesetzte Energie — also die „Geschwindigkeit“ der Arbeit. Der wahre Architekt deiner Stromrechnung.",
  "Güç (Akım ve Direnç ile)":
    "Leistung (aus Strom und Widerstand)",
  "P = I² · R — akımın karesi: kabloların neden ısındığının hikâyesi.":
    "P = I² · R — Strom im Quadrat: die Geschichte, warum Leitungen warm werden.",
  "Gücü gerilimi bilmeden, akım ve dirençten hesapla. Akım KARESİYLE girdiği için iki kat akım = dört kat ısı demektir. Kablo kesitlerinin neden akıma göre seçildiğinin, gevşek klemenslerin neden yangın çıkardığının matematiksel özeti.":
    "Leistung aus Strom und Widerstand berechnen, ohne die Spannung zu kennen. Weil der Strom QUADRATISCH eingeht, bedeutet doppelter Strom die vierfache Wärme. Die mathematische Kurzfassung dafür, warum Leitungsquerschnitte nach dem Strom gewählt werden und warum lose Klemmen Brände auslösen.",
  "Kayıp güç (Verlustleistung) hesaplarının baş aktörü. Hattaki kaybı bulmak için R yerine hat direncini koy.":
    "Der Hauptdarsteller bei der Berechnung der Verlustleistung. Um den Verlust auf einer Leitung zu bestimmen, setzt du für R den Leitungswiderstand ein.",
  "Dirençte ısıya dönüşen güç. Bazen istenen şey (ısıtıcı), bazen düşman (hat kaybı).":
    "Die Leistung, die im Widerstand in Wärme umgesetzt wird. Mal ist das gewollt (Heizgerät), mal der Feind (Leitungsverlust).",
  "Güç (Gerilim ve Direnç ile)":
    "Leistung (aus Spannung und Widerstand)",
  "P = U² / R — akımı sormadan güç hesabı.":
    "P = U² / R — Leistung berechnen, ohne nach dem Strom zu fragen.",
  "Elinde sadece gerilim ve direnç varsa: P = U²/R. Gerilim de karesiyle girer — bu yüzden 230 V'luk ampulü 115 V'ta yakarsan yarı parlaklık değil, ÇEYREK güç alırsın. Gerilim düşünce cihazların neden bu kadar dramatik tepki verdiğinin açıklaması.":
    "Wenn du nur Spannung und Widerstand hast: P = U²/R. Auch die Spannung geht quadratisch ein — deshalb liefert eine 230-V-Lampe an 115 V nicht die halbe Helligkeit, sondern nur ein VIERTEL der Leistung. Das erklärt, warum Geräte so dramatisch reagieren, wenn die Spannung einbricht.",
  "η = P_ab / P_zu — verdiğinin ne kadarı geri geliyor?":
    "η = P_ab / P_zu — wie viel von dem, was du reinsteckst, kommt wieder raus?",
  "Verim, çıkan faydalı gücün giren güce oranıdır. Motora 1000 W verip milden 850 W alıyorsan η = 0,85 yani %85. Kalan 150 W kayıp değil aslında — ısınma olarak atölyeyi ısıtıyor, sadece senin istediğin iş bu değildi. η daima 1'in (yani %100'ün) altındadır; üstünde çıktıysa ya ölçüm hatası var ya da patent dairesine koşmalısın (koşma, ölçüm hatası).":
    "Der Wirkungsgrad ist das Verhältnis von abgegebener Nutzleistung zu zugeführter Leistung. Gibst du einem Motor 1000 W und bekommst an der Welle 850 W, ist η = 0,85, also 85 %. Die übrigen 150 W sind eigentlich nicht verloren — sie heizen die Werkstatt, nur war das nicht die Arbeit, die du wolltest. η liegt immer unter 1 (also unter 100 %); kommt mehr heraus, hast du entweder einen Messfehler oder solltest zum Patentamt rennen (nicht rennen, es ist ein Messfehler).",
  "Verdiğin enerjinin ne kadarını işe dönüştürebildiğin. %100 yok — termodinamik pazarlık kabul etmiyor. Aradaki fark ısı olarak evrene bağışlanır.":
    "Wie viel der zugeführten Energie du in Nutzarbeit umsetzen kannst. 100 % gibt es nicht — die Thermodynamik lässt nicht mit sich handeln. Die Differenz wird dem Universum als Wärme gespendet.",
  "Tip etiketi veya veri sayfasından. Yoksa P_ab / P_zu oranından hesaplarsın. Yunan harfi η 'eta' diye okunur, 'n' değil!":
    "Vom Typenschild oder aus dem Datenblatt. Sonst berechnest du ihn aus P_ab / P_zu. Der griechische Buchstabe η wird „Eta“ gesprochen, nicht „n“!",
  "Çıkan güç":
    "Abgegebene Leistung",
  "Cihazın işe yarayan çıkışı: motorda mil gücü, trafoda sekonder güç.":
    "Die nutzbare Abgabe des Geräts: beim Motor die Wellenleistung, beim Trafo die Sekundärleistung.",
  "Tip etiketinde motorlarda yazan güç genellikle ÇIKIŞ gücüdür (P_ab / P₂). Evet, bu bilgi sınavda hayat kurtarır.":
    "Die Leistung auf dem Typenschild eines Motors ist in der Regel die ABGEGEBENE Leistung (P_ab / P₂). Ja, dieses Wissen rettet in der Prüfung Leben.",
  "Giren güç":
    "Zugeführte Leistung",
  "Şebekeden çekilen güç — faturaya yansıyan taraf.":
    "Die aus dem Netz aufgenommene Leistung — die Seite, die auf der Rechnung landet.",
  "Ölçü aletiyle şebeke tarafından ölçülür ya da P_ab/η ile hesaplanır.":
    "Wird netzseitig mit dem Messgerät gemessen oder mit P_ab/η berechnet.",
  "Toplam Verim":
    "Gesamtwirkungsgrad",
  "Kötü haber: verimler çarpılır, yani hep küçülür.":
    "Schlechte Nachricht: Wirkungsgrade werden multipliziert — sie werden also immer kleiner.",
  "Ard arda bağlı sistemlerde (motor → şanzıman → pompa) toplam verim, tek tek verimlerin ÇARPIMIDIR: η_ges = η₁ · η₂. %90 × %90 = %81 — iki tane 'gayet iyi' cihaz, birlikte 'eh işte' yapar. Zincir uzadıkça durum kötüleşir; mühendisliğin sessiz trajedisi.":
    "Bei hintereinandergeschalteten Systemen (Motor → Getriebe → Pumpe) ist der Gesamtwirkungsgrad das PRODUKT der Einzelwirkungsgrade: η_ges = η₁ · η₂. 90 % × 90 % = 81 % — zwei „ganz ordentliche“ Geräte ergeben zusammen ein „na ja“. Je länger die Kette, desto schlimmer wird es; die stille Tragödie des Ingenieurwesens.",
  "Üç ve daha fazla kademe varsa çarpmaya devam et: sonucu al, üçüncü verimle bu kartta tekrar çarp.":
    "Bei drei und mehr Stufen multiplizierst du einfach weiter: Ergebnis nehmen und auf dieser Karte noch einmal mit dem dritten Wirkungsgrad multiplizieren.",
  "Toplam verim":
    "Gesamtwirkungsgrad",
  "Zincirin başından sonuna kalan fayda oranı. Zincirdeki en zayıf halkadan bile küçüktür.":
    "Der Anteil, der vom Anfang bis zum Ende der Kette als Nutzen übrig bleibt. Kleiner als selbst das schwächste Glied der Kette.",
  "Kademelerin verimlerini çarparak bulunur.":
    "Ergibt sich durch Multiplizieren der Wirkungsgrade der einzelnen Stufen.",
  "1. kademe verimi":
    "Wirkungsgrad der 1. Stufe",
  "2. kademe verimi":
    "Wirkungsgrad der 2. Stufe",
  "Döndürme Momenti":
    "Drehmoment",
  "M = 9550 · P / n — sihirli sayı 9550'yle tanış.":
    "M = 9550 · P / n — darf ich vorstellen: die magische Zahl 9550.",
  "Motorun milindeki döndürme kuvveti (tork). 9550 gökten inmedi: 60 / (2π) · 1000'den gelir — dakikayı saniyeye, kW'ı W'a çeviren sabitlerin paketlenmiş hali. Aynı güçte yavaş dönen motor daha çok moment üretir; bu yüzden matkap yavaş viteste daha 'güçlü' hisseder.":
    "Die Drehkraft an der Motorwelle. Die 9550 ist nicht vom Himmel gefallen: Sie kommt aus 60 / (2π) · 1000 — den Konstanten, die Minuten in Sekunden und kW in W umrechnen, fertig verpackt. Bei gleicher Leistung liefert der langsamer drehende Motor mehr Drehmoment; deshalb fühlt sich die Bohrmaschine im langsamen Gang „kräftiger“ an.",
  "Bu formülde P KİLOWATT, n 1/min cinsindendir. 9550 sabiti bu ikiliye göre ayarlı — W girersen sonuç 1000 kat şaşar ve motorun kağıt üzerinde gemi çekmeye başlar.":
    "In dieser Formel steht P in KILOWATT und n in 1/min. Die Konstante 9550 ist genau auf dieses Paar abgestimmt — gibst du Watt ein, liegt das Ergebnis um den Faktor 1000 daneben und dein Motor schleppt auf dem Papier Schiffe ab.",
  "Döndürme momenti":
    "Drehmoment",
  "Milin döndürme kuvveti × kol uzunluğu. Newton-metre cinsinden 'burma' gücü.":
    "Drehkraft der Welle × Hebelarm. Die „Verdrehkraft“ in Newtonmetern.",
  "Motor veri sayfasında yazar ya da bu formülle güç ve devirden hesaplanır.":
    "Steht im Motordatenblatt oder wird mit dieser Formel aus Leistung und Drehzahl berechnet.",
  "Motorun mil gücü (P_ab). Bu formül kW ister — birim seçicide kW varsayılan, dokunma yeter.":
    "Die Wellenleistung des Motors (P_ab). Diese Formel verlangt kW — in der Einheitenauswahl ist kW voreingestellt, einfach nicht anfassen.",
  "Tip etiketindeki güç motorlarda mil gücüdür. kW cinsinden bırak.":
    "Die Leistung auf dem Typenschild ist bei Motoren die Wellenleistung. In kW lassen.",
  "Devir sayısı":
    "Drehzahl",
  "Milin dakikadaki tur sayısı. 1/min ya da rpm — aynı şeyin iki pasaportu.":
    "Die Anzahl der Wellenumdrehungen pro Minute. 1/min oder min⁻¹ — zwei Pässe für dieselbe Sache.",
  "Tip etiketi (ör. 1450 1/min) ya da takometreyle ölçüm.":
    "Typenschild (z. B. 1450 1/min) oder Messung mit dem Drehzahlmesser.",
  "Senkron Devir Sayısı":
    "Synchrone Drehzahl",
  "n₀ = f · 60 / p — döner alanın hız limiti.":
    "n₀ = f · 60 / p — das Tempolimit des Drehfelds.",
  "Stator döner alanının devri sadece şebeke frekansına ve kutup ÇİFTİ sayısına bağlıdır. 50 Hz'te: 2 kutuplu (p=1) → 3000, 4 kutuplu (p=2) → 1500, 6 kutuplu (p=3) → 1000 1/min. Asenkron motorun rotoru bu hıza asla tam yetişemez — yetişseydi indüksiyon biter, motor küser, dönmezdi.":
    "Die Drehzahl des Ständerdrehfelds hängt nur von der Netzfrequenz und der PolPAARzahl ab. Bei 50 Hz: 2-polig (p=1) → 3000, 4-polig (p=2) → 1500, 6-polig (p=3) → 1000 1/min. Der Läufer eines Asynchronmotors erreicht diese Drehzahl nie ganz — täte er es, wäre Schluss mit der Induktion, der Motor wäre beleidigt und würde sich nicht mehr drehen.",
  "p burada kutup sayısı DEĞİL, kutup ÇİFTİ sayısıdır (Polpaarzahl). 4 kutuplu motor → p = 2. Bu ayrımı karıştırmak, sınav kağıtlarının en klasik gözyaşı sebebidir.":
    "p ist hier NICHT die Polzahl, sondern die PolPAARzahl. 4-poliger Motor → p = 2. Diese Verwechslung ist der klassischste Grund für Tränen auf Prüfungsbögen.",
  "Senkron devir":
    "Synchrone Drehzahl",
  "Döner manyetik alanın devri — rotorun kovaladığı ama asla yakalayamadığı hedef.":
    "Die Drehzahl des magnetischen Drehfelds — das Ziel, dem der Läufer hinterherjagt, ohne es je einzuholen.",
  "Bu formülle hesaplanır. Tip etiketindeki devir bundan biraz KÜÇÜKTÜR (aradaki fark = kayma).":
    "Wird mit dieser Formel berechnet. Die Drehzahl auf dem Typenschild ist etwas KLEINER (die Differenz ist der Schlupf).",
  "Frekans":
    "Frequenz",
  "Şebeke frekansı. Avrupa'da 50 Hz; frekans konvertörü varsa onun çıkışı.":
    "Die Netzfrequenz. In Europa 50 Hz; bei einem Frequenzumrichter dessen Ausgangsfrequenz.",
  "Şebeke için 50 Hz kabul edilir (ABD 60 Hz). Aksi belirtilmedikçe görev metninde yazar ya da frekansmetreyle ölçülür.":
    "Für das Netz werden 50 Hz angenommen (USA: 60 Hz). Wenn nichts anderes angegeben ist, steht sie in der Aufgabe oder wird mit dem Frequenzmesser gemessen.",
  "Kutup çifti sayısı":
    "Polpaarzahl",
  "adet (çift!)":
    "Anzahl (Paare!)",
  "Statordaki N-S kutup ÇİFTLERİNİN sayısı. Kutup sayısının yarısı: 2 kutup → p=1, 4 kutup → p=2.":
    "Die Anzahl der Nord-Süd-PolPAARE im Ständer. Die Hälfte der Polzahl: 2 Pole → p=1, 4 Pole → p=2.",
  "Motor veri sayfası; ya da etiketteki devirden geri hesapla (1450 → senkronu 1500 → p=2).":
    "Motordatenblatt; oder aus der Typenschilddrehzahl zurückrechnen (1450 → synchron 1500 → p=2).",
  "Kayma (Schlupf)":
    "Schlupf",
  "Rotorun döner alana olan kibar mesafesi.":
    "Der höfliche Abstand des Läufers zum Drehfeld.",
  "Asenkron motorun rotoru, döner alandan hep biraz geride kalır — bu geriliğin yüzdesi kaymadır: s = (n₀−n)/n₀ · 100. Tipik değerler %3–8. Yük arttıkça motor biraz daha 'geriler', kayma büyür, moment artar. Kayma sıfır olsaydı rotor iletkenlerinde alan değişimi, dolayısıyla indüksiyon, dolayısıyla moment olmazdı.":
    "Der Läufer eines Asynchronmotors bleibt immer ein wenig hinter dem Drehfeld zurück — dieser Rückstand in Prozent ist der Schlupf: s = (n₀−n)/n₀ · 100. Typische Werte liegen bei 3–8 %. Mit steigender Last fällt der Motor etwas weiter zurück, der Schlupf wächst, das Drehmoment steigt. Wäre der Schlupf null, gäbe es in den Läuferstäben keine Feldänderung, also keine Induktion, also kein Drehmoment.",
  "Kayma":
    "Schlupf",
  "Rotorun senkron devire göre yüzde geriliği. Motorun 'nefes payı'.":
    "Um wie viel Prozent der Läufer hinter der synchronen Drehzahl zurückbleibt. Die „Luft zum Atmen“ des Motors.",
  "Etiketteki devirle senkron deviri karşılaştırarak hesaplanır.":
    "Ergibt sich aus dem Vergleich von Typenschilddrehzahl und synchroner Drehzahl.",
  "Döner alanın devri (f·60/p'den).":
    "Die Drehzahl des Drehfelds (aus f·60/p).",
  "Senkron devir kartından hesapla: 50 Hz'te 3000/1500/1000/750…":
    "Mit der Karte „Synchrone Drehzahl“ berechnen: bei 50 Hz 3000/1500/1000/750 …",
  "Rotor devri":
    "Läuferdrehzahl",
  "Milin gerçek devri — etikette yazan, takometrenin gösterdiği.":
    "Die tatsächliche Drehzahl der Welle — das, was auf dem Typenschild steht und der Drehzahlmesser anzeigt.",
  "Tip etiketi ya da takometre.":
    "Typenschild oder Drehzahlmesser.",
  "Tepe Değeri":
    "Scheitelwert",
  "û = √2 · U — prizdeki 230 V aslında ara sıra 325 V'tur.":
    "û = √2 · U — die 230 V aus der Steckdose sind zwischendurch eigentlich 325 V.",
  "Multimetrenin gösterdiği 230 V, etkin değerdir (Effektivwert): aynı ısıtma işini yapan DC eşdeğeri. Sinüs dalgasının gerçek tepesi ise √2 kat yüksektir: 230 · 1,414 ≈ 325 V. İzolasyon ve yarı iletkenler bu tepe değere dayanmak zorundadır — 'ama ortalaması 230'du' savunması kondansatörde geçmez.":
    "Die 230 V, die das Multimeter anzeigt, sind der Effektivwert: der Gleichstromwert, der dieselbe Wärmearbeit verrichtet. Der tatsächliche Scheitel der Sinuskurve liegt um den Faktor √2 höher: 230 · 1,414 ≈ 325 V. Isolierung und Halbleiter müssen diesen Scheitelwert aushalten — die Ausrede „aber im Mittel waren es doch 230“ zieht beim Kondensator nicht.",
  "Tepe değeri":
    "Scheitelwert",
  "Sinüs dalgasının ulaştığı en yüksek anlık değer. Osiloskopta gördüğün zirve.":
    "Der höchste Augenblickswert, den die Sinuskurve erreicht. Der Gipfel, den du auf dem Oszilloskop siehst.",
  "Osiloskopla ölçülür ya da etkin değerden √2 ile hesaplanır.":
    "Wird mit dem Oszilloskop gemessen oder aus dem Effektivwert mit √2 berechnet.",
  "Etkin değer":
    "Effektivwert",
  "Aynı gücü sağlayan DC eşdeğeri — multimetrelerin ve etiketlerin dili. 'Şebeke 230 V' derken kastedilen budur.":
    "Der Gleichstromwert, der dieselbe Leistung liefert — die Sprache der Multimeter und Typenschilder. Genau das ist gemeint, wenn es heißt „das Netz hat 230 V“.",
  "Multimetreyle (AC kademesinde) ölçülür; cihaz zaten etkin değer gösterir.":
    "Wird mit dem Multimeter (im AC-Bereich) gemessen; das Gerät zeigt ohnehin den Effektivwert an.",
  "Periyot Süresi":
    "Periodendauer",
  "T = 1/f — bir dalganın kendini tamamlama süresi.":
    "T = 1/f — die Zeit, die eine Welle braucht, um sich einmal zu vollenden.",
  "Frekans ile periyot birbirinin tersidir. 50 Hz'lik şebekede bir tam dalga 20 ms sürer. Osiloskopta zaman ekseninden T'yi okur, tersini alır, frekansı bulursun — cihazın otomatiği bozulduğunda hâlâ bilen kişi ol.":
    "Frequenz und Periodendauer sind Kehrwerte voneinander. Im 50-Hz-Netz dauert eine volle Schwingung 20 ms. Am Oszilloskop liest du T an der Zeitachse ab, bildest den Kehrwert und hast die Frequenz — sei derjenige, der das noch kann, wenn die Automatik des Geräts ausfällt.",
  "Periyot süresi":
    "Periodendauer",
  "Bir tam salınımın süresi. 50 Hz → 20 ms; göz kırpmandan bile kısa.":
    "Die Dauer einer vollen Schwingung. 50 Hz → 20 ms; kürzer als ein Wimpernschlag.",
  "Osiloskopta bir tam dalganın yatay uzunluğunu oku.":
    "Am Oszilloskop die waagerechte Länge einer vollen Schwingung ablesen.",
  "Saniyedeki tam dalga sayısı. Avrupa şebekesi 50 Hz — yani gerilim saniyede 50 kez fikir değiştirir ve buna 'kararlılık' deriz.":
    "Die Anzahl der vollen Schwingungen pro Sekunde. Das europäische Netz hat 50 Hz — die Spannung ändert also 50-mal pro Sekunde ihre Meinung, und wir nennen das „Stabilität“.",
  "Açısal Frekans":
    "Kreisfrequenz",
  "ω = 2π · f — frekansın matematik smokini giymiş hali.":
    "ω = 2π · f — die Frequenz im mathematischen Smoking.",
  "Sinüs hesaplarında frekans genelde ω (omega) olarak, radyan/saniye cinsinden gezer: ω = 2πf. 50 Hz → 314 1/s. X_L ve X_C formüllerinin içindeki 2πf paketinin ta kendisi. Ezberlemesen de olur ama tanımazsan formüller sana yabancı bakar.":
    "In Sinusrechnungen ist die Frequenz meist als ω (Omega) in Radiant pro Sekunde unterwegs: ω = 2πf. 50 Hz → 314 1/s. Das ist genau das Päckchen 2πf in den Formeln für X_L und X_C. Auswendig lernen musst du es nicht, aber wenn du es nicht erkennst, schauen dich die Formeln fremd an.",
  "Açısal frekans":
    "Kreisfrequenz",
  "Saniyedeki radyan cinsinden dönüş hızı. Bir tam dalga = 2π radyan.":
    "Die Drehgeschwindigkeit in Radiant pro Sekunde. Eine volle Schwingung = 2π Radiant.",
  "Hesaplanır: 2π·f. 50 Hz için ≈ 314 1/s — bu sayıyı görürsen 50 Hz kokusu al.":
    "Wird berechnet: 2π·f. Für 50 Hz ≈ 314 1/s — wenn du diese Zahl siehst, sollte es nach 50 Hz riechen.",
  "İndüktif Reaktans":
    "Induktiver Blindwiderstand",
  "X_L = 2π · f · L — bobinin AC'ye kestiği fatura.":
    "X_L = 2π · f · L — die Rechnung, die die Spule dem Wechselstrom stellt.",
  "Bobin, alternatif akıma frekansla artan bir direnç gösterir: X_L = 2πfL. DC'de (f=0) bobin sadece bir tel parçasıdır; frekans yükseldikçe 'dur bakalım' demeye başlar. Bu yüzden şok bobinleri yüksek frekans gürültüsünü süzer ama 50 Hz'i rahat bırakır.":
    "Eine Spule setzt dem Wechselstrom einen Widerstand entgegen, der mit der Frequenz wächst: X_L = 2πfL. Bei Gleichstrom (f=0) ist die Spule nur ein Stück Draht; mit steigender Frequenz sagt sie immer deutlicher „langsam, langsam“. Deshalb filtern Drosseln hochfrequente Störungen heraus, lassen 50 Hz aber in Ruhe.",
  "X_L gerçek direnç gibi ısı üretmez — enerjiyi manyetik alanda saklayıp geri verir. Bu yüzden adı 'reaktans', güç türü de 'reaktif'.":
    "X_L erzeugt keine Wärme wie ein echter Widerstand — er speichert Energie im Magnetfeld und gibt sie wieder zurück. Daher der Name „Blindwiderstand“ und die Leistungsart „Blindleistung“.",
  "İndüktif reaktans":
    "Induktiver Blindwiderstand",
  "Bobinin AC'ye gösterdiği frekans bağımlı direnç. Akımı gerilimden 90° geride bıraktırır.":
    "Der frequenzabhängige Widerstand, den die Spule dem Wechselstrom entgegensetzt. Er lässt den Strom der Spannung um 90° nacheilen.",
  "Hesaplanır; ya da U/I ölçümünden (saf bobin varsayımıyla) çıkarılır.":
    "Wird berechnet oder aus einer U/I-Messung abgeleitet (ideale Spule vorausgesetzt).",
  "İndüktans":
    "Induktivität",
  "Bobinin akım değişimine karşı gösterdiği inat. Akım değişmek istedikçe bobin 'acele etme' der. Birimi Henry (H).":
    "Der Trotz der Spule gegen Stromänderungen. Will sich der Strom ändern, sagt die Spule: „Nur keine Eile.“ Einheit: Henry (H).",
  "Bobinin/şok bobininin etiketi veya veri sayfası; LCR metreyle de ölçülür.":
    "Aufdruck oder Datenblatt der Spule bzw. Drossel; lässt sich auch mit dem LCR-Messgerät messen.",
  "Kapasitif Reaktans":
    "Kapazitiver Blindwiderstand",
  "X_C = 1 / (2π·f·C) — kondansatör tam tersini yapar.":
    "X_C = 1 / (2π·f·C) — der Kondensator macht genau das Gegenteil.",
  "Kondansatörün AC direnci frekansla TERS orantılıdır: frekans arttıkça X_C küçülür. DC'de (f=0) kondansatör duvardır (X_C → ∞), yüksek frekansta ise neredeyse kablodur. Bobinin ayna görüntüsü — biri artarken öteki azalır; ikisinin eşitlendiği yerde rezonans denen ilginç şeyler olur (o konu sonra 😏).":
    "Der Wechselstromwiderstand eines Kondensators ist UMGEKEHRT proportional zur Frequenz: Mit steigender Frequenz wird X_C kleiner. Bei Gleichstrom (f=0) ist der Kondensator eine Wand (X_C → ∞), bei hoher Frequenz fast ein Stück Leitung. Das Spiegelbild der Spule — steigt der eine, sinkt der andere; wo beide gleich groß sind, passieren interessante Dinge namens Resonanz (das Thema kommt später 😏).",
  "Kapasitif reaktans":
    "Kapazitiver Blindwiderstand",
  "Kondansatörün AC'ye gösterdiği frekans bağımlı direnç. Akımı gerilimden 90° öne geçirtir.":
    "Der frequenzabhängige Widerstand, den der Kondensator dem Wechselstrom entgegensetzt. Er lässt den Strom der Spannung um 90° voreilen.",
  "Hesaplanır: 1/(2πfC).":
    "Wird berechnet: 1/(2πfC).",
  "Kapasite":
    "Kapazität",
  "Kondansatörün yük depolama kabiliyeti. Elektriğin küçük deposu; gerilim değişimine direnir. Birimi Farad — 1 F kocamandır, pratikte µF/nF görürsün.":
    "Die Fähigkeit des Kondensators, Ladung zu speichern. Der kleine Speicher der Elektrotechnik; er wehrt sich gegen Spannungsänderungen. Einheit: Farad — 1 F ist riesig, in der Praxis siehst du µF/nF.",
  "Kondansatörün üzerinde yazar (ör. 4,7 µF / 450 V) ya da LCR metreyle ölçülür.":
    "Steht auf dem Kondensator (z. B. 4,7 µF / 450 V) oder wird mit dem LCR-Messgerät gemessen.",
  "Yıldız Bağlantı: Gerilimler":
    "Sternschaltung: Spannungen",
  "U_L = √3 · U_Str — 230 ile 400'ün gizli akrabalığı.":
    "U_L = √3 · U_Str — die heimliche Verwandtschaft von 230 und 400.",
  "Yıldız (Stern/Y) bağlantıda faz-nötr gerilimi (U_Str) ile faz-faz gerilimi (U_L) arasında √3 çarpanı vardır: 230 V · √3 ≈ 400 V. Prizindeki 230 ile trifaze hattın 400'ü aynı şebekenin iki farklı ölçüm noktası. Yıldızda akımlar ise eşittir: I_L = I_Str — akım için çevirme yok, rahatla.":
    "In der Sternschaltung (Y) liegt zwischen der Strangspannung (Außenleiter gegen N, U_Str) und der Außenleiterspannung (U_L) der Faktor √3: 230 V · √3 ≈ 400 V. Die 230 V an deiner Steckdose und die 400 V der Drehstromleitung sind zwei Messpunkte desselben Netzes. Die Ströme sind im Stern gleich: I_L = I_Str — beim Strom gibt es nichts umzurechnen, entspann dich.",
  "√3 ≈ 1,732. Drehstrom'da bir yerde √3 görmüyorsan muhtemelen bir şeyi unutmuşsundur.":
    "√3 ≈ 1,732. Wenn du bei Drehstrom nirgends ein √3 siehst, hast du wahrscheinlich etwas vergessen.",
  "Hat gerilimi (faz-faz)":
    "Außenleiterspannung (Leiter–Leiter)",
  "İki faz iletkeni ARASINDAKİ gerilim. Avrupa şebekesinde 400 V.":
    "Die Spannung ZWISCHEN zwei Außenleitern. Im europäischen Netz 400 V.",
  "İki faz arasında multimetreyle ölç: L1–L2, L2–L3, L3–L1 → hepsi 400 V olmalı.":
    "Mit dem Multimeter zwischen zwei Außenleitern messen: L1–L2, L2–L3, L3–L1 → überall müssen 400 V anliegen.",
  "Yıldız gerilimi (faz-nötr)":
    "Strangspannung (Leiter–N)",
  "Bir faz ile nötr (yıldız noktası) arasındaki gerilim. Bildiğin priz gerilimi: 230 V.":
    "Die Spannung zwischen einem Außenleiter und dem Neutralleiter (Sternpunkt). Die bekannte Steckdosenspannung: 230 V.",
  "Faz ile N arasında ölç: L1–N → 230 V.":
    "Zwischen Außenleiter und N messen: L1–N → 230 V.",
  "Üçgen Bağlantı: Akımlar":
    "Dreieckschaltung: Ströme",
  "I_L = √3 · I_Str — üçgende √3, akım tarafına geçer.":
    "I_L = √3 · I_Str — im Dreieck wechselt das √3 auf die Stromseite.",
  "Üçgen (Dreieck/Δ) bağlantıda sargılar fazlar ARASINA bağlanır: sargı gerilimi = hat gerilimi (U_Str = U_L = 400 V), ama hat akımı sargı akımının √3 katıdır. Yıldızın tam simetriği: yıldızda √3 gerilimde, üçgende akımdadır. Motorların yıldız-üçgen yol vermesinin bütün sırrı bu iki karttadır.":
    "In der Dreieckschaltung (Δ) liegen die Stränge ZWISCHEN den Außenleitern: Strangspannung = Außenleiterspannung (U_Str = U_L = 400 V), der Außenleiterstrom ist aber das √3-Fache des Strangstroms. Das genaue Spiegelbild zum Stern: Im Stern steckt das √3 in der Spannung, im Dreieck im Strom. Das ganze Geheimnis des Stern-Dreieck-Anlaufs steckt in diesen beiden Karten.",
  "Aynı motor üçgende, yıldıza göre 3 KAT güç çeker. Yıldız-üçgen yol verme, kalkışta bu farkı kullanarak şebekeyi korur.":
    "Derselbe Motor nimmt im Dreieck die 3-FACHE Leistung auf wie im Stern. Der Stern-Dreieck-Anlauf nutzt genau diesen Unterschied, um das Netz beim Anlauf zu schonen.",
  "Hat akımı":
    "Außenleiterstrom",
  "Besleme hattından (L1, L2, L3) akan akım — sigortanın ve kablonun gördüğü akım.":
    "Der Strom in der Zuleitung (L1, L2, L3) — der Strom, den Sicherung und Leitung sehen.",
  "Pens ampermetreyle faz iletkeninden ölç.":
    "Mit der Stromzange am Außenleiter messen.",
  "Sargı akımı":
    "Strangstrom",
  "Motor/yük sargısının İÇİNDEN akan akım. Hat akımından küçüktür (üçgende).":
    "Der Strom, der DURCH die Wicklung des Motors bzw. Verbrauchers fließt. Kleiner als der Außenleiterstrom (im Dreieck).",
  "Sargı koluna seri ampermetre — pratikte genelde hesaplanır.":
    "Amperemeter in Reihe zum Strang — in der Praxis wird er meist berechnet.",
  "Trifaze Güç":
    "Drehstromleistung",
  "P = √3 · U · I · cos φ — endüstrinin ekmek teknesi formülü.":
    "P = √3 · U · I · cos φ — die Brot-und-Butter-Formel der Industrie.",
  "Trifaze sistemin aktif gücü. U hat gerilimi (400 V), I hat akımı — bağlantı yıldız da olsa üçgen de olsa BU formül aynen çalışır, √3 farkları kendi içinde halleder (kibarlığına bak). Motor etiketindeki değerlerle motorun şebekeden ne çektiğini bulmanın standart yolu.":
    "Die Wirkleistung im Drehstromsystem. U ist die Außenleiterspannung (400 V), I der Außenleiterstrom — egal ob Stern oder Dreieck, DIESE Formel funktioniert unverändert und regelt die √3-Unterschiede intern (wie zuvorkommend). Der Standardweg, um aus den Typenschildangaben zu bestimmen, was ein Motor aus dem Netz aufnimmt.",
  "U = hat gerilimi (400 V), I = hat akımı. Strang değerleriyle karıştırırsan √3 sana iki kere güler.":
    "U = Außenleiterspannung (400 V), I = Außenleiterstrom. Wenn du sie mit den Strangwerten verwechselst, lacht dich das √3 gleich zweimal aus.",
  "Üç fazın toplam aktif gücü — işe dönüşen kısım.":
    "Die gesamte Wirkleistung der drei Stränge — der Teil, der in Arbeit umgesetzt wird.",
  "Hat gerilimi":
    "Außenleiterspannung",
  "Fazlar arası gerilim; Avrupa'da 400 V.":
    "Die Spannung zwischen den Außenleitern; in Europa 400 V.",
  "İki faz arasından ölç ya da 400 V kabul et.":
    "Zwischen zwei Außenleitern messen oder 400 V annehmen.",
  "Faz iletkeninden akan akım.":
    "Der Strom, der im Außenleiter fließt.",
  "Pens ampermetre ya da motor etiketi.":
    "Stromzange oder Typenschild des Motors.",
  "Güç faktörü":
    "Leistungsfaktor",
  "birimsiz, 0–1 arası":
    "ohne Einheit, zwischen 0 und 1",
  "Gerilimle akımın arasının ne kadar iyi olduğunun ölçüsü. 1 = mükemmel uyum (saf omik yük), 0 = küslük (saf reaktif yük). Motorlarda tipik 0,8 civarı.":
    "Das Maß dafür, wie gut sich Spannung und Strom verstehen. 1 = perfekte Harmonie (rein ohmsche Last), 0 = Funkstille (reine Blindlast). Bei Motoren typischerweise um 0,8.",
  "Motorun tip etiketinde yazar (cos φ 0,82 gibi) ya da P/S oranından hesaplanır. Ölçü cihazlarının çoğu doğrudan gösterir.":
    "Steht auf dem Typenschild des Motors (z. B. cos φ 0,82) oder wird aus dem Verhältnis P/S berechnet. Die meisten Messgeräte zeigen ihn direkt an.",
  "Dönüştürme Oranı":
    "Übersetzungsverhältnis",
  "ü = U₁/U₂ — trafonun kimlik numarası.":
    "ü = U₁/U₂ — die Ausweisnummer des Trafos.",
  "Übersetzungsverhältnis: primer gerilimin sekondere oranı. ü = 10 ise trafo gerilimi 10'a böler (230 V → 23 V). İdeal trafoda bu oran aynı zamanda sarım oranına eşittir. Trafo hakkında tek bir sayı bilecek olsan, bu olurdu.":
    "Das Übersetzungsverhältnis ist das Verhältnis von Primär- zu Sekundärspannung. Bei ü = 10 teilt der Trafo die Spannung durch 10 (230 V → 23 V). Beim idealen Transformator ist es zugleich das Verhältnis der Windungszahlen. Wenn du über einen Trafo nur eine einzige Zahl wissen dürftest, wäre es diese.",
  "Dönüştürme oranı":
    "Übersetzungsverhältnis",
  "birimsiz":
    "ohne Einheit",
  "U₁/U₂ = N₁/N₂. 1'den büyükse düşürücü, küçükse yükseltici trafo.":
    "U₁/U₂ = N₁/N₂. Größer als 1: Der Trafo setzt die Spannung herab; kleiner als 1: Er setzt sie herauf.",
  "Gerilimleri ölç ve oranla; ya da veri sayfasına bak.":
    "Spannungen messen und ins Verhältnis setzen; oder ins Datenblatt schauen.",
  "Primer gerilim":
    "Primärspannung",
  "Giriş tarafının gerilimi — şebekeye bakan yüz.":
    "Die Spannung auf der Eingangsseite — das Gesicht zum Netz.",
  "Tip etiketi (ör. 230 V) ya da giriş uçlarından ölçüm.":
    "Typenschild (z. B. 230 V) oder Messung an den Eingangsklemmen.",
  "Sekonder gerilim":
    "Sekundärspannung",
  "Çıkış tarafının gerilimi — yüke giden taraf.":
    "Die Spannung auf der Ausgangsseite — die Seite zum Verbraucher.",
  "Tip etiketi ya da çıkış uçlarından (boşta) ölçüm.":
    "Typenschild oder Messung an den Ausgangsklemmen (im Leerlauf).",
  "Gerilim ↔ Sarım Sayısı":
    "Spannung ↔ Windungszahl",
  "U₁/U₂ = N₁/N₂ — kim çok sarmışsa gerilim onda.":
    "U₁/U₂ = N₁/N₂ — wer mehr Windungen hat, bekommt die Spannung.",
  "İdeal trafoda gerilimler sarım sayılarıyla DOĞRU orantılıdır. Sekondere iki kat sarım = iki kat gerilim. Dört büyüklükten üçünü bil, dördüncüyü bul — trafo hesabının ekmek kapısı.":
    "Beim idealen Transformator verhalten sich die Spannungen wie die Windungszahlen. Doppelt so viele Windungen auf der Sekundärseite = doppelte Spannung. Drei der vier Größen kennen, die vierte bestimmen — das tägliche Brot der Trafoberechnung.",
  "Primer sarım sayısı":
    "Primärwindungszahl",
  "sarım (adet)":
    "Windungen (Anzahl)",
  "Sargının tur sayısı. Trafonun bütün karakteri bu oranda saklı — kim daha çok sarmışsa gerilim ondan yana.":
    "Die Anzahl der Windungen der Wicklung. Der ganze Charakter des Trafos steckt in diesem Verhältnis — wer mehr Windungen hat, bekommt die Spannung.",
  "Veri sayfasından; pratikte sayamazsın (denemeni de önermeyiz, sarımlar dar alanda yaşar).":
    "Aus dem Datenblatt; in der Praxis kannst du sie nicht zählen (und wir raten vom Versuch ab — Windungen wohnen sehr beengt).",
  "Sekonder sarım sayısı":
    "Sekundärwindungszahl",
  "Gerilim ↔ Akım (Güç Dengesi)":
    "Spannung ↔ Strom (Leistungsbilanz)",
  "U₁·I₁ = U₂·I₂ — bedava güç yok, sadece takas var.":
    "U₁·I₁ = U₂·I₂ — Leistung gibt es nicht geschenkt, nur im Tausch.",
  "İdeal trafoda giren güç = çıkan güç. Gerilimi 10'a düşüren trafo, akımı 10'la çarpar. Kaynak makinelerinin nasıl yüzlerce amper verebildiğinin ve yüksek gerilim hatlarının neden yüksek gerilimli olduğunun tek satırlık cevabı: aynı gücü az akımla taşı, kayıpları (I²R!) küçük tut.":
    "Beim idealen Transformator gilt: zugeführte Leistung = abgegebene Leistung. Ein Trafo, der die Spannung durch 10 teilt, multipliziert den Strom mit 10. Die Antwort in einer Zeile darauf, wie Schweißgeräte Hunderte Ampere liefern und warum Hochspannungsleitungen Hochspannung führen: dieselbe Leistung mit wenig Strom übertragen und die Verluste (I²R!) klein halten.",
  "Akım oranının TERS olduğuna dikkat: U₁/U₂ = I₂/I₁. Gerilim kimde çoksa akım onda azdır — trafo dünyasının denge yasası.":
    "Achtung, das Stromverhältnis ist UMGEKEHRT: U₁/U₂ = I₂/I₁. Wo die Spannung groß ist, ist der Strom klein — das Gleichgewichtsgesetz der Trafowelt.",
  "Primer akım":
    "Primärstrom",
  "Giriş tarafından çekilen akım.":
    "Der auf der Eingangsseite aufgenommene Strom.",
  "Giriş hattından pens ampermetreyle.":
    "Mit der Stromzange an der Eingangsleitung.",
  "Sekonder akım":
    "Sekundärstrom",
  "Çıkış tarafının yüke verdiği akım.":
    "Der Strom, den die Ausgangsseite an den Verbraucher abgibt.",
  "Çıkış hattından pens ampermetreyle ya da etiketten.":
    "Mit der Stromzange an der Ausgangsleitung oder vom Typenschild.",
  "Aktif Güç (AC, 1 faz)":
    "Wirkleistung (AC, einphasig)",
  "P = U · I · cos φ — işe yarayan kısım.":
    "P = U · I · cos φ — der Teil, der wirklich etwas bringt.",
  "Alternatif akımda gerilimle akım her zaman aynı anda zirve yapmaz; aradaki faz kayması (φ) yüzünden çarpımın sadece cos φ'lik kısmı gerçek işe dönüşür. Motor, bobin ve floresan gibi endüktif yüklerde cos φ < 1'dir. Rezistif yüklerde (ısıtıcı, akkor ampul) cos φ = 1 — ne alırsan iş.":
    "Bei Wechselstrom erreichen Spannung und Strom ihren Scheitel nicht immer gleichzeitig; wegen der Phasenverschiebung (φ) wird nur der cos-φ-Anteil des Produkts zu echter Arbeit. Bei induktiven Verbrauchern wie Motoren, Spulen und Leuchtstofflampen ist cos φ < 1. Bei ohmschen Verbrauchern (Heizgerät, Glühlampe) ist cos φ = 1 — alles, was du aufnimmst, ist Arbeit.",
  "Aktif güç":
    "Wirkleistung",
  "Isıya, harekete, ışığa dönüşen 'gerçek' güç. Sayacın saydığı ve faturalandırılan kısım.":
    "Die „echte“ Leistung, die zu Wärme, Bewegung und Licht wird. Der Teil, den der Zähler zählt und der abgerechnet wird.",
  "Görünür Güç (1 faz)":
    "Scheinleistung (einphasig)",
  "S = U · I — şebekenin sırtındaki toplam yük.":
    "S = U · I — die gesamte Last auf dem Rücken des Netzes.",
  "Faz açısını hiç sormadan gerilim çarpı akım: görünür güç. Birimi bilerek VA'dır, W değil — çünkü hepsi 'iş' değil. Trafolar ve jeneratörler VA/kVA ile etiketlenir; onların derdi taşımak, işin ne kadarının 'gerçek' olduğu yükün bileceği iş.":
    "Spannung mal Strom, ohne nach dem Phasenwinkel zu fragen: die Scheinleistung. Ihre Einheit ist bewusst VA und nicht W — denn nicht alles davon ist „Arbeit“. Transformatoren und Generatoren werden in VA/kVA angegeben; ihre Aufgabe ist das Übertragen, wie viel davon „echt“ ist, ist Sache des Verbrauchers.",
  "Görünür güç":
    "Scheinleistung",
  "Şebekenin taşımak zorunda olduğu toplam güç: U·I. Aktif ve reaktif gücün vektörel toplamı. Kablolar ve trafolar buna göre boyutlandırılır — şebeke 'ne iş yaptığına' değil 'ne taşıdığına' bakar.":
    "Die gesamte Leistung, die das Netz übertragen muss: U·I. Die geometrische Summe aus Wirk- und Blindleistung. Leitungen und Transformatoren werden danach ausgelegt — das Netz interessiert nicht, „was du arbeitest“, sondern „was es transportieren muss“.",
  "U ve I ölçümünden (S = U·I) ya da güç üçgeninden.":
    "Aus der Messung von U und I (S = U·I) oder aus dem Leistungsdreieck.",
  "Görünür Güç (trifaze)":
    "Scheinleistung (Drehstrom)",
  "S = √3 · U · I — üç fazlı versiyonu, √3 dahil.":
    "S = √3 · U · I — die dreiphasige Variante, √3 inklusive.",
  "Trifaze sistemde görünür güç. U hat gerilimi (400 V), I hat akımı. Trafo boyutlandırırken, jeneratör seçerken, 'bu hat kaç amper taşır' sorusunu cevaplandırırken kullanılır.":
    "Die Scheinleistung im Drehstromsystem. U ist die Außenleiterspannung (400 V), I der Außenleiterstrom. Wird gebraucht, wenn man einen Trafo auslegt, einen Generator auswählt oder die Frage „Wie viel Ampere führt diese Leitung?“ beantwortet.",
  "Üç fazın toplam görünür gücü. Trafoların etiketindeki kVA budur.":
    "Die gesamte Scheinleistung der drei Stränge. Das sind die kVA auf dem Typenschild eines Trafos.",
  "Fazlar arasından ölç ya da 400 V al.":
    "Zwischen den Außenleitern messen oder 400 V ansetzen.",
  "Güç Üçgeni":
    "Leistungsdreieck",
  "S² = P² + Q² — Pisagor, elektrikçilikte de mesai yapıyor.":
    "S² = P² + Q² — Pythagoras schiebt auch in der Elektrotechnik Schichten.",
  "Aktif güç (P), reaktif güç (Q) ve görünür güç (S) bir dik üçgen oluşturur: S hipotenüs, P ve Q dik kenarlar. Reaktif güç 'boşuna' gidip gelen enerjidir — iş yapmaz ama hatları meşgul eder. Kompanzasyonun (kondansatör bankalarının) bütün amacı Q'yu küçültüp üçgeni yatırmaktır.":
    "Wirkleistung (P), Blindleistung (Q) und Scheinleistung (S) bilden ein rechtwinkliges Dreieck: S ist die Hypotenuse, P und Q sind die Katheten. Blindleistung ist Energie, die „umsonst“ hin- und herpendelt — sie verrichtet keine Arbeit, belegt aber die Leitungen. Der ganze Zweck der Kompensation (Kondensatorbatterien) ist es, Q zu verkleinern und das Dreieck flach zu legen.",
  "S her zaman en uzun kenardır. P > S çıkıyorsa üçgen değil, ölçüm hatası çizmişsin demektir.":
    "S ist immer die längste Seite. Kommt bei dir P > S heraus, hast du kein Dreieck gezeichnet, sondern einen Messfehler.",
  "Üçgenin yatay kenarı: gerçek işe dönüşen güç (W).":
    "Die waagerechte Seite des Dreiecks: die Leistung, die zu echter Arbeit wird (W).",
  "Reaktif güç":
    "Blindleistung",
  "Manyetik/elektrik alan kurmak için gidip gelen güç. İş yapmaz ama hat kapasitesi yer; birimi var. Şebekenin 'boş koltukta seyahat eden yolcusu'.":
    "Die Leistung, die hin- und herpendelt, um magnetische bzw. elektrische Felder aufzubauen. Sie verrichtet keine Arbeit, frisst aber Leitungskapazität; eine eigene Einheit hat sie trotzdem. Der „Fahrgast auf dem leeren Sitz“ des Netzes.",
  "Ölçü cihazından ya da üçgenden: Q = √(S²−P²).":
    "Vom Messgerät oder aus dem Dreieck: Q = √(S²−P²).",
  "Güç Faktörü":
    "Leistungsfaktor",
  "cos φ = P / S — üçgenin özet istatistiği.":
    "cos φ = P / S — die Kurzstatistik des Dreiecks.",
  "Güç faktörü, görünür gücün ne kadarının işe dönüştüğünü söyler. cos φ = 0,8 ise şebekeden çektiğinin %80'i iş, %20'si 'alan kurma servisi'. Endüstride düşük cos φ cezalıdır — elektrik dağıtıcısı, boşuna taşıdığı reaktif gücün faturasını kibarca sana keser.":
    "Der Leistungsfaktor sagt, wie viel der Scheinleistung in Arbeit umgesetzt wird. Bei cos φ = 0,8 sind 80 % dessen, was du aus dem Netz aufnimmst, Arbeit und 20 % „Feldaufbau-Service“. In der Industrie kostet ein niedriger cos φ Geld — der Netzbetreiber stellt dir die umsonst transportierte Blindleistung höflich in Rechnung.",
  "Gerilim Düşümü (1 faz)":
    "Spannungsfall (einphasig)",
  "Kablo uzadıkça gerilim eriyecek — fizik, pazarlık yapmaz.":
    "Je länger die Leitung, desto mehr schmilzt die Spannung dahin — die Physik verhandelt nicht.",
  "Tek fazlı hatta gerilim düşümü: Δu = (2·l·I·cosφ)/(γ·A). Baştaki 2, akımın gidiş VE dönüş yolunu sayar (faz + nötr). Uzun hat, yüksek akım, ince kesit = büyük düşüm. Kesiti (A) tıklarsan bu formül kesit hesabına dönüşür — Querschnitt formülü diye ezberletilen şey, bunun umstellen halidir. Sürpriz!":
    "Spannungsfall auf einer einphasigen Leitung: Δu = (2·l·I·cosφ)/(γ·A). Die 2 am Anfang zählt den Hin- UND den Rückweg des Stroms (Außenleiter + Neutralleiter). Lange Leitung, hoher Strom, kleiner Querschnitt = großer Spannungsfall. Klickst du auf den Querschnitt (A), wird aus dieser Formel die Querschnittsberechnung — was man dir als „Querschnittsformel“ zum Auswendiglernen gegeben hat, ist nur diese Formel umgestellt. Überraschung!",
  "γ bakır için 56, alüminyum için 35 m/(Ω·mm²). l TEK YÖN uzunluğu — 2 çarpanı dönüşü zaten hallediyor.":
    "γ ist für Kupfer 56, für Aluminium 35 m/(Ω·mm²). l ist die EINFACHE Länge — den Rückweg erledigt bereits der Faktor 2.",
  "Gerilim düşümü":
    "Spannungsfall",
  "Kablonun kendi direncinde 'kaybolan' gerilim. Sen 230 V yollarsın, hat ucuna 225 V varır — aradaki 5 V kabloda ısı olarak buharlaşmıştır.":
    "Die Spannung, die im Eigenwiderstand der Leitung „verloren geht“. Du schickst 230 V los, am Leitungsende kommen 225 V an — die 5 V dazwischen sind in der Leitung als Wärme verdampft.",
  "Hat başı ile hat sonu gerilimlerini ölçüp fark alırsın — ya da bu formülle önceden hesaplayıp hiç sürprizle karşılaşmazsın.":
    "Spannung am Leitungsanfang und am Leitungsende messen und die Differenz bilden — oder vorher mit dieser Formel rechnen und gar nicht erst überrascht werden.",
  "Hattın TEK YÖN uzunluğu. Gidiş-dönüşü sen hesaplama — tek fazlı formüldeki 2 çarpanı dönüş yolunu zaten sayıyor.":
    "Die EINFACHE Länge der Leitung. Hin- und Rückweg rechnest du nicht selbst — der Faktor 2 in der einphasigen Formel zählt den Rückweg bereits mit.",
  "Hattan geçen işletme akımı. Yükün çektiği akımı bilmeden kablo hesabı yapılmaz.":
    "Der Betriebsstrom, der durch die Leitung fließt. Ohne den Strom des Verbrauchers zu kennen, gibt es keine Leitungsberechnung.",
  "Yükün güç faktörü. Priz devreleri ve omik yükler için 1 alınır; motor besliyorsan etiketine bak.":
    "Der Leistungsfaktor des Verbrauchers. Für Steckdosenstromkreise und ohmsche Verbraucher wird 1 angesetzt; speist du einen Motor, schau aufs Typenschild.",
  "İletkenlik":
    "Leitfähigkeit",
  "Öz direncin tersi (γ = 1/ρ): malzeme elektriği ne kadar severek iletiyor. Bakır 56, alüminyum 35 m/(Ω·mm²).":
    "Der Kehrwert des spezifischen Widerstands (γ = 1/ρ): wie bereitwillig der Werkstoff Strom leitet. Kupfer 56, Aluminium 35 m/(Ω·mm²).",
  "Tablo kitabından. Pratik değerler: Cu = 56, Al = 35. Kappa (κ) olarak da gösterilir, panik yok, aynı şey.":
    "Aus dem Tabellenbuch. Praxiswerte: Cu = 56, Al = 35. Wird auch als Kappa (κ) geschrieben — keine Panik, es ist dasselbe.",
  "Gerilim Düşümü (trifaze)":
    "Spannungsfall (Drehstrom)",
  "Aynı hikâye, ama 2 yerine √3 — trifaze nötrden dönmez.":
    "Dieselbe Geschichte, nur √3 statt 2 — Drehstrom kommt nicht über den Neutralleiter zurück.",
  "Üç fazlı yüklü hatta gerilim düşümü: Δu = (√3·l·I·cosφ)/(γ·A). Simetrik yükte nötrden akım dönmediği için gidiş-dönüş çarpanı 2 değil √3'tür — trifazenin küçük ikramı. Kesit için A'yı tıkla: üç fazlı Querschnitt formülü hazır.":
    "Spannungsfall auf einer belasteten Drehstromleitung: Δu = (√3·l·I·cosφ)/(γ·A). Bei symmetrischer Belastung fließt über den Neutralleiter kein Strom zurück, deshalb ist der Faktor für Hin- und Rückweg nicht 2, sondern √3 — eine kleine Aufmerksamkeit des Drehstroms. Für den Querschnitt auf A klicken: Die dreiphasige Querschnittsformel steht bereit.",
  "Yine: l tek yön, γ = 56 (Cu). Sonucu hat gerilimine (400 V) oranlayıp %'ye çevirmek için alttaki 'Yüzdesel Gerilim Düşümü' kartını kullan.":
    "Auch hier: l ist die einfache Länge, γ = 56 (Cu). Um das Ergebnis auf die Außenleiterspannung (400 V) zu beziehen und in Prozent umzurechnen, nimm die Karte „Prozentualer Spannungsfall“ weiter unten.",
  "Yüzdesel Gerilim Düşümü":
    "Prozentualer Spannungsfall",
  "Voltlar güzel, ama norm senden yüzde ister.":
    "Volt sind schön, aber die Norm will Prozent sehen.",
  "Hesapladığın Δu'yu anlamlandırmanın yolu, anma gerilimine oranlamak: Δu% = Δu/U_n · 100. DIN 18015'e göre sayaçtan son prize kadar önerilen sınır %3'tür. 400 V hatta 12 V düşüm 'çok mu?' diye düşünme — %3, tam sınırda diye oku.":
    "Um das berechnete Δu einzuordnen, bezieht man es auf die Nennspannung: Δu% = Δu/U_n · 100. Nach DIN 18015 liegt der empfohlene Grenzwert vom Zähler bis zur letzten Steckdose bei 3 %. Frag dich bei 12 V Spannungsfall auf einer 400-V-Leitung nicht, ob das „viel“ ist — lies es als 3 %, also genau an der Grenze.",
  "Tek fazda U_n = 230 V, trifazede 400 V ile oranla. Sınır değerler: DIN 18015 → %3 (konut, sayaç sonrası); DIN VDE 0100-520 tavsiyesi → aydınlatma %3, diğer %5.":
    "Einphasig auf U_n = 230 V beziehen, bei Drehstrom auf 400 V. Grenzwerte: DIN 18015 → 3 % (Wohngebäude, hinter dem Zähler); Empfehlung nach DIN VDE 0100-520 → Beleuchtung 3 %, übrige Stromkreise 5 %.",
  "Yüzdesel düşüm":
    "Prozentualer Spannungsfall",
  "Gerilim düşümünün anma gerilimine oranı. Normların konuştuğu dil.":
    "Das Verhältnis des Spannungsfalls zur Nennspannung. Die Sprache, in der die Normen sprechen.",
  "Bu formülle hesaplanır; sınır değerlerle karşılaştırılır.":
    "Wird mit dieser Formel berechnet und mit den Grenzwerten verglichen.",
  "Üstteki gerilim düşümü kartlarından hesapla ya da ölç.":
    "Mit den Spannungsfall-Karten weiter oben berechnen oder messen.",
  "Anma gerilimi":
    "Nennspannung",
  "Sistemin nominal gerilimi: 1 fazda 230 V, trifazede 400 V.":
    "Die Nennspannung des Systems: einphasig 230 V, bei Drehstrom 400 V.",
  "Sistemine göre 230 ya da 400 V.":
    "Je nach System 230 oder 400 V.",
  "Klemens Gerilimi & İç Direnç":
    "Klemmenspannung & Innenwiderstand",
  "U_K = U₀ − I·R_i — pil neden yük altında 'yoruluyor'?":
    "U_K = U₀ − I·R_i — warum wird eine Batterie unter Last „müde“?",
  "Hiçbir kaynak mükemmel değildir: her pilin, akünün, trafonun bir iç direnci (R_i) vardır. Yük akımı arttıkça iç dirençte gerilim düşer ve klemenslerde kalan gerilim azalır: U_K = U₀ − I·R_i. Marşa basınca farların kısılması, tam olarak bu formülün canlı yayınıdır. Boşta ölçtüğün gerilim U₀'dır (akım yok → düşüm yok); gerçek hayat yük altında başlar.":
    "Keine Quelle ist perfekt: Jede Batterie, jeder Akku, jeder Trafo hat einen Innenwiderstand (R_i). Mit steigendem Laststrom fällt am Innenwiderstand mehr Spannung ab, und an den Klemmen bleibt weniger übrig: U_K = U₀ − I·R_i. Dass die Scheinwerfer beim Anlassen dunkler werden, ist die Live-Übertragung genau dieser Formel. Die im Leerlauf gemessene Spannung ist U₀ (kein Strom → kein Spannungsfall); das echte Leben beginnt unter Last.",
  "İç direnci ölçmenin pratik yolu: boşta U₀'ı, yük altında U_K ve I'yı ölç → R_i = (U₀−U_K)/I. Kaynak yaşlandıkça R_i büyür — pilin 'yaşlılık belgesi'.":
    "So misst du den Innenwiderstand praktisch: im Leerlauf U₀, unter Last U_K und I messen → R_i = (U₀−U_K)/I. Mit dem Alter der Quelle wächst R_i — der „Altersnachweis“ der Batterie.",
  "Klemens gerilimi":
    "Klemmenspannung",
  "Kaynağın uçlarında YÜK ALTINDA ölçülen gerilim. İç dirençteki düşüm kadar U₀'dan küçüktür.":
    "Die Spannung, die UNTER LAST an den Klemmen der Quelle gemessen wird. Um den Spannungsfall am Innenwiderstand kleiner als U₀.",
  "Yük bağlıyken kaynağın uçlarından multimetreyle ölç.":
    "Bei angeschlossener Last mit dem Multimeter an den Klemmen der Quelle messen.",
  "Kaynak gerilimi (boşta)":
    "Quellenspannung (Leerlauf)",
  "Kaynağın 'ideal' gerilimi — akım akmazken klemenslerde görünen değer.":
    "Die „ideale“ Spannung der Quelle — der Wert an den Klemmen, wenn kein Strom fließt.",
  "Yükü ayır, boşta ölç. Akım yok → iç düşüm yok → gördüğün şey U₀.":
    "Last abklemmen und im Leerlauf messen. Kein Strom → kein innerer Spannungsfall → was du siehst, ist U₀.",
  "Yükün çektiği akım. Bu arttıkça iç dirençteki kayıp da artar — bedava öğle yemeği yok.":
    "Der Strom, den die Last aufnimmt. Je größer er wird, desto größer der Verlust am Innenwiderstand — es gibt nichts umsonst.",
  "İç direnç":
    "Innenwiderstand",
  "Kaynağın kendi içindeki kaçınılmaz direnç. Küçük olması iyidir; sıfır olması efsanedir.":
    "Der unvermeidliche Widerstand im Inneren der Quelle. Klein ist gut; null ist ein Märchen.",
  "Doğrudan ölçülmez — boşta ve yük altındaki gerilim farkından hesaplanır.":
    "Wird nicht direkt gemessen — er ergibt sich aus der Spannungsdifferenz zwischen Leerlauf und Last.",
  "Kondansatör Yükü":
    "Ladung des Kondensators",
  "Q = C · U — kapasite kadar depola, gerilim kadar doldur.":
    "Q = C · U — speichern, so viel die Kapazität hergibt; füllen, so weit die Spannung reicht.",
  "Kondansatörün depoladığı yük, kapasitesi ile üzerindeki gerilimin çarpımıdır. 100 µF'lik kondansatörü 10 V'a şarj edersen 1 mC (milicoulomb) yük tutar. Gerilimi iki katına çıkar, yük de ikiye katlanır — kapasite değişmez, o kondansatörün karakteridir.":
    "Die im Kondensator gespeicherte Ladung ist das Produkt aus seiner Kapazität und der anliegenden Spannung. Lädst du einen Kondensator mit 100 µF auf 10 V, speichert er 1 mC (Millicoulomb). Verdoppelst du die Spannung, verdoppelt sich auch die Ladung — die Kapazität ändert sich nicht, sie ist der Charakter des Kondensators.",
  "Kondansatörler fişten çekilince de dolu kalabilir! Büyük kondansatörlü cihazlarda (mikrodalga, sürücüler) önce deşarj, sonra dokunma — bu formül orada 'sürpriz' üretir.":
    "Kondensatoren können auch nach dem Ziehen des Steckers geladen bleiben! Bei Geräten mit großen Kondensatoren (Mikrowelle, Umrichter) gilt: erst entladen, dann anfassen — genau dort sorgt diese Formel für „Überraschungen“.",
  "Kondansatörün plakalarında biriken yük miktarı.":
    "Die Ladungsmenge, die sich auf den Platten des Kondensators sammelt.",
  "Ölçülmez, hesaplanır: C·U. (Deşarj akımını entegre eden de var ama biz normal insanlarız.)":
    "Wird nicht gemessen, sondern berechnet: C·U. (Manche integrieren auch den Entladestrom, aber wir sind normale Menschen.)",
  "Kondansatörün üzerindeki gerilim. Etiketteki değer MAKSİMUM dayanma gerilimi — onu aşarsan kondansatör kısa ve gürültülü bir kariyer yapar.":
    "Die Spannung am Kondensator. Der aufgedruckte Wert ist die MAXIMAL zulässige Spannung — überschreitest du sie, macht der Kondensator eine kurze und laute Karriere.",
  "Kondansatörde Depolanan Enerji":
    "Energie im Kondensator",
  "W = ½ · C · U² — küçük kutu, sürpriz tokat.":
    "W = ½ · C · U² — kleiner Becher, überraschende Ohrfeige.",
  "Kondansatörün elektrik alanında depolanan enerji. Gerilim KARESİYLE girer: 450 V'luk bir ara devre kondansatörü, görünüşünün aksine ciddi enerji taşır. Fotoğraf flaşının 'şak' diye verdiği enerji, tam olarak bu formülle önceden istiflenmiştir.":
    "Die im elektrischen Feld des Kondensators gespeicherte Energie. Die Spannung geht QUADRATISCH ein: Ein Zwischenkreiskondensator mit 450 V trägt, anders als er aussieht, ernsthafte Energie. Die Energie, die ein Fotoblitz mit einem „Zack“ abgibt, wurde vorher genau nach dieser Formel eingelagert.",
  "Depolanan enerji":
    "Gespeicherte Energie",
  "Elektrik alanında bekleyen enerji. Deşarjda ısıya, ışığa ya da (dikkatsizsen) kötü anılara dönüşür.":
    "Energie, die im elektrischen Feld wartet. Beim Entladen wird sie zu Wärme, Licht oder (bei Unachtsamkeit) zu schlechten Erinnerungen.",
  "Hesaplanır: ½·C·U².":
    "Wird berechnet: ½·C·U².",
  "Bobinde Depolanan Enerji":
    "Energie in der Spule",
  "W = ½ · L · I² — manyetik alandaki gizli hazine.":
    "W = ½ · L · I² — der verborgene Schatz im Magnetfeld.",
  "Bobin enerjiyi manyetik alanında, akım cinsinden depolar (kondansatörün ayna ikizi: o gerilimle, bu akımla çalışır). Akım kesilince bu enerji BİR YERE gitmek zorundadır — gidecek yer bulamazsa endüksiyon piki olarak kontaklarında ark yapar. Rölelerin bobinlerine neden 'Freilaufdiode' (serbest geçiş diyotu) konduğunun cevabı bu formüldür.":
    "Die Spule speichert Energie in ihrem Magnetfeld, und zwar über den Strom (der Spiegelzwilling des Kondensators: Der arbeitet mit Spannung, sie mit Strom). Wird der Strom unterbrochen, MUSS diese Energie irgendwohin — findet sie keinen Weg, entlädt sie sich als Induktionsspitze in einem Lichtbogen an den Kontakten. Diese Formel ist der Grund, warum Relaisspulen eine Freilaufdiode bekommen.",
  "Kontaktör bobinini süren transistörlü devrede diyot unutulursa, transistör bu enerjiyi 'yüzüne yiyerek' öğrenir. Diyotu unutma.":
    "Vergisst man in einer Transistorschaltung, die eine Schützspule ansteuert, die Diode, lernt der Transistor diese Energie auf die harte Tour kennen. Vergiss die Diode nicht.",
  "Manyetik alanda bekleyen enerji. Akım kesildiğinde tahsilata çıkar.":
    "Energie, die im Magnetfeld wartet. Wird der Strom unterbrochen, treibt sie ihre Forderung ein.",
  "Hesaplanır: ½·L·I².":
    "Wird berechnet: ½·L·I².",
  "Bobinden geçen akım. Karesiyle girer: akımı ikiye katla, depolanan enerji dörde katlansın.":
    "Der Strom durch die Spule. Er geht quadratisch ein: Verdoppelst du den Strom, vervierfacht sich die gespeicherte Energie.",
  "Şebeke Sistemleri":
    "Netzsysteme",
  "TN, TT, IT — topraklamanın aile ağacı.":
    "TN, TT, IT — der Stammbaum der Erdung.",
  "Şebeke sistemleri, 'toprak ile şebekenin ilişkisi nasıl kurulmuş?' sorusunun cevabıdır. İsimlendirme şifre gibi görünür ama mantığı basit: İLK harf şebekenin (trafonun) toprakla ilişkisi, İKİNCİ harf cihaz gövdelerinin toprakla ilişkisi. T = Terre (toprak, doğrudan topraklı), N = Nötr üzerinden şebekeye bağlı, I = İzole (toprakla arası mesafeli).":
    "Netzsysteme sind die Antwort auf die Frage: „Wie ist das Verhältnis zwischen Erde und Netz geregelt?“ Die Bezeichnungen sehen aus wie ein Code, die Logik ist aber einfach: Der ERSTE Buchstabe beschreibt die Erdverbindung des Netzes (des Trafos), der ZWEITE die Erdverbindung der Gerätekörper. T = Terre (Erde, direkt geerdet), N = über den Neutralleiter mit dem Netz verbunden, I = isoliert (hält Abstand zur Erde).",
  "TN-C — eski toprak, tek kablo":
    "TN-C — alte Schule, ein Leiter für beides",
  "Koruma iletkeni (PE) ile nötr (N) tek iletkende birleşik: PEN. Eski binaların klasiği. Ekonomik ama riskli: PEN koparsa cihaz gövdeleri şebeke potansiyeline gelebilir — yani buzdolabının kapısı aniden 'sürpriz' moduna geçer. Bu yüzden yeni tesisatlarda 10 mm²'nin altında yasak. Şemada gör: yeşil-sarı PEN hattı trafodan cihaza kadar tek başına gidiyor.":
    "Schutzleiter (PE) und Neutralleiter (N) sind in einem Leiter zusammengefasst: PEN. Der Klassiker im Altbau. Wirtschaftlich, aber riskant: Reißt der PEN, können die Gerätekörper Netzpotenzial annehmen — die Kühlschranktür schaltet dann plötzlich in den „Überraschungsmodus“. Deshalb in Neuanlagen unter 10 mm² verboten. Im Schaltbild zu sehen: Der grün-gelbe PEN läuft allein vom Trafo bis zum Gerät.",
  "TN-S — modern ve medeni":
    "TN-S — modern und zivilisiert",
  "PE ve N baştan sona ayrı yürür. Beş iletkenli sistem (L1, L2, L3, N, PE). Güvenli, EMC dostu, FI/RCD ile mükemmel anlaşır. Yeni tesisatın standardı. Şemada mavi N ile yeşil-sarı PE'nin trafodan itibaren ayrı yürüdüğüne dikkat.":
    "PE und N laufen von Anfang bis Ende getrennt. Ein Fünfleitersystem (L1, L2, L3, N, PE). Sicher, EMV-freundlich, versteht sich bestens mit dem FI/RCD. Der Standard für Neuanlagen. Achte im Schaltbild darauf, wie der blaue N und der grün-gelbe PE ab dem Trafo getrennt laufen.",
  "TN-C-S — ortada tanışıp ayrılanlar":
    "TN-C-S — unterwegs getrennt",
  "Şebekeden binaya kadar PEN (TN-C), bina girişinden itibaren PE ve N ayrılır (TN-S). Almanya'daki tipik ev bağlantısı budur. Şemadaki sarı nokta ayrım noktası: PEN, Hausanschlusskasten'e kadar gelir ve orada N ile PE'ye ayrılır. Önemli kural: bir kez ayrıldılar mı bir daha ASLA birleşemezler — elektrik tesisatının en katı ayrılık hikâyesi.":
    "Vom Netz bis zum Gebäude PEN (TN-C), ab der Gebäudeeinführung PE und N getrennt (TN-S). Das ist der typische Hausanschluss in Deutschland. Der gelbe Punkt im Schaltbild ist die Aufteilungsstelle: Der PEN kommt bis zum Hausanschlusskasten und wird dort in N und PE aufgeteilt. Wichtige Regel: Einmal getrennt, dürfen sie NIE wieder verbunden werden — die strengste Trennungsgeschichte der Elektroinstallation.",
  "TT — herkes kendi toprağına":
    "TT — jeder an seiner eigenen Erde",
  "Trafo kendi topraklamasına sahip, senin binanın da KENDİ toprak elektrodu var (Anlagenerder); ikisi arasında metalik bağlantı yok, hata akımı toprak üzerinden döner. Toprak geçiş dirençleri yüksek olabileceğinden hata akımları küçük kalır — bu yüzden TT sisteminde RCD pratikte zorunlu hayat sigortasıdır. Şemada dikkat: trafodan PE GELMİYOR, gövde binanın kendi toprağına bağlı. Kırsal bölgelerde ve bazı ülkelerde (merhaba Fransa 🥖) yaygın.":
    "Der Trafo hat seine eigene Erdung, und dein Gebäude hat SEINEN EIGENEN Erder (Anlagenerder); dazwischen gibt es keine metallische Verbindung, der Fehlerstrom fließt über das Erdreich zurück. Weil die Erdübergangswiderstände hoch sein können, bleiben die Fehlerströme klein — deshalb ist der RCD im TT-System praktisch eine Pflicht-Lebensversicherung. Achte im Schaltbild darauf: Vom Trafo kommt KEIN PE, der Körper hängt am eigenen Erder des Gebäudes. Verbreitet in ländlichen Gebieten und in manchen Ländern (hallo Frankreich 🥖).",
  "IT — inatçı ve kesintisiz":
    "IT — stur und unterbrechungsfrei",
  "Şebeke toprağa bağlı DEĞİL (ya da yüksek empedansla bağlı — şemadaki Z kutusu). İlk hata olduğunda kısa devre akımı akacak yol bulamaz → sistem çalışmaya DEVAM eder, sadece izolasyon izleme cihazı (Isolationswächter) alarm verir. İkinci hata gelmeden birinciyi bulman beklenir. Ameliyathaneler ve kesintinin felaket olduğu endüstri tesisleri için: 'ışık sönmesin, alarm ötsün' felsefesi.":
    "Das Netz ist NICHT geerdet (oder nur hochohmig — das Z-Kästchen im Schaltbild). Beim ersten Fehler findet der Kurzschlussstrom keinen Weg → die Anlage läuft WEITER, nur das Isolationsüberwachungsgerät (Isolationswächter) meldet. Von dir wird erwartet, dass du den ersten Fehler findest, bevor der zweite kommt. Für OP-Säle und Industrieanlagen, in denen ein Ausfall eine Katastrophe wäre: die Philosophie „das Licht bleibt an, der Alarm geht los“.",
  "🚧 Yakında":
    "🚧 Demnächst",
  "Hata senaryosu animasyonları ('PEN koptu, şimdi ne olacak?') ve 'hangi sistemde RCD nasıl davranır' interaktifleri yolda. Şemalar artık burada — animasyonları da Playground motoruyla evlendireceğiz.":
    "Animationen zu Fehlerszenarien („Der PEN ist gerissen — und jetzt?“) und interaktive Teile zur Frage „Wie verhält sich der RCD in welchem System?“ sind unterwegs. Die Schaltbilder sind schon da — die Animationen verheiraten wir noch mit der Playground-Engine.",
  "Kaçak Akım Koruması":
    "Fehlerstromschutz",
  "Giden akım dönmüyorsa, biri fazla bilgi sahibi oluyor demektir.":
    "Wenn der Strom, der hingeht, nicht zurückkommt, erfährt gerade jemand mehr, als ihm lieb ist.",
  "RCD (Residual Current Device, Almanca kültüründe FI-Schalter) tek bir soruyu takıntı halinde sorar: 'Giden akım, dönen akıma eşit mi?' Normalde fazdan giden her miliamper nötrden geri döner. Dönmüyorsa, akım başka bir yol bulmuş demektir — ve o yol bazen bir insandır. Fark, eşik değeri (ör. 30 mA) aşarsa RCD milisaniyeler içinde devreyi keser.":
    "Der RCD (Residual Current Device, im Alltag FI-Schalter) stellt wie besessen eine einzige Frage: „Ist der hinfließende Strom gleich dem zurückfließenden?“ Normalerweise kommt jedes Milliampere, das über den Außenleiter hinausgeht, über den Neutralleiter zurück. Wenn nicht, hat der Strom einen anderen Weg gefunden — und dieser Weg ist manchmal ein Mensch. Überschreitet die Differenz den Auslösewert (z. B. 30 mA), schaltet der RCD innerhalb von Millisekunden ab.",
  "30 mA neden 30 mA?":
    "Warum ausgerechnet 30 mA?",
  "İnsan kalbi için tehlike sınırı kabaca 50 mA civarında başlar (ventriküler fibrilasyon riski). 30 mA'lik RCD bu sınırın altında, üstelik hızlı davranır — bu yüzden İNSAN koruması (Zusatzschutz) için standart budur. 300 mA'lik olanlar ise insan değil YANGIN korumasıdır: 'seni değil, çatını koruyorum' der.":
    "Für das menschliche Herz beginnt die Gefahr grob bei 50 mA (Risiko von Herzkammerflimmern). Ein RCD mit 30 mA bleibt darunter und reagiert obendrein schnell — deshalb ist er der Standard für den PERSONENschutz (Zusatzschutz). Die mit 300 mA dienen nicht dem Personen-, sondern dem BRANDschutz: „Ich schütze nicht dich, sondern dein Dach.“",
  "Tipler: A, B, F, AC":
    "Typen: A, B, F, AC",
  "Tip AC yalnızca sinüs kaçağı görür (Almanya'da tek başına yeterli değil). Tip A, pulslu DC bileşenleri de görür — standart tercih. Tip F frekans konvertörlü cihazlara, Tip B düz DC kaçağı da görebildiği için wallbox/fotovoltaik gibi işlere. Yanlış tip seçersen RCD orada durur, görevi 'süs' olur.":
    "Typ AC erfasst nur sinusförmige Fehlerströme (in Deutschland nicht zulässig). Typ A erfasst zusätzlich pulsierende Gleichfehlerströme — die Standardwahl. Typ F ist für Geräte mit Frequenzumrichter gedacht, Typ B erkennt auch glatte Gleichfehlerströme und kommt deshalb bei Wallbox, Photovoltaik und Ähnlichem zum Einsatz. Wählst du den falschen Typ, sitzt der RCD nur zur Zierde da.",
  "Test butonu":
    "Prüftaste",
  "Üzerindeki T butonu yapay bir kaçak üretir. Ayda bir basılması önerilir; gerçekte çoğu insan hayatında bir kez, o da yanlışlıkla basar. Sen çoğu insan olma — mekanizma yıllarca hareket etmezse yapışabilir.":
    "Die Taste T erzeugt einen künstlichen Fehlerstrom. Empfohlen wird, sie regelmäßig zu drücken (je nach Hersteller monatlich bis halbjährlich); in Wirklichkeit drücken die meisten Menschen sie einmal im Leben, und das aus Versehen. Sei nicht wie die meisten — bewegt sich die Mechanik jahrelang nicht, kann sie verkleben.",
  "Auslösekarakteristik detayları, seçicilik (Selektivität), bağlantı şemaları ve 'RCD neden ikide bir atıyor' rehberi.":
    "Details zur Auslösecharakteristik, Selektivität, Anschlussbilder und der Ratgeber „Warum fliegt mein RCD ständig raus?“.",
  "Otomat Sigortalar":
    "Leitungsschutzschalter",
  "B, C, D — sigortanın sabır katsayısı.":
    "B, C, D — der Geduldsfaktor der Sicherung.",
  "LS-Schalter (Leitungsschutzschalter) iki ayrı reflekse sahiptir. Termik açma: bimetal şerit, uzun süreli hafif aşırı yükte yavaşça ısınıp devreyi keser — 'sabırlı ama unutmaz'. Manyetik açma: kısa devrede bobin, akımı milisaniyede keser — 'düşünmez, atar'. Karakteristik harfi (B/C/D), manyetik refleksin NE ZAMAN devreye gireceğini söyler.":
    "Der LS-Schalter (Leitungsschutzschalter) hat zwei getrennte Reflexe. Thermische Auslösung: Ein Bimetallstreifen erwärmt sich bei länger andauernder leichter Überlast langsam und schaltet ab — „geduldig, aber vergisst nichts“. Magnetische Auslösung: Bei Kurzschluss unterbricht eine Spule den Strom in Millisekunden — „denkt nicht nach, löst aus“. Der Buchstabe der Charakteristik (B/C/D) sagt, WANN der magnetische Reflex anspricht.",
  "B tipi: 3–5 × In":
    "Typ B: 3–5 × In",
  "Anma akımının 3–5 katında ani açar. Konutların standardı: prizler, aydınlatma. B16 → yaklaşık 48–80 A'de anında keser.":
    "Löst beim 3- bis 5-Fachen des Bemessungsstroms sofort aus. Der Standard im Wohnungsbau: Steckdosen, Beleuchtung. B16 → schaltet bei etwa 48–80 A unverzögert ab.",
  "C tipi: 5–10 × In":
    "Typ C: 5–10 × In",
  "Kalkış akımı çeken yüklere tolerans tanır: motorlar, floresan grupları, küçük trafolar. 'Motor kalkarken 7 kat akım çekiyor diye elektriği kesmek olmaz' diyen tip.":
    "Toleriert Verbraucher mit Einschaltstrom: Motoren, Leuchtstofflampengruppen, kleine Transformatoren. Der Typ, der sagt: „Man kann doch nicht abschalten, nur weil der Motor beim Anlauf den 7-fachen Strom zieht.“",
  "D tipi: 10–20 × In":
    "Typ D: 10–20 × In",
  "En sabırlısı: kaynak makineleri, büyük trafolar, aşırı kalkış akımlı endüstriyel yükler. Dikkat: sabır arttıkça hat sonundaki kısa devre akımının yine de açtırabilecek kadar büyük olması gerekir — kablo hesabıyla el ele gider.":
    "Der Geduldigste: Schweißgeräte, große Transformatoren, industrielle Verbraucher mit extremen Einschaltströmen. Achtung: Je mehr Geduld, desto wichtiger, dass der Kurzschlussstrom am Leitungsende trotzdem groß genug zum Auslösen ist — das geht Hand in Hand mit der Leitungsberechnung.",
  "Zaman-akım eğrileri (interaktif!), seçicilik, hat koruması hesabıyla bağlantısı ve karakteristik seçim rehberi.":
    "Zeit-Strom-Kennlinien (interaktiv!), Selektivität, der Zusammenhang mit der Leitungsschutzberechnung und ein Leitfaden zur Wahl der Charakteristik.",
  "Koruma Sınıfları":
    "Schutzklassen",
  "Cihazlar kendilerini nasıl savunur: üç ekol.":
    "Wie Geräte sich verteidigen: drei Schulen.",
  "Koruma sınıfı (Schutzklasse), bir cihazın elektrik çarpmasına karşı hangi felsefeyle korunduğunu söyler. IP koruma türüyle (toz/su) karıştırılmasın — o başka bir hikâye (o da yakında).":
    "Die Schutzklasse sagt, nach welcher Philosophie ein Gerät gegen elektrischen Schlag geschützt ist. Nicht zu verwechseln mit der IP-Schutzart (Staub/Wasser) — das ist eine andere Geschichte (kommt ebenfalls bald).",
  "Sınıf I — koruma iletkenine güven":
    "Schutzklasse I — Vertrauen in den Schutzleiter",
  "Metal gövde PE'ye bağlıdır. İzolasyon hatasında gövdeye kaçan akım PE üzerinden kaçar, sigorta/RCD atar. Sembolü yandaki toprak işareti — tip etiketinde bunu görürsen 'bu cihazın PE'si boşa bağlanmamış' demektir. Çamaşır makinesi, fırın, ütü — mutfağın ağır abileri genelde Sınıf I. Fişinde toprak kontağı olmak ZORUNDADIR.":
    "Das Metallgehäuse ist mit dem PE verbunden. Bei einem Isolationsfehler fließt der Strom vom Gehäuse über den PE ab, und Sicherung bzw. RCD lösen aus. Das Symbol ist das Erdungszeichen nebenan — siehst du es auf dem Typenschild, heißt das: „Der PE dieses Geräts ist nicht zum Spaß angeschlossen.“ Waschmaschine, Backofen, Bügeleisen — die Schwergewichte im Haushalt sind meist Schutzklasse I. Der Stecker MUSS einen Schutzkontakt haben.",
  "Sınıf II — çifte zırh":
    "Schutzklasse II — doppelte Rüstung",
  "Koruma iletkeni yok; onun yerine çift veya güçlendirilmiş izolasyon. Sembolü yandaki iç içe iki kare — sınavda 'doppelte Isolierung' dendiğinde aklına bu kutu içinde kutu gelsin. Matkaplar, saç kurutucular, çoğu şarj adaptörü. Fişinde toprak kontağı olmamasına şaşırma — ihtiyacı yok, zırhı kendinden.":
    "Kein Schutzleiter; stattdessen doppelte oder verstärkte Isolierung. Das Symbol sind die zwei ineinanderliegenden Quadrate nebenan — wenn in der Prüfung „doppelte Isolierung“ steht, denk an dieses Kästchen im Kästchen. Bohrmaschinen, Haartrockner, die meisten Ladegeräte. Wundere dich nicht, dass der Stecker keinen Schutzkontakt hat — er braucht keinen, die Rüstung ist eingebaut.",
  "Sınıf III — baştan tehlikesiz":
    "Schutzklasse III — von Anfang an ungefährlich",
  "Yalnızca SELV/PELV güvenlik küçük gerilimiyle çalışır (AC ≤ 50 V, DC ≤ 120 V). Tehlikeli gerilim cihaza hiç girmez; koruma, kaynağın (güvenlik trafosunun) kendisidir. Oyuncaklar, bahçe aydınlatması, gömme spotlar. Sembolü yandaki romen rakamı III'lü eşkenar dörtgen.":
    "Arbeitet ausschließlich mit Schutzkleinspannung SELV/PELV (AC ≤ 50 V, DC ≤ 120 V). Gefährliche Spannung gelangt gar nicht erst ins Gerät; der Schutz ist die Quelle selbst (der Sicherheitstransformator). Spielzeug, Gartenbeleuchtung, Einbaustrahler. Das Symbol ist die Raute mit der römischen III nebenan.",
  "Koruma Önlemleri":
    "Schutzmaßnahmen",
  "Basis, Fehler, Zusatz — savunmanın üç hattı.":
    "Basis, Fehler, Zusatz — die drei Verteidigungslinien.",
  "DIN VDE 0100-410'un dünyası. Mantık, soğan modeli gibidir: her katman bir öncekinin başarısız olma ihtimaline karşı vardır.":
    "Die Welt der DIN VDE 0100-410. Die Logik gleicht dem Zwiebelmodell: Jede Schicht ist für den Fall da, dass die vorherige versagt.",
  "1. Basisschutz (temel koruma)":
    "1. Basisschutz",
  "Normal işletmede gerilimli kısımlara dokunamamalısın: izolasyon, kapaklar, muhafazalar, mesafe. Kısacası 'çıplak iletken ortada gezmesin'. Buna eskiden 'doğrudan dokunmaya karşı koruma' denirdi.":
    "Im Normalbetrieb darfst du aktive Teile nicht berühren können: Isolierung, Abdeckungen, Umhüllungen, Abstand. Kurz: „Kein blanker Leiter liegt offen herum.“ Früher hieß das „Schutz gegen direktes Berühren“.",
  "2. Fehlerschutz (hata koruması)":
    "2. Fehlerschutz",
  "İzolasyon hatası OLDUĞUNDA seni koruyacak katman: otomatik kapama (Abschaltung — sigorta/RCD hata akımını kesmeli, TN'de 0,4 s içinde), çift izolasyon (Sınıf II) veya koruyucu ayırma. 'Hata olursa' değil, 'hata olduğunda' — çünkü olur.":
    "Die Schicht, die dich schützt, WENN ein Isolationsfehler auftritt: automatische Abschaltung (Sicherung/RCD müssen den Fehlerstrom abschalten, im TN-System innerhalb von 0,4 s), doppelte Isolierung (Schutzklasse II) oder Schutztrennung. Nicht „falls ein Fehler auftritt“, sondern „wenn er auftritt“ — denn er tritt auf.",
  "3. Zusatzschutz (ek koruma)":
    "3. Zusatzschutz",
  "İlk iki katman da bir şekilde delinirse: 30 mA RCD. İnsan davranışının öngörülemezliğine karşı sigorta — kırılan fişler, kemirilen kablolar, 'bir saniye şuraya uzanayım' anları için. Priz devrelerinde ve banyoda zorunlu.":
    "Falls auch die ersten beiden Schichten irgendwie durchbrochen werden: RCD mit 30 mA. Die Versicherung gegen die Unberechenbarkeit des Menschen — für gebrochene Stecker, angeknabberte Leitungen und „ich greif da nur mal kurz hin“-Momente. Pflicht für Steckdosenstromkreise und im Bad.",
  "Abschaltzeiten tabloları, ölçüm ve doğrulama (Erstprüfung), Potentialausgleich ve senaryo bazlı interaktif quiz.":
    "Tabellen zu den Abschaltzeiten, Messen und Prüfen (Erstprüfung), Potentialausgleich und ein interaktives Quiz mit Szenarien.",
  "5 Güvenlik Kuralı":
    "Die 5 Sicherheitsregeln",
  "Beş parmak, beş kural — sıralaması ezber değil, hayat sigortası.":
    "Fünf Finger, fünf Regeln — die Reihenfolge ist kein Auswendiglernen, sondern eine Lebensversicherung.",
  "DIN VDE 0105-100'ün en ünlü beşlisi. Gerilimli tesiste ÇALIŞMAYA BAŞLAMADAN önce, bu sırayla uygulanır — sıra önemlidir, çünkü her kural bir sonrakinin güvenli yapılabilmesinin ön şartıdır. İş bitince de TERS SIRAYLA geri alınır (önce örtüleri kaldır, en son gerilimi ver). Elektrikçilerin 'içgüdü' haline getirdiği tek ezber buysa, sebebi var: bu beş adım her yıl insanların hayatını kurtarıyor.":
    "Die berühmtesten Fünf der DIN VDE 0105-100. Sie werden VOR BEGINN DER ARBEITEN an einer Anlage in genau dieser Reihenfolge angewendet — die Reihenfolge ist wichtig, weil jede Regel die Voraussetzung dafür ist, dass die nächste sicher ausgeführt werden kann. Nach der Arbeit werden sie in UMGEKEHRTER REIHENFOLGE aufgehoben (zuerst die Abdeckungen entfernen, ganz zuletzt wieder einschalten). Wenn Elektrofachkräfte genau das so lange üben, bis es zum Reflex wird, hat das einen Grund: Diese fünf Schritte retten jedes Jahr Menschenleben.",
  "1️⃣ Freischalten — gerilimi kes / ayır":
    "1️⃣ Freischalten",
  "Tesisatı TÜM kutuplardan besleyen her yerden ayır: LS'yi indir, sigortaları çek, fişi çek, şalteri aç. 'Ben lambadan anladım, kapalıydı' bir ayırma yöntemi değildir — lambanın patlak olma ihtimali senin hayatından daha olası. Birden fazla besleme olabileceğini unutma (merhaba, ikinci hattan beslenen priz).":
    "Die Anlage ALLPOLIG und von allen Einspeisungen trennen: LS-Schalter ausschalten, Sicherungen herausnehmen, Stecker ziehen, Schalter öffnen. „Ich hab's an der Lampe gesehen, die war aus“ ist kein Freischaltverfahren — dass die Lampe defekt ist, ist wahrscheinlicher, als dir lieb sein kann. Denk daran, dass es mehrere Einspeisungen geben kann (hallo, Steckdose am zweiten Stromkreis).",
  "2️⃣ Gegen Wiedereinschalten sichern — tekrar açılmaya karşı emniyete al":
    "2️⃣ Gegen Wiedereinschalten sichern",
  "Kestiğin şalteri kilitle, uyarı levhası as ('Çalışılıyor — açma!'), çektiğin sigortayı CEBİNE koy. Klasik kaza senaryosu: sen bodrumda kablodayken, iyi niyetli bir meslektaş 'kim kapattı bunu?' deyip şalteri kaldırır. Levha ve kilit, o iyi niyeti durduran tek şeydir.":
    "Den ausgeschalteten Schalter abschließen, ein Verbotsschild anbringen („Nicht schalten — es wird gearbeitet!“), die herausgenommene Sicherung IN DIE TASCHE stecken. Das klassische Unfallszenario: Du arbeitest im Keller an der Leitung, während ein wohlmeinender Kollege „Wer hat das denn ausgemacht?“ sagt und wieder einschaltet. Schild und Schloss sind das Einzige, was diese gute Absicht aufhält.",
  "3️⃣ Spannungsfreiheit feststellen — gerilimsizliği DOĞRULA":
    "3️⃣ Spannungsfreiheit FESTSTELLEN",
  "İki kutuplu gerilim test cihazıyla (Duspol tarzı) tüm iletkenler arasında ölç: L-N, L-PE, N-PE, fazlar arası. Önemli ritüel: test cihazını ölçümden ÖNCE ve SONRA bilinen gerilimli bir noktada dene — cihaz bozuksa 'gerilim yok' göstermesi seni teselli etmez. Multimetre bu iş için uygun DEĞİLDİR (yanlış kademe, bozuk problar… gerilim test cihazı bu yüzden var).":
    "Mit einem zweipoligen Spannungsprüfer (Typ Duspol) zwischen allen Leitern messen: L–N, L–PE, N–PE, Außenleiter untereinander. Das wichtige Ritual: den Spannungsprüfer VOR und NACH der Messung an einer bekannt spannungsführenden Stelle testen — ist das Gerät defekt, tröstet dich seine Anzeige „keine Spannung“ nicht. Ein Multimeter ist dafür NICHT geeignet (falscher Messbereich, defekte Messleitungen … genau dafür gibt es Spannungsprüfer).",
  "4️⃣ Erden und kurzschließen — toprakla ve kısa devre et":
    "4️⃣ Erden und kurzschließen",
  "Önce toprakla, sonra kısa devre et — bu sırayla. Böylece biri yanlışlıkla gerilim verirse enerji senin üzerinden değil, hazırladığın kısa devre yolundan akar ve sigortayı attırır. 1 kV üzeri tesislerde ZORUNLU; alçak gerilimde her durumda değil ama örneğin geri besleme riski (jeneratör, PV!) varsa hayati.":
    "Erst erden, dann kurzschließen — in dieser Reihenfolge. Schaltet dann jemand versehentlich ein, fließt die Energie nicht über dich, sondern über die vorbereitete Kurzschlussverbindung und lässt die Sicherung auslösen. In Anlagen über 1 kV PFLICHT; in der Niederspannung nicht in jedem Fall, aber lebenswichtig, sobald Rückspeisung droht (Generator, PV!).",
  "5️⃣ Benachbarte, unter Spannung stehende Teile abdecken — komşu gerilimli kısımları ört/ayır":
    "5️⃣ Benachbarte, unter Spannung stehende Teile abdecken oder abschranken",
  "Her şeyi kapatamadığın durumlar olur: yandaki bara gerilimli kalmak zorunda. O zaman izolasyon örtüleri, lastik paspaslar, bariyerler devreye girer. Mantık basit: dokunamayacağın şey seni çarpamaz. 'Dikkat ederim' bir koruma önlemi değildir — yorgun bir elin nereye uzanacağını kimse bilemez.":
    "Es gibt Situationen, in denen sich nicht alles abschalten lässt: Die Sammelschiene nebenan muss unter Spannung bleiben. Dann kommen Isolierabdeckungen, Gummimatten und Abschrankungen ins Spiel. Die Logik ist einfach: Was du nicht berühren kannst, kann dir keinen Schlag verpassen. „Ich pass schon auf“ ist keine Schutzmaßnahme — niemand weiß, wohin eine müde Hand greift.",
  "Bonus: geri dönüş":
    "Bonus: der Rückweg",
  "İş bitti, herkes uzaklaştı, aletler toplandı → kurallar TERS sırayla kaldırılır: örtüler kalkar, topraklama sökülür, levhalar alınır, kilit açılır ve en son gerilim verilir. Gerilimi verip SONRA topraklamayı sökmeye çalışan kişinin o günü çok kötü geçer — bu cümleyi bir daha oku.":
    "Arbeit erledigt, alle weg, Werkzeug eingesammelt → die Regeln werden in UMGEKEHRTER Reihenfolge aufgehoben: Abdeckungen weg, Erdung und Kurzschließung entfernen, Schilder abnehmen, Schloss öffnen und ganz zuletzt wieder einschalten. Wer zuerst einschaltet und DANACH die Erdung entfernen will, hat einen sehr schlechten Tag — lies diesen Satz noch einmal.",
  "Mantık Fonksiyonları":
    "Logische Funktionen",
  "UND, ODER, NICHT & arkadaşları — kararların matematiği.":
    "UND, ODER, NICHT & Co. — die Mathematik der Entscheidungen.",
  "Kumanda tekniğinin tamamı aslında tek bir soruya cevap verir: 'Hangi şartlarda çıkış aktif olsun?' Bu şartların dili mantık fonksiyonlarıdır. İyi haber: bunları zaten biliyorsun — seri bağlı kontaklar UND'dir, paralel kontaklar ODER, Öffner ise NICHT. Kapı sembolleri (DIN EN 60617: kutu + işaret) aynı fikrin elektronik/SPS dünyasındaki yazılışıdır. Aşağıdaki her fonksiyonu Playground'ın Logik modunda canlı kurabilirsin.":
    "Die gesamte Steuerungstechnik beantwortet im Grunde eine einzige Frage: „Unter welchen Bedingungen soll der Ausgang aktiv sein?“ Die Sprache dieser Bedingungen sind die logischen Funktionen. Die gute Nachricht: Du kennst sie schon — Kontakte in Reihe sind ein UND, parallele Kontakte ein ODER, der Öffner ist das NICHT. Die Gattersymbole (DIN EN 60617: Kästchen + Zeichen) sind dieselbe Idee in der Schreibweise der Elektronik- und SPS-Welt. Jede der folgenden Funktionen kannst du im Logik-Modus des Playgrounds live aufbauen.",
  "UND (AND) — hepsi, yoksa hiç":
    "UND (AND) — alle oder keiner",
  "Bütün girişler 1 ise çıkış 1. Kontak karşılığı: seri bağlantı. Klasik örnek: pres makinesinin iki el kumandası — iki buton BİRDEN basılı değilse pres inmez, çünkü tek elin nerede olduğu belli olmalı. Kutudaki işaret: &.":
    "Sind alle Eingänge 1, ist der Ausgang 1. Entsprechung in Kontakttechnik: Reihenschaltung. Klassisches Beispiel: die Zweihandbedienung einer Presse — sind nicht BEIDE Taster gedrückt, fährt die Presse nicht herunter, denn es muss klar sein, wo jede Hand ist. Zeichen im Kästchen: &.",
  "Çıkış":
    "Ausgang",
  "ODER (OR) — herhangi biri yeter":
    "ODER (OR) — einer genügt",
  "Girişlerden en az biri 1 ise çıkış 1. Kontak karşılığı: paralel bağlantı. Örnek: kapı zili — alt kapıdaki buton da üst kapıdaki de zili çaldırır. İşaret: ≥1 ('bir veya daha fazlası aktifse' demenin matematikçe kısaltması).":
    "Ist mindestens ein Eingang 1, ist der Ausgang 1. Entsprechung in Kontakttechnik: Parallelschaltung. Beispiel: die Türklingel — der Taster an der unteren Tür lässt sie genauso läuten wie der an der oberen. Zeichen: ≥1 (die mathematische Kurzform für „wenn einer oder mehrere aktiv sind“).",
  "NICHT (NOT) — tersine çevirici":
    "NICHT (NOT) — der Umkehrer",
  "Girişi ters çevirir: 1 → 0, 0 → 1. Kontak karşılığı: Öffner. Çıkıştaki küçük yuvarlak 'değil' işaretidir — nerede görürsen orada bir tersleme var demektir. Motor çalışMIYORken yanan 'hazır' lambası tam olarak budur.":
    "Kehrt den Eingang um: 1 → 0, 0 → 1. Entsprechung in Kontakttechnik: der Öffner. Der kleine Kreis am Ausgang ist das Negationszeichen — wo immer du ihn siehst, wird etwas umgekehrt. Die „Bereit“-Leuchte, die leuchtet, solange der Motor NICHT läuft, ist genau das.",
  "NAND — UND'un ters kardeşi":
    "NAND — das Gegenstück zum UND",
  "UND + NICHT: yalnızca TÜM girişler 1 olduğunda çıkış 0, diğer her durumda 1. Neden bu kadar önemli? Çünkü NAND üniversal kapıdır: sadece NAND'lerle UND da, ODER de, NICHT de kurulabilir — yani teoride her devre. Çip üreticilerinin gözdesi; elektroniğin İsviçre çakısı.":
    "UND + NICHT: Nur wenn ALLE Eingänge 1 sind, ist der Ausgang 0, in jedem anderen Fall 1. Warum ist das so wichtig? Weil NAND ein Universalgatter ist: Allein aus NAND-Gattern lassen sich UND, ODER und NICHT aufbauen — theoretisch also jede Schaltung. Der Liebling der Chiphersteller; das Schweizer Taschenmesser der Elektronik.",
  "NOR — ODER'in ters kardeşi":
    "NOR — das Gegenstück zum ODER",
  "ODER + NICHT: herhangi bir giriş 1 olduğu anda çıkış 0; ancak HİÇBİRİ aktif değilse 1. O da üniversaldir. Asıl şöhreti: iki NOR'u çapraz bağlarsan RS-Flipflop elde edersin — Selbsthaltung'un dijital atası. Playground'da dene: her kapının çıkışını diğerinin girişine bağla, butonlarla Set/Reset yap.":
    "ODER + NICHT: Sobald irgendein Eingang 1 ist, ist der Ausgang 0; nur wenn KEINER aktiv ist, ist er 1. Auch das NOR ist universell. Sein eigentlicher Ruhm: Verschaltest du zwei NOR über Kreuz, erhältst du ein RS-Flipflop — den digitalen Vorfahren der Selbsthaltung. Probier es im Playground aus: den Ausgang jedes Gatters auf den Eingang des anderen legen und mit den Tastern setzen und rücksetzen.",
  "XOR (Antivalenz) — ya o, ya bu; ikisi değil":
    "XOR (Antivalenz) — entweder oder, nicht beides",
  "Girişler FARKLIYSA çıkış 1, aynıysa 0. İşaret: =1 ('tam olarak bir tanesi aktif'). Bunu yıllardır kullanıyorsun: koridorun iki ucundaki Wechselschalter'ler. Hangi şalteri çevirirsen çevir lambanın durumu değişir — çünkü lamba, şalter konumlarının XOR'udur. (Aynıysa 1 veren kardeşi XNOR/Äquivalenz da vardır, o da =1 kutusunun çıkışına yuvarlak takılmış hali.)":
    "Sind die Eingänge VERSCHIEDEN, ist der Ausgang 1, sind sie gleich, ist er 0. Zeichen: =1 („genau einer ist aktiv“). Du benutzt das seit Jahren: die Wechselschalter an den beiden Enden des Flurs. Egal welchen Schalter du betätigst, die Leuchte wechselt ihren Zustand — denn sie ist das XOR der Schalterstellungen. (Es gibt auch das Geschwister, das bei gleichen Eingängen 1 liefert: XNOR/Äquivalenz, also das =1-Kästchen mit einem Kreis am Ausgang.)",
  "Kontak tekniği ↔ Logik sözlüğü":
    "Kontakttechnik ↔ Logik: das Wörterbuch",
  "İki dünya aynı dili konuşur, sadece aksanları farklı. Sınavda 'kontak planını mantık planına çevir' tarzı sorular tam buradan çıkar:":
    "Beide Welten sprechen dieselbe Sprache, nur mit unterschiedlichem Akzent. Prüfungsfragen der Art „Wandle den Kontaktplan in einen Logikplan um“ kommen genau von hier:",
  "Kontak tekniği":
    "Kontakttechnik",
  "Logik karşılığı":
    "Entsprechung in der Logik",
  "Seri bağlı kapayıcılar":
    "Schließer in Reihe",
  "Paralel bağlı kapayıcılar":
    "Schließer parallel",
  "Öffner (açıcı kontak)":
    "Öffner",
  "NICHT (tersleme)":
    "NICHT (Negation)",
  "Seri bağlı açıcılar":
    "Öffner in Reihe",
  "NOR (hiçbiri basılı değilse 1)":
    "NOR (1, wenn keiner betätigt ist)",
  "Paralel bağlı açıcılar":
    "Öffner parallel",
  "NAND (ikisi birden basılı değilse 1)":
    "NAND (1, solange nicht beide betätigt sind)",
  "Selbsthaltung (mühürleme)":
    "Selbsthaltung",
  "RS-Flipflop (2 × NOR)":
    "RS-Flipflop (2 × NOR)",
  "Wechselschaltung (koridor)":
    "Wechselschaltung (Flur)",
  "Devre Sembolleri":
    "Schaltzeichen",
  "Elektrikçinin hiyeroglifleri.":
    "Die Hieroglyphen der Elektrofachkraft.",
  "Şemalar, elektrikçilerin ortak dili — ve her dilde olduğu gibi, alfabeyi bilmeyen cümleyi de okuyamaz. Öffner mi Schließer mi, Taster mı Schalter mı; hangi kutu bobin, hangi çizgi PE… Aşağıda en sık karşılaşacağın semboller, şema türleri ve harf kodları var. Sembollerin hepsi Playground'da canlı: sürükle, bağla, çalıştır.":
    "Schaltpläne sind die gemeinsame Sprache der Elektrotechnik — und wie in jeder Sprache gilt: Wer das Alphabet nicht kennt, kann den Satz nicht lesen. Öffner oder Schließer, Taster oder Schalter; welches Kästchen ist die Spule, welche Linie der PE … Hier findest du die häufigsten Schaltzeichen, die Schaltplanarten und die Kennbuchstaben. Alle Zeichen gibt es im Playground in lebendig: ziehen, verdrahten, einschalten.",
  "Şema türleri":
    "Schaltplanarten",
  "Aynı tesisat üç farklı şekilde çizilir; hangisine baktığını bilmezsen yanlış soruya cevap ararsın. Sınavda da işte de en çok Stromlaufplan okursun.":
    "Dieselbe Anlage wird auf drei verschiedene Arten gezeichnet; wenn du nicht weißt, welche du vor dir hast, suchst du die Antwort auf die falsche Frage. In der Prüfung wie im Betrieb liest du am häufigsten den Stromlaufplan.",
  "Şema":
    "Schaltplan",
  "Ne gösterir?":
    "Was zeigt er?",
  "Ne zaman kullanılır?":
    "Wann wird er verwendet?",
  "Übersichtsschaltplan":
    "Übersichtsschaltplan",
  "Tek hatlı, sadeleştirilmiş genel bakış; iletken sayısı çentiklerle belirtilir":
    "Einpolige, vereinfachte Übersicht; die Leiterzahl wird durch Querstriche angegeben",
  "Dağıtım panosu, tesisin bütünü":
    "Verteilung, die Anlage als Ganzes",
  "Stromlaufplan (aufgelöste Darstellung)":
    "Stromlaufplan (aufgelöste Darstellung)",
  "Her akım yolu ayrı ayrı, yukarıdan aşağıya; bobin ve kontakları ayrı yerlerde çizilir":
    "Jeder Strompfad einzeln, von oben nach unten; Spule und Kontakte werden an getrennten Stellen gezeichnet",
  "Kontaktör devreleri, arıza arama":
    "Schützschaltungen, Fehlersuche",
  "Stromlaufplan (zusammenhängende Darstellung)":
    "Stromlaufplan (zusammenhängende Darstellung)",
  "Cihazlar bütün halinde, tüm bağlantılarıyla":
    "Die Betriebsmittel als Ganzes mit allen Anschlüssen",
  "Basit tesisat devreleri":
    "Einfache Installationsschaltungen",
  "Installationsplan":
    "Installationsplan",
  "Kat planı üzerinde priz, şalter ve lamba konumları":
    "Lage von Steckdosen, Schaltern und Leuchten im Grundriss",
  "Şantiye: neyin nereye monte edileceği":
    "Baustelle: was wo montiert wird",
  "Şalterler ve butonlar":
    "Schalter und Taster",
  "Schließer (kapayıcı) basılınca devreyi kapatır, Öffner (açıcı) basılınca açar. Schalter konumunda kalır; Taster yaylıdır, bırakınca geri döner. Semboller her zaman BASILMAMIŞ ve GERİLİMSİZ halde çizilir — şemayı okurken ilk kural budur. Kontak numaraları da konuşur: sonu 3-4 ile biten (13-14, 23-24) kapayıcı, 1-2 ile biten (11-12, 21-22) açıcıdır.":
    "Der Schließer schließt den Stromkreis beim Betätigen, der Öffner öffnet ihn. Ein Schalter bleibt in seiner Stellung; ein Taster ist federnd und geht beim Loslassen zurück. Schaltzeichen werden immer UNBETÄTIGT und SPANNUNGSLOS gezeichnet — das ist die erste Regel beim Lesen eines Schaltplans. Auch die Kontaktnummern sprechen: Endet die Bezeichnung auf 3-4 (13-14, 23-24), ist es ein Schließer, endet sie auf 1-2 (11-12, 21-22), ein Öffner.",
  "Kontaktör ve zaman rölesi":
    "Schütz und Zeitrelais",
  "Bobin (A1–A2) gerilim alınca çeker ve aynı etiketi taşıyan bütün kontakları birlikte oynatır. Aufgelöste Darstellung'da bobin bir akım yolunda, kontakları bambaşka yollarda durur; onları birbirine bağlayan tek şey etikettir (K1). Zaman kontaklarındaki yarım daire gecikmeyi gösterir.":
    "Bekommt die Spule (A1–A2) Spannung, zieht sie an und betätigt alle Kontakte mit derselben Bezeichnung gemeinsam. In der aufgelösten Darstellung liegt die Spule in einem Strompfad, ihre Kontakte in ganz anderen; verbunden sind sie nur über die Bezeichnung (K1). Der Halbkreis an Zeitkontakten kennzeichnet die Verzögerung.",
  "Yükler ve kaynak":
    "Verbraucher und Quelle",
  "Devrenin işi yapan kısmı. Lamba çarpı işaretli daire, motor içinde M yazan dairedir. Yük olmadan L'den N'ye giden her yol kısa devredir — şemada bunu görebilmek, sigortadan önce senin işin.":
    "Der Teil der Schaltung, der die Arbeit verrichtet. Die Leuchte ist ein Kreis mit Kreuz, der Motor ein Kreis mit einem M darin. Jeder Weg von L nach N ohne Verbraucher ist ein Kurzschluss — das im Schaltplan zu erkennen ist deine Aufgabe, bevor es die der Sicherung wird.",
  "Harf kodları (Betriebsmittelkennzeichnung)":
    "Kennbuchstaben (Betriebsmittelkennzeichnung)",
  "Her elemanın yanındaki harf, onun ne iş yaptığını söyler (DIN EN 81346-2). Eski şemalarda ve birçok okul kitabında hâlâ eski harfler geçer: sinyal lambası için H, ana kontaktör için K. İkisini de tanımak zorundasın; sınav hangisini kullanıyorsa onu yaz.":
    "Der Buchstabe neben jedem Betriebsmittel sagt, welche Aufgabe es hat (DIN EN 81346-2). In älteren Plänen und vielen Schulbüchern stehen noch die alten Buchstaben: H für die Meldeleuchte, K für das Hauptschütz. Du musst beide kennen; schreib so, wie es deine Prüfung verwendet.",
  "Harf":
    "Buchstabe",
  "Görev":
    "Aufgabe",
  "Örnek":
    "Beispiel",
  "Fiziksel büyüklüğü sinyale çevirir":
    "Wandelt eine physikalische Größe in ein Signal um",
  "Sensör, hareket dedektörü, termostat":
    "Sensor, Bewegungsmelder, Thermostat",
  "Işık veya ısı üretir":
    "Erzeugt Licht oder Wärme",
  "Aydınlatma lambası, ısıtıcı":
    "Beleuchtung, Heizung",
  "Korur":
    "Schützt",
  "Sigorta, LS-Schalter, RCD, motor koruma":
    "Sicherung, LS-Schalter, RCD, Motorschutz",
  "Enerji üretir":
    "Erzeugt Energie",
  "Jeneratör, akü, güç kaynağı":
    "Generator, Batterie, Netzteil",
  "Sinyal işler":
    "Verarbeitet Signale",
  "Yardımcı kontaktör, röle, zaman rölesi":
    "Hilfsschütz, Relais, Zeitrelais",
  "Mekanik hareket üretir":
    "Erzeugt mechanische Bewegung",
  "Motor":
    "Motor",
  "Bilgi gösterir":
    "Stellt Informationen dar",
  "Sinyal lambası, sayaç, ölçü aleti (eski: H)":
    "Meldeleuchte, Zähler, Messgerät (alt: H)",
  "Enerji akışını anahtarlar":
    "Schaltet den Energiefluss",
  "Ana kontaktör, güç şalteri (eski: K)":
    "Hauptschütz, Leistungsschalter (alt: K)",
  "El hareketini sinyale çevirir":
    "Wandelt Handbetätigung in ein Signal um",
  "Şalter, buton":
    "Schalter, Taster",
  "Enerjiyi dönüştürür":
    "Wandelt Energie um",
  "Trafo, frekans konvertörü":
    "Transformator, Frequenzumrichter",
  "Enerji veya sinyal iletir":
    "Leitet Energie oder Signale",
  "Kablo, bara":
    "Leitung, Sammelschiene",
  "Bağlar":
    "Verbindet",
  "Klemens, priz, fiş":
    "Klemme, Steckdose, Stecker",
  "Döşeme Türleri":
    "Verlegearten",
  "Kablonun nerede yattığı, ne kadar taşıyacağını belirler.":
    "Wo die Leitung liegt, bestimmt, wie viel sie tragen darf.",
  "Aynı kablo, duvarın içinde başka, kablo kanalında başka, açık havada bambaşka akım taşır — mesele ısının kaçıp kaçamadığıdır. DIN VDE 0298-4 bunu harflerle sınıflandırır. Harf ilerledikçe kablo nefes alır, taşıyabildiği akım (Strombelastbarkeit, I_z) artar.":
    "Dieselbe Leitung trägt in der Wand einen anderen Strom als im Kanal und wieder einen anderen frei in Luft — entscheidend ist, ob die Wärme wegkann. DIN VDE 0298-4 teilt das mit Buchstaben ein. Je weiter hinten im Alphabet, desto besser kann die Leitung atmen und desto höher ist ihre Strombelastbarkeit (I_z).",
  "Referans döşeme türleri":
    "Referenzverlegearten",
  "Tabloda aradığın şey kablonun KENDİSİ değil, etrafındaki ortamdır. Bir hat yolu boyunca birden fazla tür varsa en kötüsü belirleyicidir: 20 metre duvar üstünden gidip 1 metre yalıtımın içinden geçen kablo, A türüne göre hesaplanır.":
    "In der Tabelle suchst du nicht die Leitung SELBST, sondern ihre Umgebung. Gibt es entlang eines Leitungswegs mehrere Verlegearten, bestimmt die ungünstigste: Eine Leitung, die 20 Meter auf der Wand und 1 Meter durch die Dämmung läuft, wird nach Verlegeart A berechnet.",
  "Tür":
    "Verlegeart",
  "Nasıl döşenir?":
    "Wie wird verlegt?",
  "Tipik örnek":
    "Typisches Beispiel",
  "Tek damarlı iletkenler, ısı yalıtımlı duvar içindeki boruda":
    "Aderleitungen im Elektroinstallationsrohr in wärmegedämmter Wand",
  "Ahşap karkas / alçıpan duvarda boru içinde H07V-U":
    "H07V-U im Rohr in Holzständer- / Gipskartonwand",
  "Çok damarlı kablo, ısı yalıtımlı duvar içindeki boruda":
    "Mehradrige Leitung im Elektroinstallationsrohr in wärmegedämmter Wand",
  "Yalıtımlı duvarda boru içinde NYM":
    "NYM im Rohr in gedämmter Wand",
  "Tek damarlı iletkenler, duvar üstü boru veya kanalda":
    "Aderleitungen im Rohr oder Kanal auf der Wand",
  "Sıva üstü boruda H07V-U":
    "H07V-U im Rohr auf Putz",
  "Çok damarlı kablo, duvar üstü boru veya kanalda":
    "Mehradrige Leitung im Rohr oder Kanal auf der Wand",
  "Kablo kanalında NYM":
    "NYM im Leitungskanal",
  "Doğrudan duvarın üstünde veya sıvanın içinde":
    "Direkt auf der Wand oder im Putz",
  "Sıva altı NYM, kroşeyle sıva üstü NYM":
    "NYM unter Putz, NYM mit Schellen auf Putz",
  "Toprak altında (boru içinde veya doğrudan)":
    "Im Erdreich (im Rohr oder direkt)",
  "Bahçe hattı, NYY":
    "Gartenzuleitung, NYY",
  "Çok damarlı kablo, havada serbest (duvardan mesafeli)":
    "Mehradrige Leitung frei in Luft (mit Abstand zur Wand)",
  "Kablo rafında NYM / NYY":
    "NYM / NYY auf der Kabelpritsche",
  "Tek damarlı kablolar, havada (F: birbirine değerek, G: aralıklı)":
    "Einadrige Kabel frei in Luft (F: mit Berührung, G: mit Abstand)",
  "Endüstride büyük kesitli besleme hatları":
    "Zuleitungen mit großem Querschnitt in der Industrie",
  "Akım taşıma kapasitesi I_z (A)":
    "Strombelastbarkeit I_z (A)",
  "Bakır iletken, PVC yalıtım (izin verilen iletken sıcaklığı 70 °C), ortam sıcaklığı 30 °C. Her hücrede ilk değer 2 yüklü damar (tek fazlı devre), ikinci değer 3 yüklü damar (trifaze devre) içindir. PE yüklü damar sayılmaz.":
    "Kupferleiter, PVC-Isolierung (zulässige Leitertemperatur 70 °C), Umgebungstemperatur 30 °C. In jeder Zelle gilt der erste Wert für 2 belastete Adern (Wechselstromkreis), der zweite für 3 belastete Adern (Drehstromkreis). Der PE zählt nicht als belastete Ader.",
  "mm²":
    "mm²",
  "Düzeltme faktörleri":
    "Umrechnungsfaktoren",
  "Tablo değerleri ideal koşullar içindir. Ortam 30 °C'den sıcaksa ya da aynı boruda/kanalda birden fazla devre yan yana ısınıyorsa, tablo değeri faktörlerle çarpılır: I_z = I_tablo · f_sıcaklık · f_yığılma. İkisi birden geçerliyse ikisi de çarpılır — kablo için kötü günler üst üste gelir.":
    "Die Tabellenwerte gelten für ideale Bedingungen. Ist die Umgebung wärmer als 30 °C oder erwärmen sich mehrere Stromkreise im selben Rohr bzw. Kanal gegenseitig, wird der Tabellenwert mit Faktoren multipliziert: I_z = I_Tabelle · f_Temperatur · f_Häufung. Trifft beides zu, wird beides multipliziert — für die Leitung kommt ein Unglück selten allein.",
  "Ortam sıcaklığı (PVC)":
    "Umgebungstemperatur (PVC)",
  "Sıcaklık faktörü":
    "Temperaturfaktor",
  "Yan yana devre sayısı":
    "Anzahl der Stromkreise nebeneinander",
  "Yığılma faktörü":
    "Häufungsfaktor",
  "Seçim zinciri: I_b ≤ I_n ≤ I_z":
    "Die Auswahlkette: I_b ≤ I_n ≤ I_z",
  "Önce yükün çektiği akım (I_b), sonra onu karşılayan sigorta (I_n), en son da o sigortayı taşıyabilen kablo (I_z). Sigorta kabloyu korur, tersi değil. Örnek: 3 yüklü damar, 1,5 mm². C türünde I_z = 17,5 A → B16 uygun. Aynı kablo A1 türünde yalnızca 13,5 A taşır → B16 OLMAZ; ya B13'e inersin ya da 2,5 mm²'ye çıkarsın (18 A). Kesiti seçtikten sonra iş bitmez: uzun hatlarda gerilim düşümünü de kontrol et — Spannungsfall kartları bunun için var.":
    "Erst der Strom, den der Verbraucher aufnimmt (I_b), dann die Sicherung, die ihn abdeckt (I_n), und zuletzt die Leitung, die diese Sicherung tragen kann (I_z). Die Sicherung schützt die Leitung, nicht umgekehrt. Beispiel: 3 belastete Adern, 1,5 mm². Bei Verlegeart C ist I_z = 17,5 A → B16 passt. Dieselbe Leitung trägt bei Verlegeart A1 nur 13,5 A → B16 geht NICHT; entweder runter auf B13 oder rauf auf 2,5 mm² (18 A). Mit der Wahl des Querschnitts ist es nicht getan: Bei langen Leitungen auch den Spannungsfall prüfen — dafür gibt es die Spannungsfall-Karten.",
  "⚠️ Bu tablolar ne kadar bağlayıcı?":
    "⚠️ Wie verbindlich sind diese Tabellen?",
  "Buradaki değerler öğrenmek ve hızlı kontrol içindir; sık kullanılan kesitleri ve türleri kapsar. Gerçek projede ve sınavda güncel norm (DIN VDE 0298-4, DIN VDE 0100-520) ile elindeki Tabellenbuch geçerlidir. Farklı yalıtım (ör. VPE/XLPE, 90 °C), alüminyum iletken veya toprak altı döşemede değerler değişir.":
    "Die Werte hier dienen dem Lernen und der schnellen Kontrolle; sie decken die gängigen Querschnitte und Verlegearten ab. Im echten Projekt und in der Prüfung gelten die aktuelle Norm (DIN VDE 0298-4, DIN VDE 0100-520) und dein Tabellenbuch. Bei anderer Isolierung (z. B. VPE, 90 °C), Aluminiumleitern oder Verlegung im Erdreich ändern sich die Werte.",
  "Kaynak (yatay)":
    "Quelle (waagerecht)",
  "Kaynak (dikey)":
    "Quelle (senkrecht)",
  "Ray L":
    "Schiene L",
  "Ray N":
    "Schiene N",
  "Knotenpunkt":
    "Knotenpunkt",
  "Şalter (kapayıcı)":
    "Schalter (Schließer)",
  "Şalter (açıcı)":
    "Schalter (Öffner)",
  "Buton (kapayıcı)":
    "Taster (Schließer)",
  "Buton (açıcı)":
    "Taster (Öffner)",
  "Eş kontak (kapayıcı)":
    "Gekoppelter Kontakt (Schließer)",
  "Eş kontak (açıcı)":
    "Gekoppelter Kontakt (Öffner)",
  "Lamba":
    "Leuchte",
  "Kontaktör bobini":
    "Schützspule",
  "Kontak (kapayıcı)":
    "Schützkontakt (Schließer)",
  "Kontak (açıcı)":
    "Schützkontakt (Öffner)",
  "Zaman rölesi":
    "Zeitrelais",
  "Zaman kontağı (kapayıcı)":
    "Zeitkontakt (Schließer)",
  "Zaman kontağı (açıcı)":
    "Zeitkontakt (Öffner)",
  "Gerilim kaynağı (şebeke). Gerilimi panelden değiştir; simülasyonda üzerine tıklayarak aç/kapa.":
    "Spannungsquelle (Netz). Die Spannung stellst du im Eigenschaften-Feld ein; in der Simulation schaltest du sie per Klick ein und aus.",
  "Dikey kaynak: L üstte, N altta. Panelden veya simülasyonda tıklayarak aktif/deaktif edilebilir.":
    "Senkrechte Quelle: L oben, N unten. Lässt sich im Eigenschaften-Feld oder per Klick in der Simulation aktivieren und deaktivieren.",
  "L rayı (Sammelschiene): fiziksel modda faz, Logik modunda mantık 1. Sabittir, silinmez.":
    "L-Schiene (Sammelschiene): im elektrischen Modus der Außenleiter, im Logik-Modus logisch 1. Sie ist fest und kann nicht gelöscht werden.",
  "N rayı: dönüş / mantık 0. Devrenin bittiği yer.":
    "N-Schiene: Rückleiter / logisch 0. Hier endet der Stromkreis.",
  "Knotenpunkt: kablo dallanma noktası. Kablo çekerken boş alana tıklayınca otomatik oluşur; buradan istediğin kadar kol ayır.":
    "Knotenpunkt: Abzweigstelle für Leitungen. Entsteht automatisch, wenn du beim Verdrahten auf eine freie Stelle klickst; von hier kannst du beliebig viele Abzweige ziehen.",
  "Kalıcı şalter, kapayıcı (Schließer). Simülasyonda tıkla: konum değiştirir ve orada kalır.":
    "Rastender Schalter, Schließer. In der Simulation anklicken: Er wechselt die Stellung und bleibt dort.",
  "Kalıcı şalter, açıcı (Öffner). Normalde KAPALI, tıklayınca açar.":
    "Rastender Schalter, Öffner. Im Ruhezustand GESCHLOSSEN, öffnet beim Anklicken.",
  "Yaylı buton, kapayıcı (Taster). Sadece BASILI TUTTUĞUN sürece kapalı — zil butonu mantığı.":
    "Taster mit Federrückstellung, Schließer. Nur geschlossen, SOLANGE DU IHN GEDRÜCKT HÄLTST — das Prinzip Klingeltaster.",
  "Yaylı buton, açıcı. Normalde kapalı, bastığın sürece açık. Acil stoplar bu yüzden hep açıcıdır.":
    "Taster mit Federrückstellung, Öffner. Im Ruhezustand geschlossen, offen, solange du drückst. Deshalb sind Not-Halt-Taster immer Öffner.",
  "Eş kontak (kapayıcı): panelden seçtiğin şalterin/butonun İKİNCİ kontağı. Aynı düğmeye basınca bu da onunla birlikte hareket eder. Her düğmenin 1 kapayıcı + 1 açıcı eş kontağı olabilir — gerçek düğmede daha fazlasına yer yok 😄":
    "Gekoppelter Kontakt (Schließer): der ZWEITE Kontakt des Schalters/Tasters, den du im Eigenschaften-Feld auswählst. Wird dieser betätigt, bewegt sich der Kontakt mit. Jeder Taster kann 1 Schließer + 1 Öffner als gekoppelten Kontakt haben — für mehr ist im echten Taster kein Platz 😄",
  "Eş kontak (açıcı): seçtiğin düğme basılınca BU AÇILIR. Tasterverriegelung'un anahtarı: S1'in açıcısını S2'nin yoluna koy, ikisi aynı anda çalışamasın. Turkuaz kesik çizgi = mekanik bağ işareti.":
    "Gekoppelter Kontakt (Öffner): DIESER ÖFFNET, wenn der gewählte Taster betätigt wird. Der Schlüssel zur Tasterverriegelung: Leg den Öffner von S1 in den Pfad von S2, dann können beide nicht gleichzeitig arbeiten. Türkise gestrichelte Linie = mechanische Wirkverbindung.",
  "Lamba (H). Tam gerilimde parlar, seri bölünmüş gerilimde loş yanar. Logik modunda: giriş 1 ise yanar.":
    "Leuchte (H). Leuchtet bei voller Spannung hell, bei in Reihe aufgeteilter Spannung nur schwach. Im Logik-Modus: leuchtet, wenn der Eingang 1 ist.",
  "Motor (M). Tam gerilim alınca döner (mavi ışıma), yarım gerilimde 'zayıf!' diye sızlanır.":
    "Motor (M). Dreht sich bei voller Spannung (blaues Leuchten), bei halber Spannung jammert er „zu schwach!“.",
  "Kontaktör bobini (Schütz, K). A1–A2 gerilim görünce çeker ve aynı etiketli TÜM kontakları oynatır.":
    "Schützspule (K). Zieht an, sobald an A1–A2 Spannung anliegt, und betätigt ALLE Kontakte mit derselben Bezeichnung.",
  "Kontaktör kontağı, kapayıcı. Panelden hangi bobini (K1…) takip edeceğini seç.":
    "Schützkontakt, Schließer. Im Eigenschaften-Feld wählst du, welcher Spule (K1 …) er folgt.",
  "Kontaktör kontağı, açıcı. Bobin çekince AÇILIR — kilitleme (Verriegelung) bununla yapılır.":
    "Schützkontakt, Öffner. ÖFFNET, wenn die Spule anzieht — damit wird die Verriegelung aufgebaut.",
  "Zaman rölesi (KT). Panelden modunu seç: EIN-verzögert (çekmede gecikme), AUS-verzögert (bırakmada gecikme), IMPULS (tek darbe), TAKT (yanıp sönme). Süre de ayarlanır.":
    "Zeitrelais (KT). Im Eigenschaften-Feld wählst du die Funktion: EIN-verzögert (anzugverzögert), AUS-verzögert (abfallverzögert), IMPULS (einzelner Impuls), TAKT (Blinken). Auch die Zeit ist einstellbar.",
  "Zaman kontağı, kapayıcı: bağlı rölenin moduna göre hareket eder. Yarım daire = zaman işareti.":
    "Zeitkontakt, Schließer: schaltet je nach Funktion des zugehörigen Relais. Halbkreis = Kennzeichen für die Verzögerung.",
  "Zaman kontağı, açıcı: röle 'aktif' sayıldığında açılır.":
    "Zeitkontakt, Öffner: öffnet, wenn das Relais als „aktiv“ gilt.",
  "UND (&): bütün girişler 1 ise çıkış 1. Seri kontakların elektronik ruh ikizi. Presin iki el butonu: ikisi birden basılı değilse inmez.":
    "UND (&): Sind alle Eingänge 1, ist der Ausgang 1. Der elektronische Seelenverwandte der Kontakte in Reihe. Die Zweihandtaster der Presse: Sind nicht beide gedrückt, fährt sie nicht herunter.",
  "ODER (≥1): girişlerden HERHANGİ biri 1 ise çıkış 1. Paralel kontaklar. Kapı zili: alt kapı da üst kapı da çaldırır.":
    "ODER (≥1): Ist IRGENDEIN Eingang 1, ist der Ausgang 1. Parallele Kontakte. Die Türklingel: Die untere Tür lässt sie läuten, die obere auch.",
  "NICHT: girişi ters çevirir. Öffner'in elektronik hali. Çıkıştaki yuvarlak = 'değil' şapkası.":
    "NICHT: kehrt den Eingang um. Die elektronische Form des Öffners. Der Kreis am Ausgang = das Negationszeichen.",
  "NAND: UND + değil. Üniversal kapı — sadece NAND'lerle her devre kurulabilir; elektroniğin İsviçre çakısı.":
    "NAND: UND + NICHT. Das Universalgatter — allein aus NAND-Gattern lässt sich jede Schaltung aufbauen; das Schweizer Taschenmesser der Elektronik.",
  "NOR: ODER + değil. İki NOR'u çaprazlarsan RS-Flipflop olur — Selbsthaltung'un dijital dedesi. Dene!":
    "NOR: ODER + NICHT. Verschaltest du zwei NOR über Kreuz, entsteht ein RS-Flipflop — der digitale Großvater der Selbsthaltung. Probier es aus!",
  "XOR / Antivalenz (=1): girişler FARKLIYSA 1. Koridordaki iki Wechselschalter tam olarak budur.":
    "XOR / Antivalenz (=1): 1, wenn die Eingänge VERSCHIEDEN sind. Genau das sind die beiden Wechselschalter im Flur.",
  "Lamba + Şalter":
    "Leuchte + Schalter",
  "Tasterverriegelung (eş kontaklarla)":
    "Tasterverriegelung (mit gekoppelten Kontakten)",
  "Zaman rölesi (gecikmeli lamba)":
    "Zeitrelais (verzögerte Leuchte)",
  "Kontaktör kilitleme (Verriegelung)":
    "Schützverriegelung",
  "Kısa devre (bilerek 💥)":
    "Kurzschluss (mit Absicht 💥)",
  "UND — iki el kumandası":
    "UND — Zweihandbedienung",
  "ODER — kapı zili":
    "ODER — Türklingel",
  "XOR — koridor lambası":
    "XOR — Flurbeleuchtung",
  "NAND — üniversal kapı":
    "NAND — Universalgatter",
};

export default dict;
