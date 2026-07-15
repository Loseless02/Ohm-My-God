import { Link, useParams } from "react-router-dom";
import { TOPIC_BY_ID } from "../data";
import { NetzDiagram, type NetzSystem } from "../components/NetzDiagram";
import { SchutzklasseSymbol, type SkKind } from "../components/SchutzklasseSymbol";
import { GateSymbol, type GateKind } from "../components/GateSymbol";

export default function TopicPage() {
  const { id } = useParams();
  const topic = id ? TOPIC_BY_ID[id] : undefined;
  if (!topic) {
    return (
      <p className="text-mut">
        Böyle bir konu yok — henüz.{" "}
        <Link to="/" className="text-volt underline">
          Ana sayfaya dön
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          Ana sayfa
        </Link>
        <span className="mx-2">/</span>
        <span>Konular</span>
      </nav>
      <h1 className="font-disp text-3xl font-bold text-ink">
        <span className="mr-2">{topic.icon}</span>
        {topic.title}
        {topic.de && <span className="ml-2 text-lg font-normal text-mut">· {topic.de}</span>}
      </h1>
      <p className="mt-1 italic text-mut">{topic.tagline}</p>
      {topic.stub && (
        <p className="mt-4 inline-block rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-xs text-volt">
          🚧 Bu konu inşaat halinde — temel atıldı, kaba yapı aşağıda
        </p>
      )}
      {topic.id === "logische-funktionen" && (
        <Link
          to="/playground"
          className="mt-4 inline-block rounded-xl bg-spark/10 px-4 py-2 font-disp text-sm font-semibold text-spark transition hover:bg-spark/20"
        >
          🎛️ Playground'ın Logik modunda canlı dene →
        </Link>
      )}
      <div className="mt-6 space-y-5">
        {topic.sections.map((s, i) => (
          <section key={i} className="card p-5">
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
                {s.h && <h2 className="mb-2 font-disp text-lg font-semibold text-volt">{s.h}</h2>}
                <p className="leading-relaxed text-ink/90">{s.body}</p>
              </div>
            </div>
            {s.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="border-collapse text-center text-sm">
                  <thead>
                    <tr>
                      {s.table.head.map((h, j) => (
                        <th
                          key={j}
                          className="border border-line bg-panel2 px-4 py-1.5 font-disp text-xs uppercase tracking-wide text-mut"
                        >
                          {h}
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
                            className={`border border-line px-4 py-1.5 ${
                              c === "1" ? "font-semibold text-volt" : c === "0" ? "text-mut" : "text-ink/90"
                            }`}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.diagram && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-line/60 bg-bg/50 p-3">
                <NetzDiagram sys={s.diagram as NetzSystem} />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
