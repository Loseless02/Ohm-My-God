import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LedColor, MotorConn, Part, PartType, TimerMode, Wire } from "./types";
import { SPEC, angleOf, snap } from "./types";
import { simulateLogic, type SimResult } from "./sim";
import { simulate3, type Mem3 } from "./sim3";
import { Engine } from "./engine";
import { MiniSymbol } from "./parts";
import { CUSTOM_PRESETS, EL_PRESETS, LOGIC_PRESETS, POWER_PRESETS, PRESETS } from "./presets";
import { PART_INFO } from "./info";
import Board, { type BoardApi, type Contact, type Ghost, type Probes, type Sel, type Snap, type Which } from "./Board";
import { MAIN_SWITCH, removeItem } from "./ops";
import { PANES, downloadCircuit, parseCircuitFile, type Circuit, type Domain, type Orient } from "./file";
import { PARAMS, pn, ps, si, type ParamDef } from "./params";
import FloatPanel, { type PanelPos } from "./FloatPanel";
import Meter, { fmt3, type MeterData, type MeterMode } from "./Meter";
import Calc from "./Calc";
import type { Pt } from "./route";
import { adminToken, savePresetAsAdmin } from "../lib/admin";
import { rich, useI18n } from "../i18n";
import type { UIKey } from "../i18n/ui";

const LS4 = "omg-playground-v4";
const LSP = "omg-pg-panels-v1";

type Store = Record<Domain, { panes: Record<string, Circuit>; orient: Orient; free: boolean }>;
type GroupKey = "src" | "sw" | "relay" | "load" | "gate" | "power" | "passive" | "semi" | "ic" | "prot";
type Palette = [GroupKey, PartType[]][];
type PanelId = "parts" | "props" | "meter" | "calc" | "guide";

const SW: PartType[] = ["switch_no", "switch_nc", "taster_no", "taster_nc", "pairc_no", "pairc_nc"];
const RELAY: PartType[] = ["coil", "contact_no", "contact_nc", "contact_co", "relay_ss", "tcoil", "tcontact_no", "tcontact_nc"];

const PALETTES: Record<string, Palette> = {
  phys: [
    ["src", ["source", "source2"]],
    ["sw", SW],
    ["relay", RELAY],
    ["load", ["lamp", "led", "fluo", "heater", "motor"]],
    ["prot", ["fuse"]],
  ],
  el: [
    ["src", ["fgen", "source2"]],
    ["passive", ["res", "pot", "cap", "ecap", "ind", "ldr", "ntc"]],
    ["semi", ["diode", "zener", "led_d", "bridge", "npn", "pnp", "nmos"]],
    ["ic", ["reg", "opamp", "mcu"]],
    ["sw", ["switch_no", "switch_nc", "taster_no", "taster_nc", "coil", "contact_no", "contact_nc", "contact_co", "relay_ss"]],
    ["load", ["lamp", "dcmotor", "xfmr", "fuse", "heater"]],
  ],
  logic: [
    ["sw", ["switch_no", "switch_nc", "taster_no", "taster_nc"]],
    ["gate", ["and", "or", "not", "nand", "nor", "xor"]],
    ["load", ["lamp", "led"]],
  ],
  steuer: [
    ["src", ["source", "source2"]],
    ["sw", SW],
    ["relay", [...RELAY, "ol_nc", "ol_no"]],
    ["load", ["lamp", "led"]],
    ["prot", ["fuse"]],
  ],
  last: [
    ["src", ["netz3"]],
    ["power", ["q3", "contact3", "ol3"]],
    ["load", ["motor3", "lamp", "fluo"]],
  ],
};

const GROUP_KEY: Record<GroupKey, UIKey> = {
  src: "pg.g.src",
  sw: "pg.g.sw",
  relay: "pg.g.relay",
  load: "pg.g.load",
  gate: "pg.g.gate",
  power: "pg.g.power",
  passive: "pg.g.passive",
  semi: "pg.g.semi",
  ic: "pg.g.ic",
  prot: "pg.g.prot",
};

const STATE_TR: Record<string, string> = {
  burnt: "yandı (tıkla: yenisini tak)",
  blown: "attı (tıkla: yenile)",
  smoke: "yandı, duman (tıkla: yenile)",
  trip: "LS attı (tıkla: kur)",
  prot: "termik koruma açtı — soğuyunca devam",
  sd: "aşırı ısındı, kendini kapattı",
};

function ensureRails(list: Part[], withVolts: boolean): Part[] {
  const out = [...list];
  if (!out.some((p) => p.type === "rail_l"))
    out.push({ id: "railL", type: "rail_l", x: 60, y: 40, label: "L", ...(withVolts ? { volts: 230 } : {}) });
  if (!out.some((p) => p.type === "rail_n")) out.push({ id: "railN", type: "rail_n", x: 900, y: 40, label: "N" });
  return out;
}

/** Üst L / alt N baraları (kaynak sürüklemeye gerek yok). */
function ensureBus(list: Part[], el: boolean): Part[] {
  const out = list.filter((p) => p.type !== "rail_l" && p.type !== "rail_n");
  if (!out.some((p) => p.type === "bus_l"))
    out.push({ id: "busL", type: "bus_l", x: 0, y: 0, label: el ? "+" : "L", volts: el ? 12 : 230, ...(el ? { prm: { ac: "dc", In: 3 } } : {}) });
  if (!out.some((p) => p.type === "bus_n")) out.push({ id: "busN", type: "bus_n", x: 0, y: 560, label: el ? "0V" : "N" });
  return out;
}
const isRailWire = (w: Wire) => /^(rail[LN]|bus[LN]):/.test(w.a) || /^(rail[LN]|bus[LN]):/.test(w.b);

const clone = <T,>(v: T): T => structuredClone(v);

function defaults(): Store {
  const pw = POWER_PRESETS[0];
  const el = EL_PRESETS[0];
  return {
    phys: { panes: { main: { parts: clone(PRESETS[1].parts), wires: clone(PRESETS[1].wires) } }, orient: "v", free: false },
    el: { panes: { main: { parts: clone(el.parts), wires: clone(el.wires) } }, orient: "b", free: false },
    logic: { panes: { main: { parts: clone(LOGIC_PRESETS[0].parts), wires: clone(LOGIC_PRESETS[0].wires) } }, orient: "h", free: false },
    power: { panes: { steuer: clone(pw.steuer), last: clone(pw.last) }, orient: "v", free: false },
  };
}

function loadStore(): Store {
  const d = defaults();
  try {
    const raw = localStorage.getItem(LS4) ?? localStorage.getItem("omg-playground-v3");
    if (raw) {
      const s = JSON.parse(raw);
      for (const k of ["phys", "el", "logic", "power"] as Domain[]) {
        if (!s[k]) continue;
        const f = parseCircuitFile(JSON.stringify({ app: "ohm-my-god", kind: "circuit", domain: k, ...s[k] }));
        if (f) d[k] = { panes: f.panes, orient: k === "logic" ? "h" : k === "el" ? "b" : (f.orient ?? "v"), free: !!f.free };
      }
    }
  } catch {
    /* bozuk kayıt → varsayılan */
  }
  return d;
}

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

interface TState {
  onSince: number | null;
  offSince: number | null;
  start: number | null;
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
    case "treppe":
      return t.start !== null && now - t.start < d;
  }
}

/** "4,7k" "100n" "10µ" "1e6" → sayı. */
function parseSI(s: string): number | null {
  const m = /^\s*([-+]?\d*[.,]?\d+(?:e[-+]?\d+)?)\s*([pnuµmkKMG]?)/.exec(s);
  if (!m) return null;
  const v = parseFloat(m[1].replace(",", "."));
  const mult: Record<string, number> = { p: 1e-12, n: 1e-9, u: 1e-6, "µ": 1e-6, m: 1e-3, k: 1e3, K: 1e3, M: 1e6, G: 1e9 };
  return Number.isFinite(v) ? v * (m[2] ? (mult[m[2]] ?? 1) : 1) : null;
}

function defaultPanels(w: number, h: number): Record<PanelId, PanelPos> {
  return {
    parts: { x: 8, y: 8, w: 236, h: Math.min(h - 16, 620), open: true },
    props: { x: Math.max(260, w - 276), y: 8, w: 268, h: Math.min(h - 16, 440), open: true },
    meter: { x: Math.max(260, w - 276), y: Math.min(h - 200, 456), w: 268, h: Math.max(180, Math.min(h - 470, 480)), open: false },
    calc: { x: Math.max(260, w - 560), y: 8, w: 270, open: false },
    guide: { x: 256, y: 8, w: 440, h: Math.min(h - 16, 360), open: false },
  };
}

export default function Playground() {
  const { t, tx, deTerm } = useI18n();
  const [initial] = useState(loadStore);
  const storeRef = useRef(initial);
  const [domain, setDomain] = useState<Domain>("phys");
  const [orient, setOrient] = useState<Orient>(initial.phys.orient);
  const [free, setFree] = useState(initial.phys.free);
  const [panes, setPanes] = useState<Record<string, Circuit>>(initial.phys.panes);
  const [activePane, setActivePane] = useState("main");
  const [mode, setMode] = useState<"edit" | "sim">("edit");
  const [sel, setSel] = useState<Sel>(null);
  const [placing, setPlacing] = useState<PartType | null>(null);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [hoverType, setHoverType] = useState<PartType | null>(null);
  const [actuated, setActuated] = useState<Record<string, boolean>>({});
  const [held, setHeld] = useState<Record<string, boolean>>({});
  const [fitKey, setFitKey] = useState(0);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [admin, setAdmin] = useState(() => !!adminToken());
  const [coarse] = useState(() => mq("(pointer: coarse)"));
  const [full, setFull] = useState(false);
  const [snaps, setSnaps] = useState<Record<string, Snap | null>>({});
  const [panels, setPanels] = useState<Record<PanelId, PanelPos> | null>(() => {
    try {
      const r = localStorage.getItem(LSP);
      return r ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  });
  const [zs, setZs] = useState<PanelId[]>(["guide", "calc", "meter", "props", "parts"]);
  const [probes, setProbes] = useState<(Probes & { pane: string }) | null>(null);
  const [contacts, setContacts] = useState<Record<Which, Contact | null>>({ red: null, black: null });
  const [meterMode, setMeterMode] = useState<MeterMode>("V");
  const [meterData, setMeterData] = useState<MeterData>({ red: null, black: null, v: null, part: null, wire: null, same: false });
  const [live, setLive] = useState<ReturnType<Engine["partReading"]>>(null);
  const [slow, setSlow] = useState(1);
  const boards = useRef<Record<string, BoardApi | null>>({});
  const areaRef = useRef<HTMLDivElement>(null);
  const engines = useRef<Record<string, Engine>>({});
  const timersRef = useRef<Record<string, TState>>({});
  const ssPrev = useRef<Record<string, boolean>>({});
  const ssLast = useRef<Record<string, number>>({});
  const mem3 = useRef<Mem3>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const paneIds = PANES[domain];
  const allParts = useMemo(() => paneIds.flatMap((k) => panes[k]?.parts ?? []), [panes, paneIds]);
  const railed = domain === "logic" || orient === "h";
  const isEl = domain === "el";

  // ── kalıcılık ──────────────────────────────────────────────────────────
  useEffect(() => {
    storeRef.current[domain] = { panes, orient, free };
    try {
      localStorage.setItem(LS4, JSON.stringify(storeRef.current));
    } catch {
      /* kayıt şart değil */
    }
  }, [panes, orient, domain, free]);

  useEffect(() => {
    if (!panels) return;
    try {
      localStorage.setItem(LSP, JSON.stringify(panels));
    } catch {
      /* önemli değil */
    }
  }, [panels]);

  // panel yerleşimi: ilk açılışta çalışma alanının boyutuna göre
  useEffect(() => {
    if (panels || !areaRef.current) return;
    const r = areaRef.current.getBoundingClientRect();
    setPanels(defaultPanels(r.width, r.height));
  }, [panels]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    document.body.style.overflow = full ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [full]);

  const setPaneParts = useCallback(
    (pane: string) => (fn: (ps: Part[]) => Part[]) => setPanes((s) => ({ ...s, [pane]: { ...s[pane], parts: fn(s[pane].parts) } })),
    [],
  );
  const setPaneWires = useCallback(
    (pane: string) => (fn: (ws: Wire[]) => Wire[]) => setPanes((s) => ({ ...s, [pane]: { ...s[pane], wires: fn(s[pane].wires) } })),
    [],
  );
  const setters = useMemo(
    () => Object.fromEntries(["main", "steuer", "last"].map((k) => [k, { parts: setPaneParts(k), wires: setPaneWires(k) }])),
    [setPaneParts, setPaneWires],
  );
  const register = useCallback((pane: string, api: BoardApi | null) => {
    boards.current[pane] = api;
  }, []);

  const heldFull = useMemo(() => {
    const h: Record<string, boolean> = {};
    for (const p of allParts) if (p.type === "relay_ss") h[p.label] = false;
    return { ...h, ...held };
  }, [allParts, held]);

  // döngü içinden güncel değerlere erişim
  const R = useRef({ allParts, actuated, heldFull, panes, domain, probes, contacts, sel });
  R.current = { allParts, actuated, heldFull, panes, domain, probes, contacts, sel };

  const computeTimerDone = useCallback((ps: Part[]) => {
    const now = Date.now();
    const done: Record<string, boolean> = {};
    for (const p of ps) if (p.type === "tcoil") done[p.label] = timedActive(p, timersRef.current[p.id], now);
    return done;
  }, []);

  const withLabels = (ps: Part[], act: Record<string, boolean>) => {
    const m: Record<string, boolean> = { ...act };
    for (const p of ps) if (MAIN_SWITCH.includes(p.type)) m["§" + p.label] = !!act[p.id];
    return m;
  };

  // ── simülasyon motoru: devre değişince yeniden kur (durum korunur) ─────
  const ctlPane = domain === "power" ? "steuer" : "main";
  useEffect(() => {
    if (mode !== "sim" || domain === "logic") {
      engines.current = {};
      return;
    }
    const c = panes[ctlPane];
    if (!c) return;
    engines.current[ctlPane] = new Engine(c.parts, c.wires, engines.current[ctlPane]);
  }, [mode, domain, panes, ctlPane]);

  /** Probların değdiği yerlere göre ölçü aleti verisi. */
  const readMeter = (eng: Engine | null, next: Record<string, Snap | null>): MeterData => {
    const { contacts: c, probes: pr, panes: pp } = R.current;
    const red = c.red;
    const black = c.black;
    const out: MeterData = { red, black, v: null, part: null, wire: null, same: false };
    if (!red || !black || !pr) return out;
    const paneParts = pp[pr.pane]?.parts ?? [];
    const samePart = red.part && red.part === black.part && red.tid !== black.tid ? paneParts.find((p) => p.id === red.part) : undefined;
    if (eng && red.tid && black.tid) {
      const na = eng.nodeOf(red.tid);
      const nb = eng.nodeOf(black.tid);
      if (na !== undefined && nb !== undefined) {
        out.v = eng.read(na, nb);
        out.same = na === nb;
      }
      if (samePart) {
        const r = eng.partReading(samePart.id);
        if (r) {
          let Rv = r.R;
          if (SPEC[samePart.type].kind === "switch") Rv = next[pr.pane]?.closed[samePart.id] ? 0.001 : Infinity;
          out.part = { ...r, R: Rv, name: `${samePart.label} · ${tx(SPEC[samePart.type].name)}` };
        }
      }
      if (red.wire && red.wire === black.wire) out.wire = eng.wireReading(red.wire);
    } else if (pr.pane === "last" && red.tid && black.tid) {
      // trifaze güç devresi: fazörlerden
      const s3 = next.last as (SimResult & { phasor?: Record<string, [number, number]> }) | null;
      const a = s3?.phasor?.[red.tid];
      const b = s3?.phasor?.[black.tid];
      if (a && b) {
        const re = a[0] - b[0];
        const im = a[1] - b[1];
        const rms = Math.hypot(re, im);
        const ph = Math.atan2(im, re);
        const wave = Array.from({ length: 160 }, (_, i) => rms * Math.SQRT2 * Math.cos(2 * Math.PI * 50 * i * 2.5e-4 + ph));
        out.v = { dc: 0, rms, ac: rms, min: -rms * Math.SQRT2, max: rms * Math.SQRT2, f: rms > 1e-3 ? 50 : 0, wave, dt: 2.5e-4 };
        out.same = rms < 1e-9;
      }
    }
    return out;
  };

  // ── simülasyon döngüsü ─────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "sim" || domain === "logic") return;
    let raf = 0;
    let last = performance.now();
    let lastUi = 0;
    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const cur = R.current;
      const eng = engines.current[ctlPane];
      if (eng) {
        const ctlParts = cur.panes[ctlPane]?.parts ?? [];
        eng.setInputs({ act: withLabels(cur.allParts, cur.actuated), timerDone: computeTimerDone(ctlParts), held: cur.heldFull });
        eng.run(dt);
        const tnow = Date.now();
        for (const p of ctlParts) {
          if (p.type === "tcoil") {
            const tm = (timersRef.current[p.id] ??= { onSince: null, offSince: null, start: null });
            const on = !!eng.energized[p.label];
            if (on && tm.onSince === null) {
              tm.onSince = tnow;
              tm.offSince = null;
              tm.start = tnow;
            }
            if (!on && tm.onSince !== null) {
              tm.onSince = null;
              tm.offSince = tnow;
            }
          }
          if (p.type === "relay_ss") {
            const on = !!eng.energized[p.label];
            if (on && !ssPrev.current[p.label] && tnow - (ssLast.current[p.label] ?? 0) > 150) {
              ssLast.current[p.label] = tnow;
              setHeld((h) => ({ ...h, [p.label]: !h[p.label] }));
            }
            ssPrev.current[p.label] = on;
          }
        }
      }
      if (now - lastUi > 60) {
        const next: Record<string, Snap | null> = {};
        if (eng) next[ctlPane] = eng.snapshot();
        if (cur.domain === "power" && cur.panes.last) {
          const latch: Record<string, boolean> = {};
          for (const p of cur.allParts) if (p.type === "relay_ss") latch[p.label] = !!cur.heldFull[p.label];
          const r3 = simulate3(cur.panes.last.parts, cur.panes.last.wires, {
            state: { ...(eng?.energized ?? {}), ...latch },
            actuated: cur.actuated,
            held: cur.heldFull,
            mem: mem3.current,
            dt: Math.min(0.2, (now - (lastUi || now)) / 1000),
          });
          next.last = r3;
          // motor koruma rölesi kendiliğinden attı / şalter kısa devrede açtı
          for (const tr of r3.trips) {
            if (tr.startsWith("§Q:")) setActuated((a) => ({ ...a, [tr.slice(3)]: true }));
            else setHeld((h) => ({ ...h, [tr]: true }));
          }
        }
        setSnaps(next);
        if (eng) setSlow(eng.slow);
        const sp = cur.sel?.kind === "part" ? cur.sel : null;
        setLive(sp && eng && sp.pane === ctlPane ? eng.partReading(sp.id) : null);
        setMeterData(readMeter(cur.probes?.pane === ctlPane ? (eng ?? null) : null, next));
        lastUi = now;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, domain, ctlPane]);

  // düzenleme modunda ölçü aleti sadece temasları gösterir
  useEffect(() => {
    if (mode === "sim") return;
    setMeterData({ red: contacts.red, black: contacts.black, v: null, part: null, wire: null, same: false });
  }, [contacts, mode]);

  const resetSim = () => {
    setActuated({});
    setHeld({});
    timersRef.current = {};
    ssPrev.current = {};
    mem3.current = {};
    engines.current = {};
    setSnaps({});
    setLive(null);
    setPlacing(null);
  };
  const startStop = () => {
    resetSim();
    setMode((m) => (m === "edit" ? "sim" : "edit"));
  };

  // ── mod / yerleşim geçişleri ───────────────────────────────────────────
  function openCircuit(d: Domain, next: Record<string, Circuit>, o: Orient, fr: boolean) {
    resetSim();
    setSel(null);
    setMode("edit");
    setDomain(d);
    const oo: Orient = d === "logic" ? "h" : d === "power" ? "v" : d === "el" ? "b" : o;
    setOrient(oo);
    setFree(fr);
    const fixed = { ...next };
    if (d === "logic") fixed.main = { ...fixed.main, parts: ensureRails(fixed.main.parts, false) };
    if (d === "phys" && oo === "h") fixed.main = { ...fixed.main, parts: ensureRails(fixed.main.parts, true) };
    if ((d === "phys" && oo === "b") || d === "el") fixed.main = { ...fixed.main, parts: ensureBus(fixed.main.parts, d === "el") };
    setPanes(fixed);
    setActivePane(PANES[d][0]);
    setProbes(null);
    setPanels((ps) => (ps ? { ...ps, meter: { ...ps.meter, open: false } } : ps));
    setFitKey((k) => k + 1);
  }

  function switchDomain(d: Domain) {
    if (d === domain) return;
    storeRef.current[domain] = { panes, orient, free };
    const s = storeRef.current[d];
    openCircuit(d, s.panes, s.orient, s.free);
  }

  function setOrientation(o: Orient) {
    if (o === orient || domain !== "phys") return;
    setOrient(o);
    setPanes((s) => {
      let parts = s.main.parts.map((p) => (SPEC[p.type].vert ? { ...p, rot: o === "h" ? 1 : 0, ...(free ? { angle: o === "h" ? 90 : 0 } : {}) } : p));
      let wires = s.main.wires;
      parts = parts.filter((p) => !["rail_l", "rail_n", "bus_l", "bus_n"].includes(p.type));
      wires = wires.filter((w) => !isRailWire(w));
      if (o === "h") parts = ensureRails(parts, true);
      if (o === "b") parts = ensureBus(parts, false);
      return { main: { parts, wires } };
    });
    setFitKey((k) => k + 1);
  }

  /** Izgara ↔ serbest: kablo yolları dondurulur ya da ızgaraya oturtulur. */
  function toggleFree() {
    const toFree = !free;
    setPanes((s) => {
      const out: Record<string, Circuit> = {};
      for (const k of Object.keys(s)) {
        const c = s[k];
        if (toFree) {
          const routes = boards.current[k]?.routes() ?? {};
          out[k] = {
            parts: c.parts.map((p) => ({ ...p, angle: angleOf(p) })),
            wires: c.wires.map((w) => {
              const r = routes[w.id];
              return r && r.length > 2 ? { id: w.id, a: w.a, b: w.b, pts: r.slice(1, -1) } : { id: w.id, a: w.a, b: w.b };
            }),
          };
        } else {
          out[k] = {
            parts: c.parts.map((p) => {
              const { angle, ...rest } = p;
              return { ...rest, x: snap(p.x), y: snap(p.y), rot: (((Math.round((angle ?? (p.rot ?? 0) * 90) / 90) % 4) + 4) % 4) };
            }),
            wires: c.wires.map((w) => ({ id: w.id, a: w.a, b: w.b })),
          };
        }
      }
      return out;
    });
    setFree(toFree);
  }

  function clearAll() {
    const empty: Record<string, Circuit> = {};
    for (const k of paneIds) empty[k] = { parts: [], wires: [] };
    openCircuit(domain, empty, orient, free);
  }

  // ── hazır devreler ─────────────────────────────────────────────────────
  const presetOptions = useMemo(() => {
    const builtIn = domain === "phys" ? PRESETS : domain === "logic" ? LOGIC_PRESETS : domain === "el" ? EL_PRESETS : POWER_PRESETS;
    return [
      ...builtIn.map((p) => ({ id: p.id, name: tx(p.name), custom: false })),
      ...CUSTOM_PRESETS[domain].map((p) => ({ id: p.id, name: p.name, custom: true })),
    ];
  }, [domain, tx]);

  function loadPreset(id: string) {
    const custom = CUSTOM_PRESETS[domain].find((p) => p.id === id);
    if (custom) return openCircuit(domain, clone(custom.panes), custom.orient ?? orient, false);
    if (domain === "power") {
      const pr = POWER_PRESETS.find((p) => p.id === id);
      if (pr) openCircuit("power", { steuer: clone(pr.steuer), last: clone(pr.last) }, "v", false);
      return;
    }
    const list = domain === "phys" ? PRESETS : domain === "el" ? EL_PRESETS : LOGIC_PRESETS;
    const pr = list.find((p) => p.id === id);
    if (!pr) return;
    const hasBus = pr.parts.some((p) => p.type === "bus_l");
    openCircuit(domain, { main: { parts: clone(pr.parts), wires: clone(pr.wires) } }, domain === "logic" ? "h" : hasBus ? "b" : "v", false);
  }

  // ── dosya ──────────────────────────────────────────────────────────────
  const currentFile = () => ({ app: "ohm-my-god" as const, kind: "circuit" as const, version: 1 as const, domain, orient, free, panes });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 2_000_000) return setNotice({ ok: false, text: t("pg.loadErr") });
    const parsed = parseCircuitFile(await f.text());
    if (!parsed) return setNotice({ ok: false, text: t("pg.loadErr") });
    openCircuit(parsed.domain, parsed.panes, parsed.orient ?? "v", !!parsed.free);
    setNotice({ ok: true, text: t("pg.loaded", { mode: t(`pg.${parsed.domain}` as UIKey) }) });
  }

  async function publish() {
    const name = window.prompt(t("pg.admin.name"))?.trim();
    if (!name) return;
    const desc = window.prompt(t("pg.admin.desc"))?.trim() ?? "";
    setNotice({ ok: true, text: t("pg.admin.saving") });
    const r = await savePresetAsAdmin({ domain, name, desc, orient, panes });
    if (r === "expired") setAdmin(false);
    setNotice(r === "ok" ? { ok: true, text: t("pg.admin.saved") } : { ok: false, text: t("pg.admin.err") });
  }

  // ── seçim / klavye ─────────────────────────────────────────────────────
  const removeSelected = useCallback(() => {
    if (!sel) return;
    const sp = panes[sel.pane]?.parts.find((p) => p.id === sel.id);
    if (sp && SPEC[sp.type].kind === "rail") return;
    setPanes((s) => ({ ...s, [sel.pane]: removeItem(s[sel.pane].parts, s[sel.pane].wires, sel.kind, sel.id) }));
    setSel(null);
  }, [sel, panes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tg = e.target as HTMLElement;
      if (tg instanceof HTMLInputElement || tg instanceof HTMLSelectElement || tg instanceof HTMLTextAreaElement) return;
      if ((e.key === "Delete" || e.key === "Backspace") && mode === "edit") removeSelected();
      if (e.key === "Escape") {
        setPlacing(null);
        setSel(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [removeSelected, mode]);

  const selPart = sel?.kind === "part" ? panes[sel.pane]?.parts.find((p) => p.id === sel.id) : undefined;
  function updateSel(patch: Partial<Part>) {
    if (!sel || sel.kind !== "part") return;
    setPaneParts(sel.pane)((ps) => ps.map((p) => (p.id === sel.id ? { ...p, ...patch } : p)));
  }
  function setParam(d: ParamDef, v: number | string) {
    if (!selPart) return;
    if (d.field === "volts" && typeof v === "number") return updateSel({ volts: v });
    updateSel({ prm: { ...(selPart.prm ?? {}), [d.k]: v } });
  }
  const labelsOf = (types: PartType[]) => [...new Set(allParts.filter((p) => types.includes(p.type)).map((p) => p.label))];

  // ── simülasyonda tıklama ───────────────────────────────────────────────
  function actuateToggle(id: string) {
    setActuated((a) => ({ ...a, [id]: !a[id] }));
  }
  function actuateMomentary(id: string) {
    setActuated((a) => ({ ...a, [id]: true }));
    const t0 = performance.now();
    const up = () => {
      // kısa tıklamada bile en az 150 ms basılı say (bobin bir periyotta çeksin)
      const left = Math.max(0, 150 - (performance.now() - t0));
      setTimeout(() => setActuated((a) => ({ ...a, [id]: false })), left);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }
  const onSimDown = (pane: string) => (p: Part) => {
    const eng = engines.current[pane];
    if (eng?.isBroken(p.id)) {
      eng.repair(p.id);
      return;
    }
    const kind = SPEC[p.type].kind;
    if (kind === "source" || kind === "source3" || p.type === "bus_l") {
      setPaneParts(pane)((ps) => ps.map((q) => (q.id === p.id ? { ...q, enabled: q.enabled === false } : q)));
      return;
    }
    if (p.type === "switch_no" || p.type === "switch_nc" || p.type === "q3") actuateToggle(p.id);
    else if (p.type === "taster_no" || p.type === "taster_nc") actuateMomentary(p.id);
    else if (p.type === "ol3") setHeld((h) => ({ ...h, [p.label]: !h[p.label] }));
    else if (p.type === "pairc_no" || p.type === "pairc_nc") {
      const main = allParts.find((q) => MAIN_SWITCH.includes(q.type) && q.label === p.group);
      if (!main) return;
      if (main.type.startsWith("switch")) actuateToggle(main.id);
      else actuateMomentary(main.id);
    }
  };

  // ── palet ──────────────────────────────────────────────────────────────
  const paletteKey = domain === "power" ? activePane : domain;
  const palette = PALETTES[paletteKey];
  const dragStart = useRef<{ type: PartType; x: number; y: number; moved: boolean } | null>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragStart.current;
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
      if (d.moved) setGhost({ type: d.type, cx: e.clientX, cy: e.clientY });
    };
    const up = (e: PointerEvent) => {
      const d = dragStart.current;
      if (!d) return;
      dragStart.current = null;
      setGhost(null);
      if (d.moved) {
        for (const api of Object.values(boards.current)) if (api?.drop(d.type, e.clientX, e.clientY)) return;
      } else setPlacing((cur) => (cur === d.type ? null : d.type));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const info = hoverType ?? placing ?? selPart?.type ?? null;

  // ── paneller ───────────────────────────────────────────────────────────
  const P = panels;
  const setPanel = (id: PanelId, pos: PanelPos) => setPanels((pp) => (pp ? { ...pp, [id]: pos } : pp));
  const focusPanel = (id: PanelId) => setZs((z) => (z[z.length - 1] === id ? z : [...z.filter((x) => x !== id), id]));
  function recallProbes() {
    const pane = domain === "power" ? activePane : "main";
    const v = boards.current[pane]?.view();
    if (!v) return;
    setProbes({ pane, red: { x: v.x + v.w * 0.62, y: v.y + v.h * 0.45 }, black: { x: v.x + v.w * 0.7, y: v.y + v.h * 0.6 } });
  }
  const togglePanel = (id: PanelId) => {
    if (!P) return;
    const open = !P[id].open;
    setPanel(id, { ...P[id], open, min: false });
    if (open) focusPanel(id);
    if (id === "meter") {
      if (open) recallProbes();
      else setProbes(null);
    }
  };
  const onProbeMove = useCallback((w: Which, pt: Pt) => setProbes((p) => (p ? { ...p, [w]: pt } : p)), []);
  const onProbeContact = useCallback((w: Which, c: Contact | null) => setContacts((cs) => ({ ...cs, [w]: c })), []);
  const resetLayout = () => {
    const r = areaRef.current?.getBoundingClientRect();
    if (r) setPanels(defaultPanels(r.width, r.height));
  };

  // ── durum mesajları ────────────────────────────────────────────────────
  const logicSim = useMemo(
    () => (mode === "sim" && domain === "logic" ? simulateLogic(panes.main.parts, panes.main.wires, { actuated, held: heldFull }) : null),
    [mode, domain, panes, actuated, heldFull],
  );
  const shown: Snap[] = logicSim ? [logicSim] : (Object.values(snaps).filter(Boolean) as Snap[]);
  const short = shown.some((s) => s.short);
  const chatter = shown.some((s) => s.chatter);
  const noSource = mode === "sim" && shown.length > 0 && shown.some((s) => !s.hasSource);
  const phaseLoss = shown.some((s) => Object.values(s.motor ?? {}).some((m) => m.fault));
  const broken = shown.flatMap((s) => Object.entries(s.state ?? {}));

  const domainBtns: [Domain, string][] = [
    ["phys", `⚡ ${t("pg.phys")}`],
    ["el", `🔬 ${t("pg.el")}`],
    ["logic", `🔢 ${t("pg.logic")}`],
    ["power", `🏭 ${t("pg.power")}`],
  ];
  const seg = "flex rounded-xl border border-line bg-panel p-0.5";
  const segBtn = (on: boolean) => `rounded-lg px-2.5 py-1 text-xs font-semibold transition ${on ? "bg-volt text-black" : "text-mut hover:text-ink"}`;
  const tool = "rounded-lg border border-line bg-panel px-2.5 py-1 text-xs text-mut transition hover:border-spark/50 hover:text-ink";
  const panelBtn = (id: PanelId, icon: string, label: string) => (
    <button
      type="button"
      onClick={() => togglePanel(id)}
      aria-pressed={!!P?.[id].open}
      title={label}
      className={`rounded-lg border px-2 py-1 text-xs transition ${P?.[id].open ? "border-volt/50 bg-volt/10 text-volt" : "border-line bg-panel text-mut hover:text-ink"}`}
    >
      {icon} <span className="hidden 2xl:inline">{label}</span>
    </button>
  );
  const panel = (id: PanelId, title: string, body: React.ReactNode) =>
    P && P[id].open ? (
      <FloatPanel title={title} pos={P[id]} onChange={(p) => setPanel(id, p)} onClose={() => togglePanel(id)} z={10 + zs.indexOf(id)} onFocus={() => focusPanel(id)}>
        {body}
      </FloatPanel>
    ) : null;

  const lv = (k: string, v: string) => (
    <div className="flex justify-between">
      <span className="text-mut">{k}</span>
      <span>{v}</span>
    </div>
  );

  return (
    <div className={full ? "fixed inset-0 z-[70] flex flex-col gap-2 bg-bg p-2" : "flex h-[calc(100dvh-2.5rem)] min-h-[600px] flex-col gap-2"}>
      {/* araç çubuğu */}
      <div className="flex flex-wrap items-center gap-1.5">
        <h1 className="mr-1 font-disp text-lg font-bold text-ink">🎛️ Playground</h1>
        <div className={seg}>
          {domainBtns.map(([d, txt]) => (
            <button key={d} type="button" onClick={() => switchDomain(d)} aria-pressed={domain === d} className={segBtn(domain === d)}>
              {txt}
            </button>
          ))}
        </div>
        {domain === "phys" && (
          <div className={seg}>
            {(
              [
                ["v", t("pg.vert")],
                ["b", t("pg.bus")],
                ["h", t("pg.horiz")],
              ] as [Orient, string][]
            ).map(([o, txt]) => (
              <button key={o} type="button" onClick={() => setOrientation(o)} aria-pressed={orient === o} className={segBtn(orient === o)}>
                {txt}
              </button>
            ))}
          </div>
        )}
        <div className={seg}>
          <button type="button" onClick={() => free && toggleFree()} aria-pressed={!free} className={segBtn(!free)} title={t("pg.gridHint")}>
            ▦ {t("pg.grid")}
          </button>
          <button type="button" onClick={() => !free && toggleFree()} aria-pressed={free} className={segBtn(free)} title={t("pg.freeHint")}>
            ✎ {t("pg.free")}
          </button>
        </div>
        <button
          type="button"
          onClick={startStop}
          className={`rounded-lg px-3 py-1 font-disp text-sm font-semibold transition ${
            mode === "sim" ? "bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/50 hover:bg-rose-500/30" : "bg-volt text-black hover:brightness-110"
          }`}
        >
          {mode === "sim" ? `■ ${t("pg.stop")}` : `▶ ${t("pg.start")}`}
        </button>
        <select
          onChange={(e) => {
            loadPreset(e.target.value);
            e.target.value = "";
          }}
          defaultValue=""
          aria-label={t("pg.loadPreset")}
          className="min-w-0 max-w-[220px] rounded-lg border border-line bg-panel px-2 py-1 text-xs text-mut outline-none focus:border-volt/60"
        >
          <option value="" disabled>
            📦 {t("pg.loadPreset")}
          </option>
          {presetOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.custom ? "⭐ " : ""}
              {p.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => downloadCircuit(currentFile())} className={tool} title={t("pg.saveHint")}>
          💾
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={tool} title={t("pg.openHint")}>
          📂
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onFile} />
        {admin && (
          <button type="button" onClick={publish} className="rounded-lg border border-volt/50 bg-volt/10 px-2.5 py-1 text-xs text-volt hover:bg-volt/20">
            ⭐ {t("pg.admin.publish")}
          </button>
        )}
        <button type="button" onClick={clearAll} className={`${tool} hover:!border-rose-400/50 hover:!text-rose-300`} title={t("pg.clear")}>
          🗑
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        {panelBtn("parts", "🧩", t("pg.parts"))}
        {panelBtn("props", "⚙️", t("pg.props"))}
        {panelBtn("meter", "🔌", t("pg.meter"))}
        {panelBtn("calc", "🧮", t("pg.calc"))}
        {panelBtn("guide", "❓", t("pg.guideTitle"))}
        <button type="button" onClick={resetLayout} className={tool} title={t("pg.resetLayout")}>
          ⊞
        </button>
        <button type="button" onClick={() => setFull((f) => !f)} className={tool} title={full ? t("pg.exitFull") : t("pg.full")}>
          {full ? "🗗" : "⛶"}
        </button>
      </div>

      {/* çalışma alanı */}
      <div ref={areaRef} className="relative min-h-0 flex-1">
        <div className={`absolute inset-0 grid gap-2 ${domain === "power" ? "grid-cols-2" : ""}`}>
          {paneIds.map((k) => (
            <div key={`${domain}-${k}`} className="min-h-0">
              <Board
                pane={k}
                title={domain === "power" ? t(k === "steuer" ? "pg.steuer" : "pg.last") : undefined}
                parts={panes[k]?.parts ?? []}
                wires={panes[k]?.wires ?? []}
                setParts={setters[k].parts}
                setWires={setters[k].wires}
                pool={allParts}
                mode={mode}
                sim={logicSim ?? snaps[k] ?? null}
                held={heldFull}
                sel={sel}
                setSel={setSel}
                placing={placing}
                clearPlacing={() => setPlacing(null)}
                ghost={ghost}
                vertRot={railed}
                free={free}
                el={isEl}
                fitKey={fitKey}
                active={activePane === k}
                onActivate={() => setActivePane(k)}
                onSimDown={onSimDown(k)}
                register={register}
                coarse={coarse}
                probes={probes?.pane === k ? probes : null}
                onProbeMove={onProbeMove}
                onProbeContact={onProbeContact}
              />
            </div>
          ))}
        </div>

        {/* durum mesajları: tuvalin altında, ortada */}
        <div className="pointer-events-none absolute bottom-12 left-1/2 z-[5] flex w-[min(640px,70%)] -translate-x-1/2 flex-col gap-1.5 text-xs" aria-live="polite">
          {notice && (
            <p className={`rounded-lg border px-3 py-1.5 ${notice.ok ? "border-spark/40 bg-bg/90 text-spark" : "border-rose-400/50 bg-bg/90 text-rose-300"}`}>{notice.text}</p>
          )}
          {short && (
            <p className="rounded-lg border border-rose-400/50 bg-bg/90 px-3 py-1.5 font-semibold text-rose-300">
              💥 {domain === "power" ? t("pg.short3") : t("pg.short")} {t("pg.shortFix")}
            </p>
          )}
          {phaseLoss && !short && <p className="rounded-lg border border-rose-400/50 bg-bg/90 px-3 py-1.5 text-rose-300">⚠️ {t("pg.phaseLoss")}</p>}
          {broken.slice(0, 3).map(([id, st]) => {
            const p = allParts.find((q) => q.id === id);
            return (
              <p key={id} className="rounded-lg border border-rose-400/40 bg-bg/90 px-3 py-1.5 text-rose-300">
                {p?.label || (p ? tx(SPEC[p.type].name) : id)}: {STATE_TR[st] ?? st}
              </p>
            );
          })}
          {chatter && !short && (
            <p className="rounded-lg border border-volt/40 bg-bg/90 px-3 py-1.5 text-volt">🌀 {domain === "logic" ? t("pg.chatterLogic") : t("pg.chatterPhys")}</p>
          )}
          {noSource && <p className="rounded-lg border border-line bg-bg/90 px-3 py-1.5 text-mut">🔌 {domain === "logic" ? t("pg.noSourceLogic") : t("pg.noSourcePhys")}</p>}
          {mode === "sim" && slow < 0.95 && <p className="rounded-lg border border-line bg-bg/90 px-3 py-1.5 text-mut">🐢 {t("pg.slow", { x: slow.toFixed(2) })}</p>}
          {mode === "edit" && placing && <p className="rounded-lg border border-volt/40 bg-bg/90 px-3 py-1.5 text-volt">{t("pg.placeHint", { name: tx(SPEC[placing].name) })}</p>}
        </div>

        {panel(
          "parts",
          domain === "power" ? t(activePane === "last" ? "pg.lastParts" : "pg.steuerParts") : t("pg.parts"),
          <>
            <div className={mode === "sim" ? "pointer-events-none opacity-40" : ""}>
              {mode === "sim" && <p className="mb-1 text-[10px] text-mut">{t("pg.stopToEdit")}</p>}
              {palette.map(([g, types]) => (
                <div key={g} className="mb-2">
                  <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-mut/70">{t(GROUP_KEY[g])}</p>
                  <div className="grid grid-cols-3 gap-1">
                    {types.map((ty) => (
                      <button
                        key={ty}
                        type="button"
                        onPointerDown={(e) => {
                          if (e.pointerType !== "mouse" || e.button !== 0) return;
                          e.preventDefault();
                          dragStart.current = { type: ty, x: e.clientX, y: e.clientY, moved: false };
                        }}
                        onClick={(e) => {
                          if (e.detail > 0 && !coarse && (e.nativeEvent as PointerEvent).pointerType !== "touch") return;
                          setPlacing((cur) => (cur === ty ? null : ty));
                        }}
                        onPointerEnter={() => setHoverType(ty)}
                        onPointerLeave={() => setHoverType((h) => (h === ty ? null : h))}
                        onFocus={() => setHoverType(ty)}
                        onBlur={() => setHoverType(null)}
                        aria-pressed={placing === ty}
                        title={`${tx(SPEC[ty].name)} — ${SPEC[ty].de}`}
                        className={`flex cursor-grab select-none flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center text-[10px] leading-tight transition hover:bg-panel2 hover:text-ink ${
                          placing === ty ? "bg-volt/15 text-ink ring-1 ring-volt/70" : "text-mut"
                        }`}
                      >
                        <MiniSymbol type={ty} />
                        <span className="line-clamp-2">{tx(SPEC[ty].name)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 mt-1 rounded-lg border border-line bg-panel p-2 text-[11px] leading-relaxed text-mut">
              {info ? (
                <>
                  <p className="font-semibold text-ink">
                    {tx(SPEC[info].name)}
                    {deTerm(SPEC[info].de) && <span className="block text-[10px] font-normal text-mut">{SPEC[info].de}</span>}
                  </p>
                  <p className="mt-1">{tx(PART_INFO[info])}</p>
                </>
              ) : (
                <p>{t("pg.paletteHint")}</p>
              )}
            </div>
          </>,
        )}

        {panel(
          "props",
          t("pg.props"),
          <>
            {!sel && <p className="text-xs text-mut">{t("pg.selectHint")}</p>}
            {sel?.kind === "wire" && (
              <button type="button" onClick={removeSelected} className="rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10">
                {t("pg.delWire")}
              </button>
            )}
            {selPart && (
              <div className="space-y-2.5 text-sm">
                <p className="font-disp font-semibold text-ink">
                  {tx(SPEC[selPart.type].name)}
                  {deTerm(SPEC[selPart.type].de) && <span className="block text-[11px] font-normal text-mut">{SPEC[selPart.type].de}</span>}
                </p>

                {mode === "sim" && live && (
                  <div className="rounded-lg border border-spark/30 bg-spark/5 p-2 font-mono text-[11px] text-ink">
                    {lv("U", fmt3(live.U, "V"))}
                    {lv("I", fmt3(live.I, "A"))}
                    {lv("P", fmt3(live.P, "W"))}
                    {live.R !== undefined && lv("R", fmt3(live.R, "Ω"))}
                    {live.T !== undefined && lv("ϑ", `${live.T.toFixed(1)} °C`)}
                    {live.rpm !== undefined && lv("n", `${live.rpm.toFixed(0)} 1/min`)}
                    {live.state && <div className="text-rose-300">{STATE_TR[live.state] ?? live.state}</div>}
                  </div>
                )}

                {!["node", "source3"].includes(SPEC[selPart.type].kind) && (
                  <Field label={t("pg.label")}>
                    <input value={selPart.label} maxLength={24} onChange={(e) => updateSel({ label: e.target.value })} className="pg-input" />
                  </Field>
                )}

                {(PARAMS[selPart.type] ?? []).map((d) => (
                  <ParamField key={d.k} d={d} part={selPart} onSet={(v) => setParam(d, v)} />
                ))}

                {(SPEC[selPart.type].kind === "source" || selPart.type === "netz3" || selPart.type === "bus_l") && (
                  <label className="flex items-center gap-2 text-xs text-mut">
                    <input type="checkbox" checked={selPart.enabled !== false} onChange={(e) => updateSel({ enabled: e.target.checked })} className="accent-[#fbbf24]" />
                    {t("pg.active")}
                  </label>
                )}
                {selPart.type === "tcoil" && (
                  <>
                    <Field label={t("pg.tmode")}>
                      <select value={selPart.tmode ?? "ein"} onChange={(e) => updateSel({ tmode: e.target.value as TimerMode })} className="pg-input">
                        <option value="ein">{t("pg.tm.ein")}</option>
                        <option value="aus">{t("pg.tm.aus")}</option>
                        <option value="impuls">{t("pg.tm.impuls")}</option>
                        <option value="blink">{t("pg.tm.blink")}</option>
                        <option value="treppe">{t("pg.tm.treppe")}</option>
                      </select>
                    </Field>
                    <Field label={t("pg.delay")}>
                      <input type="number" min={0.5} step={0.5} value={selPart.delay ?? 3} onChange={(e) => updateSel({ delay: Number(e.target.value) || 3 })} className="pg-input" />
                    </Field>
                  </>
                )}
                {(selPart.type === "contact_no" || selPart.type === "contact_nc" || selPart.type === "contact_co" || selPart.type === "contact3") && (
                  <GroupSelect label={t("pg.grp.coil")} value={selPart.group} options={labelsOf(["coil", "relay_ss"])} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "tcontact_no" || selPart.type === "tcontact_nc") && (
                  <GroupSelect label={t("pg.grp.timer")} value={selPart.group} options={labelsOf(["tcoil"])} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "pairc_no" || selPart.type === "pairc_nc") && (
                  <GroupSelect label={t("pg.grp.switch")} value={selPart.group} options={labelsOf(MAIN_SWITCH)} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "ol_nc" || selPart.type === "ol_no") && (
                  <GroupSelect label={t("pg.grp.ol")} value={selPart.group} options={labelsOf(["ol3"])} onChange={(g) => updateSel({ group: g })} />
                )}
                {(selPart.type === "led" || selPart.type === "led_d") && (
                  <Field label={t("pg.color")}>
                    <select value={selPart.color ?? "red"} onChange={(e) => updateSel({ color: e.target.value as LedColor })} className="pg-input">
                      {(["red", "green", "yellow", "blue", "white"] as LedColor[]).map((c) => (
                        <option key={c} value={c}>
                          {t(`pg.c.${c}` as UIKey)}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                {selPart.type === "motor3" && (
                  <Field label={t("pg.conn")}>
                    <select value={selPart.conn ?? "6"} onChange={(e) => updateSel({ conn: e.target.value as MotorConn })} className="pg-input">
                      <option value="6">{t("pg.conn.6")}</option>
                      <option value="Y">{t("pg.conn.Y")}</option>
                      <option value="D">{t("pg.conn.D")}</option>
                    </select>
                  </Field>
                )}
                {free && !["node", "rail"].includes(SPEC[selPart.type].kind) && (
                  <Field label={t("pg.angle")}>
                    <div className="flex items-center gap-2">
                      <input type="range" min={0} max={359} value={Math.round(angleOf(selPart))} onChange={(e) => updateSel({ angle: Number(e.target.value) })} className="flex-1 accent-[#fbbf24]" />
                      <span className="w-10 text-right font-mono text-xs text-ink">{Math.round(angleOf(selPart))}°</span>
                    </div>
                  </Field>
                )}
                {SPEC[selPart.type].kind !== "rail" && (
                  <div className="flex flex-wrap gap-2">
                    {SPEC[selPart.type].kind !== "node" && (
                      <button
                        type="button"
                        onClick={() => (free ? updateSel({ angle: (angleOf(selPart) + 90) % 360 }) : updateSel({ rot: ((selPart.rot ?? 0) + 1) % 4 }))}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs text-mut hover:border-spark/50 hover:text-spark"
                      >
                        ↺ {t("pg.rotate")}
                      </button>
                    )}
                    <button type="button" onClick={removeSelected} className="rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10">
                      {t("pg.delPart")}
                    </button>
                  </div>
                )}
                <p className="rounded-lg border border-line bg-bg/50 p-2 text-[11px] leading-relaxed text-mut">💡 {tx(PART_INFO[selPart.type])}</p>
              </div>
            )}
          </>,
        )}

        {panel(
          "meter",
          t("pg.meter"),
          <>
            <Meter data={meterData} mode={meterMode} setMode={setMeterMode} onRecall={recallProbes} />
            {mode === "edit" && <p className="mt-2 text-[11px] text-mut">{t("pg.meterEdit")}</p>}
          </>,
        )}

        {panel("calc", t("pg.calc"), <Calc />)}

        {panel(
          "guide",
          t("pg.guideTitle"),
          <div className="space-y-2.5 text-xs leading-relaxed text-mut">
            <p>{rich(free ? t("pg.editFree") : coarse ? t("pg.editTouch") : t("pg.editMouse"))}</p>
            <p>{rich(t("pg.guideMeter"))}</p>
            <p>{rich(t("pg.guide"))}</p>
            <p>{rich(t("pg.guidePower"))}</p>
            <p>{rich(t("pg.guideEl"))}</p>
          </div>,
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs text-mut">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

/** Tek bir parça ayarı: sayı (birim önekli giriş), seçenek ya da kaydırıcı. */
function ParamField({ d, part, onSet }: { d: ParamDef; part: Part; onSet: (v: number | string) => void }) {
  const [txt, setTxt] = useState<string | null>(null);
  if (d.options)
    return (
      <Field label={d.label}>
        <select value={ps(part, d.k)} onChange={(e) => onSet(e.target.value)} className="pg-input">
          {d.options.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </Field>
    );
  const val = pn(part, d.k);
  const commit = () => {
    if (txt === null) return;
    const v = parseSI(txt);
    if (v !== null) onSet(Math.min(d.max ?? Infinity, Math.max(d.min ?? -Infinity, v)));
    setTxt(null);
  };
  const plain = !d.unit || ["°C", "1/min", "Hz", "ms", "lx", "K", "V"].includes(d.unit);
  return (
    <Field label={`${d.label}${d.unit ? ` (${d.unit})` : ""}`}>
      {d.slider && (
        <input
          type="range"
          min={d.min ?? 0}
          max={d.max ?? 1}
          step={d.step ?? ((d.max ?? 1) - (d.min ?? 0)) / 200}
          value={val}
          onChange={(e) => onSet(Number(e.target.value))}
          className="mb-1 w-full accent-[#22d3ee]"
        />
      )}
      <input
        value={txt ?? (plain ? String(+val.toPrecision(6)) : si(val, "", 4))}
        onChange={(e) => setTxt(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="pg-input font-mono"
        inputMode="decimal"
      />
    </Field>
  );
}

function GroupSelect({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v: string | undefined) => void }) {
  const choose = useI18n().t("pg.choose");
  return (
    <Field label={label}>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)} className="pg-input">
        <option value="">{choose}</option>
        {options.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
    </Field>
  );
}
