import { Link, useParams } from "react-router-dom";
import { TOPIC_BY_ID } from "../data";
import { NetzDiagram, type NetzSystem } from "../components/NetzDiagram";
import { SchutzklasseSymbol, type SkKind } from "../components/SchutzklasseSymbol";
import { GateSymbol, type GateKind } from "../components/GateSymbol";
import { MiniSymbol } from "../playground/parts";
import { SPEC, type PartType } from "../playground/types";
import { PART_INFO } from "../playground/info";
import { useI18n } from "../i18n";

// Playground'a "canlı dene" bağlantısı olan konular
const PLAY_LINK: Record<string, "topic.tryLogic" | "topic.trySymbols"> = {
  "logische-funktionen": "topic.tryLogic",
  schaltzeichen: "topic.trySymbols",
};

export default function TopicPage() {
  const { id } = useParams();
  const { t, tx, deTerm, lang } = useI18n();
  const topic = id ? TOPIC_BY_ID[id] : undefined;
  if (!topic) {
    return (
      <p className="text-mut">
        {t("topic.notFound")}{" "}
        <Link to="/" className="text-volt underline">
          {t("common.backHome")}
        </Link>
      </p>
    );
  }

  // sayı hücreleri kaynakta ondalık virgülle yazılı; İngilizcede noktaya çevir
  const cell = (c: string) => (/\p{L}/u.test(c) ? tx(c) : lang === "en" ? c.replace(/,/g, ".") : c);
  const playKey = PLAY_LINK[topic.id];

  return (
    <div className="max-w-3xl">
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          {t("common.home")}
        </Link>
        <span className="mx-2">/</span>
        <span>{t("nav.topics")}</span>
      </nav>
      <h1 className="font-disp text-2xl font-bold text-ink sm:text-3xl">
        <span className="mr-2">{topic.icon}</span>
        {tx(topic.title)}
        {deTerm(topic.de) && <span className="ml-2 text-lg font-normal text-mut">· {topic.de}</span>}
      </h1>
      <p className="mt-1 italic text-mut">{tx(topic.tagline)}</p>
      {topic.stub && (
        <p className="mt-4 inline-block rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-xs text-volt">
          {t("topic.stub")}
        </p>
      )}
      {playKey && (
        <Link
          to="/playground"
          className="mt-4 inline-block rounded-xl bg-spark/10 px-4 py-2 font-disp text-sm font-semibold text-spark transition hover:bg-spark/20"
        >
          🎛️ {t(playKey)} →
        </Link>
      )}
      <div className="mt-6 space-y-5">
        {topic.sections.map((s, i) => (
          <section key={i} className="card p-4 sm:p-5">
            <div className={s.symbol || s.gate ? "flex flex-wrap items-start gap-4" : undefined}>
              {s.symbol && (
                <div className="shrink-0 rounded-xl border border-line bg-bg/50 p-2">
                  <SchutzklasseSymbol k={s.symbol as SkKind} />
                </div>
              )}
              {s.gate && (
                <div className="shrink-0 rounded-xl border border-line bg-bg/50 p-2">
                  <GateSymbol g={s.gate as GateKind} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {s.h && <h2 className="mb-2 font-disp text-lg font-semibold text-volt">{tx(s.h)}</h2>}
                <p className="leading-relaxed text-ink/90">{tx(s.body)}</p>
              </div>
            </div>
            {s.symbols && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(s.symbols as PartType[]).map((pt) => (
                  <div key={pt} className="flex gap-3 rounded-xl border border-line/60 bg-bg/50 p-3">
                    <div className="shrink-0 [&>svg]:h-14 [&>svg]:w-14">
                      <MiniSymbol type={pt} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-disp text-sm font-semibold text-ink">{tx(SPEC[pt].name)}</p>
                      {deTerm(SPEC[pt].de) && <p className="text-[11px] text-mut">{SPEC[pt].de}</p>}
                      <p className="mt-1 text-xs leading-relaxed text-mut">{tx(PART_INFO[pt])}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {s.table && (
              <div className="-mx-1 mt-4 overflow-x-auto px-1">
                <table className="border-collapse text-center text-sm">
                  <thead>
                    <tr>
                      {s.table.head.map((h, j) => (
                        <th
                          key={j}
                          className="border border-line bg-panel2 px-3 py-1.5 font-disp text-xs uppercase tracking-wide text-mut sm:px-4"
                        >
                          {cell(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td
                            key={k}
                            className={`border border-line px-3 py-1.5 sm:px-4 ${
                              c === "1" ? "font-semibold text-volt" : c === "0" ? "text-mut" : "text-ink/90"
                            } ${c.length > 24 ? "min-w-44 text-left" : c.length > 14 ? "text-left" : "whitespace-nowrap"}`}
                          >
                            {cell(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.diagram && (
              <div className="mt-4 rounded-xl border border-line/60 bg-bg/50 p-3">
                <NetzDiagram sys={s.diagram as NetzSystem} />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
