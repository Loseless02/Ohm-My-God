import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TOPICS } from "../data";
import { useI18n } from "../i18n";

// Playground fare + geniş ekran ister. Telefonda ağır parçayı hiç indirmeden konulara yönlendir.
const Playground = lazy(() => import("../playground/Playground"));
const SMALL = "(max-width: 767px)";

export default function PlaygroundGate() {
  const { t, tx } = useI18n();
  const [small, setSmall] = useState(() => window.matchMedia(SMALL).matches);
  useEffect(() => {
    const m = window.matchMedia(SMALL);
    const on = () => setSmall(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);

  if (!small)
    return (
      <Suspense fallback={null}>
        <Playground />
      </Suspense>
    );

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-disp text-2xl font-bold text-ink">🎛️ Playground</h1>
      <div className="card mt-4 p-5">
        <p className="font-disp text-lg font-semibold text-volt">🖥️ {t("pg.mobile.title")}</p>
        <p className="mt-2 text-sm leading-relaxed text-mut">{t("pg.mobile.body")}</p>
      </div>
      <h2 className="mb-3 mt-6 font-disp text-sm uppercase tracking-widest text-mut">{t("pg.mobile.topics")}</h2>
      <div className="grid gap-2">
        {TOPICS.filter((x) => !x.stub).map((x) => (
          <Link
            key={x.id}
            to={`/konu/${x.id}`}
            className="card flex items-center gap-3 p-4 transition hover:border-spark/50"
          >
            <span className="text-2xl" aria-hidden="true">
              {x.icon}
            </span>
            <span>
              <span className="block font-semibold text-ink">{tx(x.title)}</span>
              <span className="block text-xs text-mut">{tx(x.tagline)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
