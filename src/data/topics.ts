import type { TopicDef } from "./types";

export const TOPICS: TopicDef[] = [
  {
    id: "netzsysteme",
    title: "Şebeke Sistemleri",
    de: "Netzsysteme",
    icon: "🌐",
    tagline: "TN, TT, IT — topraklamanın aile ağacı.",
    sections: [
      {
        body: "Şebeke sistemleri, 'toprak ile şebekenin ilişkisi nasıl kurulmuş?' sorusunun cevabıdır. İsimlendirme şifre gibi görünür ama mantığı basit: İLK harf şebekenin (trafonun) toprakla ilişkisi, İKİNCİ harf cihaz gövdelerinin toprakla ilişkisi. T = Terre (toprak, doğrudan topraklı), N = Nötr üzerinden şebekeye bağlı, I = İzole (toprakla arası mesafeli).",
      },
      {
        h: "TN-C — eski toprak, tek kablo",
        body: "Koruma iletkeni (PE) ile nötr (N) tek iletkende birleşik: PEN. Eski binaların klasiği. Ekonomik ama riskli: PEN koparsa cihaz gövdeleri şebeke potansiyeline gelebilir — yani buzdolabının kapısı aniden 'sürpriz' moduna geçer. Bu yüzden yeni tesisatlarda 10 mm²'nin altında yasak. Şemada gör: yeşil-sarı PEN hattı trafodan cihaza kadar tek başına gidiyor.",
        diagram: "tn-c",
      },
      {
        h: "TN-S — modern ve medeni",
        body: "PE ve N baştan sona ayrı yürür. Beş iletkenli sistem (L1, L2, L3, N, PE). Güvenli, EMC dostu, FI/RCD ile mükemmel anlaşır. Yeni tesisatın standardı. Şemada mavi N ile yeşil-sarı PE'nin trafodan itibaren ayrı yürüdüğüne dikkat.",
        diagram: "tn-s",
      },
      {
        h: "TN-C-S — ortada tanışıp ayrılanlar",
        body: "Şebekeden binaya kadar PEN (TN-C), bina girişinden itibaren PE ve N ayrılır (TN-S). Almanya'daki tipik ev bağlantısı budur. Şemadaki sarı nokta ayrım noktası: PEN, Hausanschlusskasten'e kadar gelir ve orada N ile PE'ye ayrılır. Önemli kural: bir kez ayrıldılar mı bir daha ASLA birleşemezler — elektrik tesisatının en katı ayrılık hikâyesi.",
        diagram: "tn-c-s",
      },
      {
        h: "TT — herkes kendi toprağına",
        body: "Trafo kendi topraklamasına sahip, senin binanın da KENDİ toprak elektrodu var (Anlagenerder); ikisi arasında metalik bağlantı yok, hata akımı toprak üzerinden döner. Toprak geçiş dirençleri yüksek olabileceğinden hata akımları küçük kalır — bu yüzden TT sisteminde RCD pratikte zorunlu hayat sigortasıdır. Şemada dikkat: trafodan PE GELMİYOR, gövde binanın kendi toprağına bağlı. Kırsal bölgelerde ve bazı ülkelerde (merhaba Fransa 🥖) yaygın.",
        diagram: "tt",
      },
      {
        h: "IT — inatçı ve kesintisiz",
        body: "Şebeke toprağa bağlı DEĞİL (ya da yüksek empedansla bağlı — şemadaki Z kutusu). İlk hata olduğunda kısa devre akımı akacak yol bulamaz → sistem çalışmaya DEVAM eder, sadece izolasyon izleme cihazı (Isolationswächter) alarm verir. İkinci hata gelmeden birinciyi bulman beklenir. Ameliyathaneler ve kesintinin felaket olduğu endüstri tesisleri için: 'ışık sönmesin, alarm ötsün' felsefesi.",
        diagram: "it",
      },
      {
        h: "🚧 Yakında",
        body: "Hata senaryosu animasyonları ('PEN koptu, şimdi ne olacak?') ve 'hangi sistemde RCD nasıl davranır' interaktifleri yolda. Şemalar artık burada — animasyonları da Playground motoruyla evlendireceğiz.",
      },
    ],
  },
  {
    id: "rcd-fi",
    title: "Kaçak Akım Koruması",
    de: "RCD / FI-Schutzschalter",
    icon: "🛟",
    tagline: "Giden akım dönmüyorsa, biri fazla bilgi sahibi oluyor demektir.",
    sections: [
      {
        body: "RCD (Residual Current Device, Almanca kültüründe FI-Schalter) tek bir soruyu takıntı halinde sorar: 'Giden akım, dönen akıma eşit mi?' Normalde fazdan giden her miliamper nötrden geri döner. Dönmüyorsa, akım başka bir yol bulmuş demektir — ve o yol bazen bir insandır. Fark, eşik değeri (ör. 30 mA) aşarsa RCD milisaniyeler içinde devreyi keser.",
      },
      {
        h: "30 mA neden 30 mA?",
        body: "İnsan kalbi için tehlike sınırı kabaca 50 mA civarında başlar (ventriküler fibrilasyon riski). 30 mA'lik RCD bu sınırın altında, üstelik hızlı davranır — bu yüzden İNSAN koruması (Zusatzschutz) için standart budur. 300 mA'lik olanlar ise insan değil YANGIN korumasıdır: 'seni değil, çatını koruyorum' der.",
      },
      {
        h: "Tipler: A, B, F, AC",
        body: "Tip AC yalnızca sinüs kaçağı görür (Almanya'da tek başına yeterli değil). Tip A, pulslu DC bileşenleri de görür — standart tercih. Tip F frekans konvertörlü cihazlara, Tip B düz DC kaçağı da görebildiği için wallbox/fotovoltaik gibi işlere. Yanlış tip seçersen RCD orada durur, görevi 'süs' olur.",
      },
      {
        h: "Test butonu",
        body: "Üzerindeki T butonu yapay bir kaçak üretir. Ayda bir basılması önerilir; gerçekte çoğu insan hayatında bir kez, o da yanlışlıkla basar. Sen çoğu insan olma — mekanizma yıllarca hareket etmezse yapışabilir.",
      },
      {
        h: "🚧 Yakında",
        body: "Auslösekarakteristik detayları, seçicilik (Selektivität), bağlantı şemaları ve 'RCD neden ikide bir atıyor' rehberi.",
      },
    ],
  },
  {
    id: "ls-charakteristik",
    title: "Otomat Sigortalar",
    de: "LS-Schalter & Auslösecharakteristik",
    icon: "🚦",
    tagline: "B, C, D — sigortanın sabır katsayısı.",
    sections: [
      {
        body: "LS-Schalter (Leitungsschutzschalter) iki ayrı reflekse sahiptir. Termik açma: bimetal şerit, uzun süreli hafif aşırı yükte yavaşça ısınıp devreyi keser — 'sabırlı ama unutmaz'. Manyetik açma: kısa devrede bobin, akımı milisaniyede keser — 'düşünmez, atar'. Karakteristik harfi (B/C/D), manyetik refleksin NE ZAMAN devreye gireceğini söyler.",
      },
      {
        h: "B tipi: 3–5 × In",
        body: "Anma akımının 3–5 katında ani açar. Konutların standardı: prizler, aydınlatma. B16 → yaklaşık 48–80 A'de anında keser.",
      },
      {
        h: "C tipi: 5–10 × In",
        body: "Kalkış akımı çeken yüklere tolerans tanır: motorlar, floresan grupları, küçük trafolar. 'Motor kalkarken 7 kat akım çekiyor diye elektriği kesmek olmaz' diyen tip.",
      },
      {
        h: "D tipi: 10–20 × In",
        body: "En sabırlısı: kaynak makineleri, büyük trafolar, aşırı kalkış akımlı endüstriyel yükler. Dikkat: sabır arttıkça hat sonundaki kısa devre akımının yine de açtırabilecek kadar büyük olması gerekir — kablo hesabıyla el ele gider.",
      },
      {
        h: "🚧 Yakında",
        body: "Zaman-akım eğrileri (interaktif!), seçicilik, hat koruması hesabıyla bağlantısı ve karakteristik seçim rehberi.",
      },
    ],
  },
  {
    id: "schutzklassen",
    title: "Koruma Sınıfları",
    de: "Schutzklassen",
    icon: "🛡️",
    tagline: "Cihazlar kendilerini nasıl savunur: üç ekol.",
    sections: [
      {
        body: "Koruma sınıfı (Schutzklasse), bir cihazın elektrik çarpmasına karşı hangi felsefeyle korunduğunu söyler. IP koruma türüyle (toz/su) karıştırılmasın — o başka bir hikâye (o da yakında).",
      },
      {
        h: "Sınıf I — koruma iletkenine güven",
        body: "Metal gövde PE'ye bağlıdır. İzolasyon hatasında gövdeye kaçan akım PE üzerinden kaçar, sigorta/RCD atar. Sembolü yandaki toprak işareti — tip etiketinde bunu görürsen 'bu cihazın PE'si boşa bağlanmamış' demektir. Çamaşır makinesi, fırın, ütü — mutfağın ağır abileri genelde Sınıf I. Fişinde toprak kontağı olmak ZORUNDADIR.",
        symbol: "sk1",
      },
      {
        h: "Sınıf II — çifte zırh",
        body: "Koruma iletkeni yok; onun yerine çift veya güçlendirilmiş izolasyon. Sembolü yandaki iç içe iki kare — sınavda 'doppelte Isolierung' dendiğinde aklına bu kutu içinde kutu gelsin. Matkaplar, saç kurutucular, çoğu şarj adaptörü. Fişinde toprak kontağı olmamasına şaşırma — ihtiyacı yok, zırhı kendinden.",
        symbol: "sk2",
      },
      {
        h: "Sınıf III — baştan tehlikesiz",
        body: "Yalnızca SELV/PELV güvenlik küçük gerilimiyle çalışır (AC ≤ 50 V, DC ≤ 120 V). Tehlikeli gerilim cihaza hiç girmez; koruma, kaynağın (güvenlik trafosunun) kendisidir. Oyuncaklar, bahçe aydınlatması, gömme spotlar. Sembolü yandaki romen rakamı III'lü eşkenar dörtgen.",
        symbol: "sk3",
      },
    ],
  },
  {
    id: "schutzmassnahmen",
    title: "Koruma Önlemleri",
    de: "Schutzmaßnahmen",
    icon: "⛑️",
    tagline: "Basis, Fehler, Zusatz — savunmanın üç hattı.",
    sections: [
      {
        body: "DIN VDE 0100-410'un dünyası. Mantık, soğan modeli gibidir: her katman bir öncekinin başarısız olma ihtimaline karşı vardır.",
      },
      {
        h: "1. Basisschutz (temel koruma)",
        body: "Normal işletmede gerilimli kısımlara dokunamamalısın: izolasyon, kapaklar, muhafazalar, mesafe. Kısacası 'çıplak iletken ortada gezmesin'. Buna eskiden 'doğrudan dokunmaya karşı koruma' denirdi.",
      },
      {
        h: "2. Fehlerschutz (hata koruması)",
        body: "İzolasyon hatası OLDUĞUNDA seni koruyacak katman: otomatik kapama (Abschaltung — sigorta/RCD hata akımını kesmeli, TN'de 0,4 s içinde), çift izolasyon (Sınıf II) veya koruyucu ayırma. 'Hata olursa' değil, 'hata olduğunda' — çünkü olur.",
      },
      {
        h: "3. Zusatzschutz (ek koruma)",
        body: "İlk iki katman da bir şekilde delinirse: 30 mA RCD. İnsan davranışının öngörülemezliğine karşı sigorta — kırılan fişler, kemirilen kablolar, 'bir saniye şuraya uzanayım' anları için. Priz devrelerinde ve banyoda zorunlu.",
      },
      {
        h: "🚧 Yakında",
        body: "Abschaltzeiten tabloları, ölçüm ve doğrulama (Erstprüfung), Potentialausgleich ve senaryo bazlı interaktif quiz.",
      },
    ],
  },
  {
    id: "sicherheitsregeln",
    title: "5 Güvenlik Kuralı",
    de: "Die 5 Sicherheitsregeln",
    icon: "🖐️",
    tagline: "Beş parmak, beş kural — sıralaması ezber değil, hayat sigortası.",
    sections: [
      {
        body: "DIN VDE 0105-100'ün en ünlü beşlisi. Gerilimli tesiste ÇALIŞMAYA BAŞLAMADAN önce, bu sırayla uygulanır — sıra önemlidir, çünkü her kural bir sonrakinin güvenli yapılabilmesinin ön şartıdır. İş bitince de TERS SIRAYLA geri alınır (önce örtüleri kaldır, en son gerilimi ver). Elektrikçilerin 'içgüdü' haline getirdiği tek ezber buysa, sebebi var: bu beş adım her yıl insanların hayatını kurtarıyor.",
      },
      {
        h: "1️⃣ Freischalten — gerilimi kes / ayır",
        body: "Tesisatı TÜM kutuplardan besleyen her yerden ayır: LS'yi indir, sigortaları çek, fişi çek, şalteri aç. 'Ben lambadan anladım, kapalıydı' bir ayırma yöntemi değildir — lambanın patlak olma ihtimali senin hayatından daha olası. Birden fazla besleme olabileceğini unutma (merhaba, ikinci hattan beslenen priz).",
      },
      {
        h: "2️⃣ Gegen Wiedereinschalten sichern — tekrar açılmaya karşı emniyete al",
        body: "Kestiğin şalteri kilitle, uyarı levhası as ('Çalışılıyor — açma!'), çektiğin sigortayı CEBİNE koy. Klasik kaza senaryosu: sen bodrumda kablodayken, iyi niyetli bir meslektaş 'kim kapattı bunu?' deyip şalteri kaldırır. Levha ve kilit, o iyi niyeti durduran tek şeydir.",
      },
      {
        h: "3️⃣ Spannungsfreiheit feststellen — gerilimsizliği DOĞRULA",
        body: "İki kutuplu gerilim test cihazıyla (Duspol tarzı) tüm iletkenler arasında ölç: L-N, L-PE, N-PE, fazlar arası. Önemli ritüel: test cihazını ölçümden ÖNCE ve SONRA bilinen gerilimli bir noktada dene — cihaz bozuksa 'gerilim yok' göstermesi seni teselli etmez. Multimetre bu iş için uygun DEĞİLDİR (yanlış kademe, bozuk problar… gerilim test cihazı bu yüzden var).",
      },
      {
        h: "4️⃣ Erden und kurzschließen — toprakla ve kısa devre et",
        body: "Önce toprakla, sonra kısa devre et — bu sırayla. Böylece biri yanlışlıkla gerilim verirse enerji senin üzerinden değil, hazırladığın kısa devre yolundan akar ve sigortayı attırır. 1 kV üzeri tesislerde ZORUNLU; alçak gerilimde her durumda değil ama örneğin geri besleme riski (jeneratör, PV!) varsa hayati.",
      },
      {
        h: "5️⃣ Benachbarte, unter Spannung stehende Teile abdecken — komşu gerilimli kısımları ört/ayır",
        body: "Her şeyi kapatamadığın durumlar olur: yandaki bara gerilimli kalmak zorunda. O zaman izolasyon örtüleri, lastik paspaslar, bariyerler devreye girer. Mantık basit: dokunamayacağın şey seni çarpamaz. 'Dikkat ederim' bir koruma önlemi değildir — yorgun bir elin nereye uzanacağını kimse bilemez.",
      },
      {
        h: "Bonus: geri dönüş",
        body: "İş bitti, herkes uzaklaştı, aletler toplandı → kurallar TERS sırayla kaldırılır: örtüler kalkar, topraklama sökülür, levhalar alınır, kilit açılır ve en son gerilim verilir. Gerilimi verip SONRA topraklamayı sökmeye çalışan kişinin o günü çok kötü geçer — bu cümleyi bir daha oku.",
      },
    ],
  },
  {
    id: "logische-funktionen",
    title: "Mantık Fonksiyonları",
    de: "Logische Funktionen / Grundverknüpfungen",
    icon: "🔢",
    tagline: "UND, ODER, NICHT & arkadaşları — kararların matematiği.",
    sections: [
      {
        body: "Kumanda tekniğinin tamamı aslında tek bir soruya cevap verir: 'Hangi şartlarda çıkış aktif olsun?' Bu şartların dili mantık fonksiyonlarıdır. İyi haber: bunları zaten biliyorsun — seri bağlı kontaklar UND'dir, paralel kontaklar ODER, Öffner ise NICHT. Kapı sembolleri (DIN EN 60617: kutu + işaret) aynı fikrin elektronik/SPS dünyasındaki yazılışıdır. Aşağıdaki her fonksiyonu Playground'ın Logik modunda canlı kurabilirsin.",
      },
      {
        h: "UND (AND) — hepsi, yoksa hiç",
        gate: "and",
        body: "Bütün girişler 1 ise çıkış 1. Kontak karşılığı: seri bağlantı. Klasik örnek: pres makinesinin iki el kumandası — iki buton BİRDEN basılı değilse pres inmez, çünkü tek elin nerede olduğu belli olmalı. Kutudaki işaret: &.",
        table: { head: ["A", "B", "Çıkış"], rows: [["0", "0", "0"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "1"]] },
      },
      {
        h: "ODER (OR) — herhangi biri yeter",
        gate: "or",
        body: "Girişlerden en az biri 1 ise çıkış 1. Kontak karşılığı: paralel bağlantı. Örnek: kapı zili — alt kapıdaki buton da üst kapıdaki de zili çaldırır. İşaret: ≥1 ('bir veya daha fazlası aktifse' demenin matematikçe kısaltması).",
        table: { head: ["A", "B", "Çıkış"], rows: [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]] },
      },
      {
        h: "NICHT (NOT) — tersine çevirici",
        gate: "not",
        body: "Girişi ters çevirir: 1 → 0, 0 → 1. Kontak karşılığı: Öffner. Çıkıştaki küçük yuvarlak 'değil' işaretidir — nerede görürsen orada bir tersleme var demektir. Motor çalışMIYORken yanan 'hazır' lambası tam olarak budur.",
        table: { head: ["A", "Çıkış"], rows: [["0", "1"], ["1", "0"]] },
      },
      {
        h: "NAND — UND'un ters kardeşi",
        gate: "nand",
        body: "UND + NICHT: yalnızca TÜM girişler 1 olduğunda çıkış 0, diğer her durumda 1. Neden bu kadar önemli? Çünkü NAND üniversal kapıdır: sadece NAND'lerle UND da, ODER de, NICHT de kurulabilir — yani teoride her devre. Çip üreticilerinin gözdesi; elektroniğin İsviçre çakısı.",
        table: { head: ["A", "B", "Çıkış"], rows: [["0", "0", "1"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]] },
      },
      {
        h: "NOR — ODER'in ters kardeşi",
        gate: "nor",
        body: "ODER + NICHT: herhangi bir giriş 1 olduğu anda çıkış 0; ancak HİÇBİRİ aktif değilse 1. O da üniversaldir. Asıl şöhreti: iki NOR'u çapraz bağlarsan RS-Flipflop elde edersin — Selbsthaltung'un dijital atası. Playground'da dene: her kapının çıkışını diğerinin girişine bağla, butonlarla Set/Reset yap.",
        table: { head: ["A", "B", "Çıkış"], rows: [["0", "0", "1"], ["0", "1", "0"], ["1", "0", "0"], ["1", "1", "0"]] },
      },
      {
        h: "XOR (Antivalenz) — ya o, ya bu; ikisi değil",
        gate: "xor",
        body: "Girişler FARKLIYSA çıkış 1, aynıysa 0. İşaret: =1 ('tam olarak bir tanesi aktif'). Bunu yıllardır kullanıyorsun: koridorun iki ucundaki Wechselschalter'ler. Hangi şalteri çevirirsen çevir lambanın durumu değişir — çünkü lamba, şalter konumlarının XOR'udur. (Aynıysa 1 veren kardeşi XNOR/Äquivalenz da vardır, o da =1 kutusunun çıkışına yuvarlak takılmış hali.)",
        table: { head: ["A", "B", "Çıkış"], rows: [["0", "0", "0"], ["0", "1", "1"], ["1", "0", "1"], ["1", "1", "0"]] },
      },
      {
        h: "Kontak tekniği ↔ Logik sözlüğü",
        body: "İki dünya aynı dili konuşur, sadece aksanları farklı. Sınavda 'kontak planını mantık planına çevir' tarzı sorular tam buradan çıkar:",
        table: {
          head: ["Kontak tekniği", "Logik karşılığı"],
          rows: [
            ["Seri bağlı kapayıcılar", "UND (&)"],
            ["Paralel bağlı kapayıcılar", "ODER (≥1)"],
            ["Öffner (açıcı kontak)", "NICHT (tersleme)"],
            ["Seri bağlı açıcılar", "NOR (hiçbiri basılı değilse 1)"],
            ["Paralel bağlı açıcılar", "NAND (ikisi birden basılı değilse 1)"],
            ["Selbsthaltung (mühürleme)", "RS-Flipflop (2 × NOR)"],
            ["Wechselschaltung (koridor)", "XOR (=1)"],
          ],
        },
      },
    ],
  },
  {
    id: "schaltzeichen",
    title: "Devre Sembolleri",
    de: "Schaltzeichen & Zeichnungen",
    icon: "✍️",
    tagline: "Elektrikçinin hiyeroglifleri.",
    stub: true,
    sections: [
      {
        body: "Şemalar, elektrikçilerin ortak dili — ve her dilde olduğu gibi, alfabeyi bilmeyen cümleyi de okuyamaz. Öffner mi Schließer mi, Wechsler mi Taster mi; hangi kutu sayaç, hangi çizgi PE… Bu bölümde sembol kütüphanesi, devre şeması türleri (Stromlaufplan, Installationsplan, Übersichtsschaltplan) ve okuma alıştırmaları olacak.",
      },
      {
        h: "🚧 Yakında",
        body: "İnteraktif sembol kartları (üzerine gel, ne olduğunu söylesin), çizim kuralları ve 'bu şemada hata var, bul' oyunları. SVG'ler çiziliyor, sabır.",
      },
    ],
  },
  {
    id: "verlegearten",
    title: "Döşeme Türleri",
    de: "Verlegearten",
    icon: "🛠️",
    tagline: "Kablonun nerede yattığı, ne kadar taşıyacağını belirler.",
    stub: true,
    sections: [
      {
        body: "Aynı kablo, duvarın içinde başka, kablo kanalında başka, açık havada bambaşka akım taşır — mesele ısının kaçıp kaçamadığıdır. DIN VDE 0298-4'ün harf sistemi: A1/A2 (ısı yalıtımlı duvar içinde boru — en bunalanı), B1/B2 (duvar üstü boru/kanal), C (doğrudan duvara), D (toprak altına), E/F (havada, kablo rafında — en rahatı). Harf ilerledikçe kablo nefes alır, taşıyabildiği akım (Strombelastbarkeit) artar.",
      },
      {
        h: "🚧 Yakında",
        body: "Görselli döşeme türü kataloğu, akım taşıma kapasitesi tabloları ve 'kesit + döşeme türü + sigorta' üçlüsünü birlikte seçtiren interaktif asistan. Spannungsfall kartlarıyla el ele çalışacak.",
      },
    ],
  },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
