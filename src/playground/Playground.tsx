import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Part, PartType, TimerMode, Wire } from "./types";
import {
  CANVAS_H,
  CANVAS_W,
  SPEC,
  localBox,
  snap,
  terminalsOf,
  termPos,
  worldBox,
} from "./types";
import { simulate, simulateLogic } from "./sim";
import { buildGrid, routeWire } from "./route";
import { MiniSymbol, PartSymbol } from "./parts";
import { LOGIC_PRESETS, PRESETS, type Preset } from "./presets";
import { PART_INFO } from "./info";
import { rich, useI18n } from "../i18n";

const LS2 = "omg-playground-v2";
const MAIN_SWITCH = ["switch_no", "switch_nc", "taster_no", "taster_nc"];

type Domain = "phys" | "logic";
type Orient = "v" | "h";

const PALETTE_PHYS: PartType[] = [
  "source",
  "source2",
  "switch_no",
  "switch_nc",
  "taster_no",
  "taster_nc",
  "pairc_no",
  "pairc_nc",
  "lamp",
  "motor",
  "coil",
  "contact_no",
  "contact_nc",
  "tcoil",
  "tcontact_no",
  "tcontact_nc",
];
const PALETTE_LOGIC: PartType[] = [
  "switch_no",
  "switch_nc",
  "taster_no",
  "taster_nc",
  "and",
  "or",
  "not",
  "nand",
  "nor",
  "xor",
  "lamp",
];

type Sel = { kind: "part" | "wire"; id: string } | null;
type Drag =
  | { kind: "new"; type: PartType; x: number; y: number }
  | { kind: "move"; id: string; dx: number; dy: number; ox: number; oy: number }
  | null;

interface StoredCircuit {
  parts: Part[];
  wires: Wire[];
  orient?: Orient;
}

function ensureRails(list: Part[], withVolts: boolean): Part[] {
  const out = [...list];
  if (!out.some((p) => p.type === "rail_l"))
    out.push({ id: "railL", type: "rail_l", x: 60, y: 40, label: "L", ...(withVolts ? { volts: 230 } : {}) });
  if (!out.some((p) => p.type === "rail_n"))
    out.push({ id: "railN", type: "rail_n", x: 900, y: 40, label: "N" });
  return out;
}

function loadStore(): Record<Domain, StoredCircuit> {
  const defaults: Record<Domain, StoredCircuit> = {
    phys: {
      parts: structuredClone(PRESETS[1].parts),
      wires: structuredClone(PRESETS[1].wires),
      orient: "v",
    },
    logic: {
      parts: structuredClone(LOGIC_PRESETS[0].parts),
      wires: structuredClone(LOGIC_PRESETS[0].wires),
      orient: "h",
    },
  };
  try {
    const raw = localStorage.getItem(LS2);
    if (raw) {
      const d = JSON.parse(raw);
      if (d.phys?.parts && d.logic?.parts) return d;
    }
    const old = localStorage.getItem("omg-playground-v1");
    if (old) {
      const d = JSON.parse(old);
      if (Array.isArray(d.parts))
        return { ...defaults, phys: { parts: d.parts, wires: d.wires ?? [], orient: "v" } };
    }
  } catch {
    /* bozuk kayıt → varsayılan */
  }
  return defaults;
}

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;
const clampW = (w: number) => Math.min(6000, Math.max(240, w));

/** Başlangıç görünümü: dar ekranda devrenin olduğu bölgeye yakınlaş. */
function homeView(narrow: boolean, railed: boolean) {
  if (!narrow) return { x: 0, y: 0, w: CANVAS_W };
  return railed ? { x: 30, y: 0, w: 900 } : { x: 100, y: 0, w: 640 };
}

// zaman rölesi: moduna göre kontaklar şu an "çekili" mi?
interface TState {
  onSince: number | null;
  offSince: number | null;
}
function timedActive(p: Part, t: TState | undefined, now: number): boolean {
  if (!t) return false;
  const d = Math.max(0.2, p.delay ?? 3) * 1000;
  switch (p.tmode ?? "ein") {
    case "ein":
      return t.onSince !== null && now - t.onSince >= d;
    case "aus":
      return t.onSince !== null || (t.offSince !== null && now - t.offSince < d);
    case "impuls":
      return t.onSince !== null && now - t.onSince < d;
    case "blink":
      return t.onSince !== null && Math.floor((now - t.onSince) / d) % 2 === 0;
  }
}

export default function Playground() {
  const { t, tx, deTerm } = useI18n();
  const [initialStore] = useState(loadStore);
  const storeRef = useRef(initialStore);
  const [domain, setDomainState] = useState<Domain>("phys");
  const [orient, setOrientState] = useState<Orient>(initialStore.phys.orient ?? "v");
  const [parts, setParts] = useState<Part[]>(initialStore.phys.parts);
  const [wires, setWires] = useState<Wire[]>(initialStore.phys.wires);
  const [mode, setMode] = useState<"edit" | "sim">("edit");
  const [sel, setSel] = useState<Sel>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  // dar ekran: daha dik tuval + yakın başlangıç görünümü; dokunmatik: büyük hedefler
  const [narrow, setNarrow] = useState(() => mq("(max-width: 640px)"));
  const [coarse] = useState(() => mq("(pointer: coarse)"));
  const ratio = narrow ? 0.82 : CANVAS_W / CANVAS_H; // tuval en/boy
  const [view, setView] = useState(() =>
    homeView(mq("(max-width: 640px)"), (initialStore.phys.orient ?? "v") === "h"),
  );
  const [placing, setPlacing] = useState<PartType | null>(null); // dokunmatik: önce parça seç, sonra tuvale dokun
  const lastPointer = useRef("mouse");
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ d: number; w: number; wx: number; wy: number } | null>(null);
  const [actuated, setActuated] = useState<Record<string, boolean>>({});
  const [tick, setTick] = useState(0);
  const [drag, setDrag] = useState<Drag>(null);
  const panRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const idc = useRef(0);
  const timersRef = useRef<Record<string, TState>>({});
  const energizedRef = useRef<Record<string, boolean>>({});
  const lastDoneRef = useRef("");
  const partsRef = useRef<Part[]>(initialStore.phys.parts);

  useEffect(() => {
    partsRef.current = parts;
  }, [parts]);

  const railed = domain === "logic" || orient === "h";
  useEffect(() => {
    const m = window.matchMedia("(max-width: 640px)");
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  // dar ekranda mod/yön değişince devre görünür kalsın
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    setView(homeView(narrow, railed));
  }, [narrow, railed]);

  // ── kalıcılık ──────────────────────────────────────────────────────────
  useEffect(() => {
    storeRef.current[domain] = { parts, wires, orient };
    localStorage.setItem(LS2, JSON.stringify(storeRef.current));
  }, [parts, wires, orient, domain]);

  // ── zaman rölesi durumu ────────────────────────────────────────────────
  const computeTimerDone = useCallback(
    (ps: Part[]) => {
      const now = Date.now();
      const done: Record<string, boolean> = {};
      for (const p of ps)
        if (p.type === "tcoil") done[p.label] = timedActive(p, timersRef.current[p.id], now);
      return done;
    },
    [],
  );

  // ── simülasyon ─────────────────────────────────────────────────────────
  const sim = useMemo(() => {
    if (mode !== "sim") return null;
    if (domain === "logic") return simulateLogic(parts, wires, { actuated });
    return simulate(parts, wires, {
      actuated,
      timerDone: computeTimerDone(parts),
      prevEnergized: energizedRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts, wires, actuated, mode, tick, domain]);

  useEffect(() => {
    if (!sim) return;
    energizedRef.current = sim.energized;
    const now = Date.now();
    for (const p of parts) {
      if (p.type !== "tcoil") continue;
      const t = (timersRef.current[p.id] ??= { onSince: null, offSince: null });
      const on = !!sim.energized[p.label];
      if (on && t.onSince === null) {
        t.onSince = now;
        t.offSince = null;
      }
      if (!on && t.onSince !== null) {
        t.onSince = null;
        t.offSince = now;
      }
    }
  }, [sim, parts]);

  useEffect(() => {
    if (mode !== "sim" || domain !== "phys") return;
    if (!parts.some((p) => p.type === "tcoil")) return;
    const iv = setInterval(() => {
      const key = JSON.stringify(computeTimerDone(parts));
      if (key !== lastDoneRef.current) {
        lastDoneRef.current = key;
        setTick((x) => x + 1);
      }
    }, 120);
    return () => clearInterval(iv);
  }, [mode, domain, parts, computeTimerDone]);

  const resetSim = () => {
    setActuated({});
    timersRef.current = {};
    energizedRef.current = {};
    lastDoneRef.current = "";
    setPending(null);
    setPlacing(null);
    setSel(null);
  };

  const startStop = () => {
    resetSim();
    setMode((m) => (m === "edit" ? "sim" : "edit"));
  };

  // ── mod / yön geçişleri ────────────────────────────────────────────────
  function switchDomain(d: Domain) {
    if (d === domain) return;
    storeRef.current[domain] = { parts, wires, orient };
    const t = storeRef.current[d];
    resetSim();
    setMode("edit");
    setDomainState(d);
    if (d === "logic") {
      setOrientState("h");
      setParts(ensureRails(t.parts, false));
    } else {
      const o = t.orient ?? "v";
      setOrientState(o);
      setParts(o === "h" ? ensureRails(t.parts, true) : t.parts);
    }
    setWires(t.wires);
  }

  function setOrientation(o: Orient) {
    if (o === orient || domain !== "phys") return;
    setOrientState(o);
    setParts((ps) => {
      let out = ps.map((p) => (SPEC[p.type].vert ? { ...p, rot: o === "h" ? 1 : 0 } : p));
      if (o === "h") out = ensureRails(out, true);
      else out = out.filter((p) => SPEC[p.type].kind !== "rail");
      return out;
    });
    if (o === "v")
      setWires((ws) =>
        ws.filter(
          (w) =>
            !w.a.startsWith("railL:") &&
            !w.a.startsWith("railN:") &&
            !w.b.startsWith("railL:") &&
            !w.b.startsWith("railN:"),
        ),
      );
  }

  // ── koordinatlar (zoom/pan dahil) ──────────────────────────────────────
  const viewH = view.w / ratio;
  const toSvg = useCallback(
    (cx: number, cy: number) => {
      const el = svgRef.current;
      if (!el) return { x: -9999, y: -9999 };
      const r = el.getBoundingClientRect();
      return {
        x: view.x + ((cx - r.left) / r.width) * view.w,
        y: view.y + ((cy - r.top) / r.height) * (view.w / ratio),
      };
    },
    [view, ratio],
  );

  const zoomAt = useCallback(
    (f: number, cx: number, cy: number) => {
      const pt = toSvg(cx, cy);
      setView((v) => {
        const w = clampW(v.w * f);
        const k = w / v.w;
        const nv = { w, x: pt.x - (pt.x - v.x) * k, y: pt.y - (pt.y - v.y) * k };
        if (panRef.current)
          panRef.current = { px: cx, py: cy, vx: nv.x, vy: nv.y };
        return nv;
      });
    },
    [toSvg],
  );
  const zoomBy = (f: number) =>
    setView((v) => {
      const w = clampW(v.w * f);
      const vhOld = v.w / ratio;
      const vhNew = w / ratio;
      return { x: v.x + (v.w - w) / 2, y: v.y + (vhOld - vhNew) / 2, w };
    });

  // sağ tık basılıyken scroll = zoom
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!panRef.current) return;
      e.preventDefault();
      zoomAt(e.deltaY > 0 ? 1.18 : 1 / 1.18, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // ── sürükleme (palet + taşıma) ─────────────────────────────────────────
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const pt = toSvg(e.clientX, e.clientY);
      if (drag.kind === "new") setDrag({ ...drag, x: pt.x, y: pt.y });
      else
        setParts((ps) =>
          ps.map((p) =>
            p.id === drag.id ? { ...p, x: snap(pt.x - drag.dx), y: snap(pt.y - drag.dy) } : p,
          ),
        );
    };
    const up = (e: PointerEvent) => {
      if (e.button === 2) return;
      if (drag.kind === "new") {
        const r = svgRef.current?.getBoundingClientRect();
        const over =
          r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (over) {
          const pt = toSvg(e.clientX, e.clientY);
          const spec = SPEC[drag.type];
          addPart(drag.type, snap(pt.x - spec.w / 2), snap(pt.y - spec.h / 2));
        }
      } else {
        // taşıma bitti: terminal çakışması varsa otomatik bağla
        const pt = toSvg(e.clientX, e.clientY);
        const others = partsRef.current;
        const cur = others.find((p) => p.id === drag.id);
        if (cur) {
          const movedNow = { ...cur, x: snap(pt.x - drag.dx), y: snap(pt.y - drag.dy) };
          connectPairs(coincidentPairs(movedNow, others));
        }
      }
      setDrag(null);
    };
    // sağ tık: sürüklemeyi iptal et, parça eski yerine dönsün
    const down = (e: PointerEvent) => {
      if (e.button !== 2) return;
      if (drag.kind === "move")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, toSvg]);

  /** Süren taşımayı iptal et: parça eski yerine döner. */
  const cancelDrag = () =>
    setDrag((d) => {
      if (d?.kind === "move")
        setParts((ps) => ps.map((p) => (p.id === d.id ? { ...p, x: d.ox, y: d.oy } : p)));
      return null;
    });

  function rotateSelected() {
    if (!sel || sel.kind !== "part") return;
    setParts((ps) => ps.map((q) => (q.id === sel.id ? { ...q, rot: ((q.rot ?? 0) + 1) % 4 } : q)));
  }

  // ── parça işlemleri ────────────────────────────────────────────────────
  function nextLabel(type: PartType, list: Part[]): string {
    const kind = SPEC[type].kind;
    if (kind === "node" || kind === "gate" || kind === "rail") return "";
    const prefix = SPEC[type].prefix;
    if (!prefix)
      return type.startsWith("tcontact") ? "17-18" : type.endsWith("_no") ? "13-14" : "21-22";
    let n = 1;
    while (list.some((p) => p.label === prefix + n)) n++;
    return prefix + n;
  }

  function addPart(type: PartType, x: number, y: number) {
    const id = `p${++idc.current}${Date.now().toString(36)}`;
    const p: Part = { id, type, x, y, label: nextLabel(type, parts) };
    if (SPEC[type].vert && (domain === "logic" || orient === "h")) p.rot = 1;
    if (SPEC[type].kind === "source") p.volts = 230;
    if (type === "tcoil") {
      p.delay = 3;
      p.tmode = "ein";
    }
    if (type === "contact_no" || type === "contact_nc")
      p.group = parts.find((q) => q.type === "coil")?.label;
    if (type === "tcontact_no" || type === "tcontact_nc")
      p.group = parts.find((q) => q.type === "tcoil")?.label;
    if (type === "pairc_no" || type === "pairc_nc")
      p.group = parts.find((q) => MAIN_SWITCH.includes(q.type))?.label;
    setParts((ps) => [...ps, p]);
    setSel({ kind: "part", id });
    connectPairs(coincidentPairs(p, parts)); // tam bir ucun üstüne bırakıldıysa bağla
  }

  function addNodeAt(x: number, y: number): string {
    const id = `p${++idc.current}${Date.now().toString(36)}`;
    setParts((ps) => [...ps, { id, type: "node", x, y, label: "" }]);
    return `${id}:0`;
  }

  /** Taşınan/bırakılan parçanın terminalleriyle çakışan yabancı terminaller. */
  function coincidentPairs(moved: Part, others: Part[]) {
    const out: { a: string; b: string; x: number; y: number }[] = [];
    for (const m of terminalsOf(moved))
      for (const op of others) {
        if (op.id === moved.id) continue;
        for (const t of terminalsOf(op))
          if (t.x === m.x && t.y === m.y) out.push({ a: m.id, b: t.id, x: t.x, y: t.y });
      }
    return out;
  }

  /** Çakışan terminalleri otomatik kablola (üst üste bırak = bağla). */
  function connectPairs(pairs: { a: string; b: string }[]) {
    if (!pairs.length) return;
    setWires((ws) => {
      const out = [...ws];
      for (const pr of pairs) {
        const dup = out.some(
          (w) => (w.a === pr.a && w.b === pr.b) || (w.a === pr.b && w.b === pr.a),
        );
        if (!dup) out.push({ id: `w${++idc.current}`, a: pr.a, b: pr.b });
      }
      return out;
    });
  }

  /** Kablosu kalmayan Knotenpunkt'lar kablosuyla birlikte yok olur. */
  function pruneOrphanNodes(ps: Part[], ws: Wire[]): Part[] {
    const used = new Set<string>();
    for (const w of ws) {
      used.add(w.a.split(":")[0]);
      used.add(w.b.split(":")[0]);
    }
    return ps.filter((p) => p.type !== "node" || used.has(p.id));
  }

  function removeSelected() {
    if (!sel) return;
    if (sel.kind === "part") {
      const nextWires = wires.filter(
        (w) => !w.a.startsWith(sel.id + ":") && !w.b.startsWith(sel.id + ":"),
      );
      setWires(nextWires);
      setParts((ps) => pruneOrphanNodes(ps.filter((p) => p.id !== sel.id), nextWires));
    } else {
      const nextWires = wires.filter((w) => w.id !== sel.id);
      setWires(nextWires);
      setParts((ps) => pruneOrphanNodes(ps, nextWires));
    }
    setSel(null);
  }

  function updateSel(patch: Partial<Part>) {
    if (!sel || sel.kind !== "part") return;
    setParts((ps) => ps.map((p) => (p.id === sel.id ? { ...p, ...patch } : p)));
  }

  function loadPreset(pr: Preset) {
    resetSim();
    setMode("edit");
    setParts(domain === "logic" ? ensureRails(structuredClone(pr.parts), false) : structuredClone(pr.parts));
    setWires(structuredClone(pr.wires));
  }

  // ── klavye ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === "Delete" || e.key === "Backspace") removeSelected();
      if (e.key === "Escape") {
        setPending(null);
        setPlacing(null);
        setSel(null);
        cancelDrag();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  // ── kablolama ──────────────────────────────────────────────────────────
  function clickTerminal(tid: string) {
    if (mode !== "edit") return;
    if (pending === null) {
      setPending(tid);
      return;
    }
    if (pending === tid) {
      setPending(null);
      return;
    }
    const dup = wires.some(
      (w) => (w.a === pending && w.b === tid) || (w.b === pending && w.a === tid),
    );
    if (!dup) setWires((ws) => [...ws, { id: `w${++idc.current}`, a: pending, b: tid }]);
    setPending(null);
  }

  /** Kabloyu tıklanan noktadan böl: araya Knotenpunkt koy, iki kabloya ayır. */
  function splitWireAt(w: Wire, pt: { x: number; y: number }): string {
    const tid = addNodeAt(snap(pt.x), snap(pt.y));
    setWires((ws) => [
      ...ws.filter((q) => q.id !== w.id),
      { id: `w${++idc.current}a`, a: w.a, b: tid },
      { id: `w${++idc.current}b`, a: tid, b: w.b },
    ]);
    return tid;
  }

  function actuateToggle(id: string) {
    setActuated((a) => ({ ...a, [id]: !a[id] }));
  }
  function actuateMomentary(id: string) {
    setActuated((a) => ({ ...a, [id]: true }));
    const up = () => {
      setActuated((a) => ({ ...a, [id]: false }));
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function partPointerDown(p: Part, e: React.PointerEvent) {
    if (e.button === 2) return;
    e.stopPropagation();
    if (mode === "edit") {
      if (SPEC[p.type].kind === "rail") return;
      const pt = toSvg(e.clientX, e.clientY);
      setSel({ kind: "part", id: p.id });
      setDrag({ kind: "move", id: p.id, dx: pt.x - p.x, dy: pt.y - p.y, ox: p.x, oy: p.y });
      return;
    }
    // simülasyon: kaynak aç/kapa, anahtarları oynat
    if (SPEC[p.type].kind === "source") {
      setParts((ps) => ps.map((q) => (q.id === p.id ? { ...q, enabled: q.enabled === false } : q)));
      return;
    }
    if (p.type === "switch_no" || p.type === "switch_nc") actuateToggle(p.id);
    else if (p.type === "taster_no" || p.type === "taster_nc") actuateMomentary(p.id);
    else if (p.type === "pairc_no" || p.type === "pairc_nc") {
      // eş kontağa tıklamak = asıl düğmeye basmak
      const main = parts.find((q) => MAIN_SWITCH.includes(q.type) && q.label === p.group);
      if (!main) return;
      if (main.type.startsWith("switch")) actuateToggle(main.id);
      else actuateMomentary(main.id);
    }
  }

  // ── kablo yolları (A* + engeller) ──────────────────────────────────────
  const grid = useMemo(() => {
    const boxes = parts.filter((p) => p.type !== "node").map(worldBox);
    const frees = parts.flatMap((p) => terminalsOf(p).map((t) => ({ x: t.x, y: t.y })));
    return buildGrid(boxes, frees);
  }, [parts]);

  const wireDs = useMemo(() => {
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
        let cur: { x: number; y: number } = a;
        for (const p of [...w.pts, b]) {
          if (cur.x !== p.x && cur.y !== p.y) pts.push({ x: cur.x, y: p.y });
          pts.push(p);
          cur = p;
        }
      } else {
        pts = routeWire(a, b, grid);
      }
      m[w.id] = "M " + pts.map((p) => `${p.x} ${p.y}`).join(" L ");
    }
    return m;
  }, [wires, parts, grid]);

  const selPart = sel?.kind === "part" ? parts.find((p) => p.id === sel.id) : undefined;
  const coilLabels = [...new Set(parts.filter((p) => p.type === "coil").map((p) => p.label))];
  const tcoilLabels = [...new Set(parts.filter((p) => p.type === "tcoil").map((p) => p.label))];
  const switchLabels = [
    ...new Set(parts.filter((p) => MAIN_SWITCH.includes(p.type)).map((p) => p.label)),
  ];
  const pendingPos = pending ? termPos(parts, pending) : null;
  const palette = domain === "phys" ? PALETTE_PHYS : PALETTE_LOGIC;
  const presets = domain === "phys" ? PRESETS : LOGIC_PRESETS;

  return (
    <div>
      <h1 className="font-disp text-2xl font-bold text-ink sm:text-3xl">🎛️ Playground</h1>
      <p className="mb-4 mt-1 text-sm italic text-mut sm:text-base">
        {t("pg.lead")}
      </p>

      {/* mod seçimi */}
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex rounded-2xl border border-line bg-panel p-1">
          {(
            [
              ["phys", `⚡ ${t("pg.phys")}`],
              ["logic", `🔢 ${t("pg.logic")}`],
            ] as [Domain, string][]
          ).map(([d, txt]) => (
            <button
              key={d}
              type="button"
              onClick={() => switchDomain(d)}
              className={`rounded-xl px-3 py-1.5 font-disp text-sm font-semibold transition sm:px-4 sm:py-2 ${
                domain === d ? "bg-volt text-black shadow-[0_0_16px_rgba(251,191,36,0.25)]" : "text-mut hover:text-ink"
              }`}
            >
              {txt}
            </button>
          ))}
        </div>
        {domain === "phys" && (
          <div className="flex rounded-2xl border border-line bg-panel p-1">
            {(
              [
                ["v", `⬇ ${t("pg.vert")}`],
                ["h", `➡ ${t("pg.horiz")}`],
              ] as [Orient, string][]
            ).map(([o, txt]) => (
              <button
                key={o}
                type="button"
                onClick={() => setOrientation(o)}
                className={`rounded-xl px-3 py-1.5 text-xs transition ${
                  orient === o ? "bg-spark/20 text-spark" : "text-mut hover:text-ink"
                }`}
              >
                {txt}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={startStop}
          className={`rounded-xl px-4 py-2 font-disp text-sm font-semibold transition ${
            mode === "sim"
              ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/50 hover:bg-rose-500/30"
              : "bg-volt text-black shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:brightness-110"
          }`}
        >
          {mode === "sim" ? `■ ${t("pg.stop")}` : `▶ ${t("pg.start")}`}
        </button>
        <select
          onChange={(e) => {
            const pr = presets.find((p) => p.id === e.target.value);
            if (pr) loadPreset(pr);
            e.target.value = "";
          }}
          defaultValue=""
          aria-label={t("pg.loadPreset")}
          className="min-w-0 max-w-full rounded-xl border border-line bg-panel px-3 py-2 text-sm text-mut outline-none focus:border-volt/60"
        >
          <option value="" disabled>
            📦 {t("pg.loadPreset")}
          </option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {tx(p.name)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            resetSim();
            setMode("edit");
            setParts(domain === "logic" ? ensureRails([], false) : orient === "h" ? ensureRails([], true) : []);
            setWires([]);
          }}
          className="rounded-xl border border-line px-3 py-2 text-sm text-mut transition hover:border-rose-400/50 hover:text-rose-300"
        >
          🗑 {t("pg.clear")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[200px_minmax(0,1fr)_220px] xl:gap-4">
        {/* ── palet (sol) ── */}
        <div className="order-1 min-w-0">
          <div className="card p-2 lg:p-3">
            <p className="mb-2 px-1 font-disp text-xs uppercase tracking-widest text-mut/70">
              {domain === "phys" ? t("pg.parts") : t("pg.logicParts")}
              {mode === "sim" && ` · ${t("pg.stopToEdit")}`}
            </p>
            <div
              className={`flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0 ${
                mode === "sim" ? "pointer-events-none opacity-40" : ""
              }`}
            >
              {palette.map((pt_) => (
                <div
                  key={pt_}
                  onPointerDown={(e) => {
                    lastPointer.current = e.pointerType;
                    if (e.pointerType !== "mouse") return; // dokunmatik: şerit kaydırılabilsin, yerleştirme dokunuşla
                    e.preventDefault();
                    const pt = toSvg(e.clientX, e.clientY);
                    setDrag({ kind: "new", type: pt_, x: pt.x, y: pt.y });
                  }}
                  onClick={() => {
                    if (lastPointer.current === "mouse") return;
                    setPending(null);
                    setPlacing((cur) => (cur === pt_ ? null : pt_));
                  }}
                  className={`flex w-[76px] shrink-0 cursor-grab select-none flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-center text-[10px] leading-tight transition hover:bg-panel2 hover:text-ink active:cursor-grabbing lg:w-auto lg:flex-row lg:gap-2 lg:px-2 lg:py-1 lg:text-left lg:text-xs lg:leading-normal ${
                    placing === pt_ ? "bg-volt/15 text-ink ring-1 ring-volt/70" : "text-mut"
                  }`}
                  title={SPEC[pt_].de}
                >
                  <MiniSymbol type={pt_} />
                  <span>
                    {tx(SPEC[pt_].name)}
                    {deTerm(SPEC[pt_].de) && (
                      <span className="hidden text-[10px] text-mut/60 lg:block">{SPEC[pt_].de}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── özellikler (sağ) ── */}
        <div className="order-3 w-full self-start lg:sticky lg:top-4">
          <div className="card p-4">
            <p className="mb-2 font-disp text-xs uppercase tracking-widest text-mut/70">{t("pg.props")}</p>
            {!sel && <p className="text-xs text-mut">{t("pg.selectHint")}</p>}
            {sel?.kind === "wire" && (
              <button
                type="button"
                onClick={removeSelected}
                className="rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
              >
                {t("pg.delWire")}
              </button>
            )}
            {selPart && (
              <div className="space-y-3 text-sm">
                <p className="font-disp font-semibold text-ink">
                  {tx(SPEC[selPart.type].name)}
                  {deTerm(SPEC[selPart.type].de) && (
                    <span className="block text-[11px] font-normal text-mut">{SPEC[selPart.type].de}</span>
                  )}
                </p>
                {SPEC[selPart.type].kind !== "node" && (
                  <label className="block text-xs text-mut">
                    {t("pg.label")}
                    <input
                      value={selPart.label}
                      onChange={(e) => updateSel({ label: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-2 py-1.5 text-ink outline-none focus:border-volt/60"
                    />
                  </label>
                )}
                {SPEC[selPart.type].kind === "source" && (
                  <>
                    <label className="block text-xs text-mut">
                      {t("pg.volts")}
                      <input
                        type="number"
                        value={selPart.volts ?? 230}
                        onChange={(e) => updateSel({ volts: Number(e.target.value) || 230 })}
                        className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-2 py-1.5 text-ink outline-none focus:border-volt/60"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-mut">
                      <input
                        type="checkbox"
                        checked={selPart.enabled !== false}
                        onChange={(e) => updateSel({ enabled: e.target.checked })}
                        className="accent-[#fbbf24]"
                      />
                      {t("pg.active")}
                    </label>
                  </>
                )}
                {selPart.type === "tcoil" && (
                  <>
                    <label className="block text-xs text-mut">
                      {t("pg.tmode")}
                      <select
                        value={selPart.tmode ?? "ein"}
                        onChange={(e) => updateSel({ tmode: e.target.value as TimerMode })}
                        className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-2 py-1.5 text-ink outline-none focus:border-volt/60"
                      >
                        <option value="ein">{t("pg.tm.ein")}</option>
                        <option value="aus">{t("pg.tm.aus")}</option>
                        <option value="impuls">{t("pg.tm.impuls")}</option>
                        <option value="blink">{t("pg.tm.blink")}</option>
                      </select>
                    </label>
                    <label className="block text-xs text-mut">
                      {t("pg.delay")}
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={selPart.delay ?? 3}
                        onChange={(e) => updateSel({ delay: Number(e.target.value) || 3 })}
                        className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-2 py-1.5 text-ink outline-none focus:border-volt/60"
                      />
                    </label>
                  </>
                )}
                {(selPart.type === "contact_no" || selPart.type === "contact_nc") && (
                  <GroupSelect label={t("pg.grp.coil")} value={selPart.group} options={coilLabels} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "tcontact_no" || selPart.type === "tcontact_nc") && (
                  <GroupSelect label={t("pg.grp.timer")} value={selPart.group} options={tcoilLabels} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "pairc_no" || selPart.type === "pairc_nc") && (
                  <GroupSelect label={t("pg.grp.switch")} value={selPart.group} options={switchLabels} onChange={(g) => updateSel({ group: g })} />
                )}
                <div className="flex flex-wrap gap-2">
                  {SPEC[selPart.type].kind !== "node" && (
                    <button
                      type="button"
                      onClick={rotateSelected}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs text-mut hover:border-spark/50 hover:text-spark"
                    >
                      ↺ {t("pg.rotate")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={removeSelected}
                    className="rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
                  >
                    {t("pg.delPart")}
                  </button>
                </div>
                <p className="rounded-lg border border-line bg-bg/50 p-2 text-[11px] leading-relaxed text-mut">
                  💡 {tx(PART_INFO[selPart.type])}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── tuval (orta) ── */}
        <div className="order-2 min-w-0">
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox={`${view.x} ${view.y} ${view.w} ${viewH}`}
              style={{ aspectRatio: String(ratio), touchAction: "none", WebkitTouchCallout: "none" }}
              className="w-full select-none rounded-xl border border-line bg-[#0c1220]"
              onContextMenu={(e) => e.preventDefault()}
              onPointerDownCapture={(e) => {
                if (e.pointerType !== "touch") return;
                touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (touches.current.size === 2) {
                  // iki parmak: yakınlaştır/kaydır — süren taşıma ya da kaydırma iptal
                  const [a, b] = [...touches.current.values()];
                  const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
                  pinchRef.current = {
                    d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
                    w: view.w,
                    wx: mid.x,
                    wy: mid.y,
                  };
                  panRef.current = null;
                  cancelDrag();
                  e.stopPropagation();
                }
              }}
              onPointerDown={(e) => {
                if (e.button === 2) {
                  if (pending) {
                    setPending(null); // kablo çekişini iptal et
                    return;
                  }
                  if (drag) return;
                  panRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
                  return;
                }
                if (placing && mode === "edit") {
                  // dokunmatik yerleştirme: paletten seçilen parça dokunulan yere konur
                  const pt = toSvg(e.clientX, e.clientY);
                  const spec = SPEC[placing];
                  addPart(placing, snap(pt.x - spec.w / 2), snap(pt.y - spec.h / 2));
                  setPlacing(null);
                  return;
                }
                if (pending && mode === "edit") {
                  // boş alana tıkla → otomatik Knotenpunkt + zincire devam
                  const pt = toSvg(e.clientX, e.clientY);
                  const tid = addNodeAt(snap(pt.x), snap(pt.y));
                  setWires((ws) => [...ws, { id: `w${++idc.current}`, a: pending, b: tid }]);
                  setPending(tid);
                  return;
                }
                setSel(null);
                setPending(null);
                // dokunmatik: boş alanda tek parmak = kaydır
                if (e.pointerType === "touch")
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
                    // başlangıçta parmakların ortasındaki nokta, parmakların altında kalsın
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
                    const r = el.getBoundingClientRect();
                    const s = view.w / r.width;
                    const pr = panRef.current;
                    setView((v) => ({
                      ...v,
                      x: pr.vx - (e.clientX - pr.px) * s,
                      y: pr.vy - (e.clientY - pr.py) * s,
                    }));
                  }
                  return;
                }
                if (pending) setCursor(toSvg(e.clientX, e.clientY));
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
                if (e.pointerType === "touch") return; // dokunmatikte bitişi up/cancel belirler
                panRef.current = null;
              }}
            >
              <defs>
                <pattern id="pgrid" width={20} height={20} patternUnits="userSpaceOnUse">
                  <circle cx={1} cy={1} r={1} fill="rgba(139,154,173,0.15)" />
                </pattern>
              </defs>
              {/* sonsuz grid: görünen alan neresiyse orayı döşe */}
              <rect x={view.x} y={view.y} width={view.w} height={viewH} fill="url(#pgrid)" />

              {/* kablolar */}
              {wires.map((w) => {
                const d = wireDs[w.id];
                const flow = sim?.flow[w.id] ?? 0;
                const isShortPath = sim?.short && flow > 50;
                const live = sim && flow > 0.1;
                const rev = (sim?.dir[w.id] ?? 1) < 0; // akım b→a yönünde: animasyon ters
                const stroke = isShortPath
                  ? "#f87171"
                  : live
                    ? "#fbbf24"
                    : sel?.kind === "wire" && sel.id === w.id
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
                        if (e.button === 2) return;
                        e.stopPropagation();
                        if (mode !== "edit") return;
                        if (pending) {
                          // bekleyen kabloyu bu kablonun üstüne bağla (Brücke)
                          const pt = toSvg(e.clientX, e.clientY);
                          const tid = splitWireAt(w, pt);
                          setWires((ws) => [...ws, { id: `w${++idc.current}c`, a: pending, b: tid }]);
                          setPending(null);
                        } else {
                          setSel({ kind: "wire", id: w.id });
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (mode !== "edit") return;
                        const pt = toSvg(e.clientX, e.clientY);
                        splitWireAt(w, pt);
                      }}
                    />
                  </g>
                );
              })}

              {/* kablolama lastiği */}
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
                const isSel = sel?.kind === "part" && sel.id === p.id;
                const k = (p.rot ?? 0) % 4;
                const lb = localBox(p.type);
                const wb = worldBox(p);
                const simClickable =
                  spec.kind === "source" || MAIN_SWITCH.includes(p.type) || p.type.startsWith("pairc");
                const showLabel =
                  spec.kind !== "source" && spec.kind !== "node" && spec.kind !== "gate";
                return (
                  <g
                    key={p.id}
                    transform={`translate(${p.x} ${p.y})`}
                    className={mode === "edit" || simClickable ? "pg-part" : ""}
                    onPointerDown={(e) => partPointerDown(p, e)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (mode !== "edit" || spec.kind === "node") return;
                      // çift tık: bir tık sola döndür
                      setParts((ps) =>
                        ps.map((q) => (q.id === p.id ? { ...q, rot: ((q.rot ?? 0) + 1) % 4 } : q)),
                      );
                      cancelDrag();
                    }}
                    style={{ cursor: mode === "edit" ? "move" : simClickable ? "pointer" : "default" }}
                  >
                    <g transform={k ? `rotate(${-90 * k})` : undefined}>
                      {/* geniş hitbox */}
                      <rect
                        x={lb.x1}
                        y={lb.y1}
                        width={lb.x2 - lb.x1}
                        height={lb.y2 - lb.y1}
                        fill="transparent"
                      />
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
                        closed={sim?.closed[p.id] ?? p.type.endsWith("_nc")}
                        level={sim?.level[p.id] ?? 0}
                        energized={!!sim?.energized[p.label]}
                      />
                    </g>
                    {showLabel && (
                      <text
                        x={wb.x2 - p.x + 4}
                        y={wb.y1 - p.y + 14}
                        fill="#8b9aad"
                        fontSize={11}
                        fontWeight={600}
                        pointerEvents="none"
                      >
                        {SPEC[p.type].prefix ? p.label : (p.group ?? "?")}
                        {!SPEC[p.type].prefix && (
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

              {/* terminaller */}
              {mode === "edit" &&
                parts.flatMap((p) =>
                  terminalsOf(p).map((t) => (
                    <g
                      key={t.id}
                      className="pg-term"
                      onPointerDown={(e) => {
                        if (e.button === 2) return;
                        e.stopPropagation();
                        clickTerminal(t.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (SPEC[p.type].kind === "rail") return;
                        setPending(null);
                        setSel({ kind: "part", id: p.id });
                      }}
                    >
                      <circle cx={t.x} cy={t.y} r={coarse ? 17 : 12} fill="transparent" />
                      <circle
                        className="dot"
                        cx={t.x}
                        cy={t.y}
                        r={pending === t.id ? 6 : 4.5}
                        fill={pending === t.id ? "#fbbf24" : "#0c1220"}
                        stroke={pending === t.id ? "#fbbf24" : "#22d3ee"}
                        strokeWidth={1.5}
                      />
                    </g>
                  )),
                )}

              {/* sürüklerken çakışan terminal: buraya bırakırsan bağlanır */}
              {drag?.kind === "move" &&
                (() => {
                  const mp = parts.find((p) => p.id === drag.id);
                  if (!mp) return null;
                  return coincidentPairs(mp, parts).map((h, i) => (
                    <circle
                      key={i}
                      cx={h.x}
                      cy={h.y}
                      r={11}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      className="snap-hit"
                      pointerEvents="none"
                    />
                  ));
                })()}

              {/* palet hayaleti */}
              {drag?.kind === "new" && (
                <g
                  transform={`translate(${snap(drag.x - SPEC[drag.type].w / 2)} ${snap(drag.y - SPEC[drag.type].h / 2)})`}
                  opacity={0.5}
                  pointerEvents="none"
                >
                  <g
                    transform={
                      SPEC[drag.type].vert && (domain === "logic" || orient === "h")
                        ? "rotate(-90)"
                        : undefined
                    }
                  >
                    <PartSymbol
                      part={{ id: "ghost", type: drag.type, x: 0, y: 0, label: "" }}
                      sim={false}
                      closed={drag.type.endsWith("_nc")}
                    />
                  </g>
                </g>
              )}
            </svg>

            {/* büyüteç */}
            <div className="absolute right-2 top-2 flex flex-col gap-1">
              <button type="button" onClick={() => zoomBy(1 / 1.3)} title={t("pg.zoomIn")} aria-label={t("pg.zoomIn")} className="pg-zoom">
                +
              </button>
              <button type="button" onClick={() => zoomBy(1.3)} title={t("pg.zoomOut")} aria-label={t("pg.zoomOut")} className="pg-zoom">
                −
              </button>
              <button
                type="button"
                onClick={() => setView(homeView(narrow, railed))}
                title={t("pg.zoomReset")}
                aria-label={t("pg.zoomReset")}
                className="pg-zoom text-sm"
              >
                ⤢
              </button>
            </div>

            {/* seçim araç çubuğu: dokunmatikte çift tık / Del yerine */}
            {mode === "edit" && sel && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {selPart && SPEC[selPart.type].kind !== "node" && (
                  <button
                    type="button"
                    onClick={rotateSelected}
                    title={t("pg.rotate")}
                    aria-label={t("pg.rotate")}
                    className="pg-zoom"
                  >
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

          {/* durum çubuğu */}
          <div className="mt-3 space-y-2 text-sm">
            {sim?.short && (
              <p className="rounded-xl border border-rose-400/50 bg-rose-500/15 px-4 py-2.5 font-semibold text-rose-300">
                💥 {t("pg.short")}
                {domain === "logic" && ` ${t("pg.shortLogic")}`} {t("pg.shortFix")}
              </p>
            )}
            {sim?.chatter && !sim.short && (
              <p className="rounded-xl border border-volt/40 bg-volt/10 px-4 py-2.5 text-volt">
                🌀 {domain === "logic" ? t("pg.chatterLogic") : t("pg.chatterPhys")}
              </p>
            )}
            {sim && !sim.hasSource && (
              <p className="rounded-xl border border-line bg-panel px-4 py-2.5 text-mut">
                🔌 {domain === "logic" ? t("pg.noSourceLogic") : t("pg.noSourcePhys")}
              </p>
            )}
            {sim && sim.hasSource && !sim.short && !sim.chatter && (
              <p className="rounded-xl border border-line bg-panel px-4 py-2.5 text-mut">
                ⚡ {rich(domain === "phys" ? t("pg.runningPhys") : t("pg.runningLogic"))}
              </p>
            )}
            {mode === "edit" && (
              <p className="rounded-xl border border-line bg-panel px-4 py-2.5 text-xs leading-relaxed text-mut">
                🛠️ {rich(coarse ? t("pg.editTouch") : t("pg.editMouse"))}
                {pending && <span className="ml-1 text-spark"> {t("pg.pendingHint")}</span>}
                {placing && (
                  <span className="ml-1 text-volt"> {t("pg.placeHint", { name: tx(SPEC[placing].name) })}</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* mini rehber */}
      <div className="card mt-6 p-5 text-sm leading-relaxed text-mut">
        <h3 className="mb-2 font-disp text-sm uppercase tracking-widest text-mut">🎓 {t("pg.guideTitle")}</h3>
        <p>
          {rich(t("pg.guide"))}
        </p>
      </div>
    </div>
  );
}

function GroupSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string | undefined) => void;
}) {
  const choose = useI18n().t("pg.choose");
  return (
    <label className="block text-xs text-mut">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="mt-1 w-full rounded-lg border border-line bg-bg/60 px-2 py-1.5 text-ink outline-none focus:border-volt/60"
      >
        <option value="">{choose}</option>
        {options.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
    </label>
  );
}
