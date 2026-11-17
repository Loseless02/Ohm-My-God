// Ölçü aleti ekranı: probların dokunduğu iki nokta arasındaki değerler + mini osiloskop.
import type { PartReading, Reading } from "./engine";
import type { Contact } from "./Board";

export type MeterMode = "V" | "A" | "Ω" | "W" | "Hz" | "°C";

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
  v: Reading | null; // iki prob da bir düğüme değiyorsa
  part: (PartReading & { name: string; R?: number }) | null; // iki prob aynı parçanın uçlarındaysa
  wire: { rms: number; dc: number } | null; // ikisi de aynı kablodaysa (pens ampermetre gibi)
  same: boolean; // iki prob aynı düğümde
}

export default function Meter({
  data,
  mode,
  setMode,
  onRecall,
}: {
  data: MeterData;
  mode: MeterMode;
  setMode: (m: MeterMode) => void;
  onRecall: () => void;
}) {
  const { v, part, wire, red, black } = data;
  const isAC = !!v && v.ac > 0.05 * Math.max(1e-9, Math.abs(v.dc)) && v.ac > 1e-4;
  let big = "----";
  let sub = "";
  switch (mode) {
    case "V":
      if (v) {
        big = fmt3(isAC ? v.rms : v.dc, "V");
        sub = isAC ? "AC~ · True RMS" : "DC =";
      }
      break;
    case "A":
      if (part) {
        big = fmt3(Math.abs(part.Idc) > 0.9 * part.I && part.I > 0 ? part.Idc : part.I, "A");
        sub = "bileşen akımı";
      } else if (wire) {
        big = fmt3(Math.abs(wire.dc) > 0.9 * wire.rms ? wire.dc : wire.rms, "A");
        sub = "kablo akımı";
      }
      break;
    case "Ω":
      if (data.same) big = fmt3(0, "Ω");
      else if (part?.R !== undefined) big = fmt3(part.R, "Ω");
      else if (red && black) big = "OL";
      sub = "parça direnci";
      break;
    case "W":
      if (part) big = fmt3(part.P, "W");
      sub = "bileşen gücü";
      break;
    case "Hz":
      if (v) big = v.f ? fmt3(v.f, "Hz") : fmt3(0, "Hz");
      break;
    case "°C":
      if (part?.T !== undefined) big = `${part.T.toFixed(1)} °C`;
      else if (part?.rpm !== undefined) big = `${part.rpm.toFixed(0)} 1/min`;
      sub = part?.rpm !== undefined && part.T === undefined ? "devir" : "sıcaklık";
      break;
  }

  // osiloskop izi
  const wave = v?.wave ?? [];
  const lo = Math.min(0, ...wave);
  const hi = Math.max(0, ...wave);
  const span = hi - lo || 1;
  const pts = wave.map((y, i) => `${(i / Math.max(1, wave.length - 1)) * 200},${58 - ((y - lo) / span) * 54}`).join(" ");
  const zeroY = 58 - ((0 - lo) / span) * 54;

  const row = (k: string, val: string) => (
    <div className="flex justify-between gap-3 border-b border-line/50 py-0.5">
      <span className="text-mut">{k}</span>
      <span className="font-mono text-ink">{val}</span>
    </div>
  );

  return (
    <div className="space-y-2 text-xs">
      <div className="rounded-lg border-4 border-[#f5c518] bg-[#1b1f18] p-2 shadow-inner">
        <div className="rounded bg-[#9fb39a] px-2 py-1.5 text-right font-mono text-[#1d2618]">
          <div className="text-[10px] uppercase opacity-70">{sub || " "}</div>
          <div className="text-2xl font-bold tracking-tight">{big}</div>
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1">
          {(["V", "A", "Ω", "W", "Hz", "°C"] as MeterMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded py-1 font-mono text-[11px] font-bold ${mode === m ? "bg-[#f5c518] text-black" : "bg-[#2b3127] text-[#d6dccf] hover:bg-[#3a4234]"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="truncate text-ink">{red?.label ?? "temas yok"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-gray-400 bg-gray-800" />
          <span className="truncate text-ink">{black?.label ?? "temas yok"}</span>
        </div>
      </div>

      {v && (
        <div>
          {row("U~ (RMS)", fmt3(v.rms, "V"))}
          {row("U= (ortalama)", fmt3(v.dc, "V"))}
          {row("AC bileşeni", fmt3(v.ac, "V"))}
          {row("tepe–tepe", fmt3(v.max - v.min, "V"))}
          {row("frekans", fmt3(v.f, "Hz"))}
        </div>
      )}
      {part && (
        <div>
          <p className="mb-0.5 mt-1 font-semibold text-volt">{part.name}</p>
          {row("akım (RMS)", fmt3(part.I, "A"))}
          {row("akım (ort.)", fmt3(part.Idc, "A"))}
          {row("güç", fmt3(part.P, "W"))}
          {part.R !== undefined && row("direnç", fmt3(part.R, "Ω"))}
          {part.T !== undefined && row("sıcaklık", `${part.T.toFixed(1)} °C`)}
          {part.rpm !== undefined && row("devir", `${part.rpm.toFixed(0)} 1/min`)}
          {part.state && row("durum", part.state)}
        </div>
      )}
      {wire && !part && (
        <div>
          {row("kablo akımı (RMS)", fmt3(wire.rms, "A"))}
          {row("kablo akımı (ort.)", fmt3(wire.dc, "A"))}
        </div>
      )}

      {wave.length > 4 && (
        <svg viewBox="0 0 200 60" className="h-16 w-full rounded border border-line bg-[#07130c]">
          <line x1={0} y1={zeroY} x2={200} y2={zeroY} stroke="#1f3b2a" strokeWidth={0.8} />
          <polyline points={pts} fill="none" stroke="#4ade80" strokeWidth={1.2} />
        </svg>
      )}

      {!v && (
        <p className="leading-relaxed text-mut">
          Kırmızı ve siyah probu sürükleyip uçlarını bir kabloya, parça ucuna ya da parçanın gövdesine değdir. Sadece metal ucu tam
          değerse ölçer. Simülasyon çalışırken değerler canlıdır.
        </p>
      )}
      <button type="button" onClick={onRecall} className="w-full rounded-lg border border-line py-1 text-mut hover:border-spark/50 hover:text-ink">
        Probları görünen alana getir
      </button>
    </div>
  );
}
