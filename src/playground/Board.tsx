import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Part, PartType, Wire } from "./types";
import { SPEC, localBox, snap, terminalsOf, termPos, worldBox } from "./types";
import type { SimResult } from "./sim";
import { buildGrid, resetUsage, routeWire } from "./route";
import { PartSymbol } from "./parts";
import { MAIN_SWITCH, coincidentPairs, makePart, newId, removeItem, withWires } from "./ops";
import { useI18n } from "../i18n";

export type Sel = { pane: string; kind: "part" | "wire"; id: string } | null;
export interface Ghost {
  type: PartType;
  cx: number;
  cy: number;
}
export interface BoardApi {
  /** Paletten sürüklenen parça bu tuvalin üstünde bırakıldıysa ekler. */
  drop: (type: PartType, cx: number, cy: number) => boolean;
}
export interface View {
  x: number;
  y: number;
  w: number;
}

type Setter<T> = (fn: (v: T) => T) => void;

interface Props {
  pane: string;
  title?: string;
  parts: Part[];
  wires: Wire[];
  setParts: Setter<Part[]>;
  setWires: Setter<Wire[]>;
  pool: Part[]; // bu moddaki bütün parçalar (etiket/grup önerisi için)
  mode: "edit" | "sim";
  sim: SimResult | null;
  held: Record<string, boolean>;
  sel: Sel;
  setSel: (s: Sel) => void;
  placing: PartType | null;
  clearPlacing: () => void;
  ghost: Ghost | null;
  vertRot: boolean; // dikey standart parçalar yatay yerleşsin mi
  fitKey: number; // değişince görünüm devreye sığdırılır (hazır devre yüklenince vb.)
  active: boolean;
  onActivate: () => void;
  onSimDown: (p: Part, e: React.PointerEvent) => void;
  register: (pane: string, api: BoardApi | null) => void;
  coarse: boolean;
}

const clampW = (w: number) => Math.min(6000, Math.max(200, w));
const SIM_CLICK: PartType[] = [...MAIN_SWITCH, "pairc_no", "pairc_nc", "q3", "ol3"];

export default function Board(props: Props) {
  const { pane, parts, wires, setParts, setWires, mode, sim, sel, setSel, placing, coarse } = props;
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, w: 1000 });
  const [measured, setRatio] = useState(0);
  const ratio = measured || 1.4;
  const [pending, setPending] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; dx: number; dy: number; ox: number; oy: number } | null>(null);
  const panRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ d: number; w: number; wx: number; wy: number } | null>(null);
  const partsRef = useRef(parts);
  partsRef.current = parts;

  // tuvalin gerçek en/boy oranı: viewBox buna uysun ki tıklama koordinatları kaymasın
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let prev = 0;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return;
      const next = r.width / r.height;
      // boyut değişince görünümün merkezi yerinde kalsın
      if (prev) setView((v) => ({ ...v, y: v.y + (v.w / prev - v.w / next) / 2 }));
      prev = next;
      setRatio(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (mode === "sim") setPending(null);
  }, [mode]);

  /** Bütün devre görünecek şekilde yakınlaştır. */
  const fit = useCallback((r: number): View => {
    const ps = partsRef.current;
    if (!ps.length) return { x: -40, y: -40, w: 900 };
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    for (const p of ps) {
      const b = worldBox(p);
      x1 = Math.min(x1, b.x1);
      y1 = Math.min(y1, b.y1);
      x2 = Math.max(x2, b.x2 + 40); // etiket payı
      y2 = Math.max(y2, b.y2 + 20);
    }
    const pad = 50;
    const w = Math.max(x2 - x1 + 2 * pad, (y2 - y1 + 2 * pad) * r, 360);
    return { w, x: (x1 + x2) / 2 - w / 2, y: (y1 + y2) / 2 - w / r / 2 };
  }, []);
  const hasRatio = measured > 0;
  useEffect(() => {
    if (hasRatio) setView(fit(ratio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fitKey, hasRatio]);

  const viewH = view.w / ratio;
  const toSvg = useCallback(
    (cx: number, cy: number) => {
      const el = svgRef.current;
      if (!el) return { x: -9999, y: -9999 };
      const r = el.getBoundingClientRect();
      return { x: view.x + ((cx - r.left) / r.width) * view.w, y: view.y + ((cy - r.top) / r.height) * (view.w / ratio) };
    },
    [view, ratio],
  );
  const inside = (cx: number, cy: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    return !!r && cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
  };

  const zoomAt = useCallback(
    (f: number, cx: number, cy: number) => {
      const pt = toSvg(cx, cy);
      setView((v) => {
        const w = clampW(v.w * f);
        const k = w / v.w;
        return { w, x: pt.x - (pt.x - v.x) * k, y: pt.y - (pt.y - v.y) * k };
      });
    },
    [toSvg],
  );
  const zoomBy = (f: number) =>
    setView((v) => {
      const w = clampW(v.w * f);
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.w / ratio - w / ratio) / 2, w };
    });

  // fare tuvalin üstündeyken tekerlek = yakınlaştır/uzaklaştır
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(Math.pow(1.0015, e.deltaY * (e.deltaMode === 1 ? 16 : 1)), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // ── parça ekleme / bağlama ─────────────────────────────────────────────
  const addPart = (type: PartType, x: number, y: number) => {
    const p = makePart(type, x, y, props.pool, props.vertRot);
    setParts((ps) => [...ps, p]);
    setSel({ pane, kind: "part", id: p.id });
    setWires((ws) => withWires(ws, coincidentPairs(p, partsRef.current)));
  };
  const addAtClient = (type: PartType, cx: number, cy: number) => {
    const pt = toSvg(cx, cy);
    const spec = SPEC[type];
    addPart(type, snap(pt.x - spec.w / 2), snap(pt.y - spec.h / 2));
  };

  const dropRef = useRef<BoardApi["drop"]>(() => false);
  dropRef.current = (type, cx, cy) => {
    if (!inside(cx, cy) || mode !== "edit") return false;
    addAtClient(type, cx, cy);
    return true;
  };
  const { register } = props;
  useEffect(() => {
    register(pane, { drop: (ty, cx, cy) => dropRef.current(ty, cx, cy) });
    return () => register(pane, null);
  }, [pane, register]);

  const addNodeAt = (x: number, y: number): string => {
    const id = newId();
    setParts((ps) => [...ps, { id, type: "node", x, y, label: "" }]);
    return `${id}:0`;
  };

  function clickTerminal(tid: string) {
    if (mode !== "edit") return;
    if (pending === null) return setPending(tid);
    if (pending === tid) return setPending(null);
    setWires((ws) => withWires(ws, [{ a: pending, b: tid }]));
    setPending(null);
  }

  function splitWireAt(w: Wire, pt: { x: number; y: number }): string {
    const tid = addNodeAt(snap(pt.x), snap(pt.y));
    setWires((ws) => [
      ...ws.filter((q) => q.id !== w.id),
      { id: newId("w"), a: w.a, b: tid },
      { id: newId("w"), a: tid, b: w.b },
    ]);
    return tid;
  }

  const rotate = (id: string) =>
    setParts((ps) => ps.map((q) => (q.id === id ? { ...q, rot: ((q.rot ?? 0) + 1) % 4 } : q)));

  function removeSelected() {
    if (!sel || sel.pane !== pane) return;
    const r = removeItem(parts, wires, sel.kind, sel.id);
    setWires(() => r.wires);
    setParts(() => r.parts);
    setSel(null);
  }

  // ── taşıma ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const pt = toSvg(e.clientX, e.clientY);
      setParts((ps) => ps.map((p) => (p.id === drag.id ? { ...p, x: snap(pt.x - drag.dx), y: snap(pt.y - drag.dy) } : p)));
    };
    const up = (e: PointerEvent) => {
      if (e.button === 2) return;
      const pt = toSvg(e.clientX, e.clientY);
      const cur = partsRef.current.find((p) => p.id === drag.id);
      if (cur) {
        const moved = { ...cur, x: snap(pt.x - drag.dx), y: snap(pt.y - drag.dy) };
        setWires((ws) => withWires(ws, coincidentPairs(moved, partsRef.current)));
      }
      setDrag(null);
    };
    // sağ tık: taşımayı iptal et, parça eski yerine dönsün
    const down = (e: PointerEvent) => {
      if (e.button !== 2) return;
      setParts((ps) => ps.map((p) => (p.id === drag.id ? { ...p, x: drag.ox, y: drag.oy } : p)));
      setDrag(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointerdown", down);
    };
  }, [drag, toSvg, setParts, setWires]);

  const cancelDrag = () =>
    setDrag((d) => {
      if (d) setParts((ps) => ps.map((p) => (p.id === d.id ? { ...p, x: d.ox, y: d.oy } : p)));
      return null;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPending(null);
      cancelDrag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function partPointerDown(p: Part, e: React.PointerEvent) {
    if (e.button === 2) return;
    e.stopPropagation();
    props.onActivate();
    if (mode === "sim") return props.onSimDown(p, e);
    if (placing) {
      // yerleştirme modu: parçanın üstüne tıklansa da yeni parça oraya konur
      addAtClient(placing, e.clientX, e.clientY);
      props.clearPlacing();
      return;
    }
    if (SPEC[p.type].kind === "rail") return;
    const pt = toSvg(e.clientX, e.clientY);
    setSel({ pane, kind: "part", id: p.id });
    setDrag({ id: p.id, dx: pt.x - p.x, dy: pt.y - p.y, ox: p.x, oy: p.y });
  }

  // ── kablo yolları: A* + dolu kenar cezası (paralel binme olmasın) ──────────
  const grid = useMemo(() => {
    const boxes = parts.filter((p) => p.type !== "node").map(worldBox);
    const frees = parts.flatMap((p) => terminalsOf(p).map((tt) => ({ x: tt.x, y: tt.y })));
    return buildGrid(boxes, frees);
  }, [parts]);

  const wireDs = useMemo(() => {
    resetUsage(grid);
    const m: Record<string, string> = {};
    for (const w of wires) {
      const a = termPos(parts, w.a);
      const b = termPos(parts, w.b);
      if (!a || !b) {
        m[w.id] = "";
        continue;
      }
      let pts: { x: number; y: number }[];
      if (w.pts?.length) {
        pts = [a];
        let cur = a;
        for (const p of [...w.pts, b]) {
          if (cur.x !== p.x && cur.y !== p.y) pts.push({ x: cur.x, y: p.y });
          pts.push(p);
          cur = p;
        }
      } else pts = routeWire(a, b, grid);
      m[w.id] = "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
    }
    return m;
  }, [wires, parts, grid]);

  const wired = useMemo(() => {
    const s = new Set<string>();
    for (const w of wires) {
      s.add(w.a);
      s.add(w.b);
    }
    return s;
  }, [wires]);

  const selPart = sel?.pane === pane && sel.kind === "part" ? parts.find((p) => p.id === sel.id) : undefined;
  const pendingPos = pending ? termPos(parts, pending) : null;

  // yerleştirme/sürükleme hayaleti
  const paletteGhost = props.ghost && inside(props.ghost.cx, props.ghost.cy) ? props.ghost : null;
  const ghostType = paletteGhost?.type ?? (placing && cursor ? placing : null);
  const ghostPt = paletteGhost ? toSvg(paletteGhost.cx, paletteGhost.cy) : cursor;

  return (
    <div className="relative h-full min-h-0">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${viewH}`}
        style={{ touchAction: "none", WebkitTouchCallout: "none" }}
        className={`block h-full w-full select-none rounded-xl border bg-[#0c1220] ${
          props.active && props.title ? "border-volt/40" : "border-line"
        }`}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDownCapture={(e) => {
          props.onActivate();
          if (e.pointerType !== "touch") return;
          touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (touches.current.size === 2) {
            const [a, b] = [...touches.current.values()];
            const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
            pinchRef.current = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, w: view.w, wx: mid.x, wy: mid.y };
            panRef.current = null;
            cancelDrag();
            e.stopPropagation();
          }
        }}
        onPointerDown={(e) => {
          if (e.button === 2 || e.button === 1) {
            if (pending) return setPending(null); // kablo çekişini iptal et
            if (drag) return;
            panRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
            return;
          }
          if (placing && mode === "edit") {
            addAtClient(placing, e.clientX, e.clientY);
            props.clearPlacing();
            return;
          }
          if (pending && mode === "edit") {
            // boş alana tıkla → otomatik Knotenpunkt + zincire devam
            const pt = toSvg(e.clientX, e.clientY);
            const tid = addNodeAt(snap(pt.x), snap(pt.y));
            setWires((ws) => [...ws, { id: newId("w"), a: pending, b: tid }]);
            setPending(tid);
            return;
          }
          setSel(null);
          // boş alanda sol tık + sürükle = kaydır
          panRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "touch" && touches.current.has(e.pointerId)) {
            touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            const pz = pinchRef.current;
            const el = svgRef.current;
            if (pz && el && touches.current.size >= 2) {
              const [a, b] = [...touches.current.values()];
              const r = el.getBoundingClientRect();
              const w = clampW((pz.w * pz.d) / (Math.hypot(a.x - b.x, a.y - b.y) || 1));
              setView({
                w,
                x: pz.wx - (((a.x + b.x) / 2 - r.left) / r.width) * w,
                y: pz.wy - (((a.y + b.y) / 2 - r.top) / r.height) * (w / ratio),
              });
              return;
            }
          }
          if (panRef.current) {
            const el = svgRef.current;
            if (el) {
              const s = view.w / el.getBoundingClientRect().width;
              const pr = panRef.current;
              setView((v) => ({ ...v, x: pr.vx - (e.clientX - pr.px) * s, y: pr.vy - (e.clientY - pr.py) * s }));
            }
            return;
          }
          if (pending || placing) setCursor(toSvg(e.clientX, e.clientY));
        }}
        onPointerUp={(e) => {
          touches.current.delete(e.pointerId);
          if (touches.current.size < 2) pinchRef.current = null;
          panRef.current = null;
        }}
        onPointerCancel={(e) => {
          touches.current.delete(e.pointerId);
          if (touches.current.size < 2) pinchRef.current = null;
          panRef.current = null;
        }}
        onPointerLeave={(e) => {
          if (placing) setCursor(null);
          if (e.pointerType === "touch") return;
          panRef.current = null;
        }}
      >
        <defs>
          <pattern id={`pgrid-${pane}`} width={20} height={20} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={1} fill="rgba(139,154,173,0.15)" />
          </pattern>
        </defs>
        <rect x={view.x} y={view.y} width={view.w} height={viewH} fill={`url(#pgrid-${pane})`} />

        {/* kablolar */}
        {wires.map((w) => {
          const d = wireDs[w.id];
          const flow = sim?.flow[w.id] ?? 0;
          const isShortPath = sim?.short && flow > 50;
          const live = sim && flow > 0.1;
          const rev = (sim?.dir[w.id] ?? 1) < 0;
          const stroke = isShortPath
            ? "#f87171"
            : live
              ? "#fbbf24"
              : sel?.pane === pane && sel.kind === "wire" && sel.id === w.id
                ? "#fbbf24"
                : "#3b4c63";
          return (
            <g key={w.id} className={mode === "edit" ? "pg-wire" : ""}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={2.4}
                className={isShortPath ? "wire-short" : live ? (rev ? "wire-flow-rev" : "wire-flow") : ""}
              />
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                style={{ cursor: mode === "edit" ? "pointer" : "default" }}
                onPointerDown={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  props.onActivate();
                  if (mode !== "edit") return;
                  if (placing) {
                    addAtClient(placing, e.clientX, e.clientY);
                    props.clearPlacing();
                    return;
                  }
                  if (pending) {
                    // bekleyen kabloyu bu kablonun üstüne bağla (Brücke)
                    const tid = splitWireAt(w, toSvg(e.clientX, e.clientY));
                    setWires((ws) => [...ws, { id: newId("w"), a: pending, b: tid }]);
                    setPending(null);
                  } else setSel({ pane, kind: "wire", id: w.id });
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (mode === "edit") splitWireAt(w, toSvg(e.clientX, e.clientY));
                }}
              />
            </g>
          );
        })}

        {pendingPos && cursor && (
          <line
            x1={pendingPos.x}
            y1={pendingPos.y}
            x2={cursor.x}
            y2={cursor.y}
            stroke="#22d3ee"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            pointerEvents="none"
          />
        )}

        {/* parçalar */}
        {parts.map((p) => {
          const spec = SPEC[p.type];
          if (spec.kind === "rail")
            return (
              <g key={p.id} transform={`translate(${p.x} ${p.y})`} pointerEvents="none">
                <PartSymbol part={p} sim={mode === "sim"} />
              </g>
            );
          const isSel = selPart?.id === p.id;
          const k = (p.rot ?? 0) % 4;
          const lb = localBox(p.type);
          const wb = worldBox(p);
          const simClickable = spec.kind === "source" || spec.kind === "source3" || SIM_CLICK.includes(p.type);
          const showLabel = !["source", "source3", "node", "gate"].includes(spec.kind);
          const closed =
            p.type === "relay_ss"
              ? !!props.held[p.label]
              : (sim?.closed[p.id] ?? (p.type.endsWith("_nc") || p.type === "q3" || p.type === "ol3"));
          return (
            <g
              key={p.id}
              transform={`translate(${p.x} ${p.y})`}
              className={mode === "edit" || simClickable ? "pg-part" : ""}
              onPointerDown={(e) => partPointerDown(p, e)}
              onPointerEnter={() => setHover(p.id)}
              onPointerLeave={() => setHover((h) => (h === p.id ? null : h))}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (mode !== "edit" || spec.kind === "node") return;
                rotate(p.id); // çift tık: bir tık sola döndür
                cancelDrag();
              }}
              style={{ cursor: mode === "edit" ? (placing ? "copy" : "move") : simClickable ? "pointer" : "default" }}
            >
              <g transform={k ? `rotate(${-90 * k})` : undefined}>
                <rect x={lb.x1} y={lb.y1} width={lb.x2 - lb.x1} height={lb.y2 - lb.y1} fill="transparent" />
                {isSel && (
                  <rect
                    x={lb.x1}
                    y={lb.y1}
                    width={lb.x2 - lb.x1}
                    height={lb.y2 - lb.y1}
                    rx={8}
                    fill="rgba(251,191,36,0.06)"
                    stroke="#fbbf24"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                )}
                <PartSymbol
                  part={p}
                  sim={mode === "sim"}
                  closed={closed}
                  level={sim?.level[p.id] ?? 0}
                  energized={!!sim?.energized[p.label]}
                  motor={sim?.motor?.[p.id]}
                  burnt={!!sim?.burnt?.[p.id]}
                />
              </g>
              {showLabel && (
                <text x={wb.x2 - p.x + 4} y={wb.y1 - p.y + 14} fill="#8b9aad" fontSize={11} fontWeight={600} pointerEvents="none">
                  {spec.prefix ? p.label : (p.group ?? "?")}
                  {!spec.prefix && (
                    <tspan fill="#5b6b80" fontSize={8}>
                      {" "}
                      {p.label}
                    </tspan>
                  )}
                </text>
              )}
            </g>
          );
        })}

        {/* terminaller: bağlı olmayanlar sadece parçanın üstüne gelince ya da kablo çekerken görünür */}
        {mode === "edit" &&
          parts.flatMap((p) => {
            const rail = SPEC[p.type].kind === "rail";
            const near = hover === p.id || selPart?.id === p.id || (coarse && !rail);
            return terminalsOf(p).map((tt) => {
              const quiet = !wired.has(tt.id) && !pending && !near && p.type !== "node";
              return (
                <g
                  key={tt.id}
                  className={`pg-term${quiet ? " quiet" : ""}`}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    props.onActivate();
                    if (placing) {
                      addAtClient(placing, e.clientX, e.clientY);
                      props.clearPlacing();
                      return;
                    }
                    clickTerminal(tt.id);
                  }}
                  onPointerEnter={() => !rail && setHover(p.id)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (rail) return;
                    setPending(null);
                    setSel({ pane, kind: "part", id: p.id });
                  }}
                >
                  <circle cx={tt.x} cy={tt.y} r={coarse ? 17 : 12} fill="transparent" />
                  <circle
                    className="dot"
                    cx={tt.x}
                    cy={tt.y}
                    r={pending === tt.id ? 6 : 4.5}
                    fill={pending === tt.id ? "#fbbf24" : "#0c1220"}
                    stroke={pending === tt.id ? "#fbbf24" : "#22d3ee"}
                    strokeWidth={1.5}
                  />
                </g>
              );
            });
          })}

        {/* sürüklerken çakışan terminal: buraya bırakırsan bağlanır */}
        {drag &&
          (() => {
            const mp = parts.find((p) => p.id === drag.id);
            if (!mp) return null;
            return coincidentPairs(mp, parts).map((h, i) => (
              <circle key={i} cx={h.x} cy={h.y} r={11} fill="none" stroke="#22d3ee" strokeWidth={2.5} className="snap-hit" pointerEvents="none" />
            ));
          })()}

        {ghostType && ghostPt && mode === "edit" && (
          <g
            transform={`translate(${snap(ghostPt.x - SPEC[ghostType].w / 2)} ${snap(ghostPt.y - SPEC[ghostType].h / 2)})`}
            opacity={0.5}
            pointerEvents="none"
          >
            <g transform={SPEC[ghostType].vert && props.vertRot ? "rotate(-90)" : undefined}>
              <PartSymbol
                part={{ id: "ghost", type: ghostType, x: 0, y: 0, label: "" }}
                sim={false}
                closed={ghostType.endsWith("_nc") || ghostType === "q3" || ghostType === "ol3"}
              />
            </g>
          </g>
        )}
      </svg>

      {props.title && (
        <span
          className={`pointer-events-none absolute left-2 top-2 rounded-lg border px-2 py-0.5 font-disp text-[11px] font-semibold uppercase tracking-wider backdrop-blur ${
            props.active ? "border-volt/50 bg-volt/10 text-volt" : "border-line bg-panel/80 text-mut"
          }`}
        >
          {props.title}
        </span>
      )}

      <div className="absolute right-2 top-2 flex flex-col gap-1">
        <button type="button" onClick={() => zoomBy(1 / 1.3)} title={t("pg.zoomIn")} aria-label={t("pg.zoomIn")} className="pg-zoom">
          +
        </button>
        <button type="button" onClick={() => zoomBy(1.3)} title={t("pg.zoomOut")} aria-label={t("pg.zoomOut")} className="pg-zoom">
          −
        </button>
        <button
          type="button"
          onClick={() => setView(fit(ratio))}
          title={t("pg.zoomReset")}
          aria-label={t("pg.zoomReset")}
          className="pg-zoom text-sm"
        >
          ⤢
        </button>
      </div>

      {mode === "edit" && sel?.pane === pane && (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {selPart && SPEC[selPart.type].kind !== "node" && (
            <button type="button" onClick={() => rotate(selPart.id)} title={t("pg.rotate")} aria-label={t("pg.rotate")} className="pg-zoom">
              ↺
            </button>
          )}
          <button
            type="button"
            onClick={removeSelected}
            title={sel.kind === "wire" ? t("pg.delWire") : t("pg.delPart")}
            aria-label={sel.kind === "wire" ? t("pg.delWire") : t("pg.delPart")}
            className="pg-zoom hover:!border-rose-400/60 hover:!text-rose-300"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
