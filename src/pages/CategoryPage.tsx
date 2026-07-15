import { Link, useParams } from "react-router-dom";
import { CATEGORY_BY_ID, formulasOfCategory } from "../data";
import { FormulaCard } from "../components/FormulaCard";

export default function CategoryPage() {
  const { id } = useParams();
  const cat = id ? CATEGORY_BY_ID[id] : undefined;
  if (!cat) {
    return (
      <p className="text-mut">
        Böyle bir kategori yok.{" "}
        <Link to="/" className="text-volt underline">
          Ana sayfaya dön
        </Link>
      </p>
    );
  }
  const formulas = formulasOfCategory(cat.id);

  return (
    <div>
      <nav className="mb-4 text-sm text-mut">
        <Link to="/" className="hover:text-ink">
          Ana sayfa
        </Link>
      </nav>
      <h1 className="font-disp text-3xl font-bold text-ink">
        <span className="mr-2">{cat.icon}</span>
        {cat.title} <span className="text-lg font-normal text-mut">· {cat.de}</span>
      </h1>
      <p className="mb-8 mt-2 max-w-2xl text-mut">{cat.blurb}</p>

      {cat.article && (
        <div className="card mb-8 space-y-4 p-6">
          {cat.article.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {formulas.map((f) => (
          <FormulaCard key={f.id} f={f} />
        ))}
      </div>
      {formulas.length === 0 && !cat.article && (
        <p className="text-mut">Bu kategori henüz dolduruluyor. 🚧</p>
      )}
    </div>
  );
}
