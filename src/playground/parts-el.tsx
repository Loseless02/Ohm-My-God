// Elektronik ve ayarlı yük sembolleri (DIN EN 60617 esinli, sade çizim).
import type { Part } from "./types";
import { BUS_W } from "./types";
import { pn, ps } from "./params";
import type { MotorState } from "./sim";

const C = {
  line: "#c7d2e0",
  mut: "#8b9aad",
  volt: "#fbbf24",
  spark: "#22d3ee",
  off: "#3a4a5e",
  blue: "#60a5fa",
  red: "#f87171",
};
const LED_C: Record<string, string> = {
  red: "#f87171",
  green: "#4ade80",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  white: "#e2e8f0",
};

const L = (x1: number, y1: number, x2: number, y2: number, c = C.line, w = 2) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />
);
const Tx = ({ x, y, t, c = C.mut, s = 8, a = "middle" }: { x: number; y: number; t: string; c?: string; s?: number; a?: "start" | "middle" | "end" }) => (
  <text x={x} y={y} fill={c} fontSize={s} textAnchor={a} fontWeight={600}>
    {t}
  </text>
);

function Fan({ cx, cy, r, speed, dir, color }: { cx: number; cy: number; r: number; speed: number; dir: number; color: string }) {
  const blade = `M 0 0 C ${r * 0.25} ${-r * 0.35}, ${r * 0.2} ${-r * 0.85}, 0 ${-r} C ${-r * 0.35} ${-r * 0.8}, ${-r * 0.3} ${-r * 0.3}, 0 0 Z`;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g
        style={
          speed > 0.02
            ? {
                animationName: "pg-spin",
                animationDuration: `${(0.22 / Math.max(0.15, speed)).toFixed(2)}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDirection: dir < 0 ? "reverse" : "normal",
                transformBox: "view-box",
                transformOrigin: "0px 0px",
              }
            : undefined
        }
      >
        {[0, 120, 240].map((a) => (
          <path key={a} d={blade} transform={`rotate(${a})`} fill={color} fillOpacity={0.55} stroke={color} strokeWidth={1} />
        ))}
      </g>
    </g>
  );
}

const fmtV = (v: number) => (Math.abs(v) >= 1000 ? `${+(v / 1000).toFixed(1)} kV` : `${+v.toFixed(2)} V`);

export interface ElProps {
  part: Part;
  sim: boolean;
  level: number;
  closed: boolean;
  motor?: MotorState;
  hot?: number; // sıcaklık (°C)
  broken?: boolean;
  el?: boolean; // elektronik modu (bara etiketleri)
}

/** Bu dosyanın çizdiği tipler. */
export const EL_TYPES = new Set([
  "bus_l",
  "bus_n",
  "fuse",
  "heater",
  "res",
  "pot",
  "cap",
  "ecap",
  "ind",
  "diode",
  "zener",
  "led_d",
  "bridge",
  "npn",
  "pnp",
  "nmos",
  "reg",
  "xfmr",
  "opamp",
  "mcu",
  "fgen",
  "ldr",
  "ntc",
  "dcmotor",
]);

export function ElSymbol({ part, sim, level, closed, motor, hot, broken }: ElProps) {
  const p = part;
  const dead = sim && broken;
  const stroke = dead ? "#6b4040" : C.line;
  switch (p.type) {
    case "bus_l":
    case "bus_n": {
      const isL = p.type === "bus_l";
      const c = isL ? C.red : C.blue;
      const ac = ps(p, "ac") === "ac";
      return (
        <>
          <line x1={0} y1={0} x2={BUS_W} y2={0} stroke={c} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
          <text x={-14} y={5} textAnchor="end" fill={c} fontSize={15} fontWeight={700}>
            {p.label || (isL ? "L" : "N")}
          </text>
          {isL && (
            <text x={-14} y={22} textAnchor="end" fill={sim && !closed ? C.red : C.mut} fontSize={9}>
              {sim && !closed ? "⚡ kapalı" : `${ac ? "~" : "="} ${fmtV(pn(p, "U"))}`}
            </text>
          )}
        </>
      );
    }
    case "res":
    case "ldr":
    case "ntc":
    case "heater": {
      const glow = p.type === "heater" && sim ? Math.min(1, level) : 0;
      const tHot = hot !== undefined && hot > 80 ? Math.min(1, (hot - 80) / 250) : 0;
      return (
        <>
          {L(0, 0, 0, 14, stroke)}
          {L(0, 46, 0, 60, stroke)}
          <rect
            x={-7}
            y={14}
            width={14}
            height={32}
            rx={1.5}
            fill={glow > 0.05 ? `rgba(248,113,113,${0.2 + 0.6 * glow})` : tHot ? `rgba(251,146,60,${tHot * 0.7})` : dead ? "#1c1414" : "transparent"}
            stroke={stroke}
            strokeWidth={2}
            style={glow > 0.3 ? { filter: "drop-shadow(0 0 8px rgba(248,113,113,0.8))" } : undefined}
          />
          {p.type === "heater" && <path d="M -3 20 q 3 3 0 6 t 0 6 t 0 6" fill="none" stroke={C.mut} strokeWidth={1.2} />}
          {p.type === "ldr" && (
            <path d="M -22 8 l 10 8 m -4 0 h 4 v -4 M -24 18 l 10 8 m -4 0 h 4 v -4" fill="none" stroke={C.volt} strokeWidth={1.3} />
          )}
          {p.type === "ntc" && (
            <>
              <path d="M -13 48 L -4 40 L 12 12" fill="none" stroke={C.mut} strokeWidth={1.3} />
              <Tx x={14} y={50} t="−ϑ" a="start" />
            </>
          )}
          {p.type === "res" && dead && <Tx x={12} y={20} t="💨" s={11} a="start" />}
        </>
      );
    }
    case "fuse":
      return (
        <>
          {L(0, 0, 0, 14, stroke)}
          {L(0, 46, 0, 60, stroke)}
          <rect x={-6} y={14} width={12} height={32} rx={1.5} fill="transparent" stroke={stroke} strokeWidth={2} />
          {dead ? (
            <>
              {L(0, 14, 0, 26, C.red, 1.5)}
              {L(0, 34, 0, 46, C.red, 1.5)}
            </>
          ) : (
            L(0, 14, 0, 46, stroke, 1.5)
          )}
          <Tx x={10} y={34} t={`${pn(p, "In")}A ${ps(p, "ch")}`} a="start" s={7} />
        </>
      );
    case "pot": {
      const pos = Math.min(1, Math.max(0, pn(p, "pos")));
      const wy = 18 + 44 * (1 - pos);
      return (
        <>
          {L(0, 0, 0, 16, stroke)}
          {L(0, 64, 0, 80, stroke)}
          <rect x={-7} y={16} width={14} height={48} rx={1.5} fill="transparent" stroke={stroke} strokeWidth={2} />
          <path d={`M 40 40 H 26 V ${wy} H 12`} fill="none" stroke={C.spark} strokeWidth={1.6} />
          <path d={`M 12 ${wy} l 6 -4 v 8 z`} fill={C.spark} />
        </>
      );
    }
    case "cap":
    case "ecap": {
      const pol = p.type === "ecap";
      return (
        <>
          {L(0, 0, 0, 26, stroke)}
          {L(0, 34, 0, 60, stroke)}
          {L(-13, 26, 13, 26, stroke, 2.6)}
          {pol ? <rect x={-13} y={32} width={26} height={4} fill={stroke} /> : L(-13, 34, 13, 34, stroke, 2.6)}
          {pol && <Tx x={-17} y={22} t="+" s={10} />}
          {dead && <Tx x={16} y={30} t="💥" s={11} a="start" />}
        </>
      );
    }
    case "ind":
      return (
        <>
          {L(0, 0, 0, 12, stroke)}
          {L(0, 48, 0, 60, stroke)}
          <path d="M 0 12 a 6 4.5 0 0 1 0 9 a 6 4.5 0 0 1 0 9 a 6 4.5 0 0 1 0 9 a 6 4.5 0 0 1 0 9" fill="none" stroke={stroke} strokeWidth={2} />
        </>
      );
    case "diode":
    case "zener":
    case "led_d": {
      const isLed = p.type === "led_d";
      const col = LED_C[p.color ?? "red"] ?? C.red;
      const lit = isLed && sim && level > 0.03 && !dead;
      const a = Math.min(1, 0.25 + level);
      return (
        <>
          {L(0, 0, 0, 20, stroke)}
          {L(0, 38, 0, 60, stroke)}
          <path
            d="M -10 20 L 10 20 L 0 38 Z"
            fill={lit ? col : "transparent"}
            fillOpacity={lit ? a : 0}
            stroke={lit ? col : stroke}
            strokeWidth={2}
            strokeLinejoin="round"
            style={lit ? { filter: `drop-shadow(0 0 ${4 + 10 * Math.min(1, level)}px ${col})` } : undefined}
          />
          {p.type === "zener" ? (
            <path d="M -14 34 L -10 38 L 10 38 L 14 42" fill="none" stroke={stroke} strokeWidth={2} />
          ) : (
            L(-10, 38, 10, 38, lit ? col : stroke)
          )}
          {isLed && <path d="M 9 26 l 9 -7 m -4 0 h 4 v 4 M 12 33 l 9 -7 m -4 0 h 4 v 4" fill="none" stroke={lit ? col : C.mut} strokeWidth={1.3} />}
          {dead && <Tx x={-16} y={32} t="✕" c={C.red} s={11} />}
        </>
      );
    }
    case "bridge":
      return (
        <>
          <path d="M 40 6 L 74 40 L 40 74 L 6 40 Z" fill="#131c2a" stroke={stroke} strokeWidth={2} />
          {L(0, 40, 6, 40, stroke)}
          {L(74, 40, 80, 40, stroke)}
          {L(40, 0, 40, 6, stroke)}
          {L(40, 74, 40, 80, stroke)}
          <path d="M 32 32 l 12 0 l -6 8 z" fill={stroke} />
          {L(32, 42, 44, 42, stroke, 1.5)}
          <Tx x={14} y={36} t="~" s={10} />
          <Tx x={66} y={36} t="~" s={10} />
          <Tx x={50} y={14} t="+" s={10} />
          <Tx x={50} y={74} t="−" s={10} />
        </>
      );
    case "npn":
    case "pnp": {
      const npn = p.type === "npn";
      return (
        <>
          <circle cx={-2} cy={40} r={20} fill="#0c1220" stroke={stroke} strokeWidth={1.6} />
          {L(-40, 40, -10, 40, stroke)}
          {L(-10, 27, -10, 53, stroke, 2.6)}
          {L(-10, 34, 0, 22, stroke)}
          {L(0, 22, 0, 0, stroke)}
          {L(-10, 46, 0, 58, stroke)}
          {L(0, 58, 0, 80, stroke)}
          {npn ? (
            <path d={`M 0 58 l -7 -1.5 l 3.5 -5 z`} fill={stroke} />
          ) : (
            <path d={`M -10 34 l 7 1.5 l -3.5 5 z`} fill={stroke} />
          )}
          <Tx x={-30} y={34} t="B" />
          <Tx x={8} y={12} t={npn ? "C" : "E"} a="start" />
          <Tx x={8} y={74} t={npn ? "E" : "C"} a="start" />
          {dead && <Tx x={18} y={44} t="💥" s={11} a="start" />}
        </>
      );
    }
    case "nmos":
      return (
        <>
          <circle cx={-2} cy={40} r={20} fill="#0c1220" stroke={stroke} strokeWidth={1.6} />
          {L(-40, 40, -14, 40, stroke)}
          {L(-14, 28, -14, 52, stroke, 2.2)}
          {L(-8, 26, -8, 34, stroke, 2.4)}
          {L(-8, 37, -8, 43, stroke, 2.4)}
          {L(-8, 46, -8, 54, stroke, 2.4)}
          {L(-8, 30, 0, 30, stroke)}
          {L(0, 30, 0, 0, stroke)}
          {L(-8, 50, 0, 50, stroke)}
          {L(0, 50, 0, 80, stroke)}
          {L(-8, 40, 0, 40, stroke, 1.5)}
          {L(0, 40, 0, 50, stroke, 1.5)}
          <path d="M -8 40 l 5 -3 v 6 z" fill={stroke} />
          <Tx x={-30} y={34} t="G" />
          <Tx x={8} y={12} t="D" a="start" />
          <Tx x={8} y={74} t="S" a="start" />
          {dead && <Tx x={18} y={44} t="💥" s={11} a="start" />}
        </>
      );
    case "reg": {
      const hotC = hot !== undefined && hot > 100;
      return (
        <>
          <rect x={10} y={-16} width={60} height={32} rx={3} fill={hotC ? "rgba(248,113,113,0.2)" : "#131c2a"} stroke={hotC ? C.red : stroke} strokeWidth={2} />
          {L(0, 0, 10, 0, stroke)}
          {L(70, 0, 80, 0, stroke)}
          {L(40, 16, 40, 40, stroke)}
          <Tx x={40} y={3} t={`78${String(Math.round(pn(p, "Uo"))).padStart(2, "0")}`} c={C.line} s={10} />
          <Tx x={16} y={12} t="IN" s={6} a="start" />
          <Tx x={64} y={12} t="OUT" s={6} a="end" />
          <Tx x={46} y={30} t="GND" s={6} a="start" />
        </>
      );
    }
    case "xfmr":
      return (
        <>
          {L(0, 0, 0, 12, stroke)}
          {L(0, 68, 0, 80, stroke)}
          {L(60, 0, 60, 12, stroke)}
          {L(60, 68, 60, 80, stroke)}
          <path d="M 0 12 a 8 7 0 0 1 0 14 a 8 7 0 0 1 0 14 a 8 7 0 0 1 0 14 a 8 7 0 0 1 0 14" fill="none" stroke={stroke} strokeWidth={2} />
          <path d="M 60 12 a 8 7 0 0 0 0 14 a 8 7 0 0 0 0 14 a 8 7 0 0 0 0 14 a 8 7 0 0 0 0 14" fill="none" stroke={stroke} strokeWidth={2} />
          {L(26, 10, 26, 70, C.mut, 1.6)}
          {L(34, 10, 34, 70, C.mut, 1.6)}
          <Tx x={-10} y={44} t={`${pn(p, "U1")}V`} a="end" s={7} />
          <Tx x={70} y={44} t={`${pn(p, "U2")}V`} a="start" s={7} />
        </>
      );
    case "opamp":
      return (
        <>
          <path d="M 10 -10 L 10 50 L 70 20 Z" fill="#131c2a" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
          {L(0, 0, 10, 0, stroke)}
          {L(0, 40, 10, 40, stroke)}
          {L(70, 20, 80, 20, stroke)}
          {L(40, -20, 40, 5, stroke)}
          {L(40, 60, 40, 35, stroke)}
          <Tx x={17} y={4} t="−" s={11} />
          <Tx x={17} y={44} t="+" s={11} />
          <Tx x={46} y={-12} t="V+" s={6} a="start" />
          <Tx x={46} y={56} t="V−" s={6} a="start" />
        </>
      );
    case "mcu": {
      const pins = ["P1", "P2", "P3", "P4"];
      return (
        <>
          <rect x={10} y={0} width={80} height={100} rx={4} fill="#0f1d16" stroke={stroke} strokeWidth={2} />
          <rect x={24} y={34} width={36} height={30} rx={2} fill="#111" stroke={C.mut} strokeWidth={1} />
          <Tx x={42} y={53} t="µC" c={C.line} s={9} />
          {L(0, 20, 10, 20, stroke)}
          {L(0, 80, 10, 80, stroke)}
          <Tx x={14} y={23} t="VCC" s={6} a="start" />
          <Tx x={14} y={83} t="GND" s={6} a="start" />
          {pins.map((n, i) => (
            <g key={n}>
              {L(90, 20 + i * 20, 100, 20 + i * 20, stroke)}
              <Tx x={86} y={23 + i * 20} t={n} s={6} a="end" />
            </g>
          ))}
          <Tx x={50} y={14} t={ps(p, "prog")} s={6} />
        </>
      );
    }
    case "fgen":
      return (
        <>
          {L(0, 0, 0, 12, stroke)}
          {L(0, 48, 0, 60, stroke)}
          <circle cx={0} cy={30} r={18} fill="#131c2a" stroke={C.volt} strokeWidth={1.5} />
          <path
            d={
              ps(p, "wave") === "square"
                ? "M -10 34 v -8 h 7 v 8 h 7 v -8 h 6"
                : ps(p, "wave") === "tri"
                  ? "M -11 34 l 6 -8 l 6 8 l 6 -8 l 4 5"
                  : ps(p, "wave") === "dc"
                    ? "M -10 30 h 20"
                    : "M -11 30 q 5.5 -12 11 0 t 11 0"
            }
            fill="none"
            stroke={C.volt}
            strokeWidth={1.6}
          />
          <Tx x={22} y={26} t={`${pn(p, "Up")}V`} a="start" s={7} />
          <Tx x={22} y={36} t={`${pn(p, "f")}Hz`} a="start" s={7} />
          <Tx x={-8} y={8} t="+" s={9} />
        </>
      );
    case "dcmotor": {
      const run = !!motor && motor.speed > 0.02;
      return (
        <>
          {L(0, 0, 0, 14, stroke)}
          {L(0, 46, 0, 60, stroke)}
          <circle cx={0} cy={30} r={16} fill={run ? "rgba(34,211,238,0.12)" : "#0c1220"} stroke={run ? C.spark : stroke} strokeWidth={2} />
          {run ? (
            <Fan cx={0} cy={30} r={13} speed={motor!.speed} dir={motor!.dir} color={C.spark} />
          ) : (
            <>
              <Tx x={0} y={33} t="M" c={C.line} s={12} />
              <Tx x={0} y={42} t="=" c={C.line} s={9} />
            </>
          )}
        </>
      );
    }
  }
  return null;
}

/** Palet önizleme kutuları. */
export const EL_VIEWBOX: Record<string, string> = {
  bus_l: "-30 -20 200 40",
  bus_n: "-30 -20 200 40",
  pot: "-20 -2 64 86",
  bridge: "-4 -4 88 88",
  npn: "-44 -4 70 88",
  pnp: "-44 -4 70 88",
  nmos: "-44 -4 70 88",
  reg: "-4 -20 88 64",
  xfmr: "-14 -4 88 88",
  opamp: "-4 -24 88 88",
  mcu: "-4 -4 108 108",
};
