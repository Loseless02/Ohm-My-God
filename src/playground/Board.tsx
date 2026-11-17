import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Part, PartType, Wire } from "./types";
import { SPEC, angleOf, localBox, snap, terminalsOf, termPos, worldBox } from "./types";
import type { SimResult } from "./sim";
import { buildGrid, resetUsage, routeWire, type Pt } from "./route";
import { PartSymbol } from "./parts";
import { MAIN_SWITCH, coincidentPairs, makePart, newId, pruneOrphanNodes, removeItem, withWires } from "./ops";
import { valueText } from "./params";
import { useI18n } from "../i18n";

export type Sel = { pane: string; kind: "part" | "wire"; id: string } | null;
export interface Ghost {
  type: PartType;
  cx: number;
  cy: number;
}
export interface View {
  x: number;
  y: number;
  w: number;
}
export interface BoardApi {
  /** Paletten sürüklenen parça bu tuvalin üstünde bırakıldıysa ekler. */
  drop: (type: PartType, cx: number, cy: number) => boolean;
  /** Izgara modundaki kablo yolları (serbest moda geçerken dondurmak için). */
  routes: () => Record<string, Pt[]>;
  view: () => View & { h: number };
}

export type Which = "red" | "black";
export interface Probes {
  red: Pt;
  black: Pt;
}
export interface Contact {
  tid?: string; // dokunulan terminal (ya da kablonun ucu)
  wire?: string; // kabloya dokunduysa
  part?: string; // parçanın gövdesine/ucuna dokunduysa
  label: string;
}

export type Snap = SimResult & {
  temp?: Record<string, number>;
  state?: Record<string, string>;
  rpm?: Record<string, number>;
};

type Setter<T> = (fn: (v: T) => T) => void;

interface Props {
  pane: string;
  title?: string;
  parts: Part[];
  wires: Wire[];
  setParts: Setter<Part[]>;
  setWires: Setter<Wire[]>;
  pool: Part[];
  mode: "edit" | "sim";
  sim: Snap | null;
  held: Record<string, boolean>;
  sel: Sel;
  setSel: (s: Sel) => void;
  placing: PartType | null;
  clearPlacing: () => void;
  ghost: Ghost | null;
  vertRot: boolean;
  free: boolean; // serbest mod: ızgara yok, yapışma yok, kablo elle çizilir
  el: boolean; // elektronik modu (parça varsayılanları)
  fitKey: number;
  active: boolean;
  onActivate: () => void;
  onSimDown: (p: Part, e: React.PointerEvent) => void;
  register: (pane: string, api: BoardApi | null) => void;
  coarse: boolean;
  probes: Probes | null;
  onProbeMove: (w: Which, pt: Pt) => void;
  onProbeContact: (w: Which, c: Contact | null) => void;
  /** Prob kuyruklarının ekran koordinatları (kablolar ölçü aletinden buraya çizilir). */
  onProbeTails: (t: { red: Pt; black: Pt } | null) => void;
}

const clampW = (w: number) => Math.min(8000, Math.max(120, w));
const SIM_CLICK: PartType[] = [...MAIN_SWITCH, "pairc_no", "pairc_nc", "q3", "ol3", "bus_l", "fuse"];
const STATE_TXT: Record<string, string> = {
  burnt: "💥 yandı",
  blown: "⚡ attı",
  smoke: "💨 yandı",
  trip: "⚡ LS attı",
  prot: "🌡 termik",
  sd: "🌡 kapattı",
};

/** Noktanın doğru parçasına uzaklığı ve en yakın nokta. */
function segDist(p: Pt, a: Pt, b: Pt) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
  const q = { x: a.x + t * dx, y: a.y + t * dy };
  return { d: Math.hypot(p.x - q.x, p.y - q.y), q };
}

type Drag =
  | { kind: "part"; id: string; dx: number; dy: number; ox: number; oy: number }
  | { kind: "end"; wire: string; end: "a" | "b"; pt: Pt }
  | { kind: "bend"; wire: string; idx: number }
  | { kind: "probe"; which: Which; dx: number; dy: number };

export default function Board(props: Props) {
  const { pane, parts, wires, setParts, setWires, mode, sim, sel, setSel, placing, coarse, free } = props;
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, w: 1000 });
  const [measured, setRatio] = useState(0);
  const ratio = measured || 1.4;
  const [pending, setPending] = useState<{ from: string; pts: Pt[] } | null>(null);
  const [cursor, setCursor] = useState<Pt | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const panRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const termDown = useRef<{ tid: string; cx: number; cy: number } | null>(null);
  const touches = useRef(new Map<number, Pt>());
  const pinchRef = useRef<{ d: number; w: number; wx: number; wy: number } | null>(null);
  const partsRef = useRef(parts);
  partsRef.current = parts;
  const wiresRef = useRef(wires);
  wiresRef.current = wires;
  const sn = useCallback((v: number) => (free ? Math.round(v * 10) / 10 : snap(v)), [free]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let prev = 0;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return;
      const next = r.width / r.height;
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

  const fit = useCallback((r: number): View => {
    const ps = partsRef.current.filter((p) => SPEC[p.type].kind !== "rail");
    const all = ps.length ? ps : partsRef.current;
    if (!all.length) return { x: -40, y: -40, w: 900 };
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    for (const p of all) {
      const b = worldBox(p);
      x1 = Math.min(x1, b.x1);
      y1 = Math.min(y1, b.y1);
      x2 = Math.max(x2, b.x2 + 50);
      y2 = Math.max(y2, b.y2 + 20);
    }
    // raylar varsa onlar da görünsün
    for (const p of partsRef.current)
      if (p.type === "bus_l" || p.type === "bus_n") {
        y1 = Math.min(y1, p.y - 30);
        y2 = Math.max(y2, p.y + 30);
        x1 = Math.min(x1, p.x - 60);
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
  const pxScale = () => {
    const r = svgRef.current?.getBoundingClientRect();
    return r && r.width ? view.w / r.width : 1;
  };
  const toSvg = useCallback(
    (cx: number, cy: number): Pt => {
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

  const selPart = sel?.pane === pane && sel.kind === "part" ? parts.find((p) => p.id === sel.id) : undefined;

  const rotate = useCallback(
    (id: string, deg = 90) =>
      setParts((ps) =>
        ps.map((q) =>
          q.id !== id
            ? q
            : free
              ? { ...q, angle: (((angleOf(q) + deg) % 360) + 360) % 360 }
              : { ...q, rot: ((q.rot ?? 0) + Math.round(deg / 90) + 4) % 4 },
        ),
      ),
    [free, setParts],
  );

  // tekerlek = zoom; Shift + tekerlek (serbest modda, seçili parça) = döndür
  const selRef = useRef(selPart);
  selRef.current = selPart;
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.shiftKey && free && selRef.current && mode === "edit") {
        rotate(selRef.current.id, e.deltaY > 0 ? -15 : 15);
        return;
      }
      zoomAt(Math.pow(1.0015, e.deltaY * (e.deltaMode === 1 ? 16 : 1)), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, free, rotate, mode]);

  // ── geometri ─────────────────────────────────────────────────────────────
  const grid = useMemo(() => {
    if (free) return null;
    const boxes = parts.filter((p) => p.type !== "node" && SPEC[p.type].kind !== "rail").map(worldBox);
    const frees = parts.flatMap((p) => terminalsOf(p).map((tt) => ({ x: tt.x, y: tt.y })));
    return buildGrid(boxes, frees);
  }, [parts, free]);

  const wirePts = useMemo(() => {
    if (grid) resetUsage(grid);
    const m: Record<string, Pt[]> = {};
    for (const w of wires) {
      const a = termPos(parts, w.a);
      const b = termPos(parts, w.b);
      if (!a || !b) continue;
      if (free) m[w.id] = [a, ...(w.pts ?? []), b];
      else if (w.pts?.length) {
        const pts: Pt[] = [a];
        let cur = a;
        for (const p of [...w.pts, b]) {
          if (cur.x !== p.x && cur.y !== p.y) pts.push({ x: cur.x, y: p.y });
          pts.push(p);
          cur = p;
        }
        m[w.id] = pts;
      } else m[w.id] = routeWire(a, b, grid!);
    }
    return m;
  }, [wires, parts, grid, free]);

  const degree = useMemo(() => {
    const d = new Map<string, number>();
    for (const w of wires) {
      d.set(w.a, (d.get(w.a) ?? 0) + 1);
      d.set(w.b, (d.get(w.b) ?? 0) + 1);
    }
    return d;
  }, [wires]);

  /** Noktada ne var? Önce terminal, sonra kablo, sonra parça gövdesi. */
  const pick = useCallback(
    (pt: Pt, tolPx: number, skipWire?: string, skipPart?: string) => {
      const s = pxScale();
      const tol = tolPx * s;
      let best: { tid: string; d: number } | null = null;
      for (const p of partsRef.current) {
        if (p.id === skipPart) continue;
        for (const tt of terminalsOf(p)) {
          const d = Math.hypot(tt.x - pt.x, tt.y - pt.y);
          if (d <= tol && (!best || d < best.d)) best = { tid: tt.id, d };
        }
      }
      if (best) return { kind: "term" as const, tid: best.tid };
      for (const w of wiresRef.current) {
        if (w.id === skipWire) continue;
        const ps = wirePts[w.id];
        if (!ps) continue;
        for (let i = 0; i + 1 < ps.length; i++) {
          const { d, q } = segDist(pt, ps[i], ps[i + 1]);
          if (d <= tol) return { kind: "wire" as const, wire: w, seg: i, at: q };
        }
      }
      for (const p of [...partsRef.current].reverse()) {
        if (p.id === skipPart || p.type === "node") continue;
        const b = worldBox(p);
        const kind = SPEC[p.type].kind;
        const pad = kind === "rail" ? 4 * s : 0;
        if (pt.x >= b.x1 - pad && pt.x <= b.x2 + pad && pt.y >= b.y1 - pad && pt.y <= b.y2 + pad) {
          // gövdeye dokunmak = en yakın ucuna dokunmak
          let nb: { tid: string; d: number } | null = null;
          for (const tt of terminalsOf(p)) {
            const d = Math.hypot(tt.x - pt.x, tt.y - pt.y);
            if (!nb || d < nb.d) nb = { tid: tt.id, d };
          }
          if (nb) return { kind: "part" as const, part: p, tid: nb.tid };
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wirePts, view, ratio],
  );

  // ── ekleme / bağlama ─────────────────────────────────────────────────────
  const addPart = (type: PartType, x: number, y: number) => {
    const p = makePart(type, x, y, props.pool, props.vertRot, props.el);
    if (free) p.angle = (p.rot ?? 0) * 90;
    setParts((ps) => [...ps, p]);
    setSel({ pane, kind: "part", id: p.id });
    if (!free) setWires((ws) => withWires(ws, coincidentPairs(p, partsRef.current)));
  };
  const addAtClient = (type: PartType, cx: number, cy: number) => {
    const pt = toSvg(cx, cy);
    const spec = SPEC[type];
    addPart(type, sn(pt.x - spec.w / 2), sn(pt.y - spec.h / 2));
  };

  const dropRef = useRef<BoardApi["drop"]>(() => false);
  dropRef.current = (type, cx, cy) => {
    if (!inside(cx, cy) || mode !== "edit") return false;
    addAtClient(type, cx, cy);
    return true;
  };
  const routesRef = useRef(wirePts);
  routesRef.current = wirePts;
  const viewRef = useRef({ ...view, h: viewH });
  viewRef.current = { ...view, h: viewH };
  const { register } = props;
  useEffect(() => {
    register(pane, {
      drop: (ty, cx, cy) => dropRef.current(ty, cx, cy),
      routes: () => routesRef.current,
      view: () => viewRef.current,
    });
    return () => register(pane, null);
  }, [pane, register]);

  const addNodeAt = (x: number, y: number): string => {
    const id = newId();
    setParts((ps) => [...ps, { id, type: "node", x, y, label: "" }]);
    return `${id}:0`;
  };

  /** Kabloyu noktadan böl: araya Knotenpunkt koy. Serbest modda kıvrımlar korunur. */
  function splitWire(w: Wire, at: Pt, seg: number): string {
    const q = free ? { x: Math.round(at.x * 10) / 10, y: Math.round(at.y * 10) / 10 } : { x: snap(at.x), y: snap(at.y) };
    const tid = addNodeAt(q.x, q.y);
    const full = wirePts[w.id] ?? [];
    const p1 = free ? full.slice(1, seg + 1) : undefined;
    const p2 = free ? full.slice(seg + 1, full.length - 1) : undefined;
    setWires((ws) => [
      ...ws.filter((x) => x.id !== w.id),
      { id: newId("w"), a: w.a, b: tid, ...(p1?.length ? { pts: p1 } : {}) },
      { id: newId("w"), a: tid, b: w.b, ...(p2?.length ? { pts: p2 } : {}) },
    ]);
    return tid;
  }

  function finishWire(to: string, pts: Pt[] = []) {
    if (!pending) return;
    if (pending.from === to && !pts.length) return setPending(null);
    const from = pending.from;
    setWires((ws) => {
      if (!pts.length && ws.some((w) => (w.a === from && w.b === to) || (w.a === to && w.b === from))) return ws;
      return [...ws, { id: newId("w"), a: from, b: to, ...(pts.length ? { pts } : {}) }];
    });
    setPending(null);
  }

  /** Sağ tık: kabloyu son tıklanan noktada bitir (serbest uç). */
  function endPendingHere() {
    if (!pending) return;
    if (free && pending.pts.length) {
      const pts = [...pending.pts];
      const last = pts.pop()!;
      const tid = addNodeAt(last.x, last.y);
      finishWire(tid, pts);
    } else setPending(null);
  }

  function removeSelected() {
    if (!sel || sel.pane !== pane) return;
    const r = removeItem(parts, wires, sel.kind, sel.id);
    setWires(() => r.wires);
    setParts(() => r.parts);
    setSel(null);
  }

  /** Bir düğüm parçasını hedefe kaynak et (serbest uç bir uca/kabloya bırakıldı). */
  function mergeNodeInto(nodeId: string, target: string) {
    const nt = `${nodeId}:0`;
    setWires((ws) => ws.map((w) => ({ ...w, a: w.a === nt ? target : w.a, b: w.b === nt ? target : w.b })).filter((w) => w.a !== w.b));
    setParts((ps) => ps.filter((p) => p.id !== nodeId));
  }

  // ── sürüklemeler (pencere dinleyicileri) ────────────────────────────────
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const pt = toSvg(e.clientX, e.clientY);
      if (drag.kind === "part")
        setParts((ps) => ps.map((p) => (p.id === drag.id ? { ...p, x: sn(pt.x - drag.dx), y: sn(pt.y - drag.dy) } : p)));
      else if (drag.kind === "end") setDrag({ ...drag, pt });
      else if (drag.kind === "bend")
        setWires((ws) =>
          ws.map((w) => (w.id === drag.wire && w.pts ? { ...w, pts: w.pts.map((q, i) => (i === drag.idx ? { x: Math.round(pt.x), y: Math.round(pt.y) } : q)) } : w)),
        );
      else props.onProbeMove(drag.which, { x: pt.x - drag.dx, y: pt.y - drag.dy });
    };
    const up = (e: PointerEvent) => {
      if (e.button === 2) return;
      const pt = toSvg(e.clientX, e.clientY);
      if (drag.kind === "part") {
        const cur = partsRef.current.find((p) => p.id === drag.id);
        if (cur && !free) {
          const moved = { ...cur, x: sn(pt.x - drag.dx), y: sn(pt.y - drag.dy) };
          setWires((ws) => withWires(ws, coincidentPairs(moved, partsRef.current)));
        }
        // serbest uç (düğüm) bir uca ya da kabloya bırakıldıysa bağla
        if (cur && cur.type === "node" && free) {
          const hit = pick({ x: cur.x, y: cur.y }, 7, undefined, cur.id);
          if (hit?.kind === "term") mergeNodeInto(cur.id, hit.tid);
          else if (hit?.kind === "wire" && !hit.wire.a.startsWith(cur.id + ":") && !hit.wire.b.startsWith(cur.id + ":"))
            mergeNodeInto(cur.id, splitWire(hit.wire, hit.at, hit.seg));
        }
      } else if (drag.kind === "end") {
        const w = wiresRef.current.find((x) => x.id === drag.wire);
        if (w) {
          const other = drag.end === "a" ? w.b : w.a;
          const hit = pick(drag.pt, 7, w.id);
          let target: string;
          if (hit?.kind === "term") target = hit.tid;
          else if (hit?.kind === "wire") target = splitWire(hit.wire, hit.at, hit.seg);
          else target = addNodeAt(Math.round(drag.pt.x * 10) / 10, Math.round(drag.pt.y * 10) / 10);
          setWires((ws) => {
            const next = target === other ? ws.filter((x) => x.id !== w.id) : ws.map((x) => (x.id === w.id ? { ...x, [drag.end]: target } : x));
            setParts((ps) => pruneOrphanNodes(ps, next));
            return next;
          });
        }
      }
      setDrag(null);
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 2) return;
      if (drag.kind === "part") setParts((ps) => ps.map((p) => (p.id === drag.id ? { ...p, x: drag.ox, y: drag.oy } : p)));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, toSvg, setParts, setWires, free]);

  // serbest mod: uca basıp sürüklersen o uçtaki kablo kopar ve elinde kalır
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = termDown.current;
      if (!d) return;
      if (Math.hypot(e.clientX - d.cx, e.clientY - d.cy) < 5) return;
      termDown.current = null;
      if (!free || pending) return;
      const w = [...wiresRef.current].reverse().find((x) => x.a === d.tid || x.b === d.tid);
      if (!w) return;
      setDrag({ kind: "end", wire: w.id, end: w.a === d.tid ? "a" : "b", pt: toSvg(e.clientX, e.clientY) });
    };
    const up = () => {
      const d = termDown.current;
      termDown.current = null;
      if (!d) return;
      // tıklama: kablo başlat / bitir
      if (pending) finishWire(d.tid, pending.pts);
      else setPending({ from: d.tid, pts: [] });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  });

  const cancelDrag = () =>
    setDrag((d) => {
      if (d?.kind === "part") setParts((ps) => ps.map((p) => (p.id === d.id ? { ...p, x: d.ox, y: d.oy } : p)));
      return null;
    });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tg = e.target as HTMLElement;
      if (tg instanceof HTMLInputElement || tg instanceof HTMLSelectElement || tg instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") {
        setPending(null);
        cancelDrag();
      }
      if ((e.key === "r" || e.key === "R") && selRef.current && mode === "edit" && props.active)
        rotate(selRef.current.id, free ? (e.shiftKey ? -15 : 15) : 90);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [free, mode, props.active, rotate]);

  function partPointerDown(p: Part, e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.stopPropagation();
    props.onActivate();
    if (mode === "sim") return props.onSimDown(p, e);
    if (placing) {
      addAtClient(placing, e.clientX, e.clientY);
      props.clearPlacing();
      return;
    }
    const pt = toSvg(e.clientX, e.clientY);
    if (pending) {
      // raya tıkla = en yakın noktasına bağla; serbest modda başka yere tıklamak = kıvrım
      if (SPEC[p.type].kind === "rail" || p.type === "node") {
        const hit = pick(pt, 1e6);
        if (hit && hit.kind !== "wire" && hit.tid.startsWith(p.id + ":")) return finishWire(hit.tid, pending.pts);
      }
      if (free) setPending({ ...pending, pts: [...pending.pts, { x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 }] });
      return;
    }
    setSel({ pane, kind: "part", id: p.id });
    if (SPEC[p.type].kind === "rail") return; // raylar seçilir ama taşınmaz
    setDrag({ kind: "part", id: p.id, dx: pt.x - p.x, dy: pt.y - p.y, ox: p.x, oy: p.y });
  }

  // ── ölçü probları: dokunma tespiti ───────────────────────────────────────
  const { probes, onProbeContact } = props;
  const lastContact = useRef<Record<Which, string>>({ red: "", black: "" });
  useEffect(() => {
    for (const which of ["red", "black"] as Which[]) {
      let c: Contact | null = null;
      if (probes) {
        const hit = pick(probes[which], 5);
        if (hit?.kind === "term") {
          const [pid, i] = hit.tid.split(":");
          const p = parts.find((q) => q.id === pid);
          c = { tid: hit.tid, part: p?.type === "node" ? undefined : pid, label: p ? (p.type === "node" ? "Knotenpunkt" : `${p.label || SPEC[p.type].de} · uç ${Number(i) + 1}`) : "?" };
        } else if (hit?.kind === "wire") c = { tid: hit.wire.a, wire: hit.wire.id, label: "kablo" };
        else if (hit?.kind === "part") c = { tid: hit.tid, part: hit.part.id, label: `${hit.part.label || SPEC[hit.part.type].de} (gövde)` };
      }
      const key = c ? `${c.tid}|${c.wire ?? ""}|${c.part ?? ""}` : "";
      if (key !== lastContact.current[which]) {
        lastContact.current[which] = key;
        onProbeContact(which, c);
      }
    }
  }, [probes, parts, wires, pick, onProbeContact]);

  // prob kuyruklarının ekran konumu: kablolar ölçü aletinin soketlerinden buraya
  const { onProbeTails } = props;
  useEffect(() => {
    const el = svgRef.current;
    if (!probes || !el) return onProbeTails(null);
    const r = el.getBoundingClientRect();
    const sc = view.w / r.width;
    const toC = (p: Pt) => ({ x: r.left + (p.x - view.x) / sc, y: r.top + (p.y - view.y) / sc });
    const tail = (p: Pt) => toC({ x: p.x + 44 * sc, y: p.y - 76 * sc });
    onProbeTails({ red: tail(probes.red), black: tail(probes.black) });
  }, [probes, view, ratio, measured, onProbeTails]);

  // ── çizim yardımcıları ───────────────────────────────────────────────────
  const s = pxScale();
  const pendingStart = pending ? termPos(parts, pending.from) : null;
  const paletteGhost = props.ghost && inside(props.ghost.cx, props.ghost.cy) ? props.ghost : null;
  const ghostType = paletteGhost?.type ?? (placing && cursor ? placing : null);
  const ghostPt = paletteGhost ? toSvg(paletteGhost.cx, paletteGhost.cy) : cursor;
  const dot = Math.max(1.6, 2.2 * Math.min(1.6, s)); // ekranda ~2 px kalsın

  const polyD = (ps: Pt[]) => (ps.length ? "M " + ps.map((p) => `${p.x} ${p.y}`).join(" L ") : "");

  return (
    <div className="relative h-full min-h-0">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${viewH}`}
        style={{ touchAction: "none", WebkitTouchCallout: "none" }}
        className={`block h-full w-full select-none rounded-xl border bg-[#0c1220] ${props.active && props.title ? "border-volt/40" : "border-line"}`}
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
          if (e.button === 2) {
            if (pending) return endPendingHere();
            if (drag) return;
            panRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
            return;
          }
          if (e.button === 1) {
            panRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
            return;
          }
          if (placing && mode === "edit") {
            addAtClient(placing, e.clientX, e.clientY);
            props.clearPlacing();
            return;
          }
          if (pending && mode === "edit") {
            const pt = toSvg(e.clientX, e.clientY);
            if (free) {
              // serbest mod: her tık bir kıvrım noktası; kablo elde kalır
              setPending({ ...pending, pts: [...pending.pts, { x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 }] });
            } else {
              const tid = addNodeAt(snap(pt.x), snap(pt.y));
              setWires((ws) => [...ws, { id: newId("w"), a: pending.from, b: tid }]);
              setPending({ from: tid, pts: [] });
            }
            return;
          }
          setSel(null);
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
              setView({ w, x: pz.wx - (((a.x + b.x) / 2 - r.left) / r.width) * w, y: pz.wy - (((a.y + b.y) / 2 - r.top) / r.height) * (w / ratio) });
              return;
            }
          }
          if (panRef.current) {
            const sc = pxScale();
            const pr = panRef.current;
            setView((v) => ({ ...v, x: pr.vx - (e.clientX - pr.px) * sc, y: pr.vy - (e.clientY - pr.py) * sc }));
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
        {!free && (
          <>
            <defs>
              <pattern id={`pgrid-${pane}`} width={20} height={20} patternUnits="userSpaceOnUse">
                <circle cx={1} cy={1} r={1} fill="rgba(139,154,173,0.15)" />
              </pattern>
            </defs>
            <rect x={view.x} y={view.y} width={view.w} height={viewH} fill={`url(#pgrid-${pane})`} />
          </>
        )}

        {/* kablolar */}
        {wires.map((w) => {
          let ps = wirePts[w.id];
          if (!ps) return null;
          if (drag?.kind === "end" && drag.wire === w.id) ps = drag.end === "a" ? [drag.pt, ...ps.slice(1)] : [...ps.slice(0, -1), drag.pt];
          const d = polyD(ps);
          const flow = sim?.flow[w.id] ?? 0;
          const isShortPath = sim?.short && flow > 50;
          const live = sim && flow > 0.1;
          const dirv = sim?.dir[w.id];
          const rev = (dirv ?? 1) < 0;
          const ac = dirv === 0; // AC: yön her yarım periyotta değişir → ileri-geri salınım
          const isSel = sel?.pane === pane && sel.kind === "wire" && sel.id === w.id;
          const stroke = isShortPath ? "#f87171" : live ? "#fbbf24" : isSel ? "#fbbf24" : "#3b4c63";
          return (
            <g key={w.id} className={mode === "edit" ? "pg-wire" : ""}>
              <path d={d} fill="none" stroke={stroke} strokeWidth={free ? 2 : 2.4} strokeLinejoin="round" className={isShortPath ? "wire-short" : live ? (ac ? "wire-flow-ac" : rev ? "wire-flow-rev" : "wire-flow") : ""} />
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={Math.max(10, 12 * s)}
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
                  const pt = toSvg(e.clientX, e.clientY);
                  if (pending) {
                    const full = wirePts[w.id];
                    let seg = 0;
                    let best = Infinity;
                    let at = pt;
                    for (let i = 0; i + 1 < full.length; i++) {
                      const r = segDist(pt, full[i], full[i + 1]);
                      if (r.d < best) {
                        best = r.d;
                        seg = i;
                        at = r.q;
                      }
                    }
                    const tid = splitWire(w, at, seg);
                    finishWire(tid, pending.pts);
                  } else setSel({ pane, kind: "wire", id: w.id });
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (mode !== "edit") return;
                  const pt = toSvg(e.clientX, e.clientY);
                  const full = wirePts[w.id];
                  let seg = 0;
                  let best = Infinity;
                  let at = pt;
                  for (let i = 0; i + 1 < full.length; i++) {
                    const r = segDist(pt, full[i], full[i + 1]);
                    if (r.d < best) {
                      best = r.d;
                      seg = i;
                      at = r.q;
                    }
                  }
                  splitWire(w, at, seg);
                }}
              />
              {/* seçili kablonun kıvrım noktaları sürüklenebilir */}
              {free && isSel && mode === "edit" &&
                (w.pts ?? []).map((q, i) => (
                  <rect
                    key={i}
                    x={q.x - 3.5 * s}
                    y={q.y - 3.5 * s}
                    width={7 * s}
                    height={7 * s}
                    fill="#0c1220"
                    stroke="#fbbf24"
                    strokeWidth={1.2 * s}
                    style={{ cursor: "move" }}
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      setDrag({ kind: "bend", wire: w.id, idx: i });
                    }}
                  />
                ))}
            </g>
          );
        })}

        {/* çizilmekte olan kablo */}
        {pendingStart && (
          <path
            d={polyD([pendingStart, ...pending!.pts, ...(cursor ? [cursor] : [])])}
            fill="none"
            stroke="#22d3ee"
            strokeWidth={1.6}
            strokeDasharray={free ? undefined : "4 4"}
            pointerEvents="none"
          />
        )}

        {/* parçalar */}
        {parts.map((p) => {
          const spec = SPEC[p.type];
          if (p.type === "node") {
            const deg = degree.get(`${p.id}:0`) ?? 0;
            const isH = hover === p.id;
            return (
              <g
                key={p.id}
                className="pg-node"
                onPointerDown={(e) => partPointerDown(p, e)}
                onPointerEnter={() => setHover(p.id)}
                onPointerLeave={() => setHover((h) => (h === p.id ? null : h))}
                style={{ cursor: mode === "edit" ? "move" : "default" }}
              >
                <circle cx={p.x} cy={p.y} r={8 * s} fill="transparent" />
                {(deg !== 2 || isH) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isH ? dot * 2.1 : deg === 1 ? dot * 1.2 : dot}
                    fill={deg === 1 && !isH ? "#0c1220" : "#c7d2e0"}
                    stroke="#c7d2e0"
                    strokeWidth={0.9 * s}
                  />
                )}
              </g>
            );
          }
          const isSel = selPart?.id === p.id;
          const ang = angleOf(p);
          const lb = localBox(p.type);
          const wb = worldBox(p);
          const simClickable = spec.kind === "source" || spec.kind === "source3" || SIM_CLICK.includes(p.type) || !!sim?.state?.[p.id] || !!sim?.burnt?.[p.id];
          const showLabel = !["source", "source3", "node", "gate", "rail"].includes(spec.kind);
          const closed =
            p.type === "relay_ss"
              ? !!props.held[p.label]
              : (sim?.closed[p.id] ?? (p.type.endsWith("_nc") || p.type === "q3" || p.type === "ol3" || p.type === "bus_l"));
          const val = valueText(p);
          const st = sim?.state?.[p.id];
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
                if (mode !== "edit" || spec.kind === "rail") return;
                rotate(p.id, 90);
                cancelDrag();
              }}
              style={{ cursor: mode === "edit" ? (placing ? "copy" : spec.kind === "rail" ? "pointer" : "move") : simClickable ? "pointer" : "default" }}
            >
              <g transform={ang ? `rotate(${-ang})` : undefined}>
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
                  burnt={!!sim?.burnt?.[p.id] || st === "trip" || st === "blown"}
                  hot={sim?.temp?.[p.id]}
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
                  {val && (
                    <tspan x={wb.x2 - p.x + 4} dy={12} fill="#5b6b80" fontSize={9}>
                      {val}
                    </tspan>
                  )}
                </text>
              )}
              {mode === "sim" && st && STATE_TXT[st] && (
                <text x={wb.x2 - p.x + 4} y={wb.y2 - p.y - 2} fill="#f87171" fontSize={10} fontWeight={700} pointerEvents="none">
                  {STATE_TXT[st]}
                </text>
              )}
            </g>
          );
        })}

        {/* terminaller: bağlı uçta küçük nokta (Knotenpunkt), boştakiler parçanın üstüne gelince */}
        {mode === "edit" &&
          parts.flatMap((p) => {
            if (p.type === "node") return [];
            const rail = SPEC[p.type].kind === "rail";
            const near = hover === p.id || selPart?.id === p.id || (coarse && !rail);
            return terminalsOf(p).map((tt) => {
              const wired = (degree.get(tt.id) ?? 0) > 0;
              const show = wired || near || (!!pending && !rail);
              return (
                <g
                  key={tt.id}
                  className={`pg-term${show ? "" : " quiet"}`}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    props.onActivate();
                    if (placing) {
                      addAtClient(placing, e.clientX, e.clientY);
                      props.clearPlacing();
                      return;
                    }
                    if (!free) {
                      if (pending === null) setPending({ from: tt.id, pts: [] });
                      else if (pending.from === tt.id) setPending(null);
                      else {
                        setWires((ws) => withWires(ws, [{ a: pending.from, b: tt.id }]));
                        setPending(null);
                      }
                      return;
                    }
                    termDown.current = { tid: tt.id, cx: e.clientX, cy: e.clientY };
                  }}
                  onPointerEnter={() => !rail && setHover(p.id)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (rail) return;
                    setPending(null);
                    setSel({ pane, kind: "part", id: p.id });
                  }}
                >
                  <circle cx={tt.x} cy={tt.y} r={(coarse ? 14 : 8) * Math.max(1, s)} fill="transparent" />
                  <circle
                    className="dot"
                    cx={tt.x}
                    cy={tt.y}
                    r={pending?.from === tt.id ? dot * 2.4 : wired ? dot : dot * 1.3}
                    fill={pending?.from === tt.id ? "#fbbf24" : wired ? "#c7d2e0" : "#0c1220"}
                    stroke={pending?.from === tt.id ? "#fbbf24" : wired ? "#c7d2e0" : "#22d3ee"}
                    strokeWidth={1.1 * Math.min(1.5, s)}
                  />
                </g>
              );
            });
          })}

        {drag?.kind === "part" &&
          !free &&
          (() => {
            const mp = parts.find((p) => p.id === drag.id);
            if (!mp) return null;
            return coincidentPairs(mp, parts).map((h, i) => (
              <circle key={i} cx={h.x} cy={h.y} r={11} fill="none" stroke="#22d3ee" strokeWidth={2.5} className="snap-hit" pointerEvents="none" />
            ));
          })()}

        {ghostType && ghostPt && mode === "edit" && (
          <g transform={`translate(${sn(ghostPt.x - SPEC[ghostType].w / 2)} ${sn(ghostPt.y - SPEC[ghostType].h / 2)})`} opacity={0.5} pointerEvents="none">
            <g transform={SPEC[ghostType].vert && props.vertRot ? "rotate(-90)" : undefined}>
              <PartSymbol part={{ id: "ghost", type: ghostType, x: 0, y: 0, label: "" }} sim={false} closed={ghostType.endsWith("_nc") || ghostType === "q3" || ghostType === "ol3"} />
            </g>
          </g>
        )}

        {/* ölçü aleti probları */}
        {probes &&
          (["black", "red"] as Which[]).map((which) => {
            const tip = probes[which];
            const col = which === "red" ? "#ef4444" : "#1f2937";
            const edge = which === "red" ? "#fecaca" : "#9ca3af";
            const k = s; // sabit ekran boyu
            const hx = tip.x + 22 * k;
            const hy = tip.y - 38 * k;
            const ex = tip.x + 44 * k;
            const ey = tip.y - 76 * k;
            const grab = (e: React.PointerEvent) => {
              if (e.button !== 0) return;
              e.stopPropagation();
              const pt = toSvg(e.clientX, e.clientY);
              setDrag({ kind: "probe", which, dx: pt.x - tip.x, dy: pt.y - tip.y });
            };
            return (
              <g key={which}>
                <g style={{ cursor: "grab" }} onPointerDown={grab}>
                  <line x1={tip.x} y1={tip.y} x2={tip.x + 8 * k} y2={tip.y - 14 * k} stroke="#d1d5db" strokeWidth={1.6 * k} strokeLinecap="round" />
                  <line x1={tip.x + 8 * k} y1={tip.y - 14 * k} x2={ex} y2={ey} stroke={col} strokeWidth={9 * k} strokeLinecap="round" />
                  <line x1={tip.x + 8 * k} y1={tip.y - 14 * k} x2={hx} y2={hy} stroke={edge} strokeWidth={9 * k} strokeLinecap="round" opacity={0.35} />
                  <circle cx={tip.x} cy={tip.y} r={10 * k} fill="transparent" />
                </g>
              </g>
            );
          })}
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

      <div className="absolute bottom-2 right-2 flex gap-1">
        <button type="button" onClick={() => zoomBy(1 / 1.3)} title={t("pg.zoomIn")} aria-label={t("pg.zoomIn")} className="pg-zoom">
          +
        </button>
        <button type="button" onClick={() => zoomBy(1.3)} title={t("pg.zoomOut")} aria-label={t("pg.zoomOut")} className="pg-zoom">
          −
        </button>
        <button type="button" onClick={() => setView(fit(ratio))} title={t("pg.zoomReset")} aria-label={t("pg.zoomReset")} className="pg-zoom text-sm">
          ⤢
        </button>
      </div>

      {mode === "edit" && sel?.pane === pane && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
          {selPart && SPEC[selPart.type].kind !== "node" && SPEC[selPart.type].kind !== "rail" && (
            <button type="button" onClick={() => rotate(selPart.id, 90)} title={t("pg.rotate")} aria-label={t("pg.rotate")} className="pg-zoom">
              ↺
            </button>
          )}
          {!(selPart && SPEC[selPart.type].kind === "rail") && (
            <button
              type="button"
              onClick={removeSelected}
              title={sel.kind === "wire" ? t("pg.delWire") : t("pg.delPart")}
              aria-label={sel.kind === "wire" ? t("pg.delWire") : t("pg.delPart")}
              className="pg-zoom hover:!border-rose-400/60 hover:!text-rose-300"
            >
              🗑
            </button>
          )}
        </div>
      )}
    </div>
  );
}
