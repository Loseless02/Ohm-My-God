import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LedColor, MotorConn, Part, PartType, TimerMode, Wire } from "./types";
import { SPEC } from "./types";
import { simulate, simulateLogic, type SimResult } from "./sim";
import { simulate3 } from "./sim3";
import { MiniSymbol } from "./parts";
import { CUSTOM_PRESETS, LOGIC_PRESETS, POWER_PRESETS, PRESETS } from "./presets";
import { PART_INFO } from "./info";
import Board, { type BoardApi, type Ghost, type Sel } from "./Board";
import { MAIN_SWITCH, removeItem } from "./ops";
import { PANES, downloadCircuit, parseCircuitFile, type Circuit, type Domain, type Orient } from "./file";
import { adminToken, savePresetAsAdmin } from "../lib/admin";
import { rich, useI18n } from "../i18n";
import type { UIKey } from "../i18n/ui";

const LS3 = "omg-playground-v3";

type Store = Record<Domain, { panes: Record<string, Circuit>; orient: Orient }>;
type GroupKey = "src" | "sw" | "relay" | "load" | "gate" | "power";
type Palette = [GroupKey, PartType[]][];

const SW: PartType[] = ["switch_no", "switch_nc", "taster_no", "taster_nc", "pairc_no", "pairc_nc"];
const RELAY: PartType[] = ["coil", "contact_no", "contact_nc", "contact_co", "relay_ss", "tcoil", "tcontact_no", "tcontact_nc"];

const PALETTES: Record<string, Palette> = {
  phys: [
    ["src", ["source", "source2"]],
    ["sw", SW],
    ["relay", RELAY],
    ["load", ["lamp", "led", "fluo", "motor"]],
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
};

function ensureRails(list: Part[], withVolts: boolean): Part[] {
  const out = [...list];
  if (!out.some((p) => p.type === "rail_l"))
    out.push({ id: "railL", type: "rail_l", x: 60, y: 40, label: "L", ...(withVolts ? { volts: 230 } : {}) });
  if (!out.some((p) => p.type === "rail_n")) out.push({ id: "railN", type: "rail_n", x: 900, y: 40, label: "N" });
  return out;
}

const clone = <T,>(v: T): T => structuredClone(v);

function defaults(): Store {
  const pw = POWER_PRESETS[0];
  return {
    phys: { panes: { main: { parts: clone(PRESETS[1].parts), wires: clone(PRESETS[1].wires) } }, orient: "v" },
    logic: { panes: { main: { parts: clone(LOGIC_PRESETS[0].parts), wires: clone(LOGIC_PRESETS[0].wires) } }, orient: "h" },
    power: { panes: { steuer: clone(pw.steuer), last: clone(pw.last) }, orient: "v" },
  };
}

function loadStore(): Store {
  const d = defaults();
  try {
    const raw = localStorage.getItem(LS3);
    if (raw) {
      const s = JSON.parse(raw);
      for (const k of ["phys", "logic", "power"] as Domain[]) {
        const f = parseCircuitFile(JSON.stringify({ app: "ohm-my-god", kind: "circuit", domain: k, ...s[k] }));
        if (f) d[k] = { panes: f.panes, orient: k === "logic" ? "h" : (f.orient ?? "v") };
      }
      return d;
    }
    const old = localStorage.getItem("omg-playground-v2"); // eski kayıt: tek bölmeli
    if (old) {
      const s = JSON.parse(old);
      for (const k of ["phys", "logic"] as Domain[]) {
        const f = parseCircuitFile(
          JSON.stringify({ app: "ohm-my-god", kind: "circuit", domain: k, orient: s[k]?.orient, panes: { main: s[k] } }),
        );
        if (f && f.panes.main.parts.length) d[k] = { panes: f.panes, orient: k === "logic" ? "h" : (f.orient ?? "v") };
      }
    }
  } catch {
    /* bozuk kayıt → varsayılan */
  }
  return d;
}

const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

// zaman rölesi: moduna göre kontaklar şu an "çekili" mi?
interface TState {
  onSince: number | null;
  offSince: number | null;
  start: number | null; // son tetikleme anı (merdiven otomatiği)
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

export default function Playground() {
  const { t, tx, deTerm } = useI18n();
  const [initial] = useState(loadStore);
  const storeRef = useRef(initial);
  const [domain, setDomain] = useState<Domain>("phys");
  const [orient, setOrient] = useState<Orient>(initial.phys.orient);
  const [panes, setPanes] = useState<Record<string, Circuit>>(initial.phys.panes);
  const [activePane, setActivePane] = useState("main");
  const [mode, setMode] = useState<"edit" | "sim">("edit");
  const [sel, setSel] = useState<Sel>(null);
  const [placing, setPlacing] = useState<PartType | null>(null);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [hoverType, setHoverType] = useState<PartType | null>(null);
  const [actuated, setActuated] = useState<Record<string, boolean>>({});
  const [held, setHeld] = useState<Record<string, boolean>>({});
  const [tick, setTick] = useState(0);
  const [fitKey, setFitKey] = useState(0);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [admin, setAdmin] = useState(() => !!adminToken());
  const [coarse] = useState(() => mq("(pointer: coarse)"));
  const boards = useRef<Record<string, BoardApi | null>>({});
  const timersRef = useRef<Record<string, TState>>({});
  const energizedRef = useRef<Record<string, boolean>>({});
  const ssPrev = useRef<Record<string, boolean>>({});
  const ssLast = useRef<Record<string, number>>({});
  const lastDoneRef = useRef("");
  const fileRef = useRef<HTMLInputElement>(null);

  const paneIds = PANES[domain];
  const allParts = useMemo(() => paneIds.flatMap((k) => panes[k]?.parts ?? []), [panes, paneIds]);
  const railed = domain === "logic" || orient === "h";

  // ── kalıcılık ──────────────────────────────────────────────────────────
  useEffect(() => {
    storeRef.current[domain] = { panes, orient };
    try {
      localStorage.setItem(LS3, JSON.stringify(storeRef.current));
    } catch {
      /* kota dolu / gizli pencere: kayıt şart değil */
    }
  }, [panes, orient, domain]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(id);
  }, [notice]);

  const setPaneParts = useCallback(
    (pane: string) => (fn: (ps: Part[]) => Part[]) =>
      setPanes((s) => ({ ...s, [pane]: { ...s[pane], parts: fn(s[pane].parts) } })),
    [],
  );
  const setPaneWires = useCallback(
    (pane: string) => (fn: (ws: Wire[]) => Wire[]) =>
      setPanes((s) => ({ ...s, [pane]: { ...s[pane], wires: fn(s[pane].wires) } })),
    [],
  );
  const setters = useMemo(
    () => Object.fromEntries(["main", "steuer", "last"].map((k) => [k, { parts: setPaneParts(k), wires: setPaneWires(k) }])),
    [setPaneParts, setPaneWires],
  );
  const register = useCallback((pane: string, api: BoardApi | null) => {
    boards.current[pane] = api;
  }, []);

  // darbe rölelerinin konumu baştan "kapalı" sayılsın (yoksa kontakları bobini takip eder)
  const heldFull = useMemo(() => {
    const h: Record<string, boolean> = {};
    for (const p of allParts) if (p.type === "relay_ss") h[p.label] = false;
    return { ...h, ...held };
  }, [allParts, held]);

  // ── zaman rölesi ───────────────────────────────────────────────────────
  const computeTimerDone = useCallback((ps: Part[]) => {
    const now = Date.now();
    const done: Record<string, boolean> = {};
    for (const p of ps) if (p.type === "tcoil") done[p.label] = timedActive(p, timersRef.current[p.id], now);
    return done;
  }, []);

  // ── simülasyon ─────────────────────────────────────────────────────────
  const sims = useMemo<Partial<Record<string, SimResult>>>(() => {
    if (mode !== "sim") return {};
    if (domain === "logic") return { main: simulateLogic(panes.main.parts, panes.main.wires, { actuated, held: heldFull }) };
    const ctl = domain === "power" ? panes.steuer : panes.main;
    const control = simulate(ctl.parts, ctl.wires, {
      actuated,
      timerDone: computeTimerDone(ctl.parts),
      prevEnergized: energizedRef.current,
      held: heldFull,
    });
    if (domain === "phys") return { main: control };
    const latch: Record<string, boolean> = {};
    for (const p of allParts) if (p.type === "relay_ss") latch[p.label] = !!heldFull[p.label];
    const last = simulate3(panes.last.parts, panes.last.wires, {
      state: { ...control.energized, ...latch },
      actuated,
      held: heldFull,
    });
    return { steuer: control, last };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panes, actuated, heldFull, mode, tick, domain]);

  const control = sims.main ?? sims.steuer ?? null;
  useEffect(() => {
    if (!control || domain === "logic") return;
    energizedRef.current = control.energized;
    const now = Date.now();
    for (const p of allParts) {
      if (p.type === "tcoil") {
        const tm = (timersRef.current[p.id] ??= { onSince: null, offSince: null, start: null });
        const on = !!control.energized[p.label];
        if (on && tm.onSince === null) {
          tm.onSince = now;
          tm.offSince = null;
          tm.start = now;
        }
        if (!on && tm.onSince !== null) {
          tm.onSince = null;
          tm.offSince = now;
        }
      }
      if (p.type === "relay_ss") {
        // yükselen kenarda konum değiştir; kendini besleyen döngü sonsuza gitmesin
        const on = !!control.energized[p.label];
        if (on && !ssPrev.current[p.label] && now - (ssLast.current[p.label] ?? 0) > 150) {
          ssLast.current[p.label] = now;
          setHeld((h) => ({ ...h, [p.label]: !h[p.label] }));
        }
        ssPrev.current[p.label] = on;
      }
    }
  }, [control, allParts, domain]);

  useEffect(() => {
    if (mode !== "sim" || domain === "logic") return;
    if (!allParts.some((p) => p.type === "tcoil")) return;
    const iv = setInterval(() => {
      const key = JSON.stringify(computeTimerDone(allParts));
      if (key !== lastDoneRef.current) {
        lastDoneRef.current = key;
        setTick((x) => x + 1);
      }
    }, 120);
    return () => clearInterval(iv);
  }, [mode, domain, allParts, computeTimerDone]);

  const resetSim = () => {
    setActuated({});
    setHeld({});
    timersRef.current = {};
    energizedRef.current = {};
    ssPrev.current = {};
    lastDoneRef.current = "";
    setPlacing(null);
    setSel(null);
  };
  const startStop = () => {
    resetSim();
    setMode((m) => (m === "edit" ? "sim" : "edit"));
  };

  // ── mod / yön geçişleri ────────────────────────────────────────────────
  function openCircuit(d: Domain, next: Record<string, Circuit>, o: Orient) {
    resetSim();
    setMode("edit");
    setDomain(d);
    const oo: Orient = d === "logic" ? "h" : d === "power" ? "v" : o;
    setOrient(oo);
    const fixed = { ...next };
    if (d === "logic") fixed.main = { ...fixed.main, parts: ensureRails(fixed.main.parts, false) };
    if (d === "phys" && oo === "h") fixed.main = { ...fixed.main, parts: ensureRails(fixed.main.parts, true) };
    setPanes(fixed);
    setActivePane(PANES[d][0]);
    setFitKey((k) => k + 1);
  }

  function switchDomain(d: Domain) {
    if (d === domain) return;
    storeRef.current[domain] = { panes, orient };
    const s = storeRef.current[d];
    openCircuit(d, s.panes, s.orient);
  }

  function setOrientation(o: Orient) {
    if (o === orient || domain !== "phys") return;
    setOrient(o);
    setPanes((s) => {
      let parts = s.main.parts.map((p) => (SPEC[p.type].vert ? { ...p, rot: o === "h" ? 1 : 0 } : p));
      let wires = s.main.wires;
      if (o === "h") parts = ensureRails(parts, true);
      else {
        parts = parts.filter((p) => SPEC[p.type].kind !== "rail");
        wires = wires.filter((w) => !/^rail[LN]:/.test(w.a) && !/^rail[LN]:/.test(w.b));
      }
      return { main: { parts, wires } };
    });
    setFitKey((k) => k + 1);
  }

  function clearAll() {
    const empty: Record<string, Circuit> = {};
    for (const k of paneIds) empty[k] = { parts: [], wires: [] };
    openCircuit(domain, empty, orient);
  }

  // ── hazır devreler ─────────────────────────────────────────────────────
  const presetOptions = useMemo(() => {
    const builtIn =
      domain === "phys" ? PRESETS : domain === "logic" ? LOGIC_PRESETS : POWER_PRESETS;
    return [
      ...builtIn.map((p) => ({ id: p.id, name: tx(p.name), custom: false })),
      ...CUSTOM_PRESETS[domain].map((p) => ({ id: p.id, name: p.name, custom: true })),
    ];
  }, [domain, tx]);

  function loadPreset(id: string) {
    const custom = CUSTOM_PRESETS[domain].find((p) => p.id === id);
    if (custom) return openCircuit(domain, clone(custom.panes), custom.orient ?? orient);
    if (domain === "power") {
      const pr = POWER_PRESETS.find((p) => p.id === id);
      if (pr) openCircuit("power", { steuer: clone(pr.steuer), last: clone(pr.last) }, "v");
      return;
    }
    const pr = (domain === "phys" ? PRESETS : LOGIC_PRESETS).find((p) => p.id === id);
    if (pr) openCircuit(domain, { main: { parts: clone(pr.parts), wires: clone(pr.wires) } }, domain === "phys" ? "v" : "h");
  }

  // ── dosya ──────────────────────────────────────────────────────────────
  const currentFile = () => ({ app: "ohm-my-god" as const, kind: "circuit" as const, version: 1 as const, domain, orient, panes });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 2_000_000) return setNotice({ ok: false, text: t("pg.loadErr") });
    const parsed = parseCircuitFile(await f.text());
    if (!parsed) return setNotice({ ok: false, text: t("pg.loadErr") });
    openCircuit(parsed.domain, parsed.panes, parsed.orient ?? "v");
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
    setPanes((s) => ({ ...s, [sel.pane]: removeItem(s[sel.pane].parts, s[sel.pane].wires, sel.kind, sel.id) }));
    setSel(null);
  }, [sel]);

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
  const labelsOf = (types: PartType[]) => [...new Set(allParts.filter((p) => types.includes(p.type)).map((p) => p.label))];

  // ── simülasyonda tıklama ───────────────────────────────────────────────
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
  const onSimDown = (pane: string) => (p: Part) => {
    const kind = SPEC[p.type].kind;
    if (kind === "source" || kind === "source3") {
      setPaneParts(pane)((ps) => ps.map((q) => (q.id === p.id ? { ...q, enabled: q.enabled === false } : q)));
      return;
    }
    if (p.type === "switch_no" || p.type === "switch_nc" || p.type === "q3") actuateToggle(p.id);
    else if (p.type === "taster_no" || p.type === "taster_nc") actuateMomentary(p.id);
    else if (p.type === "ol3") setHeld((h) => ({ ...h, [p.label]: !h[p.label] })); // aşırı yük / reset
    else if (p.type === "pairc_no" || p.type === "pairc_nc") {
      const main = allParts.find((q) => MAIN_SWITCH.includes(q.type) && q.label === p.group);
      if (!main) return;
      if (main.type.startsWith("switch")) actuateToggle(main.id);
      else actuateMomentary(main.id);
    }
  };

  // ── palet: tıkla-yerleştir ya da sürükle-bırak ─────────────────────────
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

  // ── durum mesajları ────────────────────────────────────────────────────
  const anySim = Object.values(sims).filter(Boolean) as SimResult[];
  const short = anySim.some((s) => s.short);
  const chatter = anySim.some((s) => s.chatter);
  const noSource = mode === "sim" && anySim.some((s) => !s.hasSource);
  const phaseLoss = anySim.some((s) => Object.values(s.motor ?? {}).some((m) => m.fault));
  const burnt = anySim.some((s) => Object.keys(s.burnt ?? {}).length > 0);

  const domainBtns: [Domain, string][] = [
    ["phys", `⚡ ${t("pg.phys")}`],
    ["logic", `🔢 ${t("pg.logic")}`],
    ["power", `🏭 ${t("pg.power")}`],
  ];
  const btn = "rounded-xl border border-line px-3 py-2 text-sm text-mut transition hover:border-spark/50 hover:text-ink";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-disp text-2xl font-bold text-ink">🎛️ Playground</h1>
        <p className="text-sm italic text-mut">{t("pg.lead")}</p>
      </div>

      {/* araç çubuğu */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-2xl border border-line bg-panel p-1">
          {domainBtns.map(([d, txt]) => (
            <button
              key={d}
              type="button"
              onClick={() => switchDomain(d)}
              aria-pressed={domain === d}
              className={`rounded-xl px-3 py-1.5 font-disp text-sm font-semibold transition ${
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
                aria-pressed={orient === o}
                className={`rounded-xl px-3 py-1.5 text-xs transition ${orient === o ? "bg-spark/20 text-spark" : "text-mut hover:text-ink"}`}
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
            loadPreset(e.target.value);
            e.target.value = "";
          }}
          defaultValue=""
          aria-label={t("pg.loadPreset")}
          className="min-w-0 max-w-full rounded-xl border border-line bg-panel px-3 py-2 text-sm text-mut outline-none focus:border-volt/60"
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
        <button type="button" onClick={() => downloadCircuit(currentFile())} className={btn} title={t("pg.saveHint")}>
          💾 {t("pg.save")}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={btn} title={t("pg.openHint")}>
          📂 {t("pg.open")}
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onFile} />
        {admin && (
          <button
            type="button"
            onClick={publish}
            className="rounded-xl border border-volt/50 bg-volt/10 px-3 py-2 text-sm text-volt transition hover:bg-volt/20"
          >
            ⭐ {t("pg.admin.publish")}
          </button>
        )}
        <button
          type="button"
          onClick={clearAll}
          className="rounded-xl border border-line px-3 py-2 text-sm text-mut transition hover:border-rose-400/50 hover:text-rose-300"
        >
          🗑 {t("pg.clear")}
        </button>
      </div>

      {/* çalışma alanı: masaüstünde tek ekrana sığar, paneller kendi içinde kayar */}
      <div className="grid grid-cols-1 gap-3 lg:h-[calc(100dvh-12rem)] lg:min-h-[560px] lg:grid-cols-[236px_minmax(0,1fr)_244px]">
        {/* ── palet ── */}
        <aside className="card order-1 flex min-h-0 min-w-0 flex-col p-2">
          <p className="mb-1 px-1 font-disp text-[11px] uppercase tracking-widest text-mut/80">
            {domain === "power" ? t(activePane === "last" ? "pg.lastParts" : "pg.steuerParts") : domain === "logic" ? t("pg.logicParts") : t("pg.parts")}
            {mode === "sim" && ` · ${t("pg.stopToEdit")}`}
          </p>
          <div
            className={`flex min-h-0 gap-1 overflow-x-auto pb-1 lg:block lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 ${
              mode === "sim" ? "pointer-events-none opacity-40" : ""
            }`}
          >
            {palette.map(([g, types]) => (
              <div key={g} className="contents lg:mb-2 lg:block">
                <p className="hidden px-1 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-mut/60 lg:block">
                  {t(GROUP_KEY[g])}
                </p>
                <div className="contents lg:grid lg:grid-cols-3 lg:gap-1">
                  {types.map((ty) => (
                    <button
                      key={ty}
                      type="button"
                      onPointerDown={(e) => {
                        if (e.pointerType !== "mouse" || e.button !== 0) return; // dokunmatik: şerit kaydırılsın, seçim dokunuşla
                        e.preventDefault();
                        dragStart.current = { type: ty, x: e.clientX, y: e.clientY, moved: false };
                      }}
                      onClick={(e) => {
                        // fare tıklaması pointerup'ta işlendi; klavye (detail=0) ve dokunmatik burada
                        if (e.detail > 0 && !coarse && (e.nativeEvent as PointerEvent).pointerType !== "touch") return;
                        setPlacing((cur) => (cur === ty ? null : ty));
                      }}
                      onPointerEnter={() => setHoverType(ty)}
                      onPointerLeave={() => setHoverType((h) => (h === ty ? null : h))}
                      onFocus={() => setHoverType(ty)}
                      onBlur={() => setHoverType(null)}
                      aria-pressed={placing === ty}
                      title={`${tx(SPEC[ty].name)} — ${SPEC[ty].de}`}
                      className={`flex w-[72px] shrink-0 cursor-grab select-none flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center text-[10px] leading-tight transition hover:bg-panel2 hover:text-ink lg:w-auto ${
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
          {/* üstüne gelinen / seçilen parçanın açıklaması: sayfayı kaydırmadan oku */}
          <div className="mt-2 hidden min-h-[7.5rem] shrink-0 rounded-lg border border-line bg-bg/50 p-2 text-[11px] leading-relaxed text-mut lg:block">
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
        </aside>

        {/* ── tuval(ler) ── */}
        <section className="order-2 flex min-h-0 min-w-0 flex-col gap-2">
          <div className={`grid min-h-0 flex-1 gap-2 ${domain === "power" ? "lg:grid-cols-2" : ""}`}>
            {paneIds.map((k) => (
              <div key={`${domain}-${k}`} className="aspect-[0.82] min-h-0 sm:aspect-[1.35] lg:aspect-auto lg:h-full">
                <Board
                  pane={k}
                  title={domain === "power" ? t(k === "steuer" ? "pg.steuer" : "pg.last") : undefined}
                  parts={panes[k]?.parts ?? []}
                  wires={panes[k]?.wires ?? []}
                  setParts={setters[k].parts}
                  setWires={setters[k].wires}
                  pool={allParts}
                  mode={mode}
                  sim={sims[k] ?? null}
                  held={heldFull}
                  sel={sel}
                  setSel={setSel}
                  placing={placing}
                  clearPlacing={() => setPlacing(null)}
                  ghost={ghost}
                  vertRot={railed}
                  fitKey={fitKey}
                  active={activePane === k}
                  onActivate={() => setActivePane(k)}
                  onSimDown={onSimDown(k)}
                  register={register}
                  coarse={coarse}
                />
              </div>
            ))}
          </div>

          {/* durum çubuğu */}
          <div className="shrink-0 space-y-1.5 text-sm" aria-live="polite">
            {notice && (
              <p className={`rounded-xl border px-3 py-2 ${notice.ok ? "border-spark/40 bg-spark/10 text-spark" : "border-rose-400/50 bg-rose-500/15 text-rose-300"}`}>
                {notice.text}
              </p>
            )}
            {short && (
              <p className="rounded-xl border border-rose-400/50 bg-rose-500/15 px-3 py-2 font-semibold text-rose-300">
                💥 {domain === "power" ? t("pg.short3") : t("pg.short")}
                {domain === "logic" && ` ${t("pg.shortLogic")}`} {t("pg.shortFix")}
              </p>
            )}
            {phaseLoss && !short && (
              <p className="rounded-xl border border-rose-400/50 bg-rose-500/15 px-3 py-2 text-rose-300">⚠️ {t("pg.phaseLoss")}</p>
            )}
            {burnt && (
              <p className="rounded-xl border border-rose-400/50 bg-rose-500/15 px-3 py-2 text-rose-300">🔥 {t("pg.burnt")}</p>
            )}
            {chatter && !short && (
              <p className="rounded-xl border border-volt/40 bg-volt/10 px-3 py-2 text-volt">
                🌀 {domain === "logic" ? t("pg.chatterLogic") : t("pg.chatterPhys")}
              </p>
            )}
            {noSource && (
              <p className="rounded-xl border border-line bg-panel px-3 py-2 text-mut">
                🔌 {domain === "logic" ? t("pg.noSourceLogic") : t("pg.noSourcePhys")}
              </p>
            )}
            {mode === "sim" && !noSource && !short && !chatter && (
              <p className="rounded-xl border border-line bg-panel px-3 py-2 text-mut">
                ⚡ {rich(domain === "phys" ? t("pg.runningPhys") : domain === "logic" ? t("pg.runningLogic") : t("pg.runningPower"))}
              </p>
            )}
            {mode === "edit" && (
              <p className="rounded-xl border border-line bg-panel px-3 py-2 text-xs leading-relaxed text-mut">
                {placing ? (
                  <span className="text-volt">{t("pg.placeHint", { name: tx(SPEC[placing].name) })}</span>
                ) : (
                  <>🛠️ {rich(coarse ? t("pg.editShortTouch") : t("pg.editShort"))}</>
                )}
              </p>
            )}
          </div>
        </section>

        {/* ── özellikler ── */}
        <aside className="card order-3 min-h-0 overflow-y-auto p-4">
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
                {deTerm(SPEC[selPart.type].de) && <span className="block text-[11px] font-normal text-mut">{SPEC[selPart.type].de}</span>}
              </p>
              {!["node", "source3"].includes(SPEC[selPart.type].kind) && (
                <Field label={t("pg.label")}>
                  <input value={selPart.label} maxLength={24} onChange={(e) => updateSel({ label: e.target.value })} className="pg-input" />
                </Field>
              )}
              {SPEC[selPart.type].kind === "source" && (
                <Field label={t("pg.volts")}>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={selPart.volts ?? 230}
                    onChange={(e) => updateSel({ volts: Number(e.target.value) || 230 })}
                    className="pg-input"
                  />
                </Field>
              )}
              {(SPEC[selPart.type].kind === "source" || selPart.type === "netz3") && (
                <label className="flex items-center gap-2 text-xs text-mut">
                  <input
                    type="checkbox"
                    checked={selPart.enabled !== false}
                    onChange={(e) => updateSel({ enabled: e.target.checked })}
                    className="accent-[#fbbf24]"
                  />
                  {t("pg.active")}
                </label>
              )}
              {(selPart.type === "coil" || selPart.type === "relay_ss") && (
                <Field label={t("pg.coilVolts")}>
                  <select value={selPart.volts ?? 230} onChange={(e) => updateSel({ volts: Number(e.target.value) })} className="pg-input">
                    {[12, 24, 48, 110, 230].map((v) => (
                      <option key={v} value={v}>
                        {v} V AC
                      </option>
                    ))}
                  </select>
                </Field>
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
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={selPart.delay ?? 3}
                      onChange={(e) => updateSel({ delay: Number(e.target.value) || 3 })}
                      className="pg-input"
                    />
                  </Field>
                </>
              )}
              {(selPart.type === "contact_no" || selPart.type === "contact_nc" || selPart.type === "contact_co") && (
                <GroupSelect label={t("pg.grp.coil")} value={selPart.group} options={labelsOf(["coil", "relay_ss"])} onChange={(g) => updateSel({ group: g })} />
              )}
              {selPart.type === "contact3" && (
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
              {selPart.type === "led" && (
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
              <div className="flex flex-wrap gap-2">
                {SPEC[selPart.type].kind !== "node" && (
                  <button
                    type="button"
                    onClick={() => updateSel({ rot: ((selPart.rot ?? 0) + 1) % 4 })}
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
              <p className="rounded-lg border border-line bg-bg/50 p-2 text-[11px] leading-relaxed text-mut lg:hidden">
                💡 {tx(PART_INFO[selPart.type])}
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* mini rehber */}
      <div className="card mt-6 space-y-3 p-5 text-sm leading-relaxed text-mut">
        <h3 className="font-disp text-sm uppercase tracking-widest text-mut">🎓 {t("pg.guideTitle")}</h3>
        <p>{rich(coarse ? t("pg.editTouch") : t("pg.editMouse"))}</p>
        <p>{rich(t("pg.guide"))}</p>
        <p>{rich(t("pg.guidePower"))}</p>
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
