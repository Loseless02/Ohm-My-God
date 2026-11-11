import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { UI, type UIKey } from "./ui";
import { setNumberLocale } from "../lib/format";

// ── Dil altyapısı ────────────────────────────────────────────────────────────
// Kaynak dil Türkçe. İki tür metin var:
//   t("key")  → arayüz metinleri (ui.ts; üç dil yan yana, anahtarlı)
//   tx("...") → içerik metinleri (formüller, konular…); Türkçe kaynak metin
//               anahtar olarak kullanılır, çevirisi content.<dil>.ts'ten gelir.
//               Çevirisi olmayan metin Türkçe kalır — `npm run i18n:check` eksikleri listeler.

export type Lang = "tr" | "en" | "de";
export const LANGS: Lang[] = ["de", "en", "tr"];
const LS = "omg-lang";

type Dict = Record<string, string>;
const loaders: Record<Exclude<Lang, "tr">, () => Promise<{ default: Dict }>> = {
  en: () => import("./content.en"),
  de: () => import("./content.de"),
};
const dicts: Partial<Record<Lang, Dict>> = { tr: {} };

const isLang = (s: unknown): s is Lang => s === "tr" || s === "en" || s === "de";

export async function loadLang(l: Lang): Promise<void> {
  if (l !== "tr" && !dicts[l]) dicts[l] = (await loaders[l]()).default;
}

export function detectLang(): Lang {
  const q = new URLSearchParams(window.location.search).get("lang");
  if (isLang(q)) return q;
  try {
    const s = localStorage.getItem(LS);
    if (isLang(s)) return s;
  } catch {
    /* localStorage yoksa tarayıcı diline düş */
  }
  for (const n of navigator.languages ?? [navigator.language]) {
    const p = n.slice(0, 2).toLowerCase();
    if (isLang(p)) return p;
  }
  return "en";
}

const fill = (s: string, p?: Record<string, string | number>) =>
  p ? s.replace(/\{(\w+)\}/g, (m, k) => (k in p ? String(p[k]) : m)) : s;

/** Dil seçimini sayfaya uygula: <html lang>, başlık, açıklama, sayı biçimi, kalıcılık. */
export function applyLang(l: Lang): void {
  setNumberLocale(l);
  document.documentElement.lang = l;
  document.title = UI["meta.title"][l];
  document.querySelector('meta[name="description"]')?.setAttribute("content", UI["meta.desc"][l]);
  try {
    localStorage.setItem(LS, l);
  } catch {
    /* kalıcılık şart değil */
  }
}

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: UIKey, p?: Record<string, string | number>) => string;
  tx: (s: string) => string;
  /** Almanca terim alt yazısı: Almanca modda zaten başlığın kendisi olduğu için gizlenir. */
  deTerm: (de?: string) => string | undefined;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);

  const setLang = useCallback((l: Lang) => {
    void loadLang(l).then(() => {
      applyLang(l);
      setLangState(l);
    });
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (k, p) => fill(UI[k][lang], p),
      tx: (s) => dicts[lang]?.[s] ?? s,
      deTerm: (de) => (lang === "de" ? undefined : de),
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n: I18nProvider eksik");
  return v;
}

/** "**vurgulu**" parçaları öne çıkararak metni çizer (çeviri metninde HTML tutmamak için). */
export function rich(s: string, cls = "font-semibold text-ink"): ReactNode {
  return s.split("**").map((part, i) =>
    i % 2 ? (
      <span key={i} className={cls}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
