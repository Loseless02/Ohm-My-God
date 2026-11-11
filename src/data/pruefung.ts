// ── Prüfungsvorbereitung soruları ────────────────────────────────────────────
// Soru eklemek için bu listeye bir nesne ekle; sayfa (src/pages/PruefungPage.tsx)
// liste boşken "yakında" ekranını, doluyken soruları gösterir.
// Metinler Türkçe yazılır; İngilizce/Almanca karşılıkları src/i18n/content.*.ts
// dosyalarına aynı Türkçe metin anahtar olacak şekilde eklenir
// (`npm run i18n:check` eksik çevirileri listeler).
//
// Örnek:
// {
//   id: "ohm-1",
//   topic: "Temeller",
//   q: "230 V'luk bir ısıtıcı 10 A çekiyor. Direnci kaç ohm'dur?",
//   options: ["2,3 Ω", "23 Ω", "230 Ω", "2300 Ω"],   // isteğe bağlı (çoktan seçmeli)
//   answer: "23 Ω",
//   explain: "R = U / I = 230 V / 10 A = 23 Ω.",        // isteğe bağlı (çözüm yolu)
//   formula: "ohm",                                      // isteğe bağlı (formül kartı id'si)
// }

export interface ExamQuestion {
  id: string;
  topic: string; // konu başlığı — sorular buna göre gruplanır
  q: string; // soru metni
  options?: string[]; // çoktan seçmeli şıklar
  answer: string; // doğru cevap
  explain?: string; // adım adım çözüm
  formula?: string; // ilgili formül kartının id'si (src/data/f-*.ts)
}

export const EXAM_QUESTIONS: ExamQuestion[] = [];
