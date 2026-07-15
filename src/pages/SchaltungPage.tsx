import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CNode, GNode, Given, Quantities } from "../schaltung/model";
import { collectNodes, solveCircuit } from "../schaltung/model";
import { fmt, parseNum } from "../lib/format";

type Tpl = "reihe" | "parallel" | "gruppe";

const R_UNITS: [string, number][] = [["Ω", 1], ["kΩ", 1e3], ["MΩ", 1e6]];
const U_UNITS: [string, number][] = [["V", 1], ["mV", 1e-3], ["kV", 1e3]];
const I_UNITS: [string, number][] = [["A", 1], ["mA", 1e-3]];

interface Entry {
  R: string;
  Ru: number;
  U: string;
  Uu: number;
  I: string;
  Iu: number;
}
const EMPTY: Entry = { R: "", Ru: 0, U: "", Uu: 0, I: "", Iu: 0 };

function fmtQ(v: number | undefined, base: "Ω" | "V" | "A" | "W"): string {
  if (v === undefined) return "—";
  const a = Math.abs(v);
  if (a !== 0 && a < 1e-12) return `0 ${base}`;
  if (a >= 1e6) return `${fmt(v / 1e6)} M${base}`;
  if (a >= 1e3) return `${fmt(v / 1e3)} k${base}`;
  if (a !== 0 && a < 0.1) return `${fmt(v * 1e3)} m${base}`;
  return `${fmt(v)} ${base}`;
}

// ── Devre önizlemesi (özyinelemeli şema) ─────────────────────────────────────
const RW = 96;
const RH = 46;
const GX = 18;
const GY = 16;

function sizeOf(n: CNode): { w: number; h: number } {
  if (n.kind === "R") return { w: RW, h: RH };
  const cs = n.children.map(sizeOf);
  if (n.kind === "series")
    return {
      w: cs.reduce((a, c) => a + c.w, 0) + GX * (cs.length - 1),
      h: Math.max(RH, ...cs.map((c) => c.h)),
    };
  return {
    w: Math.max(RW, ...cs.map((c) => c.w)) + 56,
    h: cs.reduce((a, c) => a + c.h, 0) + GY * (cs.length - 1),
  };
}

function draw(n: CNode, x: number, cy: number, vals: Record<string, Quantities>): ReactNode {
  const L = "#c7d2e0";
  if (n.kind === "R") {
    const v = vals[n.id];
    return (
      <g key={n.id}>
        <line x1={x} y1={cy} x2={x + 20} y2={cy} stroke={L} strokeWidth={2} />
        <rect x={x + 20} y={cy - 9} width={56} height={18} fill="none" stroke={L} strokeWidth={2} />
        <line x1={x + 76} y1={cy} x2={x + RW} y2={cy} stroke={L} strokeWidth={2} />
        <text x={x + 48} y={cy - 15} textAnchor="middle" fill={L} fontSize={11} fontWeight={600}>
          {n.label}
        </text>
        <text x={x + 48} y={cy + 24} textAnchor="middle" fill="#8b9aad" fontSize={9}>
          {v?.R !== undefined ? fmtQ(v.R, "Ω") : "?"}
        </text>
      </g>
    );
  }
  if (n.kind === "series") {
    const els: ReactNode[] = [];
    let cx = x;
    n.children.forEach((c, i) => {
      const cs = sizeOf(c);
      if (i > 0) {
        els.push(
          <line key={`c${i}`} x1={cx} y1={cy} x2={cx + GX} y2={cy} stroke={L} strokeWidth={2} />,
        );
        cx += GX;
      }
      els.push(draw(c, cx, cy, vals));
      cx += cs.w;
    });
    return <g key={n.id}>{els}</g>;
  }
  // paralel: sol/sağ baralar + ortalanmış kollar
  const s = sizeOf(n);
  const busL = x + 12;
  const busR = x + s.w - 12;
  const innerW = s.w - 56;
  const els: ReactNode[] = [];
  const cys: number[] = [];
  let yy = cy - s.h / 2;
  n.children.forEach((c, i) => {
    const cs = sizeOf(c);
    const ccy = yy + cs.h / 2;
    cys.push(ccy);
    const cx = x + 28 + (innerW - cs.w) / 2;
    els.push(
      <line key={`l${i}`} x1={busL} y1={ccy} x2={cx} y2={ccy} stroke={L} strokeWidth={2} />,
      draw(c, cx, ccy, vals),
      <line key={`r${i}`} x1={cx + cs.w} y1={ccy} x2={busR} y2={ccy} stroke={L} strokeWidth={2} />,
    );
    yy += cs.h + GY;
  });
  const top = Math.min(cys[0], cy);
  const bot = Math.max(cys[cys.length - 1], cy);
  els.push(
    <line key="bl" x1={busL} y1={top} x2={busL} y2={bot} stroke={L} strokeWidth={2.5} />,
    <line key="br" x1={busR} y1={top} x2={busR} y2={bot} stroke={L} strokeWidth={2.5} />,
    <line key="il" x1={x} y1={cy} x2={busL} y2={cy} stroke={L} strokeWidth={2} />,
    <line key="ir" x1={busR} y1={cy} x2={x + s.w} y2={cy} stroke={L} strokeWidth={2} />,
  );
  return <g key={n.id}>{els}</g>;
}

// ── Sayfa ────────────────────────────────────────────────────────────────────
export default function SchaltungPage() {
  const idc = useRef(0);
  const rc = useRef(0);
  const mkR = (): CNode => ({ id: `n${++idc.current}`, kind: "R", label: `R${++rc.current}` });
  const mkG = (kind: "series" | "parallel", children: CNode[]): GNode => ({
    id: `n${++idc.current}`,
    kind,
    label: kind === "series" ? "Seri grup" : "Paralel grup",
    children,
  });

  const initTree = (t: Tpl): GNode => {
    rc.current = 0;
    if (t === "reihe") return { ...mkG("series", [mkR(), mkR(), mkR()]), label: "Toplam (Reihe)" };
    if (t === "parallel")
      return { ...mkG("parallel", [mkR(), mkR()]), label: "Toplam (Parallel)" };
    return { ...mkG("series", [mkR(), mkG("parallel", [mkR(), mkR()])]), label: "Toplam (kaynak)" };
  };

  const [tpl, setTpl] = useState<Tpl>("reihe");
  const [tree, setTree] = useState<GNode>(() => initTree("reihe"));
  const [inputs, setInputs] = useState<Record<string, Entry>>({});

  const switchTpl = (t: Tpl) => {
    setTpl(t);
    setTree(initTree(t));
    setInputs({});
  };

  // ── ağaç işlemleri ─────────────────────────────────────────────────────
  const mapGroups = (n: GNode, fn: (g: GNode) => GNode): GNode => {
    const mapped = fn(n);
    return {
      ...mapped,
      children: mapped.children.map((c) => (c.kind === "R" ? c : mapGroups(c, fn))),
    };
  };
  const addChild = (gid: string, child: CNode) =>
    setTree((t) => mapGroups(t, (g) => (g.id === gid ? { ...g, children: [...g.children, child] } : g)));
  const removeChild = (id: string) =>
    setTree((t) => mapGroups(t, (g) => ({ ...g, children: g.children.filter((c) => c.id !== id) })));

  // ── çözüm ──────────────────────────────────────────────────────────────
  const given = useMemo(() => {
    const out: Given = {};
    for (const [id, e] of Object.entries(inputs)) {
      const r = parseNum(e.R);
      const u = parseNum(e.U);
      const i = parseNum(e.I);
      if (!Number.isNaN(r)) (out[id] ??= {}).R = r * R_UNITS[e.Ru][1];
      if (!Number.isNaN(u)) (out[id] ??= {}).U = u * U_UNITS[e.Uu][1];
      if (!Number.isNaN(i)) (out[id] ??= {}).I = i * I_UNITS[e.Iu][1];
    }
    return out;
  }, [inputs]);

  const { vals, conflict } = useMemo(() => solveCircuit(tree, given), [tree, given]);
  const size = useMemo(() => sizeOf(tree), [tree]);

  const setField = (id: string, patch: Partial<Entry>) =>
    setInputs((s) => ({ ...s, [id]: { ...(s[id] ?? EMPTY), ...patch } }));

  const isGiven = (id: string, k: "R" | "U" | "I") => given[id]?.[k] !== undefined;

  const chips = (id: string) => {
    const v = vals[id];
    if (!v) return null;
    const items: [string, number | undefined, "Ω" | "V" | "A" | "W", boolean][] = [
      ["R", v.R, "Ω", isGiven(id, "R")],
      ["U", v.U, "V", isGiven(id, "U")],
      ["I", v.I, "A", isGiven(id, "I")],
      ["P", v.P, "W", false],
    ];
    return (
      <span className="flex flex-wrap gap-1.5">
        {items.map(
          ([k, val, base, giv]) =>
            val !== undefined && (
              <span
                key={k}
                className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] ${
                  giv ? "bg-panel2 text-mut" : "bg-volt/15 font-semibold text-volt"
                }`}
                title={giv ? "senin girdiğin" : "hesaplanan"}
              >
                {k}={fmtQ(val, base)}
              </span>
            ),
        )}
      </span>
    );
  };

  const qInput = (id: string, k: "R" | "U" | "I", units: [string, number][]) => {
    const e = inputs[id] ?? EMPTY;
    const val = e[k];
    const uIdx = e[(k + "u") as "Ru" | "Uu" | "Iu"];
    return (
      <span className="flex items-center gap-1">
        <span className="eq-v eq-v-static text-sm text-mut">{k}</span>
        <input
          inputMode="decimal"
          value={val}
          placeholder="?"
          onChange={(ev) => setField(id, { [k]: ev.target.value } as Partial<Entry>)}
          className="w-16 rounded-lg border border-line bg-bg/60 px-2 py-1 text-sm text-ink outline-none focus:border-volt/60"
        />
        <select
          value={uIdx}
          onChange={(ev) => setField(id, { [(k + "u") as "Ru"]: Number(ev.target.value) } as Partial<Entry>)}
          className="rounded-lg border border-line bg-bg/60 px-1 py-1 text-xs text-mut outline-none"
        >
          {units.map((u, i) => (
            <option key={i} value={i}>
              {u[0]}
            </option>
          ))}
        </select>
      </span>
    );
  };

  const renderNode = (n: CNode, depth: number, removable: boolean): ReactNode => {
    if (n.kind === "R")
      return (
        <div key={n.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line/50 bg-bg/30 px-3 py-2">
          <span className="eq-v eq-v-static w-9 text-volt">{n.label}</span>
          {qInput(n.id, "R", R_UNITS)}
          {qInput(n.id, "U", U_UNITS)}
          {qInput(n.id, "I", I_UNITS)}
          {chips(n.id)}
          {removable && (
            <button
              type="button"
              onClick={() => removeChild(n.id)}
              className="ml-auto text-xs text-mut transition hover:text-rose-300"
              title="Direnci sil"
            >
              ✕
            </button>
          )}
        </div>
      );
    const isRoot = n.id === tree.id;
    return (
      <div key={n.id} className={`space-y-2 rounded-xl border p-3 ${isRoot ? "border-line" : "border-spark/30 bg-spark/5"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-disp text-sm font-semibold text-ink">
            {isRoot ? "⚡ " : n.kind === "series" ? "⛓ " : "🔀 "}
            {n.label}
          </span>
          {qInput(n.id, "R", R_UNITS)}
          {qInput(n.id, "U", U_UNITS)}
          {qInput(n.id, "I", I_UNITS)}
          {chips(n.id)}
          {!isRoot && tpl === "gruppe" && (
            <button
              type="button"
              onClick={() => removeChild(n.id)}
              className="ml-auto text-xs text-mut transition hover:text-rose-300"
              title="Grubu sil"
            >
              ✕
            </button>
          )}
        </div>
        <div className={`space-y-2 ${depth > 0 || isRoot ? "pl-3" : ""}`}>
          {n.children.map((c) => renderNode(c, depth + 1, n.children.length > 1))}
        </div>
        <div className="flex flex-wrap gap-2 pl-3">
          <button
            type="button"
            onClick={() => addChild(n.id, mkR())}
            className="rounded-lg border border-line px-2.5 py-1 text-xs text-mut transition hover:border-volt/50 hover:text-volt"
          >
            + Direnç
          </button>
          {tpl === "gruppe" && (
            <>
              <button
                type="button"
                onClick={() => addChild(n.id, mkG("series", [mkR(), mkR()]))}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-mut transition hover:border-spark/50 hover:text-spark"
              >
                + Seri grup
              </button>
              <button
                type="button"
                onClick={() => addChild(n.id, mkG("parallel", [mkR(), mkR()]))}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-mut transition hover:border-spark/50 hover:text-spark"
              >
                + Paralel grup
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const solvedCount = collectNodes(tree).reduce((a, n) => {
    const v = vals[n.id];
    return a + ["R", "U", "I"].filter((k) => v?.[k as "R"] !== undefined && !isGiven(n.id, k as "R")).length;
  }, 0);

  return (
    <div>
      <h1 className="font-disp text-3xl font-bold text-ink">🧮 Devre Çözücü</h1>
      <p className="mb-6 mt-1 italic text-mut">
        Devreni kur, bildiğin değerleri gir — bulunabilecek <b className="text-ink">her şeyi</b> biz
        bulalım. Sarı değerler hesap, grisi senin.
      </p>

      {/* şablonlar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["reihe", "⛓ Reihenschaltung", "Seri devre: akım tek, gerilim paylaşılır"],
            ["parallel", "🔀 Parallelschaltung", "Paralel devre: gerilim ortak, akım bölüşülür"],
            ["gruppe", "🧩 Gruppenschaltung", "Karma: grupları iç içe kur"],
          ] as [Tpl, string, string][]
        ).map(([t, label, tip]) => (
          <button
            key={t}
            type="button"
            title={tip}
            onClick={() => switchTpl(t)}
            className={`rounded-xl px-4 py-2 font-disp text-sm font-semibold transition ${
              tpl === t
                ? "bg-volt text-black shadow-[0_0_16px_rgba(251,191,36,0.25)]"
                : "border border-line bg-panel text-mut hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {conflict && (
        <p className="mb-4 rounded-xl border border-rose-400/50 bg-rose-500/15 px-4 py-2.5 text-sm text-rose-300">
          ⚠️ {conflict}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* editör */}
        <div className="space-y-3">
          {renderNode(tree, 0, false)}
          <p className="text-xs text-mut">
            💡 Bir alanı boş bırak = "bunu sen bul". {solvedCount > 0 && (
              <span className="text-volt">Şu an {solvedCount} değer hesaplandı.</span>
            )}
            {solvedCount === 0 && "Yeterli veri girince sonuçlar sarı rozetlerle belirir."}
          </p>
        </div>

        {/* önizleme */}
        <div className="card self-start p-4">
          <h3 className="mb-3 font-disp text-xs uppercase tracking-widest text-mut">Şema</h3>
          <div className="overflow-x-auto">
            <svg
              viewBox={`-12 -14 ${size.w + 24} ${size.h + 44}`}
              className="mx-auto w-full"
              style={{ maxHeight: 420 }}
            >
              {draw(tree, 0, size.h / 2, vals)}
            </svg>
          </div>
          <p className="mt-2 text-center text-[11px] text-mut">
            Uçlar arası kaynak bağlı varsay — toplam satırına U girmen yeter.
          </p>
        </div>
      </div>

      <div className="card mt-6 p-5 text-sm leading-relaxed text-mut">
        <h3 className="mb-2 font-disp text-sm uppercase tracking-widest text-mut">🎓 Nasıl çalışır?</h3>
        <p>
          Çözücü, senin girdiklerinden türetilebilen her değeri kurallar sabitlenene kadar zincirleme
          hesaplar: <b className="text-ink">Ohm</b> (U=R·I), <b className="text-ink">seri</b> (I ortak,
          U ve R toplanır), <b className="text-ink">paralel</b> (U ortak, I toplanır, 1/R toplanır).
          Örnek: Reihe'de R₁=100 Ω, R₂=200 Ω ve U_toplam=30 V gir — I, tüm kısmi gerilimler ve güçler
          kendiliğinden gelir. Çelişkili değer girersen kavgayı biz haber veririz; hakemlik Ohm
          amcanın.
        </p>
      </div>
    </div>
  );
}
