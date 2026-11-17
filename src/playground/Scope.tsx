// Osiloskop: probların arasındaki gerilim (CH1) ve ölçülen parçanın akımı (CH2).
// Tetiklemeli: dalga ekranda durur, kaymaz. Kendi requestAnimationFrame döngüsüyle 60 fps çizer.
import { useEffect, useRef, useState, type MutableRefObject } from "react";

export interface ScopeData {
  v: Float32Array;
  i: Float32Array | null;
  dt: number;
}
export type ScopeSrc = MutableRefObject<(() => ScopeData | null) | null>;

const TDIV = [0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
const fmtT = (t: number) => (t >= 1 ? `${t} s` : t >= 1e-3 ? `${+(t * 1e3).toFixed(1)} ms` : `${+(t * 1e6).toFixed(0)} µs`);
const nice = (x: number) => {
  if (!(x > 0)) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(x)));
  const m = x / e;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e;
};
const fmtU = (v: number, u: string) => {
  const a = Math.abs(v);
  return a >= 1000 ? `${+(v / 1000).toPrecision(3)} k${u}` : a >= 1 || a === 0 ? `${+v.toPrecision(3)} ${u}` : a >= 1e-3 ? `${+(v * 1e3).toPrecision(3)} m${u}` : `${+(v * 1e6).toPrecision(3)} µ${u}`;
};

/** Temel frekansta fazör (DFT): genlik ve açı. */
function phasorAt(x: Float32Array, from: number, to: number, f: number, dt: number) {
  let c = 0;
  let s = 0;
  for (let k = from; k < to; k++) {
    const w = 2 * Math.PI * f * k * dt;
    c += x[k] * Math.cos(w);
    s += x[k] * Math.sin(w);
  }
  return Math.atan2(-s, c);
}

export default function Scope({ src, running }: { src: ScopeSrc; running: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tdiv, setTdiv] = useState(0.005);
  const [trig, setTrig] = useState(true);
  const [run, setRun] = useState(true);
  const [ch2, setCh2] = useState(true);
  const [info, setInfo] = useState<{ vpp: number; rms: number; f: number; phi: number | null; ipp: number | null }>({ vpp: 0, rms: 0, f: 0, phi: null, ipp: null });
  const cfg = useRef({ tdiv, trig, run, ch2 });
  cfg.current = { tdiv, trig, run, ch2 };
  const frozen = useRef<ScopeData | null>(null);

  useEffect(() => {
    let raf = 0;
    let lastInfo = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const cv = canvasRef.current;
      if (!cv) return;
      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth;
      const H = cv.clientHeight;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
      }
      const g = cv.getContext("2d");
      if (!g) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#06120b";
      g.fillRect(0, 0, W, H);
      // ızgara: 10 × 8 kare
      g.strokeStyle = "#13301f";
      g.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        g.beginPath();
        g.moveTo((W * i) / 10 + 0.5, 0);
        g.lineTo((W * i) / 10 + 0.5, H);
        g.stroke();
      }
      for (let i = 1; i < 8; i++) {
        g.beginPath();
        g.moveTo(0, (H * i) / 8 + 0.5);
        g.lineTo(W, (H * i) / 8 + 0.5);
        g.stroke();
      }
      g.strokeStyle = "#1f4a31";
      g.beginPath();
      g.moveTo(0, H / 2 + 0.5);
      g.lineTo(W, H / 2 + 0.5);
      g.stroke();

      const c = cfg.current;
      let d = c.run ? (src.current?.() ?? null) : frozen.current;
      if (c.run) frozen.current = d;
      if (!d || d.v.length < 4) {
        g.fillStyle = "#4b7a5c";
        g.font = "12px ui-monospace, monospace";
        g.fillText(running ? "Probları iki noktaya değdir" : "Simülasyonu başlat", 12, H / 2 - 8);
        return;
      }
      const N = Math.max(8, Math.round((c.tdiv * 10) / d.dt));
      const len = d.v.length;
      // seviye: son bölümün ortalaması; tetik: en son yükselen geçiş (tam ekran sığacak şekilde)
      let mean = 0;
      const look = Math.min(len, N * 2);
      for (let k = len - look; k < len; k++) mean += d.v[k];
      mean /= look;
      let vmin = Infinity;
      let vmax = -Infinity;
      for (let k = len - look; k < len; k++) {
        vmin = Math.min(vmin, d.v[k]);
        vmax = Math.max(vmax, d.v[k]);
      }
      const hyst = (vmax - vmin) * 0.05;
      let start = Math.max(0, len - N);
      if (c.trig && vmax - vmin > 1e-6) {
        for (let k = len - N; k > Math.max(1, len - N * 4); k--) {
          if (d.v[k - 1] < mean - hyst && d.v[k] >= mean) {
            start = k;
            break;
          }
        }
      }
      const end = Math.min(len, start + N);
      // dikey ölçek: 4 kare yarım yükseklik
      let amp = 0;
      for (let k = start; k < end; k++) amp = Math.max(amp, Math.abs(d.v[k]));
      const vdiv = nice(amp / 3.6 || 1);
      let idiv = 1;
      let iamp = 0;
      if (d.i && c.ch2) {
        for (let k = start; k < end; k++) iamp = Math.max(iamp, Math.abs(d.i[k]));
        idiv = nice(iamp / 3.6 || 1e-3);
      }
      const trace = (arr: Float32Array, div: number, color: string) => {
        g.strokeStyle = color;
        g.lineWidth = 1.8;
        g.shadowColor = color;
        g.shadowBlur = 6;
        g.beginPath();
        for (let k = start; k < end; k++) {
          const x = ((k - start) / (N - 1)) * W;
          const y = H / 2 - (arr[k] / div) * (H / 8);
          if (k === start) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
        g.shadowBlur = 0;
      };
      if (d.i && c.ch2) trace(d.i, idiv, "#22d3ee");
      trace(d.v, vdiv, "#4ade80");
      g.font = "11px ui-monospace, monospace";
      g.fillStyle = "#4ade80";
      g.fillText(`CH1 ${fmtU(vdiv, "V")}/div`, 8, 14);
      if (d.i && c.ch2) {
        g.fillStyle = "#22d3ee";
        g.fillText(`CH2 ${fmtU(idiv, "A")}/div`, 8, 28);
      }
      g.fillStyle = "#9ca3af";
      g.fillText(`${fmtT(c.tdiv)}/div${c.trig ? " · T↑" : ""}`, W - 120, 14);

      // ölçüm değerleri: saniyede ~4 kez
      if (now - lastInfo > 250) {
        lastInfo = now;
        const from = Math.max(0, len - Math.min(len, Math.round(0.2 / d.dt)));
        let cross = 0;
        let s2 = 0;
        let m2 = 0;
        for (let k = from; k < len; k++) m2 += d.v[k];
        m2 /= len - from;
        for (let k = from + 1; k < len; k++) {
          if (d.v[k - 1] < m2 && d.v[k] >= m2) cross++;
          s2 += d.v[k] * d.v[k];
        }
        const f = cross >= 2 ? cross / ((len - from) * d.dt) : 0;
        let phi: number | null = null;
        let ipp: number | null = null;
        if (d.i && f > 0) {
          const n0 = from;
          const pu = phasorAt(d.v, n0, len, f, d.dt);
          const pi = phasorAt(d.i, n0, len, f, d.dt);
          phi = (((pi - pu) * 180) / Math.PI + 540) % 360 - 180;
          let a = -Infinity;
          let b = Infinity;
          for (let k = from; k < len; k++) {
            a = Math.max(a, d.i[k]);
            b = Math.min(b, d.i[k]);
          }
          ipp = a - b;
        }
        setInfo({ vpp: vmax - vmin, rms: Math.sqrt(s2 / Math.max(1, len - from - 1)), f, phi, ipp });
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [src, running]);

  const btn = (on: boolean) => `rounded px-2 py-0.5 text-[11px] font-semibold ${on ? "bg-[#4ade80] text-black" : "bg-panel2 text-mut hover:text-ink"}`;
  return (
    <div className="flex h-full flex-col gap-2 text-xs">
      <canvas ref={canvasRef} className="min-h-[160px] w-full flex-1 rounded-md border border-[#1f4a31]" />
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setRun((r) => !r)} className={btn(run)}>
          {run ? "RUN" : "STOP"}
        </button>
        <button type="button" onClick={() => setTrig((t) => !t)} className={btn(trig)} title="Tetik: dalga yükselen sıfır geçişinde sabitlenir">
          T↑
        </button>
        <button type="button" onClick={() => setCh2((c) => !c)} className={btn(ch2)} title="CH2: probların değdiği parçanın akımı">
          CH2 I
        </button>
        <label className="ml-auto flex items-center gap-1 text-mut">
          ⏱
          <select value={tdiv} onChange={(e) => setTdiv(Number(e.target.value))} className="rounded border border-line bg-bg px-1 py-0.5 text-ink">
            {TDIV.map((t) => (
              <option key={t} value={t}>
                {fmtT(t)}/div
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-x-3 font-mono text-[11px]">
        <span className="text-mut">U tepe-tepe</span>
        <span className="text-right text-[#4ade80]">{fmtU(info.vpp, "V")}</span>
        <span className="text-mut">U etkin</span>
        <span className="text-right text-[#4ade80]">{fmtU(info.rms, "V")}</span>
        <span className="text-mut">frekans</span>
        <span className="text-right text-ink">{info.f ? `${info.f.toFixed(2)} Hz` : "—"}</span>
        {info.ipp !== null && (
          <>
            <span className="text-mut">I tepe-tepe</span>
            <span className="text-right text-[#22d3ee]">{fmtU(info.ipp, "A")}</span>
          </>
        )}
        {info.phi !== null && (
          <>
            <span className="text-mut">faz farkı φ</span>
            <span className="text-right text-ink">
              {info.phi.toFixed(1)}° {Math.abs(info.phi) < 2 ? "" : info.phi < 0 ? "(I geride · endüktif)" : "(I önde · kapasitif)"}
            </span>
            <span className="text-mut">cos φ</span>
            <span className="text-right text-volt">{Math.abs(Math.cos((info.phi * Math.PI) / 180)).toFixed(3)}</span>
          </>
        )}
      </div>
    </div>
  );
}
