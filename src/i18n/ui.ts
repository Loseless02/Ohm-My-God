// Arayüz metinleri — üç dil yan yana. Yeni anahtar eklerken üçünü de doldur (TypeScript eksik dili yakalar).
// "**…**" = vurgulu parça (rich() ile çizilir) · "{x}" = parametre · "a|b|c" = liste

type Entry = { tr: string; en: string; de: string };

export const UI = {
  // ── genel ──────────────────────────────────────────────────────────────
  "meta.title": {
    tr: "OHM MY GOD ⚡ Elektrik El Kitabı",
    en: "OHM MY GOD ⚡ Electrical Handbook",
    de: "OHM MY GOD ⚡ Elektro-Handbuch",
  },
  "meta.desc": {
    tr: "Elektrik Ausbildung'u için interaktif formül ve bilgi üssü. Formüle tıkla, istediğin büyüklük için çözülsün, değerleri gir, sonucu al.",
    en: "Interactive formula and knowledge base for the German electrical apprenticeship. Click a formula, let it rearrange for the quantity you need, enter the values, get the result.",
    de: "Interaktive Formel- und Wissensbasis für die Elektro-Ausbildung. Formel anklicken, nach der gesuchten Größe umstellen lassen, Werte eingeben, Ergebnis ablesen.",
  },
  "lang.label": { tr: "Dil", en: "Language", de: "Sprache" },
  "app.sub": {
    tr: "elektrik el kitabı · v0.2",
    en: "electrical handbook · v0.2",
    de: "Elektro-Handbuch · v0.2",
  },
  "menu.open": { tr: "Menüyü aç", en: "Open menu", de: "Menü öffnen" },
  "menu.close": { tr: "Menüyü kapat", en: "Close menu", de: "Menü schließen" },
  footer: {
    tr: "Ohm kanunu her yerde geçerlidir; itirazlar Kirchhoff'a iletilir. · Bu site bir hobi/öğrenme projesidir, bağlayıcı teknik doküman değildir — gerçek tesisatta normlar (VDE) ve ustan konuşur.",
    en: "Ohm's law applies everywhere; complaints are forwarded to Kirchhoff. · This site is a hobby and learning project, not a binding technical document — on a real installation, the standards (VDE) and your supervisor have the final say.",
    de: "Das ohmsche Gesetz gilt überall; Beschwerden gehen an Kirchhoff. · Diese Seite ist ein Hobby- und Lernprojekt und keine verbindliche technische Unterlage — an der echten Anlage haben die Normen (VDE) und dein Meister das letzte Wort.",
  },
  "common.home": { tr: "Ana sayfa", en: "Home", de: "Startseite" },
  "common.backHome": { tr: "Ana sayfaya dön", en: "Back to home", de: "Zurück zur Startseite" },

  // ── gezinme ────────────────────────────────────────────────────────────
  "nav.interactive": { tr: "İnteraktif", en: "Interactive", de: "Interaktiv" },
  "nav.solver": { tr: "Devre Çözücü", en: "Circuit Solver", de: "Schaltungsrechner" },
  "nav.exam": { tr: "Sınav Hazırlığı", en: "Exam Prep", de: "Prüfungsvorbereitung" },
  "nav.soon": { tr: "yakında", en: "soon", de: "bald" },
  "nav.formulas": { tr: "Formüller", en: "Formulas", de: "Formeln" },
  "nav.topics": { tr: "Konular", en: "Topics", de: "Themen" },

  // ── ana sayfa ──────────────────────────────────────────────────────────
  "home.lead": {
    tr: "Elektrik Ausbildung'unun formül ve bilgi üssü. Formüle tıkla, istediğin büyüklük için kendini yeniden yazsın; değerleri gir, sonucu al. **Ezber yok, anlamak var** — espriler dahildir, sigorta değildir.",
    en: "The formula and knowledge base for your electrical apprenticeship. Click a formula and it rearranges itself for the quantity you need; enter the values, get the result. **No cramming, just understanding** — jokes included, fuses not.",
    de: "Die Formel- und Wissensbasis für deine Elektro-Ausbildung. Klick auf eine Formel, und sie stellt sich nach der gesuchten Größe um; Werte eingeben, Ergebnis ablesen. **Nicht pauken, sondern verstehen** — Witze inklusive, Sicherungen nicht.",
  },
  "home.search": {
    tr: "Hangi değeri arıyorsun? (ör. Frequenz, U, Hz, kesit, cos φ…)",
    en: "Which quantity are you after? (e.g. frequency, U, Hz, cos φ…)",
    de: "Welche Größe suchst du? (z. B. Frequenz, U, Hz, Querschnitt, cos φ …)",
  },
  "home.stats": {
    tr: "{f} interaktif formül · {c} kategori · {t} konu — ve daha gelecek çok şey var 🚀",
    en: "{f} interactive formulas · {c} categories · {t} topics — and plenty more on the way 🚀",
    de: "{f} interaktive Formeln · {c} Kategorien · {t} Themen — und da kommt noch einiges 🚀",
  },
  "home.noResult": {
    tr: "Hmm, bir şey bulamadım. Bahsettiğin formül ya gerçekte yok ya da bizde henüz yok 🤷 — ikincisiyse, eklenecekler listesine az önce girdi say. 📝",
    en: "Hmm, nothing found. Either that formula doesn't exist, or we don't have it yet 🤷 — if it's the latter, consider it added to the to-do list as of just now. 📝",
    de: "Hm, nichts gefunden. Entweder gibt es diese Formel gar nicht, oder wir haben sie noch nicht 🤷 — im zweiten Fall steht sie ab sofort auf der To-do-Liste. 📝",
  },
  "home.pg.desc": {
    tr: "Kendi devreni kur: şalterler, butonlar, lambalar, motorlar, **kontaktörler ve zaman röleleri**. Simülasyonu başlat, akımın nereden geçtiğini izle, Selbsthaltung kur — ya da kısa devre yap, burada sigorta yerine espri atıyor.",
    en: "Build your own circuit: switches, push-buttons, lamps, motors, **contactors and time relays**. Start the simulation, watch where the current flows, wire up a latching circuit (Selbsthaltung) — or cause a short circuit; here it's the jokes that blow, not the fuses.",
    de: "Bau deine eigene Schaltung: Schalter, Taster, Leuchten, Motoren, **Schütze und Zeitrelais**. Simulation starten, dem Strom beim Fließen zusehen, eine Selbsthaltung aufbauen — oder einen Kurzschluss; hier fliegt statt der Sicherung nur ein Witz raus.",
  },
  "home.pg.cta": { tr: "Devre kurmaya başla", en: "Start building", de: "Schaltung aufbauen" },
  "home.solver.desc": {
    tr: "Reihen-, Parallel- veya Gruppenschaltung kur; bildiğin R/U/I değerlerini gir — **bulunabilecek her şeyi** zincirleme hesaplasın. Çözüm yolunu bilmeyene üçgeni de biz çizeriz.",
    en: "Set up a series, parallel or mixed circuit and enter the R/U/I values you know — it works out **everything that can be found**, one link in the chain after another. Stuck on how to get there? We'll draw you the triangle too.",
    de: "Reihen-, Parallel- oder Gruppenschaltung aufbauen, bekannte R/U/I-Werte eintragen — der Rechner ermittelt Schritt für Schritt **alles, was sich berechnen lässt**. Und wer den Lösungsweg nicht kennt, bekommt das Dreieck gleich mit aufgemalt.",
  },
  "home.solver.cta": { tr: "Hesaplamaya başla", en: "Start calculating", de: "Jetzt rechnen" },
  "home.exam.desc": {
    tr: "Abschlussprüfung'a hazırlık için örnek sorular ve adım adım çözümler hazırlanıyor. Eklenir eklenmez burada olacak.",
    en: "Sample questions with step-by-step solutions for the final exam (Abschlussprüfung) are in the works. They'll show up here as soon as they're ready.",
    de: "Beispielaufgaben mit Schritt-für-Schritt-Lösungen für die Abschlussprüfung sind in Arbeit. Sobald sie fertig sind, findest du sie hier.",
  },
  "home.exam.cta": { tr: "Göz at", en: "Take a look", de: "Reinschauen" },
  "home.cats": { tr: "Formül Kategorileri", en: "Formula Categories", de: "Formelkategorien" },
  "home.nFormulas": { tr: "{n} formül", en: "{n} formulas", de: "{n} Formeln" },
  "home.oneFormula": { tr: "1 formül", en: "1 formula", de: "1 Formel" },
  "home.guide": { tr: "rehber", en: "guide", de: "Leitfaden" },
  "home.topics.sub": {
    tr: "Formülün ötesi: sistemler, koruma, pratik bilgi.",
    en: "Beyond the formulas: systems, protection, practical know-how.",
    de: "Jenseits der Formeln: Netzsysteme, Schutz, Praxiswissen.",
  },
  "home.roadmap": { tr: "Yol Haritası", en: "Roadmap", de: "Fahrplan" },
  "home.roadmap.items": {
    tr: "📝 Sınav hazırlığı: örnek sorular|🧪 Quiz modu|🤖 AI asistan|🌐 Netzwerk konuları|🔌 Daha fazla hazır devre|🤝 Katkı sistemi",
    en: "📝 Exam prep: sample questions|🧪 Quiz mode|🤖 AI assistant|🌐 Networking topics|🔌 More example circuits|🤝 Contributions",
    de: "📝 Prüfungsvorbereitung: Beispielaufgaben|🧪 Quiz-Modus|🤖 KI-Assistent|🌐 Netzwerk-Themen|🔌 Mehr Beispielschaltungen|🤝 Mitmachen",
  },

  // ── kategori / konu ────────────────────────────────────────────────────
  "cat.notFound": {
    tr: "Böyle bir kategori yok.",
    en: "There is no such category.",
    de: "Diese Kategorie gibt es nicht.",
  },
  "cat.filling": {
    tr: "Bu kategori henüz dolduruluyor. 🚧",
    en: "This category is still being filled. 🚧",
    de: "Diese Kategorie wird noch befüllt. 🚧",
  },
  "topic.notFound": {
    tr: "Böyle bir konu yok — henüz.",
    en: "There is no such topic — yet.",
    de: "Dieses Thema gibt es nicht — noch nicht.",
  },
  "topic.stub": {
    tr: "🚧 Bu konu inşaat halinde — temel atıldı, kaba yapı aşağıda",
    en: "🚧 This topic is under construction — foundations laid, shell below",
    de: "🚧 Dieses Thema ist noch Baustelle — das Fundament steht, der Rohbau folgt unten",
  },
  "topic.tryLogic": {
    tr: "Playground'ın Logik modunda canlı dene",
    en: "Try it live in the Playground's logic mode",
    de: "Im Logik-Modus des Playgrounds live ausprobieren",
  },
  "topic.trySymbols": {
    tr: "Sembolleri Playground'da canlı dene",
    en: "Try the symbols live in the Playground",
    de: "Schaltzeichen im Playground live ausprobieren",
  },

  // ── formül sayfası ─────────────────────────────────────────────────────
  "formula.hint": {
    tr: "Bir büyüklüğe tıkla — formül onun için çözülsün (Umstellen), açıklaması aşağıda belirsin.",
    en: "Click a quantity — the formula rearranges to solve for it (Umstellen) and its explanation appears below.",
    de: "Klick auf eine Größe — die Formel wird danach umgestellt, die Erklärung erscheint darunter.",
  },
  "formula.what": { tr: "Bu ne?", en: "What is this?", de: "Was ist das?" },
  "formula.unit": { tr: "Birim", en: "Unit", de: "Einheit" },
  "formula.unitless": { tr: "birimsiz", en: "dimensionless", de: "ohne Einheit" },
  "formula.integer": { tr: "tam sayı", en: "integer", de: "ganze Zahl" },
  "formula.where": { tr: "Nereden bulurum?", en: "Where do I get it?", de: "Woher bekomme ich das?" },
  "formula.noSolve": {
    tr: "Bu kart {sym} için otomatik çözüm sunmuyor — açıklamadaki taktiğe göz at. 😉",
    en: "This card doesn't solve for {sym} automatically — check the tip in the description. 😉",
    de: "Diese Karte stellt nicht automatisch nach {sym} um — schau dir den Tipp in der Erklärung an. 😉",
  },
  "formula.tells": {
    tr: "Bu formül ne anlatıyor?",
    en: "What does this formula tell you?",
    de: "Was sagt diese Formel aus?",
  },
  "formula.notFound": {
    tr: "Bu formül bulunamadı. Belki henüz icat edilmedi?",
    en: "Formula not found. Maybe it hasn't been invented yet?",
    de: "Formel nicht gefunden. Vielleicht wurde sie noch nicht erfunden?",
  },
  "card.poke": { tr: "kurcalamak için tıkla", en: "click to tinker", de: "zum Ausprobieren klicken" },
  "calc.enter": {
    tr: "Değerleri gir, gerisini Ohm halletsin ⚡",
    en: "Enter the values and let Ohm handle the rest ⚡",
    de: "Werte eingeben, den Rest erledigt Ohm ⚡",
  },
  "calc.nan": {
    tr: "Bu değerler matematiği kızdırdı — negatif kök ya da tutarsız girdi olabilir 🤔",
    en: "These values upset the maths — probably a negative square root or inconsistent input 🤔",
    de: "Diese Werte haben die Mathematik verärgert — vermutlich eine negative Wurzel oder widersprüchliche Eingaben 🤔",
  },
  "calc.div0": {
    tr: "Sıfıra bölme tespit edildi. Evren çökmeden değerleri gözden geçir 🕳️",
    en: "Division by zero detected. Check your values before the universe collapses 🕳️",
    de: "Division durch null erkannt. Prüf die Werte, bevor das Universum kollabiert 🕳️",
  },
  "calc.title": { tr: "Hesapla — aranan:", en: "Calculate — solving for:", de: "Berechnen — gesucht:" },
  "calc.clear": { tr: "Temizle", en: "Clear", de: "Zurücksetzen" },

  // ── Netzsysteme şeması ─────────────────────────────────────────────────
  "netz.station": { tr: "Trafo istasyonu", en: "Substation", de: "Trafostation" },
  "netz.opEarth": {
    tr: "Betriebserdung (işletme topr.)",
    en: "Betriebserdung (system earth)",
    de: "Betriebserdung",
  },
  "netz.isolated": {
    tr: "izole / yüksek empedans",
    en: "isolated / high impedance",
    de: "isoliert / hochohmig",
  },
  "netz.split": { tr: "PEN ayrım noktası", en: "PEN split point", de: "PEN-Aufteilung" },
  "netz.splitNote": {
    tr: "bir kez ayrıldı mı bir daha birleşmez!",
    en: "once split, never joined again!",
    de: "einmal getrennt, nie wieder verbunden!",
  },
  "netz.building": { tr: "Bina (Gebäude)", en: "Building (Gebäude)", de: "Gebäude" },
  "netz.load": { tr: "Verbraucher / gövde", en: "Verbraucher / casing", de: "Verbraucher / Körper" },
  "netz.loadNote": { tr: "(metal gövdeli cihaz)", en: "(metal-cased device)", de: "(Metallgehäuse)" },
  "netz.bodyPen": { tr: "gövde PEN'e bağlı", en: "casing tied to PEN", de: "Körper am PEN" },
  "netz.siteEarth": {
    tr: "Anlagenerder (bina toprağı)",
    en: "Anlagenerder (building earth)",
    de: "Anlagenerder",
  },
  "netz.protEarth": { tr: "koruma topraklaması", en: "protective earthing", de: "Schutzerdung" },
  "netz.iso": {
    tr: "izolasyon bekçisi: ilk hatada alarm",
    en: "insulation monitor: alarm on 1st fault",
    de: "Isolationsüberwachung: Meldung beim 1. Fehler",
  },
  "netz.sum.tn-c": {
    tr: "TN-C: PE + N tek iletkende (PEN) — trafodan cihaza kadar. Eski usul; PEN koparsa gövdeler gerilim altında kalır.",
    en: "TN-C: PE and N share one conductor (PEN) — all the way from the transformer to the device. Old school; if the PEN breaks, the casings become live.",
    de: "TN-C: PE und N in einem Leiter (PEN) — vom Trafo bis zum Gerät. Alte Schule; reißt der PEN, stehen die Gehäuse unter Spannung.",
  },
  "netz.sum.tn-s": {
    tr: "TN-S: N ve PE trafodan itibaren ayrı yürür. Beş telli modern sistem — temiz, güvenli, EMC dostu.",
    en: "TN-S: N and PE run separately from the transformer onwards. The modern five-wire system — clean, safe, EMC-friendly.",
    de: "TN-S: N und PE laufen ab dem Trafo getrennt. Das moderne Fünfleitersystem — sauber, sicher, EMV-freundlich.",
  },
  "netz.sum.tn-c-s": {
    tr: "TN-C-S: Şebekede PEN, binada ayrım — HAK'taki sarı nokta ayrım noktası. Almanya'daki standart ev bağlantısı.",
    en: "TN-C-S: PEN in the supply network, split inside the building — the yellow dot at the HAK is the split point. The standard house connection in Germany.",
    de: "TN-C-S: Im Netz PEN, im Gebäude getrennt — der gelbe Punkt am HAK ist die Aufteilungsstelle. Der Standard-Hausanschluss in Deutschland.",
  },
  "netz.sum.tt": {
    tr: "TT: Trafo kendi toprağına, bina KENDİ toprağına. Metalik PE bağlantısı yok — RCD burada hayat sigortası.",
    en: "TT: The transformer has its own earth, the building has ITS own. No metallic PE connection — here the RCD is your life insurance.",
    de: "TT: Der Trafo hat seinen Erder, das Gebäude seinen EIGENEN. Keine metallische PE-Verbindung — hier ist der RCD die Lebensversicherung.",
  },
  "netz.sum.it": {
    tr: "IT: Şebeke toprağa bağlı değil. İlk hata devreyi durdurmaz, izolasyon bekçisi alarm verir — ameliyathane felsefesi.",
    en: "IT: The system is not earthed. The first fault doesn't trip anything; the insulation monitor raises an alarm — operating-theatre philosophy.",
    de: "IT: Das Netz ist nicht geerdet. Der erste Fehler schaltet nicht ab, die Isolationsüberwachung meldet ihn — die Philosophie des OP-Saals.",
  },

  // ── Playground ─────────────────────────────────────────────────────────
  "pg.lead": {
    tr: "Kendi devreni kur, simüle et, patlat (güvenli tarafta). Fiziksel devreler ya da mantık kapıları — seçim senin.",
    en: "Build your own circuit, simulate it, blow it up (from the safe side). Physical circuits or logic gates — your call.",
    de: "Bau deine eigene Schaltung, simuliere sie, lass es knallen (von der sicheren Seite aus). Echte Stromkreise oder Logikgatter — du entscheidest.",
  },
  "pg.phys": { tr: "Fiziksel", en: "Physical", de: "Elektrisch" },
  "pg.logic": { tr: "Logik", en: "Logic", de: "Logik" },
  "pg.vert": { tr: "Dikey", en: "Vertical", de: "Senkrecht" },
  "pg.horiz": { tr: "Yatay (raylı)", en: "Horizontal (rails)", de: "Waagerecht (mit Schienen)" },
  "pg.stop": { tr: "Durdur & Düzenle", en: "Stop & edit", de: "Stoppen & bearbeiten" },
  "pg.start": { tr: "Simülasyonu Başlat", en: "Start simulation", de: "Simulation starten" },
  "pg.loadPreset": {
    tr: "Hazır devre yükle…",
    en: "Load an example circuit…",
    de: "Beispielschaltung laden …",
  },
  "pg.clear": { tr: "Temizle", en: "Clear", de: "Leeren" },
  "pg.parts": { tr: "Parçalar", en: "Parts", de: "Bauteile" },
  "pg.logicParts": { tr: "Logik parçaları", en: "Logic parts", de: "Logik-Bauteile" },
  "pg.stopToEdit": { tr: "düzenlemek için durdur", en: "stop to edit", de: "zum Bearbeiten stoppen" },
  "pg.props": { tr: "Özellikler", en: "Properties", de: "Eigenschaften" },
  "pg.selectHint": {
    tr: "Bir parça ya da kablo seç.",
    en: "Select a part or a wire.",
    de: "Wähle ein Bauteil oder eine Leitung.",
  },
  "pg.delWire": { tr: "Kabloyu sil", en: "Delete wire", de: "Leitung löschen" },
  "pg.label": { tr: "Etiket", en: "Label", de: "Bezeichnung" },
  "pg.volts": { tr: "Gerilim (V)", en: "Voltage (V)", de: "Spannung (V)" },
  "pg.active": {
    tr: "Aktif — simülasyonda tıklayarak da açıp kapatabilirsin",
    en: "Active — you can also toggle it with a click during the simulation",
    de: "Aktiv — lässt sich in der Simulation auch per Klick ein- und ausschalten",
  },
  "pg.tmode": { tr: "Çalışma şekli", en: "Operating mode", de: "Funktion" },
  "pg.tm.ein": {
    tr: "Einschaltverzögert — çekmede gecikme",
    en: "Einschaltverzögert — on-delay",
    de: "Einschaltverzögert (anzugverzögert)",
  },
  "pg.tm.aus": {
    tr: "Ausschaltverzögert — bırakmada gecikme",
    en: "Ausschaltverzögert — off-delay",
    de: "Ausschaltverzögert (abfallverzögert)",
  },
  "pg.tm.impuls": {
    tr: "Impuls / Wischrelais — tek darbe",
    en: "Impuls / Wischrelais — single pulse",
    de: "Impuls / Wischrelais — einzelner Impuls",
  },
  "pg.tm.blink": {
    tr: "Blink / Taktrelais — yanıp sönme",
    en: "Blink / Taktrelais — flashing",
    de: "Blink- / Taktrelais — taktet ein und aus",
  },
  "pg.delay": { tr: "Süre (saniye)", en: "Time (seconds)", de: "Zeit (Sekunden)" },
  "pg.grp.coil": { tr: "Bağlı bobin", en: "Linked coil", de: "Zugehörige Spule" },
  "pg.grp.timer": { tr: "Bağlı zaman rölesi", en: "Linked time relay", de: "Zugehöriges Zeitrelais" },
  "pg.grp.switch": {
    tr: "Bağlı düğme/şalter",
    en: "Linked push-button/switch",
    de: "Zugehöriger Taster/Schalter",
  },
  "pg.rotate": { tr: "Döndür", en: "Rotate", de: "Drehen" },
  "pg.delPart": { tr: "Parçayı sil (Del)", en: "Delete part (Del)", de: "Bauteil löschen (Entf)" },
  "pg.zoomIn": { tr: "Yakınlaştır", en: "Zoom in", de: "Vergrößern" },
  "pg.zoomOut": { tr: "Uzaklaştır", en: "Zoom out", de: "Verkleinern" },
  "pg.zoomReset": { tr: "Görünümü sıfırla", en: "Reset view", de: "Ansicht zurücksetzen" },
  "pg.short": {
    tr: "KISA DEVRE! L'den N'ye yük olmadan giden bir yol var (kırmızı hat).",
    en: "SHORT CIRCUIT! There is a path from L to N with no load in it (red line).",
    de: "KURZSCHLUSS! Es gibt einen Weg von L nach N ohne Verbraucher (rote Leitung).",
  },
  "pg.shortLogic": {
    tr: "Logik'te L'yi N'ye bağlamak da aynı kapıya çıkar.",
    en: "In logic mode, wiring L straight to N amounts to the same thing.",
    de: "Auch im Logik-Modus läuft L direkt an N auf dasselbe hinaus.",
  },
  "pg.shortFix": { tr: "Araya bir şey koy.", en: "Put something in between.", de: "Schalte etwas dazwischen." },
  "pg.chatterLogic": {
    tr: "Kararsızlık: bir kapı kendi girişini kovalıyor (geri besleme salınımı) — NOT'un çıkışını kendi girişine mi bağladın? 😄",
    en: "Unstable: a gate is chasing its own input (feedback oscillation) — did you wire a NOT's output back to its own input? 😄",
    de: "Instabil: Ein Gatter jagt seinem eigenen Eingang hinterher (Rückkopplungsschwingung) — hast du den Ausgang eines NICHT-Gatters auf seinen eigenen Eingang gelegt? 😄",
  },
  "pg.chatterPhys": {
    tr: "Kararsızlık: bir bobin kendi kontağı üzerinden kendini açıp kapatıyor (flatter). Gerçekte kontaklar erir — devreyi gözden geçir.",
    en: "Unstable: a coil keeps switching itself on and off through its own contact (chatter). In real life the contacts would weld — review the circuit.",
    de: "Instabil: Eine Spule schaltet sich über ihren eigenen Kontakt ständig ein und aus (Flattern). In echt verschweißen dabei die Kontakte — überprüf die Schaltung.",
  },
  "pg.noSourceLogic": {
    tr: "Kaynak yok. L rayı gerekli — hazır devre yükle.",
    en: "No source. The L rail is required — load an example.",
    de: "Keine Quelle. Die L-Schiene fehlt — lade ein Beispiel.",
  },
  "pg.noSourcePhys": {
    tr: "Kaynak yok. Paletten bir kaynak ekle.",
    en: "No source. Add one from the palette.",
    de: "Keine Quelle. Füg eine aus der Palette hinzu.",
  },
  "pg.runningPhys": {
    tr: "Simülasyon çalışıyor. Şalterlere **tıkla**, butonları **basılı tut**, kaynağa tıklayıp şebekeyi kes. Sarı hat = akım geçiyor.",
    en: "Simulation running. **Click** switches, **press and hold** push-buttons, click the source to cut the supply. Yellow line = current flowing.",
    de: "Simulation läuft. Schalter **anklicken**, Taster **gedrückt halten**, Quelle anklicken, um das Netz abzuschalten. Gelbe Leitung = Strom fließt.",
  },
  "pg.runningLogic": {
    tr: "Simülasyon çalışıyor. Şalterlere **tıkla**, butonları **basılı tut**. Sarı hat = mantık 1.",
    en: "Simulation running. **Click** switches, **press and hold** push-buttons. Yellow line = logic 1.",
    de: "Simulation läuft. Schalter **anklicken**, Taster **gedrückt halten**. Gelbe Leitung = logisch 1.",
  },
  "pg.editMouse": {
    tr: "**Düzenleme:** paletten sürükle-bırak · parçaya **çift tık = döndür** · uçlara tıklayıp bağla — kablo çekerken boş alana tıklarsan orada otomatik **Knotenpunkt** oluşur ve devam edersin; mevcut kabloya bırakırsan köprü (Brücke) olur · kablo çekerken **sağ tık = iptal** · kabloya çift tık = araya Knoten · kablo/parça seç + Del = sil · sağ tık + sürükle = kaydır, **sağ tık basılıyken scroll = zoom** · Esc iptal.",
    en: "**Editing:** drag and drop from the palette · **double-click = rotate** a part · click terminals to connect — clicking empty space while wiring drops a **Knotenpunkt** (junction) there and you carry on; ending on an existing wire makes a bridge (Brücke) · **right-click = cancel** while wiring · double-click a wire = insert a junction · select a wire/part + Del = delete · right-click + drag = pan, **scroll while holding right-click = zoom** · Esc cancels.",
    de: "**Bearbeiten:** Bauteile aus der Palette ziehen · **Doppelklick = drehen** · Anschlüsse anklicken, um zu verdrahten — klickst du dabei auf eine freie Stelle, entsteht dort automatisch ein **Knotenpunkt** und du verdrahtest weiter; endest du auf einer vorhandenen Leitung, entsteht eine Brücke · beim Verdrahten **Rechtsklick = abbrechen** · Doppelklick auf eine Leitung = Knoten einfügen · Leitung/Bauteil auswählen + Entf = löschen · Rechtsklick + ziehen = verschieben, **bei gedrückter rechter Maustaste scrollen = zoomen** · Esc bricht ab.",
  },
  "pg.editTouch": {
    tr: "**Düzenleme:** paletten bir parçaya dokun, sonra tuvalde koymak istediğin yere dokun · parçayı sürükleyerek taşı · **uçlara dokunarak bağla** — kablo çekerken boş alana dokunursan orada **Knotenpunkt** oluşur; mevcut kabloya dokunursan köprü (Brücke) olur · seçili parçayı sol alttaki **↺ ile döndür, 🗑 ile sil** · boş alanda tek parmak = kaydır, **iki parmak = zoom**.",
    en: "**Editing:** tap a part in the palette, then tap the canvas where you want it · drag a part to move it · **tap terminals to connect** — tapping empty space while wiring drops a **Knotenpunkt** (junction) there; tapping an existing wire makes a bridge (Brücke) · with a part selected, **↺ rotates and 🗑 deletes** (bottom left) · one finger on empty space = pan, **two fingers = zoom**.",
    de: "**Bearbeiten:** Bauteil in der Palette antippen, dann die gewünschte Stelle auf der Zeichenfläche antippen · Bauteil ziehen = verschieben · **Anschlüsse antippen, um zu verdrahten** — tippst du dabei auf eine freie Stelle, entsteht dort ein **Knotenpunkt**; tippst du auf eine vorhandene Leitung, entsteht eine Brücke · ausgewähltes Bauteil unten links **mit ↺ drehen, mit 🗑 löschen** · ein Finger auf freier Fläche = verschieben, **zwei Finger = zoomen**.",
  },
  "pg.pendingHint": {
    tr: "Şimdi: ikinci ucu seç ya da boş alana Knoten bırak…",
    en: "Now: pick the second terminal or drop a junction on empty space…",
    de: "Jetzt: zweiten Anschluss wählen oder auf freier Fläche einen Knoten setzen …",
  },
  "pg.placeHint": {
    tr: "Şimdi: tuvale dokun — {name} oraya konur.",
    en: "Now: tap the canvas — {name} goes there.",
    de: "Jetzt: Zeichenfläche antippen — {name} wird dort platziert.",
  },
  "pg.guideTitle": { tr: "Mini rehber", en: "Quick guide", de: "Kurzanleitung" },
  "pg.guide": {
    tr: "**Fizikselde:** Selbsthaltung ve **Tasterverriegelung** hazır devrelerini dene — ikincisinde her butonun eş (açıcı) kontağı rakip yolu keser; ikisine aynı anda basınca ikisi de çalışmaz. **Zaman rölesinde** modu panelden değiştir: TAKT seçersen lamba yanıp söner. **Logik'te:** soldaki L rayından beslen, kapılardan geçir, sağdaki N rayında bitir. XOR örneği koridor lambasının ta kendisi; iki NOR'u çaprazlayıp RS-Flipflop kurmayı da dene — Selbsthaltung'un dijital hali.",
    en: "**Physical mode:** try the Selbsthaltung (latching) and **Tasterverriegelung** (push-button interlock) examples — in the second one, each button's linked break contact cuts the rival path; press both at once and neither works. **For the time relay**, change the mode in the panel: pick TAKT and the lamp flashes. **Logic mode:** feed from the L rail on the left, run through the gates, finish at the N rail on the right. The XOR example is exactly your hallway light; also try cross-coupling two NORs into an RS flip-flop — the digital version of Selbsthaltung.",
    de: "**Elektrisch:** Probier die Beispiele Selbsthaltung und **Tasterverriegelung** aus — bei der zweiten unterbricht der gekoppelte Öffner jedes Tasters den Pfad des anderen; drückst du beide gleichzeitig, zieht keines der beiden Schütze an. **Beim Zeitrelais** stellst du die Funktion im Eigenschaften-Feld um: Mit TAKT blinkt die Leuchte. **Logik:** Links von der L-Schiene einspeisen, durch die Gatter führen, rechts an der N-Schiene enden. Das XOR-Beispiel ist genau die Flurbeleuchtung; verschalte auch mal zwei NOR über Kreuz zu einem RS-Flipflop — die digitale Variante der Selbsthaltung.",
  },
  "pg.choose": { tr: "— seç —", en: "— select —", de: "— wählen —" },
  "pg.off": { tr: "kapalı", en: "off", de: "aus" },

  // ── Devre çözücü ───────────────────────────────────────────────────────
  "sch.lead": {
    tr: "Devreni kur, bildiğin değerleri gir — bulunabilecek **her şeyi** biz bulalım. Sarı değerler hesap, grisi senin.",
    en: "Set up your circuit, enter what you know — we'll find **everything** that can be found. Yellow values are calculated, grey ones are yours.",
    de: "Schaltung aufbauen, bekannte Werte eintragen — wir ermitteln **alles**, was sich berechnen lässt. Gelbe Werte sind berechnet, graue stammen von dir.",
  },
  "sch.seriesGroup": { tr: "Seri grup", en: "Series group", de: "Reihengruppe" },
  "sch.parallelGroup": { tr: "Paralel grup", en: "Parallel group", de: "Parallelgruppe" },
  "sch.totalSeries": { tr: "Toplam (Reihe)", en: "Total (series)", de: "Gesamt (Reihe)" },
  "sch.totalParallel": { tr: "Toplam (Parallel)", en: "Total (parallel)", de: "Gesamt (parallel)" },
  "sch.totalSource": { tr: "Toplam (kaynak)", en: "Total (source)", de: "Gesamt (Quelle)" },
  "sch.given": { tr: "senin girdiğin", en: "entered by you", de: "von dir eingegeben" },
  "sch.computed": { tr: "hesaplanan", en: "calculated", de: "berechnet" },
  "sch.delR": { tr: "Direnci sil", en: "Remove resistor", de: "Widerstand entfernen" },
  "sch.delGroup": { tr: "Grubu sil", en: "Remove group", de: "Gruppe entfernen" },
  "sch.addR": { tr: "Direnç", en: "Resistor", de: "Widerstand" },
  "sch.tipSeries": {
    tr: "Seri devre: akım tek, gerilim paylaşılır",
    en: "Series circuit: one current, the voltage is shared out",
    de: "Reihenschaltung: ein Strom, die Spannung teilt sich auf",
  },
  "sch.tipParallel": {
    tr: "Paralel devre: gerilim ortak, akım bölüşülür",
    en: "Parallel circuit: same voltage, the current splits",
    de: "Parallelschaltung: gleiche Spannung, der Strom teilt sich auf",
  },
  "sch.tipGroup": {
    tr: "Karma: grupları iç içe kur",
    en: "Mixed circuit: nest groups inside each other",
    de: "Gemischte Schaltung: Gruppen ineinander verschachteln",
  },
  "sch.err.twoWays": {
    tr: "{label} için {k} iki farklı yoldan iki farklı değere çıkıyor ({a} ≠ {b}). Girdiğin değerler birbiriyle kavgalı — birini sil, barışsınlar.",
    en: "{k} for {label} comes out differently via two different routes ({a} ≠ {b}). Your inputs are fighting each other — delete one and let them make peace.",
    de: "Für {label} ergibt sich {k} auf zwei Wegen unterschiedlich ({a} ≠ {b}). Deine Eingaben widersprechen sich — lösch eine davon, dann vertragen sie sich wieder.",
  },
  "sch.err.negative": {
    tr: "{label} için negatif {k} çıkıyor — toplam, parçalarından küçük olamaz. Bir değer fazla iddialı.",
    en: "{k} for {label} comes out negative — a total can't be smaller than its parts. One of the values is too ambitious.",
    de: "Für {label} ergibt sich ein negatives {k} — die Summe kann nicht kleiner sein als ihre Teile. Ein Wert ist zu hoch gegriffen.",
  },
  "sch.err.equalI": {
    tr: "{group} içinde I herkes için aynı olmalı ama {label} farklı bir değer taşıyor. Seri devrede akım tektir — pazarlık yok.",
    en: "Inside {group}, I must be the same for everyone, but {label} carries a different value. In a series circuit there is only one current — not negotiable.",
    de: "In {group} muss I überall gleich sein, aber {label} hat einen anderen Wert. In der Reihenschaltung gibt es nur einen Strom — da gibt es nichts zu verhandeln.",
  },
  "sch.err.equalU": {
    tr: "{group} içinde U herkes için aynı olmalı ama {label} farklı bir değer taşıyor. Paralel devrede gerilim ortaktır — pazarlık yok.",
    en: "Inside {group}, U must be the same for everyone, but {label} carries a different value. In a parallel circuit everyone shares the same voltage — not negotiable.",
    de: "In {group} muss U überall gleich sein, aber {label} hat einen anderen Wert. In der Parallelschaltung liegt an allen dieselbe Spannung — da gibt es nichts zu verhandeln.",
  },
  "sch.err.parallelR": {
    tr: "{label} hesaplanamıyor: paralel toplam direnç, her koldan KÜÇÜK olmalı. Girdiğin toplam R bu kollarla matematiksel olarak imkânsız.",
    en: "{label} can't be calculated: the total resistance of a parallel circuit must be SMALLER than every branch. The total R you entered is mathematically impossible with these branches.",
    de: "{label} lässt sich nicht berechnen: Der Gesamtwiderstand einer Parallelschaltung muss KLEINER sein als jeder einzelne Zweig. Dein Gesamt-R ist mit diesen Zweigen mathematisch unmöglich.",
  },
  "sch.err.ohm": {
    tr: "{label}: U = R·I tutmuyor ({a} ≠ {b}). Ohm amca bu üçlüyü onaylamadı.",
    en: "{label}: U = R·I doesn't hold ({a} ≠ {b}). Uncle Ohm does not approve of this trio.",
    de: "{label}: U = R·I geht nicht auf ({a} ≠ {b}). Herr Ohm hat dieses Trio nicht abgesegnet.",
  },
  "sch.blank": {
    tr: "Bir alanı boş bırak = \"bunu sen bul\".",
    en: "Leave a field empty = \"you work this one out\".",
    de: "Feld leer lassen = „das rechnest du aus“.",
  },
  "sch.solved": {
    tr: "Şu an {n} değer hesaplandı.",
    en: "{n} values calculated so far.",
    de: "Bisher {n} Werte berechnet.",
  },
  "sch.waiting": {
    tr: "Yeterli veri girince sonuçlar sarı rozetlerle belirir.",
    en: "Once there's enough data, the results appear as yellow badges.",
    de: "Sobald genug Angaben da sind, erscheinen die Ergebnisse als gelbe Marken.",
  },
  "sch.diagram": { tr: "Şema", en: "Diagram", de: "Schaltbild" },
  "sch.sourceNote": {
    tr: "Uçlar arası kaynak bağlı varsay — toplam satırına U girmen yeter.",
    en: "Assume a source across the two ends — entering U in the total row is enough.",
    de: "Zwischen den beiden Enden liegt gedanklich die Quelle — U in der Gesamtzeile einzutragen genügt.",
  },
  "sch.howTitle": { tr: "Nasıl çalışır?", en: "How does it work?", de: "Wie funktioniert das?" },
  "sch.how": {
    tr: "Çözücü, senin girdiklerinden türetilebilen her değeri kurallar sabitlenene kadar zincirleme hesaplar: **Ohm** (U=R·I), **seri** (I ortak, U ve R toplanır), **paralel** (U ortak, I toplanır, 1/R toplanır). Örnek: Reihe'de R₁=100 Ω, R₂=200 Ω ve toplam U=30 V gir — I, tüm kısmi gerilimler ve güçler kendiliğinden gelir. Çelişkili değer girersen kavgayı biz haber veririz; hakemlik Ohm amcanın.",
    en: "The solver keeps chaining rules until nothing new can be derived from what you entered: **Ohm** (U=R·I), **series** (same I; U and R add up), **parallel** (same U; I adds up, 1/R adds up). Example: in the series template enter R₁=100 Ω, R₂=200 Ω and a total U of 30 V — I, all partial voltages and the powers follow by themselves. Enter contradictory values and we'll report the fight; Uncle Ohm is the referee.",
    de: "Der Rechner wendet die Regeln so lange nacheinander an, bis sich aus deinen Eingaben nichts Neues mehr ableiten lässt: **Ohm** (U=R·I), **Reihe** (I gleich; U und R addieren sich), **parallel** (U gleich; I addiert sich, 1/R addiert sich). Beispiel: In der Reihenschaltung R₁=100 Ω, R₂=200 Ω und U_ges=30 V eintragen — I, alle Teilspannungen und Leistungen ergeben sich von selbst. Bei widersprüchlichen Werten melden wir den Streit; Schiedsrichter ist Herr Ohm.",
  },

  // ── Prüfungsvorbereitung ───────────────────────────────────────────────
  "exam.tagline": {
    tr: "Sınav günü sürpriz istemeyenler için.",
    en: "For everyone who'd rather not be surprised on exam day.",
    de: "Für alle, die am Prüfungstag keine Überraschungen mögen.",
  },
  "exam.soonTitle": { tr: "Yakında", en: "Coming soon", de: "Demnächst" },
  "exam.soonBody": {
    tr: "Bu bölüm hazır, sorular yolda. Abschlussprüfung'a hazırlık için örnek sorular şu an derleniyor; eklenir eklenmez burada göreceksin.",
    en: "The section is ready, the questions are on their way. Sample questions for the final exam (Abschlussprüfung) are being put together right now; you'll see them here as soon as they're added.",
    de: "Der Bereich steht, die Aufgaben sind unterwegs. Beispielaufgaben zur Vorbereitung auf die Abschlussprüfung werden gerade zusammengestellt; sobald sie da sind, findest du sie hier.",
  },
  "exam.planTitle": { tr: "Ne gelecek?", en: "What's coming?", de: "Was kommt?" },
  "exam.plan": {
    tr: "Konu konu örnek sorular|Adım adım çözümler — sadece sonuç değil, yol|Her soruda ilgili formül kartına bağlantı|Hesap soruları ve bilgi soruları ayrı ayrı",
    en: "Sample questions, topic by topic|Step-by-step solutions — the path, not just the result|A link to the matching formula card for every question|Calculation questions and knowledge questions, kept apart",
    de: "Beispielaufgaben, Thema für Thema|Lösungen Schritt für Schritt — der Weg, nicht nur das Ergebnis|Zu jeder Aufgabe ein Link zur passenden Formelkarte|Rechenaufgaben und Wissensfragen getrennt",
  },
  "exam.meanwhileTitle": { tr: "O zamana kadar", en: "In the meantime", de: "Bis dahin" },
  "exam.meanwhile": {
    tr: "Sınavda en çok işine yarayacak yerler zaten açık:",
    en: "The parts you'll need most in the exam are already open:",
    de: "Was du in der Prüfung am meisten brauchst, ist schon da:",
  },
  "exam.showAnswer": { tr: "Çözümü göster", en: "Show solution", de: "Lösung anzeigen" },
  "exam.count": { tr: "{n} soru", en: "{n} questions", de: "{n} Aufgaben" },
  "exam.formulaLink": { tr: "İlgili formül", en: "Related formula", de: "Passende Formel" },
} satisfies Record<string, Entry>;

export type UIKey = keyof typeof UI;
