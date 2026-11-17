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
    sections: [
      {
        body: "Şemalar, elektrikçilerin ortak dili — ve her dilde olduğu gibi, alfabeyi bilmeyen cümleyi de okuyamaz. Öffner mi Schließer mi, Taster mı Schalter mı; hangi kutu bobin, hangi çizgi PE… Aşağıda en sık karşılaşacağın semboller, şema türleri ve harf kodları var. Sembollerin hepsi Playground'da canlı: sürükle, bağla, çalıştır.",
      },
      {
        h: "Şema türleri",
        body: "Aynı tesisat üç farklı şekilde çizilir; hangisine baktığını bilmezsen yanlış soruya cevap ararsın. Sınavda da işte de en çok Stromlaufplan okursun.",
        table: {
          head: ["Şema", "Ne gösterir?", "Ne zaman kullanılır?"],
          rows: [
            ["Übersichtsschaltplan", "Tek hatlı, sadeleştirilmiş genel bakış; iletken sayısı çentiklerle belirtilir", "Dağıtım panosu, tesisin bütünü"],
            ["Stromlaufplan (aufgelöste Darstellung)", "Her akım yolu ayrı ayrı, yukarıdan aşağıya; bobin ve kontakları ayrı yerlerde çizilir", "Kontaktör devreleri, arıza arama"],
            ["Stromlaufplan (zusammenhängende Darstellung)", "Cihazlar bütün halinde, tüm bağlantılarıyla", "Basit tesisat devreleri"],
            ["Installationsplan", "Kat planı üzerinde priz, şalter ve lamba konumları", "Şantiye: neyin nereye monte edileceği"],
          ],
        },
      },
      {
        h: "Şalterler ve butonlar",
        body: "Schließer (kapayıcı) basılınca devreyi kapatır, Öffner (açıcı) basılınca açar. Schalter konumunda kalır; Taster yaylıdır, bırakınca geri döner. Semboller her zaman BASILMAMIŞ ve GERİLİMSİZ halde çizilir — şemayı okurken ilk kural budur. Kontak numaraları da konuşur: sonu 3-4 ile biten (13-14, 23-24) kapayıcı, 1-2 ile biten (11-12, 21-22) açıcıdır.",
        symbols: ["switch_no", "switch_nc", "taster_no", "taster_nc"],
      },
      {
        h: "Kontaktör ve zaman rölesi",
        body: "Bobin (A1–A2) gerilim alınca çeker ve aynı etiketi taşıyan bütün kontakları birlikte oynatır. Aufgelöste Darstellung'da bobin bir akım yolunda, kontakları bambaşka yollarda durur; onları birbirine bağlayan tek şey etikettir (K1). Zaman kontaklarındaki yarım daire gecikmeyi gösterir.",
        symbols: ["coil", "contact_no", "contact_nc", "tcoil", "tcontact_no", "tcontact_nc"],
      },
      {
        h: "Yükler ve kaynak",
        body: "Devrenin işi yapan kısmı. Lamba çarpı işaretli daire, motor içinde M yazan dairedir. Yük olmadan L'den N'ye giden her yol kısa devredir — şemada bunu görebilmek, sigortadan önce senin işin.",
        symbols: ["lamp", "motor", "source2"],
      },
      {
        h: "Röle çeşitleri ve ışık kaynakları",
        body: "Wechsler (11-12-14) tek kontakla iki yolu yönetir: bobin düşükken 11-12, çekince 11-14. Darbe rölesi (Stromstoßrelais) her kısa darbede konum değiştirip orada kalır — koridordaki beş butonun tek röleyle lamba yakmasının sırrı. LED, ışık yayan diyottur (oklar dışarı bakar); floresan lamba uzun tüp sembolüyle çizilir.",
        symbols: ["contact_co", "relay_ss", "led", "fluo"],
      },
      {
        h: "Güç devresi (Laststromkreis)",
        body: "Güç devresinde her şey üç kutupludur: motor koruma şalteri (Q), kontaktörün ana kontakları (1-2, 3-4, 5-6), termik motor koruma rölesi (F) ve trifaze motor (U1 V1 W1 / U2 V2 W2). Kesik çizgi, üç kutbun mekanik olarak birlikte hareket ettiğini gösterir. Motor koruma rölesinin kendisi güç devresinde, yardımcı kontağı (95-96) kumanda devresindedir.",
        symbols: ["q3", "contact3", "ol3", "ol_nc", "motor3", "netz3"],
      },
      {
        h: "Harf kodları (Betriebsmittelkennzeichnung)",
        body: "Her elemanın yanındaki harf, onun ne iş yaptığını söyler (DIN EN 81346-2). Eski şemalarda ve birçok okul kitabında hâlâ eski harfler geçer: sinyal lambası için H, ana kontaktör için K. İkisini de tanımak zorundasın; sınav hangisini kullanıyorsa onu yaz.",
        table: {
          head: ["Harf", "Görev", "Örnek"],
          rows: [
            ["B", "Fiziksel büyüklüğü sinyale çevirir", "Sensör, hareket dedektörü, termostat"],
            ["E", "Işık veya ısı üretir", "Aydınlatma lambası, ısıtıcı"],
            ["F", "Korur", "Sigorta, LS-Schalter, RCD, motor koruma"],
            ["G", "Enerji üretir", "Jeneratör, akü, güç kaynağı"],
            ["K", "Sinyal işler", "Yardımcı kontaktör, röle, zaman rölesi"],
            ["M", "Mekanik hareket üretir", "Motor"],
            ["P", "Bilgi gösterir", "Sinyal lambası, sayaç, ölçü aleti (eski: H)"],
            ["Q", "Enerji akışını anahtarlar", "Ana kontaktör, güç şalteri (eski: K)"],
            ["S", "El hareketini sinyale çevirir", "Şalter, buton"],
            ["T", "Enerjiyi dönüştürür", "Trafo, frekans konvertörü"],
            ["W", "Enerji veya sinyal iletir", "Kablo, bara"],
            ["X", "Bağlar", "Klemens, priz, fiş"],
          ],
        },
      },
    ],
  },
  {
    id: "anlaufverfahren",
    title: "Motor Kalkış Devreleri",
    de: "Anlaufverfahren & Schützschaltungen",
    icon: "🏭",
    tagline: "Direkt, ters yön, yıldız-üçgen — kontaktörlerin koreografisi.",
    sections: [
      {
        body: "Kontaktör devresi her zaman iki parçadır. Steuerstromkreis (kumanda devresi) düşünen kısımdır: butonlar, bobinler, kilitlemeler, genelde 230 V ya da 24 V. Laststromkreis (güç devresi) iş yapan kısımdır: 400 V, ana kontaklar, motor. İkisi sadece etiketle bağlıdır — kumandadaki K1 bobini çekince güç devresindeki K1 ana kontakları kapanır. Playground'daki 'Last + Steuer' modu tam olarak bunu yan yana gösterir.",
      },
      {
        h: "Direktanlauf",
        body: "En basit yol: S1'e bas, K1 çeker ve kendi 13-14 kontağıyla kendini besler (Selbsthaltung), motor doğrudan şebekeye bağlanır. Ucuz ve sağlam, ama kalkışta anma akımının 5–8 katı çekilir. Küçük motorlar için ideal; büyüklerde şebeke işletmecisi kaşlarını çatar. Motor koruma rölesi (F) aşırı yükte 95-96 kontağını açar ve kumandayı keser — motoru koruyan o, sigorta değil.",
        symbols: ["q3", "contact3", "ol3", "motor3"],
      },
      {
        h: "Wendeschützschaltung — dönüş yönü",
        body: "Motorun yönünü değiştirmek için iki fazı yer değiştirmek yeter: döner alan ters döner. K1 sağa, K2 sola çalıştırır; K2 güç devresinde L1 ile L3'ü çaprazlar. İkisi aynı anda çekerse L1–L3 kısa devresi olur — bu yüzden kontaktörler birbirini açıcı kontaklarıyla kilitler (Schützverriegelung). Ciddi tesislerde buna bir de buton kilitlemesi (Tasterverriegelung) eklenir: çift dikiş.",
      },
      {
        h: "Stern-Dreieck-Anlauf",
        body: "Normalde üçgende çalışan motor yıldızda kalkar: her sargıya 400 V yerine 230 V düşer, şebekeden çekilen kalkış akımı üçte bire iner. Bedeli, moment de üçte bire düşer. Sıra şöyle: K1 (şebeke) + K3 (yıldız) çeker, motor hızlanır; zaman rölesi KT1 dolunca K3 düşer, K2 (üçgen) çeker. K2 ile K3 asla birlikte çekmemeli — yıldız köprüsü ile üçgen bağlantısı aynı anda = kısa devre.",
        table: {
          head: ["", "Yıldız (Y)", "Üçgen (Δ)"],
          rows: [
            ["Sargı gerilimi", "230 V", "400 V"],
            ["Şebeke kalkış akımı", "I_A / 3", "I_A"],
            ["Kalkış momenti", "M_A / 3", "M_A"],
            ["Ne zaman?", "Kalkış", "Çalışma"],
          ],
        },
      },
      {
        h: "Yumuşak yolverici ve frekans konvertörü",
        body: "Sanftanlasser tristörlerle gerilimi yavaşça yükseltir: akım darbesi yok, ama devir ayarı da yok. Frekans konvertörü (Frequenzumrichter) hem kalkışı yumuşatır hem devri istediğin değere getirir: şebekeyi doğrultur (B6U, ~540 V DC), sonra istediği frekansta yeni bir trifaze üretir. U/f oranını sabit tutar ki motor doyuma gitmesin. Bugün yeni tesislerde yıldız-üçgenin yerini büyük ölçüde FU aldı — ama sınavda yıldız-üçgen hâlâ başrolde.",
      },
    ],
  },
  {
    id: "erstpruefung",
    title: "İlk Muayene (VDE 0100-600)",
    de: "Erstprüfung nach DIN VDE 0100-600",
    icon: "🔍",
    tagline: "Gözle bak, dene, ölç — sonra imzala.",
    sections: [
      {
        body: "Yeni ya da değiştirilmiş her tesisat, işletmeye alınmadan önce muayene edilir ve sonuç protokole yazılır. Sıra kutsaldır: önce Besichtigen (gözle kontrol), sonra Erproben (çalıştırarak deneme) ve Messen (ölçme). Gerilim vermeden yapılabilecek her şey gerilim vermeden yapılır — mantık basit: hatayı sen bul, müşteri değil.",
      },
      {
        h: "1 · Besichtigen — gözle kontrol",
        body: "Gerilimsiz yapılır. Doğru kablo ve kesit mi seçilmiş, koruma elemanları doğru mu, iletken renkleri (yeşil-sarı sadece PE!) doğru mu, klemensler sıkı mı, kapaklar ve dokunma koruması yerinde mi, banyo bölgeleri ve yangın önlemleri tutuyor mu, devreler panoda etiketli mi. Gözle görülen hatayı ölçü aletine bırakmak, sınavda da puan kaybettirir.",
      },
      {
        h: "2 · Messen — ölçümler sırasıyla",
        body: "Ölçümler belli bir sırayla yapılır, çünkü her biri bir sonrakinin güvenliğini sağlar. Örneğin izolasyon ölçülmeden gerilim verilmez; PE sürekliliği doğrulanmadan çevrim empedansı ölçülmez.",
        table: {
          head: ["Ölçüm", "Ne kontrol edilir?", "Tipik sınır"],
          rows: [
            ["Durchgängigkeit PE / Potentialausgleich", "Koruma iletkeni her gövdeye kesintisiz ulaşıyor mu", "Küçük, makul değer (≈ < 1 Ω)"],
            ["Isolationswiderstand", "Aktif iletkenler arası ve PE'ye karşı yalıtım", "≥ 1 MΩ (500 V DC ölçüm gerilimi)"],
            ["Schleifenimpedanz Z_S", "Hata akımı sigortayı zamanında attırır mı", "Z_S ≤ U₀ / I_a"],
            ["RCD testi", "Açma akımı ve açma süresi", "I_Δ ≤ I_Δn, t ≤ 300 ms (genel tip)"],
            ["Erdungswiderstand (TT)", "Toprak elektrodu yeterli mi", "R_A ≤ 50 V / I_Δn"],
            ["Drehfeld", "Prizlerde ve motorlarda faz sırası", "Sağ döner alan"],
          ],
        },
      },
      {
        h: "3 · Erproben — fonksiyon denemesi",
        body: "RCD'nin test butonu, acil durdurma, kilitlemeler, kontaktör devreleri, zaman röleleri: hepsi bir kez gerçekten çalıştırılır. Wendeschütz'te iki butona birlikte basmayı denemek dahil — kilitleme çalışmıyorsa bunu müşteriden önce sen öğren.",
      },
      {
        h: "4 · Dokumentation — protokol",
        body: "Tüm ölçüm değerleri, kullanılan ölçü aletleri ve sonuç bir muayene protokolüne yazılır, imzalanır ve müşteriye verilir. Protokol yoksa hukuken muayene de yoktur. Sınavda 'neden ölçtün?' sorusu kadar 'nereye yazdın?' sorusu da gelir.",
      },
    ],
  },
  {
    id: "sps",
    title: "PLC Temelleri",
    de: "SPS — Speicherprogrammierbare Steuerung",
    icon: "🖥️",
    tagline: "Kablolarla değil, programla kurulan kontaktör devresi.",
    sections: [
      {
        body: "SPS (PLC), kontaktör mantığını kablolardan alıp yazılıma taşır. Butonlar ve sensörler girişlere (E / I), kontaktörler ve lambalar çıkışlara (A / Q) bağlanır; aradaki bütün 'eğer şuna basıldıysa ve şu kapalıysa' mantığı programdadır. Devreyi değiştirmek için tornavida değil klavye gerekir.",
      },
      {
        h: "EVA prensibi ve tarama döngüsü",
        body: "Eingabe → Verarbeitung → Ausgabe. PLC döngü halinde çalışır: önce tüm girişlerin anlık görüntüsünü alır (Prozessabbild), sonra programı baştan sona bir kez işler, en sonda sonuçları çıkışlara yazar. Bir döngü birkaç milisaniye sürer ve sonsuza kadar tekrarlanır.",
      },
      {
        h: "Programlama dilleri (IEC 61131-3)",
        body: "Aynı mantık farklı kılıklarda yazılabilir. Elektrikçiler için en tanıdık olanı KOP'tur: Stromlaufplan'ın yan yatırılmış hali. FUP, Logik konusundaki kapı sembolleriyle çizilir — Playground'un Logik modu tam olarak bu.",
        table: {
          head: ["Dil", "Görünüş", "Kime yakın?"],
          rows: [
            ["KOP / LD (Kontaktplan)", "Kontak ve bobin sembolleri, raylar arasında", "Kontaktör devresi bilenlere"],
            ["FUP / FBD (Funktionsplan)", "&, ≥1 kutuları", "Logik kapı bilenlere"],
            ["AWL / IL", "Satır satır komutlar (U, O, =)", "Eski Siemens dünyası"],
            ["ST (Strukturierter Text)", "Pascal benzeri metin: IF … THEN", "Programcılara"],
          ],
        },
      },
      {
        h: "Altın kural: STOP butonu açıcıdır",
        body: "Durdurma butonu PLC girişine AÇICI (Öffner) olarak bağlanır ve programda '1 ise çalışabilir' diye sorgulanır. Neden? Kablo koparsa giriş 0 olur ve makine durur (Drahtbruchsicherheit). Kapayıcı bağlasaydın kopuk kablo fark edilmezdi — ta ki biri acil durumda butona basıp hiçbir şey olmadığını görene kadar. Acil durdurma (Not-Halt) zaten PLC'ye güvenmez: güç devresini donanımla da keser.",
      },
    ],
  },
  {
    id: "photovoltaik",
    title: "Güneş Enerjisi Sistemleri",
    de: "Photovoltaik (PV-Anlagen)",
    icon: "☀️",
    tagline: "Çatıda santral — ama DC tarafı şaka kaldırmaz.",
    sections: [
      {
        body: "PV hücresi ışığı doğrudan doğru akıma çevirir. Hücreler modülde, modüller seri bağlanarak string'de birleşir; string gerilimi kolayca 600–1000 V DC'ye çıkar. İnverter (Wechselrichter) bu DC'yi şebekeye uygun 230/400 V AC'ye çevirir. Üretilen enerji önce evde tüketilir, fazlası şebekeye ya da bataryaya gider.",
      },
      {
        h: "Önemli büyüklükler",
        body: "Modül veri sayfasındaki değerler standart test koşullarında (STC: 1000 W/m², 25 °C) ölçülür. Soğuk kış sabahında modül gerilimi STC değerinin üstüne çıkar — inverterin giriş sınırı bu yüzden en düşük sıcaklığa göre kontrol edilir.",
        table: {
          head: ["Kısaltma", "Anlamı"],
          rows: [
            ["P_MPP (Wp)", "En yüksek güç noktasındaki güç — modülün 'etiket gücü'"],
            ["U_OC", "Açık devre gerilimi (Leerlaufspannung) — yük yokken"],
            ["I_SC", "Kısa devre akımı — I_MPP'den sadece biraz büyük!"],
            ["U_MPP / I_MPP", "En yüksek güç noktasındaki gerilim ve akım"],
            ["MPP-Tracker", "İnverterin her an en verimli çalışma noktasını arayan beyni"],
          ],
        },
      },
      {
        h: "DC tarafının tehlikesi",
        body: "Güneş varken modüller kapatılamaz: string'in uçlarında her zaman yüksek DC gerilim vardır. DC arkı sıfır geçişi olmadığı için kendiliğinden sönmez — yük altında DC fiş çekmek ark ve yangın demektir. Kısa devre akımı anma akımından sadece biraz büyük olduğundan sigorta da kurtarmaz. Bu yüzden DC tarafında yalnızca DC için onaylı ayırıcılar ve fişler kullanılır, bağlantı sırası kurallara göre yapılır.",
      },
      {
        h: "AC tarafı ve koruma",
        body: "İnverter AC tarafta kendi devresiyle bağlanır, RCD tipi inverter üreticisinin istediği gibi seçilir (çoğu zaman Tip A yeter, bazen Tip B). Şebeke kesildiğinde inverter otomatik olarak ayrılmak zorundadır (NA-Schutz) — hat üzerinde çalışan teknisyen, çatından gelen sürpriz gerilime çarpılmasın diye.",
      },
    ],
  },
  {
    id: "ueberspannungsschutz",
    title: "Aşırı Gerilim Koruması",
    de: "Blitz- und Überspannungsschutz",
    icon: "🌩️",
    tagline: "Yıldırım bir kez düşer, ama elektroniği tek seferde götürür.",
    sections: [
      {
        body: "Aşırı gerilimler iki yerden gelir: yıldırımdan (doğrudan ya da yakına düşüp hatta indüklenen) ve şebekedeki anahtarlama olaylarından. Mikrosaniyeler sürer ama binlerce volta ulaşır; bir televizyonun, ısı pompasının ya da inverterin elektroniği için bu kadarı yeter. Koruma, darbeyi kontrollü şekilde toprağa saptırmaktır.",
      },
      {
        h: "Kademeli koruma: Tip 1 · 2 · 3",
        body: "Tek bir cihaz her şeyi yapamaz; koruma kademeli kurulur ve her kademe bir öncekinden kalan enerjiyi azaltır. Kaba koruma bina girişinde, ince koruma cihazın hemen yanında durur.",
        table: {
          head: ["Tip", "Yer", "Görev"],
          rows: [
            ["Tip 1 (eski B)", "Ana dağıtım / bina girişi", "Yıldırım akımı taşıyıcı — dış paratoner varsa şart"],
            ["Tip 2 (eski C)", "Alt dağıtım panoları", "Aşırı gerilimi sınırlar — konutlarda standart"],
            ["Tip 3 (eski D)", "Cihazın yanında (priz, ara fiş)", "Hassas elektroniğe ince ayar"],
            ["Kombi Tip 1+2", "Konut sayaç panosu", "İkisi bir arada — günümüzün pratik çözümü"],
          ],
        },
      },
      {
        h: "Potansiyel dengeleme olmadan olmaz",
        body: "Aşırı gerilim koruyucu (SPD) ancak iyi bir potansiyel dengeleme barasına (Haupterdungsschiene) kısa ve düz bir hatla bağlandığında işe yarar. Bağlantı kablosu uzarsa endüktansı darbe anında yüzlerce volt düşürür ve koruma seviyesi boşa gider. Kural: SPD bağlantıları mümkün olduğunca kısa, toplamda 0,5 m'nin altında.",
      },
      {
        h: "Ne zaman zorunlu?",
        body: "DIN VDE 0100-443 ve -534'e göre yeni tesisatlarda aşırı gerilim koruması pratikte zorunludur: insan hayatını, kamu hizmetlerini veya çok sayıda kişiyi etkileyebilecek durumlarda kesin, konutlarda da artık genel kural. Kısacası: yeni sayaç panosu kuruyorsan Tip 1+2 için yer ayır.",
      },
    ],
  },
  {
    id: "verlegearten",
    title: "Döşeme Türleri",
    de: "Verlegearten",
    icon: "🛠️",
    tagline: "Kablonun nerede yattığı, ne kadar taşıyacağını belirler.",
    sections: [
      {
        body: "Aynı kablo, duvarın içinde başka, kablo kanalında başka, açık havada bambaşka akım taşır — mesele ısının kaçıp kaçamadığıdır. DIN VDE 0298-4 bunu harflerle sınıflandırır. Harf ilerledikçe kablo nefes alır, taşıyabildiği akım (Strombelastbarkeit, I_z) artar.",
      },
      {
        h: "Referans döşeme türleri",
        body: "Tabloda aradığın şey kablonun KENDİSİ değil, etrafındaki ortamdır. Bir hat yolu boyunca birden fazla tür varsa en kötüsü belirleyicidir: 20 metre duvar üstünden gidip 1 metre yalıtımın içinden geçen kablo, A türüne göre hesaplanır.",
        table: {
          head: ["Tür", "Nasıl döşenir?", "Tipik örnek"],
          rows: [
            ["A1", "Tek damarlı iletkenler, ısı yalıtımlı duvar içindeki boruda", "Ahşap karkas / alçıpan duvarda boru içinde H07V-U"],
            ["A2", "Çok damarlı kablo, ısı yalıtımlı duvar içindeki boruda", "Yalıtımlı duvarda boru içinde NYM"],
            ["B1", "Tek damarlı iletkenler, duvar üstü boru veya kanalda", "Sıva üstü boruda H07V-U"],
            ["B2", "Çok damarlı kablo, duvar üstü boru veya kanalda", "Kablo kanalında NYM"],
            ["C", "Doğrudan duvarın üstünde veya sıvanın içinde", "Sıva altı NYM, kroşeyle sıva üstü NYM"],
            ["D", "Toprak altında (boru içinde veya doğrudan)", "Bahçe hattı, NYY"],
            ["E", "Çok damarlı kablo, havada serbest (duvardan mesafeli)", "Kablo rafında NYM / NYY"],
            ["F / G", "Tek damarlı kablolar, havada (F: birbirine değerek, G: aralıklı)", "Endüstride büyük kesitli besleme hatları"],
          ],
        },
      },
      {
        h: "Akım taşıma kapasitesi I_z (A)",
        body: "Bakır iletken, PVC yalıtım (izin verilen iletken sıcaklığı 70 °C), ortam sıcaklığı 30 °C. Her hücrede ilk değer 2 yüklü damar (tek fazlı devre), ikinci değer 3 yüklü damar (trifaze devre) içindir. PE yüklü damar sayılmaz.",
        table: {
          head: ["mm²", "A1", "A2", "B1", "B2", "C"],
          rows: [
            ["1,5", "15,5 / 13,5", "15,5 / 13", "17,5 / 15,5", "16,5 / 15", "19,5 / 17,5"],
            ["2,5", "19,5 / 18", "18,5 / 17,5", "24 / 21", "23 / 20", "27 / 24"],
            ["4", "26 / 24", "25 / 23", "32 / 28", "30 / 27", "36 / 32"],
            ["6", "34 / 31", "32 / 29", "41 / 36", "38 / 34", "46 / 41"],
            ["10", "46 / 42", "43 / 39", "57 / 50", "52 / 46", "63 / 57"],
            ["16", "61 / 56", "57 / 52", "76 / 68", "69 / 62", "85 / 76"],
          ],
        },
      },
      {
        h: "Düzeltme faktörleri",
        body: "Tablo değerleri ideal koşullar içindir. Ortam 30 °C'den sıcaksa ya da aynı boruda/kanalda birden fazla devre yan yana ısınıyorsa, tablo değeri faktörlerle çarpılır: I_z = I_tablo · f_sıcaklık · f_yığılma. İkisi birden geçerliyse ikisi de çarpılır — kablo için kötü günler üst üste gelir.",
        table: {
          head: ["Ortam sıcaklığı (PVC)", "Sıcaklık faktörü", "Yan yana devre sayısı", "Yığılma faktörü"],
          rows: [
            ["25 °C", "1,06", "1", "1,00"],
            ["30 °C", "1,00", "2", "0,80"],
            ["35 °C", "0,94", "3", "0,70"],
            ["40 °C", "0,87", "4", "0,65"],
            ["45 °C", "0,79", "5", "0,60"],
            ["50 °C", "0,71", "6", "0,57"],
          ],
        },
      },
      {
        h: "Seçim zinciri: I_b ≤ I_n ≤ I_z",
        body: "Önce yükün çektiği akım (I_b), sonra onu karşılayan sigorta (I_n), en son da o sigortayı taşıyabilen kablo (I_z). Sigorta kabloyu korur, tersi değil. Örnek: 3 yüklü damar, 1,5 mm². C türünde I_z = 17,5 A → B16 uygun. Aynı kablo A1 türünde yalnızca 13,5 A taşır → B16 OLMAZ; ya B13'e inersin ya da 2,5 mm²'ye çıkarsın (18 A). Kesiti seçtikten sonra iş bitmez: uzun hatlarda gerilim düşümünü de kontrol et — Spannungsfall kartları bunun için var.",
      },
      {
        h: "⚠️ Bu tablolar ne kadar bağlayıcı?",
        body: "Buradaki değerler öğrenmek ve hızlı kontrol içindir; sık kullanılan kesitleri ve türleri kapsar. Gerçek projede ve sınavda güncel norm (DIN VDE 0298-4, DIN VDE 0100-520) ile elindeki Tabellenbuch geçerlidir. Farklı yalıtım (ör. VPE/XLPE, 90 °C), alüminyum iletken veya toprak altı döşemede değerler değişir.",
      },
    ],
  },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
