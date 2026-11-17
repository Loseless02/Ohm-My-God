// Devre dosyası: kaydet (.json indir) / yükle (doğrulayarak içeri al).
import type { LedColor, MotorConn, Part, PartType, TimerMode, Wire } from "./types";
import { SPEC } from "./types";

export type Domain = "phys" | "logic" | "power";
export type Orient = "v" | "h";
export interface Circuit {
  parts: Part[];
  wires: Wire[];
}
export interface CircuitFile {
  app: "ohm-my-god";
  kind: "circuit";
  version: 1;
  domain: Domain;
  orient?: Orient;
  panes: Record<string, Circuit>;
}

export const PANES: Record<Domain, string[]> = {
  phys: ["main"],
  logic: ["main"],
  power: ["steuer", "last"],
};

const MAX_BYTES = 2_000_000;
const MAX_PARTS = 1500;
const ID = /^[\w-]{1,64}$/;
const TID = /^[\w-]{1,64}:\d{1,2}$/;
const TMODES: TimerMode[] = ["ein", "aus", "impuls", "blink", "treppe"];
const COLORS: LedColor[] = ["red", "green", "yellow", "blue", "white"];
const CONNS: MotorConn[] = ["6", "Y", "D"];

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);
const numIn = (v: unknown, lo: number, hi: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : undefined;

function cleanPart(raw: unknown): Part | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !ID.test(r.id)) return null;
  if (typeof r.type !== "string" || !Object.hasOwn(SPEC, r.type)) return null;
  const x = numIn(r.x, -20000, 20000);
  const y = numIn(r.y, -20000, 20000);
  if (x === undefined || y === undefined) return null;
  const p: Part = { id: r.id, type: r.type as PartType, x: Math.round(x), y: Math.round(y), label: str(r.label, 24) ?? "" };
  const group = str(r.group, 24);
  if (group !== undefined) p.group = group;
  const volts = numIn(r.volts, 1, 1000);
  if (volts !== undefined) p.volts = volts;
  const delay = numIn(r.delay, 0.2, 3600);
  if (delay !== undefined) p.delay = delay;
  if (typeof r.enabled === "boolean") p.enabled = r.enabled;
  const rot = numIn(r.rot, 0, 3);
  if (rot !== undefined) p.rot = Math.round(rot);
  if (TMODES.includes(r.tmode as TimerMode)) p.tmode = r.tmode as TimerMode;
  if (COLORS.includes(r.color as LedColor)) p.color = r.color as LedColor;
  if (CONNS.includes(r.conn as MotorConn)) p.conn = r.conn as MotorConn;
  return p;
}

function cleanCircuit(raw: unknown): Circuit {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const parts = (Array.isArray(r.parts) ? r.parts : [])
    .slice(0, MAX_PARTS)
    .map(cleanPart)
    .filter((p): p is Part => !!p);
  const ids = new Set(parts.map((p) => p.id));
  const okEnd = (tid: unknown): tid is string => {
    if (typeof tid !== "string" || !TID.test(tid)) return false;
    const [pid, i] = tid.split(":");
    const p = parts.find((q) => q.id === pid);
    return ids.has(pid) && !!p && Number(i) < SPEC[p.type].t.length;
  };
  const wires: Wire[] = [];
  for (const w of Array.isArray(r.wires) ? r.wires.slice(0, MAX_PARTS * 4) : []) {
    if (!w || typeof w !== "object") continue;
    const ww = w as Record<string, unknown>;
    if (typeof ww.id !== "string" || !ID.test(ww.id) || !okEnd(ww.a) || !okEnd(ww.b)) continue;
    wires.push({ id: ww.id, a: ww.a, b: ww.b });
  }
  return { parts, wires };
}

/** JSON metnini doğrula; geçersizse null. Bilinmeyen alanlar atılır. */
export function parseCircuitFile(text: string): CircuitFile | null {
  if (text.length > MAX_BYTES) return null;
  let d: unknown;
  try {
    d = JSON.parse(text);
  } catch {
    return null;
  }
  if (!d || typeof d !== "object") return null;
  const r = d as Record<string, unknown>;
  if (r.app !== "ohm-my-god" || r.kind !== "circuit") return null;
  const domain = r.domain;
  if (domain !== "phys" && domain !== "logic" && domain !== "power") return null;
  return { app: "ohm-my-god", kind: "circuit", version: 1, domain, orient: r.orient === "h" ? "h" : "v", panes: cleanPanes(domain, r.panes) };
}

export function cleanPanes(domain: Domain, raw: unknown): Record<string, Circuit> {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const panes: Record<string, Circuit> = {};
  for (const k of PANES[domain]) panes[k] = cleanCircuit(src[k]);
  return panes;
}

export function downloadCircuit(f: CircuitFile) {
  const blob = new Blob([JSON.stringify(f, null, 1)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const day = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `ohm-my-god-${f.domain}-${day}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
