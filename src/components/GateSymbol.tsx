// DIN EN 60617 mantık kapısı sembolü — konu sayfalarında bağımsız gösterim.
const C = "#e8edf4";

export type GateKind = "and" | "or" | "not" | "nand" | "nor" | "xor";

const LBL: Record<GateKind, string> = {
  and: "&",
  or: "≥1",
  not: "1",
  nand: "&",
  nor: "≥1",
  xor: "=1",
};

export function GateSymbol({ g }: { g: GateKind }) {
  const neg = g === "nand" || g === "nor" || g === "not";
  const two = g !== "not";
  return (
    <svg viewBox="0 0 96 64" className="h-16 w-24" role="img" aria-label={`${g.toUpperCase()} sembolü`}>
      {two ? (
        <>
          <line x1={0} y1={18} x2={22} y2={18} stroke={C} strokeWidth={2} />
          <line x1={0} y1={46} x2={22} y2={46} stroke={C} strokeWidth={2} />
        </>
      ) : (
        <line x1={0} y1={32} x2={22} y2={32} stroke={C} strokeWidth={2} />
      )}
      <rect x={22} y={8} width={40} height={48} fill="none" stroke={C} strokeWidth={2.5} />
      <text x={42} y={38} textAnchor="middle" fill={C} fontSize={15} fontWeight={700}>
        {LBL[g]}
      </text>
      {neg && <circle cx={67} cy={32} r={4.5} fill="none" stroke={C} strokeWidth={2.5} />}
      <line x1={neg ? 71.5 : 62} y1={32} x2={96} y2={32} stroke={C} strokeWidth={2} />
    </svg>
  );
}
