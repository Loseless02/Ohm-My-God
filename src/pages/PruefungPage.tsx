import { Link } from "react-router-dom";
import { CATEGORY_BY_ID, FORMULA_BY_ID, TOPIC_BY_ID } from "../data";
import { EXAM_QUESTIONS, type ExamQuestion } from "../data/pruefung";
import { useI18n } from "../i18n";

// Sorular gelene kadar: sınavda en çok işe yarayan mevcut sayfalar
const MEANWHILE: { to: string; icon: string; title: string }[] = [
  { to: "/konu/sicherheitsregeln", ...pick(TOPIC_BY_ID["sicherheitsregeln"]) },
  { to: "/konu/schutzmassnahmen", ...pick(TOPIC_BY_ID["schutzmassnahmen"]) },
  { to: "/konu/netzsysteme", ...pick(TOPIC_BY_ID["netzsysteme"]) },
  { to: "/kategori/grundlagen", ...pick(CATEGORY_BY_ID["grundlagen"]) },
  { to: "/kategori/drehstrom", ...pick(CATEGORY_BY_ID["drehstrom"]) },
  { to: "/kategori/spannungsfall", ...pick(CATEGORY_BY_ID["spannungsfall"]) },
];

function pick(x: { icon: string; title: string }) {
  return { icon: x.icon, title: x.title };
}

function Question({ q, n }: { q: ExamQuestion; n: number }) {
  const { t, tx } = useI18n();
  const f = q.formula ? FORMULA_BY_ID[q.formula] : undefined;
  return (
    <div className="card p-4 sm:p-5">
      <p className="leading-relaxed text-ink">
        <span className="mr-2 font-disp font-semibold text-volt">{n}.</span>
        {tx(q.q)}
      </p>
      {q.options && (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options.map((o, i) => (
            <li key={i} className="rounded-lg border border-line bg-bg/50 px-3 py-2 text-sm text-ink/90">
              <span className="mr-2 text-mut">{String.fromCharCode(97 + i)})</span>
              {tx(o)}
            </li>
          ))}
        </ul>
      )}
      <details className="mt-3 rounded-xl border border-line bg-bg/50 px-3 py-2 text-sm">
        <summary className="cursor-pointer py-1 text-spark">{t("exam.showAnswer")}</summary>
        <p className="mt-2 font-semibold text-volt">{tx(q.answer)}</p>
        {q.explain && <p className="mt-2 leading-relaxed text-ink/90">{tx(q.explain)}</p>}
        {f && (
          <p className="mt-2">
            <Link to={`/formul/${f.id}`} className="text-spark underline-offset-2 hover:underline">
              {t("exam.formulaLink")}: {tx(f.title)} →
            </Link>
          </p>
        )}
      </details>
    </div>
  );
}

export default function PruefungPage() {
  const { t, tx, deTerm } = useI18n();
  const groups = new Map<string, ExamQuestion[]>();
  for (const q of EXAM_QUESTIONS) groups.set(q.topic, [...(groups.get(q.topic) ?? []), q]);
  let n = 0;

  return (
    <div className="max-w-3xl">
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          {t("common.home")}
        </Link>
      </nav>
      <h1 className="font-disp text-2xl font-bold text-ink sm:text-3xl">
        <span className="mr-2">📝</span>
        {t("nav.exam")}
        {deTerm("Prüfungsvorbereitung") && (
          <span className="ml-2 text-lg font-normal text-mut">· Prüfungsvorbereitung</span>
        )}
      </h1>
      <p className="mt-1 italic text-mut">{t("exam.tagline")}</p>

      {EXAM_QUESTIONS.length === 0 ? (
        <>
          <div className="card relative mt-6 overflow-hidden p-5 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.10),transparent_60%)]" />
            <div className="relative">
              <span className="inline-block rounded-full border border-spark/40 bg-spark/10 px-3 py-1 font-disp text-xs font-semibold uppercase tracking-widest text-spark">
                🚧 {t("exam.soonTitle")}
              </span>
              <p className="mt-4 text-lg leading-relaxed text-ink/90">{t("exam.soonBody")}</p>
            </div>
          </div>

          <div className="card mt-5 p-4 sm:p-5">
            <h2 className="mb-3 font-disp text-lg font-semibold text-volt">{t("exam.planTitle")}</h2>
            <ul className="space-y-2 text-ink/90">
              {t("exam.plan")
                .split("|")
                .map((item) => (
                  <li key={item} className="flex gap-2 leading-relaxed">
                    <span className="text-spark">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-6 space-y-8">
          <p className="text-xs text-mut">{t("exam.count", { n: EXAM_QUESTIONS.length })}</p>
          {[...groups].map(([topic, qs]) => (
            <section key={topic}>
              <h2 className="mb-3 font-disp text-lg font-semibold text-volt">{tx(topic)}</h2>
              <div className="space-y-4">
                {qs.map((q) => (
                  <Question key={q.id} q={q} n={++n} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="card mt-5 p-4 sm:p-5">
        <h2 className="mb-1 font-disp text-lg font-semibold text-volt">{t("exam.meanwhileTitle")}</h2>
        <p className="mb-3 text-sm text-mut">{t("exam.meanwhile")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MEANWHILE.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="rounded-xl border border-line bg-bg/50 px-3 py-2.5 text-sm text-ink/90 transition hover:border-spark/50 hover:text-spark"
            >
              <span className="mr-2">{m.icon}</span>
              {tx(m.title)}
            </Link>
          ))}
          <Link
            to="/schaltung"
            className="rounded-xl border border-line bg-bg/50 px-3 py-2.5 text-sm text-ink/90 transition hover:border-spark/50 hover:text-spark"
          >
            <span className="mr-2">🧮</span>
            {t("nav.solver")}
          </Link>
          <Link
            to="/playground"
            className="rounded-xl border border-line bg-bg/50 px-3 py-2.5 text-sm text-ink/90 transition hover:border-spark/50 hover:text-spark"
          >
            <span className="mr-2">🎛️</span>
            Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
