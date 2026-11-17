// Ölçü aleti: sürüklenebilen cihaz. Ortadaki döner anahtar fareyle tutulup çevrilir.
// Prob kabloları alttaki COM / VΩ soketlerinden çıkar (kablolar Playground'da çizilir).
import { useEffect, useRef, useState } from "react";
import type { PartReading, Reading } from "./engine";
import type { Contact } from "./Board";

export type MeterMode = "OFF" | "V~" | "V=" | "Ω" | "A" | "W" | "Hz" | "°C";
const MODES: MeterMode[] = ["OFF", "V~", "V=", "Ω", "A", "W", "Hz", "°C"];
const SPAN = 270; // döner anahtarın tarama açısı
const angOf = (i: number) => -SPAN / 2 + (SPAN / (MODES.length - 1)) * i;

export const METER_W = 220;
export const METER_H = 410;
/** Soketlerin cihaz içindeki konumu (kablolar buradan çıkar). */
export const JACK = { black: { x: 82, y: 382 }, red: { x: 138, y: 382 } };

/** Otomatik kademeli, 3 ondalık: 0,021268 A → "21,268 mA". */
export function fmt3(v: number, unit: string): string {
  if (!Number.isFinite(v)) return "OL";
  const a = Math.abs(v);
  const [m, p] = a >= 1e6 ? [1e6, "M"] : a >= 1e3 ? [1e3, "k"] : a >= 1 || a === 0 ? [1, ""] : a >= 1e-3 ? [1e-3, "m"] : [1e-6, "µ"];
  return `${(v / m).toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} ${p}${unit}`;
}

export interface MeterData {
  red: Contact | null;
  black: Contact | null;
  v: Reading | null;
  part: (PartReading & { name: string; R?: number }) | null;
  wire: { rms: number; dc: number } | null;
  same: boolean;
}

function valueFor(mode: MeterMode, d: MeterData): { main: string; sub: string } {
  const { v, part, wire } = d;
  const both = !!d.red && !!d.black;
  switch (mode) {
    case "OFF":
      return { main: "", sub: "" };
    case "V~":
      return v ? { main: fmt3(v.ac, "V"), sub: `AC · f ${v.f ? v.f.toFixed(1) : "0"} Hz · = ${fmt3(v.dc, "V")}` } : { main: both ? "----" : "0,000 V", sub: "AC TRUE RMS" };
    case "V=":
      return v ? { main: fmt3(v.dc, "V"), sub: `DC · ~ ${fmt3(v.ac, "V")}` } : { main: both ? "----" : "0,000 V", sub: "DC" };
    case "Ω":
      if (d.same) return { main: fmt3(0, "Ω"), sub: "kısa devre / aynı nokta" };
      if (part?.R !== undefined) return { main: Number.isFinite(part.R) ? fmt3(part.R, "Ω") : "OL", sub: part.name };
      return { main: "OL", sub: "parçanın iki ucuna değdir" };
    case "A": {
      const pick = (rms: number, dc: number) => (Math.abs(dc) > 0.9 * rms && rms > 0 ? { val: dc, k: "DC" } : { val: rms, k: "AC" });
      if (part) {
        const r = pick(part.I, part.Idc);
        return { main: fmt3(r.val, "A"), sub: `${r.k} · ${part.name}` };
      }
      if (wire) {
        const r = pick(wire.rms, wire.dc);
        return { main: fmt3(r.val, "A"), sub: `${r.k} · kablo akımı` };
      }
      return { main: "0,000 A", sub: "parçanın iki ucuna ya da aynı kabloya değdir" };
    }
    case "W":
      return part ? { main: fmt3(part.P, "W"), sub: part.name } : { main: "----", sub: "parçanın iki ucuna değdir" };
    case "Hz":
      return v ? { main: fmt3(v.f, "Hz"), sub: `~ ${fmt3(v.ac, "V")}` } : { main: "----", sub: "frekans" };
    case "°C":
      if (part?.T !== undefined) return { main: `${part.T.toFixed(1)} °C`, sub: part.name };
      if (part?.rpm !== undefined) return { main: `${part.rpm.toFixed(0)} 1/min`, sub: `devir · ${part.name}` };
      return { main: "----", sub: "sıcaklık / devir" };
  }
}

export default function MeterDevice({
  data,
  mode,
  setMode,
  x,
  y,
  onMove,
  onClose,
  onRecall,
  z,
}: {
  data: MeterData;
  mode: MeterMode;
  setMode: (m: MeterMode) => void;
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
  onClose: () => void;
  onRecall: () => void;
  z: number;
}) {
  const [hold, setHold] = useState(false);
  const latest = useRef(data);
  latest.current = data;
  const [shown, setShown] = useState(data);
  // gerçek ölçü aletleri gibi ekran saniyede ~4 kez yenilenir (rakamlar okunabilsin)
  useEffect(() => {
    if (hold) return;
    setShown(latest.current);
    const id = setInterval(() => setShown(latest.current), 250);
    return () => clearInterval(id);
  }, [hold]);
  const view = hold ? shown : { ...shown, red: data.red, black: data.black };
  const { main, sub } = valueFor(mode, view);
  const [num, unit] = main.includes(" ") ? [main.slice(0, main.lastIndexOf(" ")), main.slice(main.lastIndexOf(" ") + 1)] : [main, ""];
  const ref = useRef<HTMLDivElement>(null);
  const idx = MODES.indexOf(mode);
  const cx = 110;
  const cy = 262;

  function dragBody(e: React.PointerEvent) {
    if (e.button !== 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = x;
    const oy = y;
    const parent = ref.current?.parentElement?.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      let nx = ox + ev.clientX - sx;
      let ny = oy + ev.clientY - sy;
      if (parent) {
        nx = Math.min(parent.width - 40, Math.max(-METER_W + 40, nx));
        ny = Math.min(parent.height - 40, Math.max(0, ny));
      }
      onMove(Math.round(nx), Math.round(ny));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function dragKnob(e: React.PointerEvent) {
    e.stopPropagation();
    if (e.button !== 0) return;
    const svg = (e.currentTarget as SVGElement).ownerSVGElement!;
    const turn = (ev: { clientX: number; clientY: number }) => {
      const r = svg.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * METER_W;
      const py = ((ev.clientY - r.top) / r.height) * METER_H;
      const a = (Math.atan2(px - cx, -(py - cy)) * 180) / Math.PI;
      let best = 0;
      MODES.forEach((_, i) => {
        if (Math.abs(angOf(i) - a) < Math.abs(angOf(best) - a)) best = i;
      });
      setMode(MODES[best]);
    };
    turn(e);
    const up = () => {
      window.removeEventListener("pointermove", turn);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", turn);
    window.addEventListener("pointerup", up);
  }

  const off = mode === "OFF";
  const pt = (r: number, a: number) => ({ x: cx + r * Math.sin((a * Math.PI) / 180), y: cy - r * Math.cos((a * Math.PI) / 180) });

  return (
    <div ref={ref} className="absolute select-none drop-shadow-2xl" style={{ left: x, top: y, width: METER_W, height: METER_H, zIndex: z }}>
      <svg viewBox={`0 0 ${METER_W} ${METER_H}`} width={METER_W} height={METER_H} onPointerDown={dragBody} style={{ cursor: "grab" }}>
        <defs>
          <radialGradient id="knob" cx="40%" cy="35%">
            <stop offset="0" stopColor="#4b5563" />
            <stop offset="1" stopColor="#111827" />
          </radialGradient>
        </defs>
        {/* gövde */}
        <rect x={2} y={2} width={METER_W - 4} height={METER_H - 4} rx={26} fill="#f5c518" stroke="#b8920c" strokeWidth={2} />
        <rect x={14} y={14} width={METER_W - 28} height={METER_H - 28} rx={18} fill="#2b3036" />
        <text x={26} y={34} fill="#f5c518" fontSize={10} fontWeight={800} fontStyle="italic">
          OHM-METER
        </text>
        <text x={METER_W - 26} y={34} textAnchor="end" fill="#9ca3af" fontSize={8}>
          TRUE RMS
        </text>
        {/* ekran */}
        <rect x={24} y={42} width={METER_W - 48} height={96} rx={6} fill={off ? "#3c4636" : "#a7b89f"} stroke="#1c2118" strokeWidth={2} />
        {!off && (
          <>
            <text x={32} y={58} fill="#25301f" fontSize={9} fontWeight={700}>
              {mode === "V~" ? "AC" : mode === "V=" ? "DC" : mode}
              {hold ? "  HOLD" : ""}
            </text>
            <text x={METER_W - 32} y={104} textAnchor="end" fill="#1b2416" fontSize={num.length > 8 ? 25 : 30} fontWeight={800} fontFamily="ui-monospace, Consolas, monospace">
              {num}
            </text>
            <text x={METER_W - 32} y={124} textAnchor="end" fill="#25301f" fontSize={12} fontWeight={700}>
              {unit}
            </text>
            <text x={32} y={130} fill="#3b4834" fontSize={7}>
              {sub.length > 34 ? sub.slice(0, 34) + "…" : sub}
            </text>
          </>
        )}
        {/* tuşlar */}
        <g
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setHold((h) => !h)}
          style={{ cursor: "pointer" }}
        >
          <rect x={26} y={148} width={52} height={20} rx={5} fill={hold ? "#f5c518" : "#4b5563"} />
          <text x={52} y={162} textAnchor="middle" fill={hold ? "#111" : "#e5e7eb"} fontSize={9} fontWeight={700}>
            HOLD
          </text>
        </g>
        <g onPointerDown={(e) => e.stopPropagation()} onClick={onRecall} style={{ cursor: "pointer" }}>
          <rect x={84} y={148} width={52} height={20} rx={5} fill="#4b5563" />
          <text x={110} y={162} textAnchor="middle" fill="#e5e7eb" fontSize={9} fontWeight={700}>
            ⌖ PROB
          </text>
        </g>
        <g onPointerDown={(e) => e.stopPropagation()} onClick={onClose} style={{ cursor: "pointer" }}>
          <rect x={142} y={148} width={52} height={20} rx={5} fill="#7f1d1d" />
          <text x={168} y={162} textAnchor="middle" fill="#fecaca" fontSize={9} fontWeight={700}>
            KAPAT
          </text>
        </g>
        {/* döner anahtar etiketleri */}
        {MODES.map((m, i) => {
          const p = pt(76, angOf(i));
          return (
            <text
              key={m}
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill={i === idx ? "#f5c518" : "#d1d5db"}
              fontSize={m === "OFF" ? 9 : 11}
              fontWeight={800}
              style={{ cursor: "pointer" }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setMode(m);
              }}
            >
              {m === "V=" ? "V⎓" : m}
            </text>
          );
        })}
        <circle cx={cx} cy={cy} r={62} fill="none" stroke="#3f4650" strokeWidth={1} />
        <g
          onPointerDown={dragKnob}
          onWheel={(e) => setMode(MODES[Math.min(MODES.length - 1, Math.max(0, idx + (e.deltaY > 0 ? 1 : -1)))])}
          style={{ cursor: "grab" }}
        >
          <circle cx={cx} cy={cy} r={50} fill="url(#knob)" stroke="#0b0f14" strokeWidth={3} />
          <g style={{ transition: "transform 0.18s cubic-bezier(.3,1.6,.5,1)", transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${angOf(idx)}deg)` }}>
            <rect x={cx - 9} y={cy - 48} width={18} height={96} rx={8} fill="#1f2937" stroke="#374151" />
            <rect x={cx - 3} y={cy - 46} width={6} height={22} rx={3} fill="#f5c518" />
          </g>
        </g>
        {/* soketler */}
        <text x={JACK.black.x} y={JACK.black.y - 16} textAnchor="middle" fill="#d1d5db" fontSize={8} fontWeight={700}>
          COM
        </text>
        <text x={JACK.red.x} y={JACK.red.y - 16} textAnchor="middle" fill="#fca5a5" fontSize={8} fontWeight={700}>
          VΩ A
        </text>
        <circle cx={JACK.black.x} cy={JACK.black.y} r={10} fill="#0b0f14" stroke="#6b7280" strokeWidth={3} />
        <circle cx={JACK.red.x} cy={JACK.red.y} r={10} fill="#0b0f14" stroke="#dc2626" strokeWidth={3} />
      </svg>
    </div>
  );
}
