import { Link, useParams } from "react-router-dom";
import { CATEGORY_BY_ID, formulasOfCategory } from "../data";
import { FormulaCard } from "../components/FormulaCard";
import { useI18n } from "../i18n";

export default function CategoryPage() {
  const { id } = useParams();
  const { t, tx, deTerm } = useI18n();
  const cat = id ? CATEGORY_BY_ID[id] : undefined;
  if (!cat) {
    return (
      <p className="text-mut">
        {t("cat.notFound")}{" "}
        <Link to="/" className="text-volt underline">
          {t("common.backHome")}
        </Link>
      </p>
    );
  }
  const formulas = formulasOfCategory(cat.id);

  return (
    <div>
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          {t("common.home")}
        </Link>
      </nav>
      <h1 className="font-disp text-2xl font-bold text-ink sm:text-3xl">
        <span className="mr-2">{cat.icon}</span>
        {tx(cat.title)}
        {deTerm(cat.de) && <span className="text-lg font-normal text-mut"> · {cat.de}</span>}
      </h1>
      <p className="mb-8 mt-2 max-w-2xl text-mut">{tx(cat.blurb)}</p>

      {cat.article && (
        <div className="card mb-8 space-y-4 p-5 sm:p-6">
          {cat.article.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink/90">
              {tx(p)}
            </p>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {formulas.map((f) => (
          <FormulaCard key={f.id} f={f} />
        ))}
      </div>
      {formulas.length === 0 && !cat.article && <p className="text-mut">{t("cat.filling")}</p>}
    </div>
  );
}
