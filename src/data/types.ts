import type { Expr } from "../lib/expr";

export interface UnitOption {
  label: string; // "kΩ"
  mult: number; // temel birime çevirme çarpanı (kΩ → 1000)
}

export interface VariableDef {
  id: string;
  sym: string; // "U", "R", "cos φ", "η" …
  sub?: string; // alt indis: "1", "ges", "L" …
  name: string; // Türkçe adı
  de?: string; // Almanca terim (Ausbildung dili!)
  units?: UnitOption[]; // ilk eleman varsayılan giriş birimi
  unitNote?: string; // birimsizler için açıklama ("birimsiz, 0–1")
  integer?: boolean;
  desc: string; // bu ne? (ironik ama doğru)
  find: string; // nereden bulunur / nasıl ölçülür
}

export interface FormulaDef {
  id: string;
  cat: string; // kategori id
  title: string;
  tagline: string; // esprili alt başlık
  desc: string; // formül ne anlatıyor
  note?: string; // ⚠️ dikkat kutusu
  vars: VariableDef[];
  base: string; // varsayılan çözülen değişken
  forms: Record<string, Expr>; // solveFor → sağ taraf (lhs = o değişken)
  keywords?: string[]; // arama için
}

export interface CategoryDef {
  id: string;
  title: string; // Türkçe
  de: string; // Almanca
  icon: string;
  blurb: string; // kısa tanıtım
  article?: string[]; // formülsüz kategoriler için paragraflar (Gruppenschaltung)
}

export interface TopicSection {
  h?: string;
  body: string;
  diagram?: string; // NetzDiagram sistemi ("tn-c", "tt"…) — varsa bölümün altına çizilir
  symbol?: string; // SchutzklasseSymbol ("sk1" | "sk2" | "sk3") — başlığın yanında gösterilir
  gate?: string; // GateSymbol ("and" | "or" | …) — başlığın yanında gösterilir
  table?: { head: string[]; rows: string[][] }; // doğruluk tablosu vb.
}

export interface TopicDef {
  id: string;
  title: string;
  de?: string;
  icon: string;
  tagline: string;
  stub?: boolean; // 🚧 detaylar yakında
  sections: TopicSection[];
}
