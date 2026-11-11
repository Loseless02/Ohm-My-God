// İçerik çevirilerini denetler: src/i18n/content.<dil>.ts dosyalarında eksik ya da artık
// kullanılmayan metinleri listeler.   Kullanım: npm run i18n:check   (eksik varsa çıkış kodu 1)
//   --dump <dosya.json>  → çevrilecek bütün Türkçe kaynak metinleri JSON olarak yazar
import { build } from "esbuild";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const dir = mkdtempSync(join(tmpdir(), "omg-i18n-"));
async function load(entry) {
  const outfile = join(dir, entry.replace(/[^\w]/g, "_") + ".mjs");
  await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile, logLevel: "silent" });
  return import(pathToFileURL(outfile).href);
}

// çeviri gerektirmeyen metinler: kısaltmalar, semboller, her dilde aynı kalan özel adlar
const SAME = /^[\p{Lu}\d\s/.,²°%&≥=∘()+-]*$/u;

try {
  const strings = (await load("src/i18n/collect.ts")).collectStrings();
  const dumpAt = process.argv.indexOf("--dump");
  if (dumpAt > 0) {
    writeFileSync(process.argv[dumpAt + 1], JSON.stringify(strings, null, 1));
    console.log(`${strings.length} metin yazıldı.`);
  } else {
    let bad = 0;
    for (const lang of ["en", "de"]) {
      const dict = (await load(`src/i18n/content.${lang}.ts`)).default;
      const missing = strings.filter((s) => !(s in dict) && !SAME.test(s));
      const stale = Object.keys(dict).filter((k) => !strings.includes(k));
      console.log(`[${lang}] ${strings.length} metin · ${missing.length} eksik · ${stale.length} kullanılmayan`);
      for (const s of missing) console.log(`  eksik: ${s.length > 90 ? s.slice(0, 90) + "…" : s}`);
      for (const s of stale) console.log(`  kullanılmıyor: ${s.length > 90 ? s.slice(0, 90) + "…" : s}`);
      bad += missing.length;
    }
    process.exitCode = bad ? 1 : 0;
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
