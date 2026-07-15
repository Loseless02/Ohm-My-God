import type { Part, PartType } from "./types";
import { RAIL_H } from "./types";

// Sembol renkleri
const C = {
  line: "#c7d2e0",
  mut: "#8b9aad",
  volt: "#fbbf24",
  spark: "#22d3ee",
  off: "#3a4a5e",
  blue: "#60a5fa",
};

interface SymProps {
  part: Part;
  closed?: boolean; // anahtarlar
  level?: number; // yükler / kapılar: 0..1
  energized?: boolean; // bobinler
  sim: boolean;
}

const lead = (x1: number, y1: number, x2: number, y2: number, key?: string) => (
  <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={2} />
);

/** Anahtar gövdesi: 0,0 üst terminal — 0,60 alt terminal. */
function SwitchBody({
  closed,
  nc,
  taster,
  timed,
  coupled,
}: {
  closed: boolean;
  nc?: boolean;
  taster?: boolean;
  timed?: boolean;
  coupled?: boolean; // eş kontak: mekanik bağ işareti
}) {
  const tip = closed ? { x: nc ? 5 : 0, y: 18 } : { x: 15, y: 23 };
  return (
    <>
      {lead(0, 0, 0, 18)}
      {lead(0, 42, 0, 60)}
      {nc && <line x1={0} y1={18} x2={9} y2={18} stroke={C.line} strokeWidth={2} />}
      <line x1={0} y1={42} x2={tip.x} y2={tip.y} stroke={C.line} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={0} cy={18} r={2.2} fill={C.line} />
      <circle cx={0} cy={42} r={2.2} fill={C.line} />
      {taster && (
        <>
          <line x1={-16} y1={30} x2={closed !== !!nc ? -4 : -7} y2={30} stroke={C.mut} strokeWidth={1.5} strokeDasharray="3 2" />
          <line x1={-16} y1={24} x2={-16} y2={36} stroke={C.mut} strokeWidth={2} />
          <line x1={-21} y1={24} x2={-21} y2={36} stroke={C.mut} strokeWidth={2} />
          <line x1={-21} y1={30} x2={-16} y2={30} stroke={C.mut} strokeWidth={2} />
        </>
      )}
      {coupled && (
        <line x1={-12} y1={20} x2={-12} y2={40} stroke={C.spark} strokeWidth={1.5} strokeDasharray="3 3" />
      )}
      {timed && <path d="M 4 50 a 7 7 0 0 1 14 0" fill="none" stroke={C.spark} strokeWidth={1.5} />}
    </>
  );
}

const TMODE_TXT: Record<string, string> = {
  ein: "EIN-verz.",
  aus: "AUS-verz.",
  impuls: "IMPULS",
  blink: "TAKT",
};

export function PartSymbol({ part, closed = false, level = 0, energized = false, sim }: SymProps) {
  const on = level > 0.8;
  const dim = level > 0.15 && level <= 0.8;
  switch (part.type) {
    case "source": {
      const off = part.enabled === false;
      const c = off ? C.off : C.volt;
      return (
        <>
          <rect x={0} y={0} width={80} height={40} rx={8} fill="#131c2a" stroke={c} strokeWidth={1.5} />
          <text x={40} y={17} textAnchor="middle" fill={c} fontSize={12} fontWeight={600}>
            ~ {part.volts ?? 230} V
          </text>
          <text x={12} y={33} textAnchor="middle" fill={C.mut} fontSize={10}>
            L
          </text>
          <text x={68} y={33} textAnchor="middle" fill={C.mut} fontSize={10}>
            N
          </text>
          {off && (
            <text x={40} y={33} textAnchor="middle" fill={C.mut} fontSize={9}>
              kapalı
            </text>
          )}
        </>
      );
    }
    case "source2": {
      const off = part.enabled === false;
      const c = off ? C.off : C.volt;
      return (
        <>
          {lead(0, 0, 0, 14)}
          {lead(0, 46, 0, 60)}
          <circle cx={0} cy={30} r={16} fill="#131c2a" stroke={c} strokeWidth={1.5} />
          <text x={0} y={35} textAnchor="middle" fill={c} fontSize={13} fontWeight={600}>
            ~
          </text>
          <text x={-21} y={8} textAnchor="end" fill={C.mut} fontSize={9}>
            L
          </text>
          <text x={-21} y={58} textAnchor="end" fill={C.mut} fontSize={9}>
            N
          </text>
          <text x={20} y={34} fill={off ? C.mut : C.volt} fontSize={9}>
            {off ? "kapalı" : `${part.volts ?? 230} V`}
          </text>
        </>
      );
    }
    case "rail_l":
    case "rail_n": {
      const isL = part.type === "rail_l";
      const c = isL ? C.volt : C.blue;
      return (
        <>
          <line x1={0} y1={0} x2={0} y2={RAIL_H} stroke={c} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
          <text x={0} y={-14} textAnchor="middle" fill={c} fontSize={15} fontWeight={700}>
            {isL ? "L" : "N"}
          </text>
          {isL && part.volts !== undefined && (
            <text x={0} y={RAIL_H + 22} textAnchor="middle" fill={C.mut} fontSize={9}>
              {part.volts} V
            </text>
          )}
        </>
      );
    }
    case "node":
      return <circle cx={0} cy={0} r={4} fill={C.line} stroke="#0c1220" strokeWidth={1} />;
    case "switch_no":
      return <SwitchBody closed={closed} />;
    case "switch_nc":
      return <SwitchBody closed={closed} nc />;
    case "taster_no":
      return <SwitchBody closed={closed} taster />;
    case "taster_nc":
      return <SwitchBody closed={closed} nc taster />;
    case "pairc_no":
      return <SwitchBody closed={closed} coupled />;
    case "pairc_nc":
      return <SwitchBody closed={closed} nc coupled />;
    case "contact_no":
      return <SwitchBody closed={closed} />;
    case "contact_nc":
      return <SwitchBody closed={closed} nc />;
    case "tcontact_no":
      return <SwitchBody closed={closed} timed />;
    case "tcontact_nc":
      return <SwitchBody closed={closed} nc timed />;
    case "lamp": {
      const g = sim && on ? C.volt : sim && dim ? "#a3894a" : C.off;
      return (
        <>
          {lead(0, 0, 0, 16)}
          {lead(0, 44, 0, 60)}
          <circle
            cx={0}
            cy={30}
            r={14}
            fill={sim && (on || dim) ? g : "transparent"}
            fillOpacity={on ? 0.85 : 0.45}
            stroke={C.line}
            strokeWidth={2}
            style={on ? { filter: "drop-shadow(0 0 10px rgba(251,191,36,0.9))" } : undefined}
          />
          <line x1={-9.9} y1={20.1} x2={9.9} y2={39.9} stroke={C.line} strokeWidth={2} />
          <line x1={9.9} y1={20.1} x2={-9.9} y2={39.9} stroke={C.line} strokeWidth={2} />
        </>
      );
    }
    case "motor": {
      return (
        <>
          {lead(0, 0, 0, 14)}
          {lead(0, 46, 0, 60)}
          <circle
            cx={0}
            cy={30}
            r={16}
            fill={sim && on ? "rgba(34,211,238,0.15)" : "transparent"}
            stroke={sim && on ? C.spark : C.line}
            strokeWidth={2}
            style={sim && on ? { filter: "drop-shadow(0 0 8px rgba(34,211,238,0.7))" } : undefined}
          />
          <text x={0} y={35} textAnchor="middle" fill={sim && on ? C.spark : C.line} fontSize={14} fontWeight={600}>
            M
          </text>
          {sim && dim && (
            <text x={0} y={54} textAnchor="middle" fill={C.mut} fontSize={8}>
              zayıf!
            </text>
          )}
        </>
      );
    }
    case "coil":
    case "tcoil": {
      const hot = sim && energized;
      return (
        <>
          {lead(0, 0, 0, 22)}
          {lead(0, 38, 0, 60)}
          <rect
            x={-14}
            y={22}
            width={28}
            height={16}
            fill={hot ? "rgba(251,191,36,0.25)" : "transparent"}
            stroke={hot ? C.volt : C.line}
            strokeWidth={2}
            style={hot ? { filter: "drop-shadow(0 0 8px rgba(251,191,36,0.6))" } : undefined}
          />
          {part.type === "tcoil" && (
            <>
              <text x={0} y={34} textAnchor="middle" fill={hot ? C.volt : C.mut} fontSize={9}>
                {part.delay ?? 3}s
              </text>
              <text x={17} y={48} fill={C.mut} fontSize={7}>
                {TMODE_TXT[part.tmode ?? "ein"]}
              </text>
            </>
          )}
          <text x={-19} y={22} textAnchor="end" fill={C.mut} fontSize={8}>
            A1
          </text>
          <text x={-19} y={42} textAnchor="end" fill={C.mut} fontSize={8}>
            A2
          </text>
        </>
      );
    }
    // ── Logik kapıları ──
    case "and":
    case "or":
    case "not":
    case "nand":
    case "nor":
    case "xor": {
      const neg = part.type === "nand" || part.type === "nor" || part.type === "not";
      const lbl =
        part.type === "and" || part.type === "nand"
          ? "&"
          : part.type === "or" || part.type === "nor"
            ? "≥1"
            : part.type === "xor"
              ? "=1"
              : "1";
      const two = part.type !== "not";
      const hot = sim && on;
      const stroke = hot ? C.volt : C.line;
      return (
        <>
          {two ? (
            <>
              {lead(0, 0, 10, 0)}
              {lead(0, 40, 10, 40)}
            </>
          ) : (
            lead(0, 20, 10, 20)
          )}
          <rect
            x={10}
            y={-6}
            width={38}
            height={52}
            fill={hot ? "rgba(251,191,36,0.12)" : "#131c2a"}
            stroke={stroke}
            strokeWidth={2}
            style={hot ? { filter: "drop-shadow(0 0 7px rgba(251,191,36,0.5))" } : undefined}
          />
          <text x={29} y={25} textAnchor="middle" fill={stroke} fontSize={13} fontWeight={600}>
            {lbl}
          </text>
          {neg && <circle cx={52} cy={20} r={4} fill="#131c2a" stroke={stroke} strokeWidth={2} />}
          {lead(neg ? 56 : 48, 20, 60, 20)}
        </>
      );
    }
  }
}

/** Palet önizlemesi için minik statik sembol. */
export function MiniSymbol({ type }: { type: PartType }) {
  const part: Part = { id: "mini", type, x: 0, y: 0, label: "" };
  const vb =
    type === "source"
      ? "-4 -4 88 48"
      : type === "node"
        ? "-12 -12 24 24"
        : ["and", "or", "not", "nand", "nor", "xor"].includes(type)
          ? "-4 -12 68 64"
          : "-28 -2 56 64";
  return (
    <svg viewBox={vb} className="h-9 w-9 shrink-0">
      <PartSymbol part={part} sim={false} closed={type.endsWith("_nc")} />
    </svg>
  );
}
