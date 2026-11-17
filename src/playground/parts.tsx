import { motion } from "motion/react";
import type { LedColor, Part, PartType } from "./types";
import { RAIL_H } from "./types";
import type { MotorState } from "./sim";
import { EL_TYPES, EL_VIEWBOX, ElSymbol } from "./parts-el";
import { useI18n } from "../i18n";

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
  motor?: MotorState; // trifaze motor
  burnt?: boolean; // bobin aşırı gerilimde
  hot?: number; // sıcaklık °C
}

const LED_C: Record<LedColor, string> = {
  red: "#f87171",
  green: "#4ade80",
  yellow: "#fbbf24",
  blue: "#60a5fa",
  white: "#e2e8f0",
};

/** Dönen pervane: hız 0..1, yön ±1. Kanatlar (cx,cy) etrafında simetrik. */
function Fan({ cx, cy, r, speed, dir, color }: { cx: number; cy: number; r: number; speed: number; dir: number; color: string }) {
  const blade = `M 0 0 C ${r * 0.25} ${-r * 0.35}, ${r * 0.2} ${-r * 0.85}, 0 ${-r} C ${-r * 0.35} ${-r * 0.8}, ${-r * 0.3} ${-r * 0.3}, 0 0 Z`;
  const turning = speed > 0.02;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g
        style={
          turning
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
      <circle r={r * 0.18} fill="#0c1220" stroke={color} strokeWidth={1.2} />
    </g>
  );
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
  thermal,
}: {
  closed: boolean;
  nc?: boolean;
  taster?: boolean;
  timed?: boolean;
  coupled?: boolean; // eş kontak: mekanik bağ işareti
  thermal?: boolean; // motor koruma yardımcı kontağı: bimetal işareti
}) {
  // bıçak pivotu (0,42): kapalıyken dik, açıkken 38° sağa yatık — yayla döner
  const angle = closed ? (nc ? 12 : 0) : 38;
  return (
    <>
      {lead(0, 0, 0, 18)}
      {lead(0, 42, 0, 60)}
      {nc && <line x1={0} y1={18} x2={9} y2={18} stroke={C.line} strokeWidth={2} />}
      <g transform="translate(0 42)">
        <motion.g
          initial={false}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 650, damping: 26 }}
        >
          <line x1={0} y1={0} x2={0} y2={-24} stroke={C.line} strokeWidth={2.4} strokeLinecap="round" />
        </motion.g>
      </g>
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
      {thermal && (
        <>
          <line x1={-14} y1={30} x2={-5} y2={30} stroke={C.mut} strokeWidth={1.5} strokeDasharray="3 2" />
          <path d="M -26 24 h 6 v 6 h 6 v 6" fill="none" stroke={C.mut} strokeWidth={1.6} />
        </>
      )}
    </>
  );
}

const TMODE_TXT: Record<string, string> = {
  ein: "EIN-verz.",
  aus: "AUS-verz.",
  impuls: "IMPULS",
  blink: "TAKT",
  treppe: "TREPPE",
};

/** Üç kutuplu anahtar (ana kontak / motor koruma şalteri): 0,40,80 sütunları. */
function Pole3({ closed, manual }: { closed: boolean; manual?: boolean }) {
  return (
    <>
      {[0, 40, 80].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <SwitchBody closed={closed} />
        </g>
      ))}
      <line x1={-4} y1={30} x2={86} y2={30} stroke={C.spark} strokeWidth={1.3} strokeDasharray="3 3" opacity={0.8} />
      {manual && (
        <>
          <text x={94} y={22} fill={C.mut} fontSize={8}>
            I&gt;
          </text>
          <path d="M 93 30 h 4 v 4 h 4 v 4" fill="none" stroke={C.mut} strokeWidth={1.3} />
        </>
      )}
    </>
  );
}

export function PartSymbol({ part, closed = false, level = 0, energized = false, sim, motor, burnt, hot }: SymProps) {
  const offText = useI18n().t("pg.off");
  if (EL_TYPES.has(part.type))
    return <ElSymbol part={part} sim={sim} level={level} closed={closed} motor={motor} hot={hot} broken={burnt} />;
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
            {off ? offText : `${part.volts ?? 230} V`}
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
      // parlaklık gerçek güce bağlı: az güçte koyu turuncu, anma gücünde sarı, fazlasında beyaz
      const lv = sim && !burnt ? Math.max(0, level) : 0;
      const g = lv > 1.15 ? "#fff7d6" : lv > 0.6 ? C.volt : lv > 0.25 ? "#d98c2b" : "#8a4a1c";
      const blur = Math.min(18, 3 + 12 * Math.min(1.5, lv));
      return (
        <>
          {lead(0, 0, 0, 16)}
          {lead(0, 44, 0, 60)}
          <circle
            cx={0}
            cy={30}
            r={14}
            fill={lv > 0.03 ? g : burnt && sim ? "#1c1414" : "transparent"}
            fillOpacity={Math.min(0.95, 0.15 + lv * 0.75)}
            stroke={burnt && sim ? "#6b4040" : C.line}
            strokeWidth={2}
            style={{
              transition: "fill 0.2s ease, fill-opacity 0.2s ease, filter 0.25s ease",
              filter: lv > 0.08 ? `drop-shadow(0 0 ${blur}px rgba(251,191,36,${Math.min(0.95, lv)}))` : "none",
            }}
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
          {sim && level > 0.15 ? (
            <Fan cx={0} cy={30} r={13} speed={level} dir={1} color={on ? C.spark : C.mut} />
          ) : (
            <text x={0} y={35} textAnchor="middle" fill={C.line} fontSize={14} fontWeight={600}>
              M
            </text>
          )}
          {sim && dim && (
            <text x={0} y={54} textAnchor="middle" fill={C.mut} fontSize={8}>
              zayıf!
            </text>
          )}
        </>
      );
    }
    case "coil":
    case "relay_ss":
    case "tcoil": {
      const hot = sim && energized;
      const fried = sim && burnt;
      return (
        <>
          {lead(0, 0, 0, 22)}
          {lead(0, 38, 0, 60)}
          <rect
            x={-14}
            y={22}
            width={28}
            height={16}
            fill={fried ? "rgba(248,113,113,0.3)" : hot ? "rgba(251,191,36,0.25)" : "transparent"}
            stroke={fried ? "#f87171" : hot ? C.volt : C.line}
            strokeWidth={2}
            style={{
              transition: "fill 0.3s ease, stroke 0.3s ease, filter 0.35s ease",
              filter: hot
                ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))"
                : "drop-shadow(0 0 0px rgba(251,191,36,0))",
            }}
          />
          {part.type === "relay_ss" && (
            <>
              <path d="M -9 34 h 4 v -8 h 6 v 8 h 4" fill="none" stroke={hot ? C.volt : C.mut} strokeWidth={1.3} />
              <circle cx={19} cy={30} r={3} fill={sim && closed ? C.volt : "transparent"} stroke={C.mut} strokeWidth={1} />
            </>
          )}
          {part.type !== "tcoil" && (part.volts ?? 230) !== 230 && (
            <text x={17} y={48} fill={C.mut} fontSize={8}>
              {part.volts} V
            </text>
          )}
          {fried && (
            <text x={0} y={16} textAnchor="middle" fontSize={10}>
              🔥
            </text>
          )}
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
    case "contact_co": {
      // 11 altta (ortak), 12 üstte solda (açıcı), 14 üstte sağda (kapayıcı)
      return (
        <>
          {lead(0, 42, 0, 60)}
          {lead(0, 0, 0, 18)}
          {lead(20, 0, 20, 20)}
          <line x1={0} y1={18} x2={7} y2={18} stroke={C.line} strokeWidth={2} />
          <g transform="translate(0 42)">
            <motion.g
              initial={false}
              animate={{ rotate: closed ? 40 : 0 }}
              transition={{ type: "spring", stiffness: 650, damping: 26 }}
            >
              <line x1={0} y1={0} x2={0} y2={-26} stroke={C.line} strokeWidth={2.4} strokeLinecap="round" />
            </motion.g>
          </g>
          <circle cx={0} cy={42} r={2.2} fill={C.line} />
          <circle cx={20} cy={20} r={2} fill={C.line} />
        </>
      );
    }
    case "ol_nc":
      return <SwitchBody closed={closed} nc thermal />;
    case "ol_no":
      return <SwitchBody closed={closed} thermal />;
    case "led": {
      const col = LED_C[part.color ?? "red"];
      const lit = sim && level > 0.15;
      return (
        <>
          {lead(0, 0, 0, 20)}
          {lead(0, 38, 0, 60)}
          <path
            d="M -10 20 L 10 20 L 0 38 Z"
            fill={lit ? col : "transparent"}
            fillOpacity={lit ? Math.min(1, 0.35 + level) : 0}
            stroke={lit ? col : C.line}
            strokeWidth={2}
            strokeLinejoin="round"
            style={{
              transition: "fill-opacity 0.15s ease, filter 0.2s ease",
              filter: lit ? `drop-shadow(0 0 9px ${col})` : "none",
            }}
          />
          <line x1={-10} y1={38} x2={10} y2={38} stroke={lit ? col : C.line} strokeWidth={2} />
          <path d="M 9 26 l 9 -7 m -4 0 h 4 v 4 M 12 33 l 9 -7 m -4 0 h 4 v 4" fill="none" stroke={lit ? col : C.mut} strokeWidth={1.3} />
        </>
      );
    }
    case "fluo": {
      const lit = sim && level > 0.6;
      return (
        <>
          {lead(0, 0, 0, 8)}
          {lead(0, 52, 0, 60)}
          <rect
            x={-8}
            y={8}
            width={16}
            height={44}
            rx={7}
            fill={lit ? "#dff7ff" : "transparent"}
            stroke={lit ? "#a5f3fc" : C.line}
            strokeWidth={2}
            className={lit ? "pg-fluo-on" : undefined}
            style={lit ? { filter: "drop-shadow(0 0 10px rgba(165,243,252,0.85))" } : undefined}
          />
          <line x1={-4} y1={14} x2={4} y2={14} stroke={C.mut} strokeWidth={1.5} />
          <line x1={-4} y1={46} x2={4} y2={46} stroke={C.mut} strokeWidth={1.5} />
        </>
      );
    }
    case "netz3": {
      const off = part.enabled === false;
      const c = off ? C.off : C.volt;
      return (
        <>
          <rect x={-14} y={-42} width={148} height={30} rx={7} fill="#131c2a" stroke={c} strokeWidth={1.5} />
          <text x={60} y={-31} textAnchor="middle" fill={c} fontSize={9} fontWeight={600}>
            3/N ~ 50 Hz 400/230 V
          </text>
          {["L1", "L2", "L3", "N"].map((l, i) => (
            <g key={l}>
              {lead(i * 40, -12, i * 40, 0)}
              <text x={i * 40} y={-17} textAnchor="middle" fill={i === 3 ? C.blue : C.mut} fontSize={9} fontWeight={600}>
                {l}
              </text>
            </g>
          ))}
          {off && (
            <text x={140} y={-24} fill={C.mut} fontSize={9}>
              {offText}
            </text>
          )}
        </>
      );
    }
    case "contact3":
      return <Pole3 closed={closed} />;
    case "q3":
      return <Pole3 closed={closed} manual />;
    case "ol3": {
      const trip = sim && !closed;
      const c = trip ? "#f87171" : C.line;
      return (
        <>
          {[0, 40, 80].map((x) => (
            <g key={x}>
              {lead(x, 0, x, 18)}
              {lead(x, 42, x, 60)}
              <rect x={x - 7} y={18} width={14} height={24} fill="transparent" stroke={c} strokeWidth={1.8} />
              <path d={`M ${x - 4} 36 h 4 v -12 h 4`} fill="none" stroke={c} strokeWidth={1.4} />
            </g>
          ))}
          <line x1={-12} y1={30} x2={-7} y2={30} stroke={C.mut} strokeWidth={1.3} strokeDasharray="3 2" />
          {trip && (
            <text x={40} y={74} textAnchor="middle" fill="#f87171" fontSize={8} fontWeight={700}>
              ⚠ ausgelöst
            </text>
          )}
        </>
      );
    }
    case "motor3": {
      const ms = sim ? motor : undefined;
      const run = !!ms && ms.speed > 0.02;
      const hum = !!ms?.fault;
      const c = hum ? "#f87171" : run ? C.spark : C.line;
      const k = 26 * Math.SQRT1_2;
      return (
        <>
          {lead(0, 0, 0, 18)}
          <line x1={0} y1={18} x2={40 - k} y2={50 - k} stroke={C.line} strokeWidth={2} />
          {lead(40, 0, 40, 24)}
          {lead(80, 0, 80, 18)}
          <line x1={80} y1={18} x2={40 + k} y2={50 - k} stroke={C.line} strokeWidth={2} />
          {lead(0, 100, 0, 82)}
          <line x1={0} y1={82} x2={40 - k} y2={50 + k} stroke={C.line} strokeWidth={2} />
          {lead(40, 100, 40, 76)}
          {lead(80, 100, 80, 82)}
          <line x1={80} y1={82} x2={40 + k} y2={50 + k} stroke={C.line} strokeWidth={2} />
          <circle
            cx={40}
            cy={50}
            r={26}
            fill={run ? "rgba(34,211,238,0.1)" : "#0c1220"}
            stroke={c}
            strokeWidth={2}
            className={hum ? "pg-hum" : undefined}
            style={run ? { filter: "drop-shadow(0 0 8px rgba(34,211,238,0.6))" } : undefined}
          />
          {run ? (
            <Fan cx={40} cy={50} r={21} speed={ms!.speed} dir={ms!.dir} color={C.spark} />
          ) : (
            <text x={40} y={55} textAnchor="middle" fill={c} fontSize={13} fontWeight={600}>
              M 3~
            </text>
          )}
          {["U1", "V1", "W1"].map((l, i) => (
            <text key={l} x={i * 40 + 4} y={11} fill={C.mut} fontSize={7}>
              {l}
            </text>
          ))}
          {["U2", "V2", "W2"].map((l, i) => (
            <text key={l} x={i * 40 + 4} y={96} fill={C.mut} fontSize={7}>
              {l}
            </text>
          ))}
          {part.conn === "Y" && <line x1={0} y1={92} x2={80} y2={92} stroke={C.volt} strokeWidth={2} opacity={0.8} />}
          {part.conn === "D" && (
            <text x={88} y={56} fill={C.volt} fontSize={11} fontWeight={700}>
              Δ
            </text>
          )}
          {run && (
            <text x={88} y={70} fill={C.spark} fontSize={8} fontWeight={600}>
              {ms!.dir > 0 ? "↻" : "↺"} {ms!.speed < 0.8 ? "Y" : "Δ"}
            </text>
          )}
          {hum && (
            <text x={40} y={88} textAnchor="middle" fill="#f87171" fontSize={8} fontWeight={700}>
              Phase?!
            </text>
          )}
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
            style={{
              transition: "fill 0.25s ease, stroke 0.25s ease, filter 0.3s ease",
              filter: hot
                ? "drop-shadow(0 0 7px rgba(251,191,36,0.5))"
                : "drop-shadow(0 0 0px rgba(251,191,36,0))",
            }}
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
  const vb = EL_VIEWBOX[type] ??
    (type === "source"
      ? "-4 -4 88 48"
      : type === "netz3"
        ? "-18 -46 156 50"
        : type === "contact3" || type === "ol3" || type === "q3"
          ? "-16 -4 124 68"
          : type === "motor3"
            ? "-14 -4 112 108"
            : type === "contact_co"
              ? "-18 -2 46 64"
              : type === "node"
        ? "-12 -12 24 24"
        : ["and", "or", "not", "nand", "nor", "xor"].includes(type)
          ? "-4 -12 68 64"
          : "-28 -2 56 64");
  return (
    <svg viewBox={vb} className="h-9 w-9 shrink-0">
      <PartSymbol part={part} sim={false} closed={type.endsWith("_nc")} />
    </svg>
  );
}
