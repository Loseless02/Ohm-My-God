// Koruma sınıfı işaretleri — tip etiketinde gördüğün semboller.
const C = "#e8edf4";

export type SkKind = "sk1" | "sk2" | "sk3";

export function SchutzklasseSymbol({ k }: { k: SkKind }) {
  if (k === "sk1") {
    // Sınıf I: koruma iletkeni (toprak) işareti
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label="Schutzklasse I sembolü">
        <circle cx={32} cy={32} r={27} fill="none" stroke={C} strokeWidth={2.5} />
        <line x1={32} y1={16} x2={32} y2={32} stroke={C} strokeWidth={2.5} />
        <line x1={19} y1={32} x2={45} y2={32} stroke={C} strokeWidth={2.5} />
        <line x1={23} y1={39} x2={41} y2={39} stroke={C} strokeWidth={2.5} />
        <line x1={27} y1={46} x2={37} y2={46} stroke={C} strokeWidth={2.5} />
      </svg>
    );
  }
  if (k === "sk2") {
    // Sınıf II: iç içe iki kare (çift izolasyon)
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label="Schutzklasse II sembolü">
        <rect x={10} y={10} width={44} height={44} fill="none" stroke={C} strokeWidth={2.5} />
        <rect x={21} y={21} width={22} height={22} fill="none" stroke={C} strokeWidth={2.5} />
      </svg>
    );
  }
  // Sınıf III: eşkenar dörtgen içinde III (SELV/PELV)
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label="Schutzklasse III sembolü">
      <polygon points="32,6 58,32 32,58 6,32" fill="none" stroke={C} strokeWidth={2.5} />
      <text
        x={32}
        y={38}
        textAnchor="middle"
        fill={C}
        fontSize={17}
        fontWeight={700}
        fontFamily="Georgia, serif"
      >
        III
      </text>
    </svg>
  );
}
