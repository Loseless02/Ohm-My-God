import { CATEGORIES, FORMULAS, TOPICS } from "../data";
import { EXAM_QUESTIONS } from "../data/pruefung";
import { SPEC } from "../playground/types";
import { PART_INFO } from "../playground/info";
import { LOGIC_PRESETS, PRESETS } from "../playground/presets";

/** tx() ile çevrilen bütün içerik metinleri (tekrarsız, görünme sırasıyla). Sadece i18n denetimi kullanır. */
export function collectStrings(): string[] {
  const out = new Set<string>();
  const add = (s?: string) => {
    if (s) out.add(s);
  };
  for (const c of CATEGORIES) {
    add(c.title);
    add(c.blurb);
    c.article?.forEach(add);
  }
  for (const f of FORMULAS) {
    add(f.title);
    add(f.tagline);
    add(f.desc);
    add(f.note);
    for (const v of f.vars) {
      add(v.name);
      add(v.unitNote);
      add(v.desc);
      add(v.find);
    }
  }
  for (const t of TOPICS) {
    add(t.title);
    add(t.tagline);
    for (const s of t.sections) {
      add(s.h);
      add(s.body);
      // sayı hücreleri çevrilmez (TopicPage ondalık ayırıcıyı kendi çevirir)
      const cells = [...(s.table?.head ?? []), ...(s.table?.rows.flat() ?? [])];
      cells.filter((c) => /\p{L}/u.test(c)).forEach(add);
    }
  }
  for (const s of Object.values(SPEC)) add(s.name);
  Object.values(PART_INFO).forEach(add);
  for (const p of [...PRESETS, ...LOGIC_PRESETS]) add(p.name);
  for (const q of EXAM_QUESTIONS) {
    add(q.topic);
    add(q.q);
    q.options?.forEach(add);
    add(q.answer);
    add(q.explain);
  }
  return [...out];
}
