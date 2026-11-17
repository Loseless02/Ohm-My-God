// ── Zamana bağlı devre simülatörü (Elektrik + Elektronik + Steuerstromkreis) ──
// Her adımda (AC'de 0,25 ms) düğüm gerilimleri çözülür (nodal analiz, LU ayrıştırma).
//  · Kaynaklar: iç dirençli EMK (Norton); AC'de gerçek sinüs.
//  · C, L, trafo: geri Euler eşdeğer modelleri.
//  · Diyot, LED, zener, transistör, MOSFET, op-amp, regülatör: Newton-Raphson
//    (Jacobian sayısal türevle).
//  · Her 20 ms'lik pencerede RMS / ortalama / güç hesaplanır; yanma, sigorta,
//    termik koruma, bobin çekme/bırakma gibi "yavaş" olaylar burada işlenir.
// Değerler mutlaktır: 1 MV verirsen lamba gerçekten 1 MV görür (ve ölür).

import type { Part, Wire } from "./types";
import { SPEC, terminalsOf } from "./types";
import { pn, ps } from "./params";
import { isClosed, type MotorState, type SimResult } from "./sim";

const VT = 0.025852;
const GMIN = 1e-9;
const G_SW = 1e3; // kapalı kontak: 1 mΩ
const R_GRID = 0.25; // şebeke iç empedansı (≈ ev tesisatı Z_S)
const R_DC = 0.05; // laboratuvar güç kaynağı iç direnci
const WIN = 0.02; // ölçüm penceresi (bir 50 Hz periyodu)
const RING = 4000; // osiloskop için saklanan örnek sayısı (AC'de 1 s)
const T_AMB = 25;

// ── küçük matematik ─────────────────────────────────────────────────────────
const sp = (x: number, k: number) => (x / k > 30 ? x : k * Math.log1p(Math.exp(x / k))); // yumuşak max(0,x)
const smin = (a: number, b: number, k: number) => b - sp(b - a, k);

/** Üstel diyot akımı; çok büyük gerilimde doğrusal devam eder (taşma olmasın). */
function dI(v: number, Is: number, nVt: number): number {
  const vmax = nVt * Math.log(200 / Is + 1);
  if (v > vmax) {
    const e = Math.exp(vmax / nVt);
    return Is * (e - 1) + ((Is * e) / nVt) * (v - vmax);
  }
  return Is * (Math.exp(v / nVt) - 1);
}

function luFactor(A: Float64Array, n: number, piv: Int32Array) {
  for (let k = 0; k < n; k++) {
    let p = k;
    let m = Math.abs(A[k * n + k]);
    for (let i = k + 1; i < n; i++) {
      const a = Math.abs(A[i * n + k]);
      if (a > m) {
        m = a;
        p = i;
      }
    }
    piv[k] = p;
    if (p !== k)
      for (let j = 0; j < n; j++) {
        const t = A[k * n + j];
        A[k * n + j] = A[p * n + j];
        A[p * n + j] = t;
      }
    let d = A[k * n + k];
    if (Math.abs(d) < 1e-300) d = A[k * n + k] = 1e-300;
    for (let i = k + 1; i < n; i++) {
      const f = (A[i * n + k] /= d);
      if (f === 0) continue;
      for (let j = k + 1; j < n; j++) A[i * n + j] -= f * A[k * n + j];
    }
  }
}

function luSolve(LU: Float64Array, n: number, piv: Int32Array, b: Float64Array) {
  for (let k = 0; k < n; k++) {
    const p = piv[k];
    if (p !== k) {
      const t = b[k];
      b[k] = b[p];
      b[p] = t;
    }
  }
  for (let i = 0; i < n; i++) {
    let s = b[i];
    for (let j = 0; j < i; j++) s -= LU[i * n + j] * b[j];
    b[i] = s;
  }
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let j = i + 1; j < n; j++) s -= LU[i * n + j] * b[j];
    b[i] = s / LU[i * n + i];
  }
}

// ── tipler ──────────────────────────────────────────────────────────────────
export interface EngineInputs {
  act: Record<string, boolean>; // şalter id'leri + "§etiket"
  timerDone: Record<string, boolean>;
  held: Record<string, boolean>;
}

/** Elemanın kalıcı durumu: yeniden kurulumda (ayar değişince) korunur. */
type St = Record<string, number>;

interface El {
  p: Part;
  k: string; // motor içi tür
  n: number[]; // terminal düğümleri (−1 = toprak), iç düğümler sonda
  nl: boolean; // doğrusal değil mi
  st: St;
  // pencere birikimleri (terminal başına akım: elemana giren)
  sI: number[];
  sI2: number[];
  sP: number;
  // son pencere sonuçları
  Irms: number[];
  Imean: number[];
  P: number;
  Urms: number; // t0–t1 arası gerilim (2 uçlu)
  Umean: number;
}

export interface Reading {
  dc: number; // ortalama
  rms: number; // toplam etkin değer
  ac: number; // AC bileşenin etkin değeri
  min: number;
  max: number;
  f: number; // frekans (sıfır geçişlerinden), yoksa 0
  wave: number[]; // osiloskop izi (eski → yeni)
  dt: number;
}

export interface PartReading {
  U: number;
  Udc: number;
  I: number;
  Idc: number;
  P: number;
  R?: number;
  T?: number;
  rpm?: number;
  state?: string;
}

// ── motor ───────────────────────────────────────────────────────────────────
export class Engine {
  readonly parts: Part[];
  readonly wires: Wire[];
  private els: El[] = [];
  private byPart = new Map<string, El[]>();
  private tIdx = new Map<string, number>(); // terminal id → düğüm (−1 toprak)
  private n = 0;
  private x = new Float64Array(0);
  private A = new Float64Array(0);
  private base = new Float64Array(0);
  private piv = new Int32Array(0);
  private rhs = new Float64Array(0);
  private dirty = true;
  private hasNL = false;
  dt = 1e-3;
  t = 0;
  private winT = 0;
  // düğüm istatistikleri
  private ring: Float32Array = new Float32Array(0);
  private iRing: Float32Array = new Float32Array(0); // eleman akımları (osiloskop 2. kanal)
  private selfHeld: Record<string, boolean> = {}; // motor koruma rölesinin kendi atması
  private ringPos = 0;
  private ringFill = 0;
  // kablo akımları (ağaç akışı)
  private wireIdx = new Map<string, number>();
  private wS = new Float64Array(0);
  private wS2 = new Float64Array(0);
  private wRms = new Float64Array(0);
  private wMean = new Float64Array(0);
  private tree: { child: number; parent: number; wire: number; sign: number }[] = [];
  private inj = new Float64Array(0);
  private termOfEl: number[][] = [];
  private winSteps = 0;
  inputs: EngineInputs = { act: {}, timerDone: {}, held: {} };
  energized: Record<string, boolean> = {};
  short = false;
  chatter = false;
  private toggles: number[] = [];
  private lastLoad = 0; // son karede harcanan süre (ms)
  slow = 1; // gerçek zamana oranı

  constructor(parts: Part[], wires: Wire[], prev?: Engine) {
    this.parts = parts;
    this.wires = wires;
    if (prev) {
      this.t = prev.t;
      this.energized = { ...prev.energized };
      this.inputs = prev.inputs;
    }
    this.build(prev);
  }

  // ── kurulum ──────────────────────────────────────────────────────────────
  private build(prev?: Engine) {
    const terms: string[] = [];
    const tpos = new Map<string, number>();
    for (const p of this.parts)
      for (const t of terminalsOf(p)) {
        tpos.set(t.id, terms.length);
        terms.push(t.id);
      }
    const par = terms.map((_, i) => i);
    const find = (i: number): number => {
      while (par[i] !== i) i = par[i] = par[par[i]];
      return i;
    };
    const uni = (a: number, b: number) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) par[ra] = rb;
    };
    // kablolar ve bara içi bağlar aynı düğüm
    const adj: { a: number; b: number; wire: number }[] = [];
    this.wires.forEach((w, wi) => {
      const a = tpos.get(w.a);
      const b = tpos.get(w.b);
      this.wireIdx.set(w.id, wi);
      if (a === undefined || b === undefined) return;
      uni(a, b);
      adj.push({ a, b, wire: wi });
    });
    const groundRoots = new Set<number>();
    for (const p of this.parts) {
      if (SPEC[p.type].kind !== "rail") continue;
      const ts = terminalsOf(p).map((t) => tpos.get(t.id)!);
      for (let i = 1; i < ts.length; i++) {
        uni(ts[0], ts[i]);
        adj.push({ a: ts[0], b: ts[i], wire: -1 });
      }
    }
    for (const p of this.parts)
      if (p.type === "rail_n" || p.type === "bus_n") groundRoots.add(find(tpos.get(`${p.id}:0`)!));
    const nodeOf = new Map<number, number>();
    let n = 0;
    for (let i = 0; i < terms.length; i++) {
      const r = find(i);
      if (groundRoots.has(r)) continue;
      if (!nodeOf.has(r)) nodeOf.set(r, n++);
    }
    const nodeOfTerm = (i: number) => {
      const r = find(i);
      return groundRoots.has(r) ? -1 : nodeOf.get(r)!;
    };
    terms.forEach((t, i) => this.tIdx.set(t, nodeOfTerm(i)));

    // kablo akımları için yayılan ağaç (her düğüm grubunda BFS)
    const nb: { to: number; wire: number; sign: number }[][] = terms.map(() => []);
    for (const e of adj) {
      nb[e.a].push({ to: e.b, wire: e.wire, sign: 1 });
      nb[e.b].push({ to: e.a, wire: e.wire, sign: -1 });
    }
    const seen = new Uint8Array(terms.length);
    const order: { child: number; parent: number; wire: number; sign: number }[] = [];
    for (let s = 0; s < terms.length; s++) {
      if (seen[s]) continue;
      seen[s] = 1;
      const q = [s];
      for (let qi = 0; qi < q.length; qi++) {
        const u = q[qi];
        for (const e of nb[u])
          if (!seen[e.to]) {
            seen[e.to] = 1;
            q.push(e.to);
            // sign: kablo a→b yönünde akım = sign · (çocuğun alt ağacının çektiği akım)
            order.push({ child: e.to, parent: u, wire: e.wire, sign: e.sign });
          }
      }
    }
    this.tree = order.reverse(); // yapraktan köke
    this.inj = new Float64Array(terms.length);
    const nw = this.wires.length;
    this.wS = new Float64Array(nw);
    this.wS2 = new Float64Array(nw);
    this.wRms = new Float64Array(nw);
    this.wMean = new Float64Array(nw);

    // elemanlar
    const els: El[] = [];
    const prevSt = new Map<string, St>();
    if (prev) for (const e of prev.els) prevSt.set(`${e.p.id}#${e.k}`, e.st);
    const mk = (p: Part, k: string, nodes: number[], nl = false): El => {
      const e: El = {
        p,
        k,
        n: nodes,
        nl,
        st: prevSt.get(`${p.id}#${k}`) ?? {},
        sI: nodes.map(() => 0),
        sI2: nodes.map(() => 0),
        sP: 0,
        Irms: nodes.map(() => 0),
        Imean: nodes.map(() => 0),
        P: 0,
        Urms: 0,
        Umean: 0,
      };
      els.push(e);
      return e;
    };
    const T = (p: Part) => terminalsOf(p).map((t) => this.tIdx.get(t.id)!);
    let hasAC = false;
    let fastF = 50;
    for (const p of this.parts) {
      const t = T(p);
      switch (p.type) {
        case "source":
        case "source2":
          mk(p, "vs", [t[0], t[1]]);
          if (ps(p, "ac") === "ac") {
            hasAC = true;
            fastF = Math.max(fastF, pn(p, "f"));
          }
          break;
        case "bus_l":
        case "rail_l":
          mk(p, "vs", [t[0], -1]);
          if (p.type === "rail_l" || ps(p, "ac") === "ac") {
            hasAC = true;
            fastF = Math.max(fastF, p.type === "rail_l" ? 50 : pn(p, "f"));
          }
          break;
        case "netz3":
          mk(p, "v3", [t[0], t[1], t[2], t[3]]);
          hasAC = true;
          fastF = Math.max(fastF, pn(p, "f"));
          break;
        case "q3":
        case "contact3":
        case "ol3":
          mk(p, "p3", t.slice(0, 6));
          break;
        case "motor3": {
          const m0 = n++;
          const m1 = n++;
          const m2 = n++;
          mk(p, "m3", [...t.slice(0, 6), m0, m1, m2]);
          break;
        }
        case "fgen":
          mk(p, "fg", [t[0], t[1]]);
          if (ps(p, "wave") !== "dc") {
            hasAC = true;
            fastF = Math.max(fastF, pn(p, "f"));
          }
          break;
        case "switch_no":
        case "switch_nc":
        case "taster_no":
        case "taster_nc":
        case "pairc_no":
        case "pairc_nc":
        case "contact_no":
        case "contact_nc":
        case "tcontact_no":
        case "tcontact_nc":
        case "ol_nc":
        case "ol_no":
          mk(p, "sw", [t[0], t[1]]);
          break;
        case "contact_co":
          mk(p, "co", [t[0], t[1], t[2]]);
          break;
        case "lamp":
        case "led":
        case "fluo":
        case "heater":
        case "coil":
        case "relay_ss":
        case "tcoil":
        case "res":
        case "ldr":
        case "ntc":
        case "fuse":
          mk(p, "r", [t[0], t[1]]);
          break;
        case "pot":
          mk(p, "pot", [t[0], t[1], t[2]]);
          break;
        case "motor": {
          const m = n++; // iç düğüm: R ile L arası
          mk(p, "mot", [t[0], t[1], m]);
          break;
        }
        case "cap":
        case "ecap":
          mk(p, "c", [t[0], t[1]]);
          break;
        case "ind":
          mk(p, "l", [t[0], t[1]]);
          break;
        case "xfmr":
          mk(p, "tr", [t[0], t[1], t[2], t[3]]);
          break;
        case "diode":
        case "zener":
        case "led_d":
          mk(p, "d", [t[0], t[1]], true);
          break;
        case "bridge":
          mk(p, "br", [t[0], t[1], t[2], t[3]], true);
          break;
        case "npn":
        case "pnp":
          mk(p, "bjt", [t[0], t[1], t[2]], true);
          break;
        case "nmos":
          mk(p, "mos", [t[0], t[1], t[2]], true);
          break;
        case "reg":
          mk(p, "reg", [t[0], t[1], t[2]], true);
          break;
        case "opamp":
          mk(p, "op", [t[0], t[1], t[2], t[3], t[4]], true);
          break;
        case "mcu":
          mk(p, "mcu", t.slice(0, 6));
          break;
        case "dcmotor":
          mk(p, "dcm", [t[0], t[1]]);
          break;
      }
    }
    this.els = els;
    this.byPart.clear();
    for (const e of els) {
      const l = this.byPart.get(e.p.id) ?? [];
      l.push(e);
      this.byPart.set(e.p.id, l);
    }
    // elemanın terminallerinin termList indeksleri (kablo akışı için)
    this.termOfEl = els.map((e) => {
      const ids = terminalsOf(e.p).map((t) => tpos.get(t.id)!);
      return e.n.map((_, i) => (i < ids.length ? ids[i] : -1));
    });
    this.n = n;
    this.hasNL = els.some((e) => e.nl);
    this.x = new Float64Array(n);
    if (prev && prev.n === n) this.x.set(prev.x);
    this.A = new Float64Array(n * n);
    this.base = new Float64Array(n * n);
    this.piv = new Int32Array(n);
    this.rhs = new Float64Array(n);
    const dynamic = els.some((e) => ["c", "l", "tr", "mot", "dcm", "mcu"].includes(e.k));
    this.dt = hasAC ? Math.min(2.5e-4, 1 / (fastF * 40)) : dynamic ? 1e-3 : 2e-3;
    this.ring = new Float32Array(n * RING);
    this.iRing = new Float32Array(els.length * RING);
    this.ringPos = 0;
    this.ringFill = 0;
    this.dirty = true;
  }

  // ── yardımcılar ──────────────────────────────────────────────────────────
  private v(i: number) {
    return i < 0 ? 0 : this.x[i];
  }

  private on(e: El): boolean {
    return !e.st.burnt;
  }

  private heldEff() {
    return { ...this.inputs.held, ...this.selfHeld };
  }

  private closed(e: El): boolean {
    return isClosed(e.p, this.energized, this.inputs.act, this.inputs.timerDone, this.heldEff());
  }

  /** 3 kutuplu anahtar iletiyor mu? */
  private closed3(e: El): boolean {
    const p = e.p;
    if (p.type === "q3") return !this.inputs.act[p.id] && !e.st.trip;
    if (p.type === "contact3") {
      const g = p.group ?? "";
      const h = this.heldEff();
      return g in h ? !!h[g] : !!this.energized[g];
    }
    return true; // ol3: termik eleman hep iletir
  }

  private emf3(e: El, k: number) {
    const p = e.p;
    if (p.enabled === false || e.st.trip) return 0;
    const U = pn(p, `U${k + 1}`);
    const ph = (-2 * Math.PI * k) / 3;
    return U * Math.SQRT2 * Math.sin(2 * Math.PI * pn(p, "f") * this.t + ph);
  }

  /** Trifaze motor sargı empedansı (üçgen anma değerlerinden), hızla değişir. */
  private m3Z(e: El) {
    const p = e.p;
    const P = pn(p, "Pn");
    const U = pn(p, "Un");
    const cos = pn(p, "cos");
    const IN = P / (Math.sqrt(3) * U * cos * pn(p, "eta"));
    const Z = (U / (IN / Math.sqrt(3))) * (0.2 + 0.8 * Math.min(1, e.st.w ?? 0));
    return { R: Math.max(0.01, Z * cos), L: Math.max(1e-6, (Z * Math.sqrt(1 - cos * cos)) / (2 * Math.PI * 50)), IN };
  }
  private m3Bridges(e: El): [number, number][] {
    if (e.p.conn === "Y") return [[3, 4], [4, 5]];
    if (e.p.conn === "D") return [[0, 5], [1, 3], [2, 4]];
    return [];
  }

  /** Bu elemanın doğrusal iletkenliği (topolojiye bağlı, adım boyunca sabit). */
  private resOf(e: El): number {
    const p = e.p;
    switch (p.type) {
      case "lamp":
      case "led":
      case "heater":
        return (pn(p, "Un") ** 2) / pn(p, "Pn");
      case "fluo":
        return e.st.lit ? (pn(p, "Un") ** 2) / pn(p, "Pn") : 2e6;
      case "coil":
      case "relay_ss":
        return (pn(p, "U") ** 2) / pn(p, "S");
      case "tcoil":
        return (pn(p, "U") ** 2) / 2;
      case "res":
        return pn(p, "R");
      case "fuse":
        return 0.005;
      case "ldr": {
        const lux = Math.max(0.01, pn(p, "lux"));
        return Math.min(5e6, pn(p, "R10") * Math.pow(lux / 10, -0.75));
      }
      case "ntc": {
        const T = pn(p, "T") + 273.15;
        return pn(p, "R25") * Math.exp(pn(p, "B") * (1 / T - 1 / 298.15));
      }
    }
    return 1e9;
  }

  private stampG(M: Float64Array, a: number, b: number, g: number) {
    const n = this.n;
    if (a >= 0) M[a * n + a] += g;
    if (b >= 0) M[b * n + b] += g;
    if (a >= 0 && b >= 0) {
      M[a * n + b] -= g;
      M[b * n + a] -= g;
    }
  }
  /** a'dan çıkıp eleman içinden b'ye giden akım kaynağı. */
  private stampI(a: number, b: number, i: number) {
    if (a >= 0) this.rhs[a] -= i;
    if (b >= 0) this.rhs[b] += i;
  }

  private srcEmf(e: El): number {
    const p = e.p;
    if (p.enabled === false || e.st.trip) return 0;
    const U = p.type === "rail_l" ? (p.volts ?? 230) : pn(p, "U");
    const ac = p.type === "rail_l" || ps(p, "ac") === "ac";
    const f = p.type === "rail_l" ? 50 : pn(p, "f");
    return ac ? U * Math.SQRT2 * Math.sin(2 * Math.PI * f * this.t) : U;
  }
  private srcR(e: El) {
    const p = e.p;
    const ac = p.type === "rail_l" || ps(p, "ac") === "ac";
    return ac ? R_GRID : R_DC;
  }
  private srcOpen(e: El) {
    return e.p.enabled === false || !!e.st.trip;
  }

  private fgEmf(e: El): number {
    const p = e.p;
    const ph = (2 * Math.PI * pn(p, "f") * this.t) % (2 * Math.PI);
    const Up = pn(p, "Up");
    const w = ps(p, "wave");
    const s =
      w === "square" ? (ph < Math.PI ? 1 : -1) : w === "tri" ? 1 - (2 * Math.abs(ph - Math.PI)) / Math.PI : w === "dc" ? 1 : Math.sin(ph);
    return pn(p, "off") + Up * s;
  }

  // mikrodenetleyici: pin sürüşleri (−1 = yüksek empedans, 0..1 = görev oranı), pull-up
  private mcuPins(e: El): { d: number[]; pu: boolean[]; powered: boolean } {
    const vcc = this.v(e.n[0]) - this.v(e.n[1]);
    const powered = vcc >= 3.5;
    const d = [-1, -1, -1, -1];
    const pu = [false, false, false, false];
    if (!powered) return { d, pu, powered };
    const T = pn(e.p, "T") / 1000;
    const step = Math.floor(this.t / T);
    const pin = (k: number) => this.v(e.n[2 + k]) - this.v(e.n[1]);
    switch (ps(e.p, "prog")) {
      case "blink":
        d[0] = step % 2 ? 0 : 1;
        break;
      case "button":
        pu[3] = true;
        d[0] = pin(3) < vcc / 3 ? 1 : 0;
        break;
      case "runner":
        for (let k = 0; k < 3; k++) d[k] = step % 3 === k ? 1 : 0;
        break;
      case "traffic": {
        const ph = step % 8; // 0-2 kırmızı, 3 kırmızı+sarı, 4-6 yeşil, 7 sarı
        d[0] = ph <= 3 ? 1 : 0;
        d[1] = ph === 3 || ph === 7 ? 1 : 0;
        d[2] = ph >= 4 && ph <= 6 ? 1 : 0;
        break;
      }
      case "fade":
        d[0] = 0.5 - 0.5 * Math.cos((2 * Math.PI * this.t) / (8 * T));
        break;
      case "thresh":
        d[0] = pin(3) > vcc / 2 ? 1 : 0;
        break;
    }
    return { d, pu, powered };
  }

  // ── doğrusal taban matris ────────────────────────────────────────────────
  private buildBase() {
    const n = this.n;
    const M = this.base;
    M.fill(0);
    for (let i = 0; i < n; i++) M[i * n + i] = GMIN;
    const dt = this.dt;
    for (const e of this.els) {
      if (!this.on(e) && e.k !== "vs") continue;
      const [a, b] = e.n;
      switch (e.k) {
        case "vs":
          if (!this.srcOpen(e)) this.stampG(M, a, b, 1 / this.srcR(e));
          break;
        case "v3":
          if (e.p.enabled !== false && !e.st.trip) for (let k = 0; k < 3; k++) this.stampG(M, e.n[k], e.n[3], 1 / R_GRID);
          break;
        case "p3":
          if (this.closed3(e)) for (let k = 0; k < 3; k++) this.stampG(M, e.n[k], e.n[k + 3], G_SW);
          break;
        case "m3": {
          const { R, L } = this.m3Z(e);
          for (let k = 0; k < 3; k++) {
            this.stampG(M, e.n[k], e.n[6 + k], 1 / R);
            this.stampG(M, e.n[6 + k], e.n[k + 3], dt / L);
          }
          for (const [x, y] of this.m3Bridges(e)) this.stampG(M, e.n[x], e.n[y], G_SW);
          break;
        }
        case "fg":
          this.stampG(M, a, b, 1 / 50);
          break;
        case "sw":
          if (this.closed(e)) this.stampG(M, a, b, G_SW);
          break;
        case "co":
          this.stampG(M, a, this.closed(e) ? e.n[2] : b, G_SW);
          break;
        case "r":
          this.stampG(M, a, b, 1 / this.resOf(e));
          break;
        case "pot": {
          const R = pn(e.p, "R");
          const pos = Math.min(1, Math.max(0, pn(e.p, "pos")));
          this.stampG(M, a, e.n[2], 1 / Math.max(0.5, R * pos));
          this.stampG(M, e.n[2], b, 1 / Math.max(0.5, R * (1 - pos)));
          break;
        }
        case "mot": {
          if (e.st.prot) break; // sargı koruması açık
          const { R, L } = this.motZ(e);
          this.stampG(M, a, e.n[2], 1 / R);
          this.stampG(M, e.n[2], b, dt / L);
          break;
        }
        case "c":
          this.stampG(M, a, b, pn(e.p, "C") / dt);
          break;
        case "l":
          this.stampG(M, a, b, dt / pn(e.p, "L"));
          break;
        case "tr": {
          const G = this.trG(e);
          const ports = [
            [e.n[0], e.n[1]],
            [e.n[2], e.n[3]],
          ];
          for (let k = 0; k < 2; k++)
            for (let j = 0; j < 2; j++) {
              const g = dt * G[k][j];
              const [ak, bk] = ports[k];
              const [aj, bj] = ports[j];
              if (ak >= 0 && aj >= 0) M[ak * n + aj] += g;
              if (ak >= 0 && bj >= 0) M[ak * n + bj] -= g;
              if (bk >= 0 && aj >= 0) M[bk * n + aj] -= g;
              if (bk >= 0 && bj >= 0) M[bk * n + bj] += g;
            }
          break;
        }
        case "dcm":
          this.stampG(M, a, b, 1 / this.dcmRa(e));
          break;
        case "mcu": {
          const pins = this.mcuPins(e);
          e.st.pw = pins.powered ? 1 : 0;
          for (let k = 0; k < 4; k++) {
            e.st[`d${k}`] = pins.d[k];
            const pnode = e.n[2 + k];
            if (pins.d[k] >= 0) {
              const g = 1 / 25;
              if (pins.d[k] > 0) this.stampG(M, pnode, e.n[0], g * pins.d[k]);
              if (pins.d[k] < 1) this.stampG(M, pnode, e.n[1], g * (1 - pins.d[k]));
            } else if (pins.pu[k]) this.stampG(M, pnode, e.n[0], 1 / 30000);
          }
          break;
        }
      }
    }
  }

  private motZ(e: El) {
    const p = e.p;
    const Un = pn(p, "Un");
    const S = pn(p, "Pn") / (0.75 * pn(p, "cos"));
    const Z = (Un * Un) / S;
    const k = 0.2 + 0.8 * Math.min(1, e.st.w ?? 0); // dururken empedans 1/5 → kalkış akımı ~5×
    const cos = pn(p, "cos");
    const R = Z * cos * k;
    const X = Z * Math.sqrt(1 - cos * cos) * k;
    return { R: Math.max(0.01, R), L: Math.max(1e-6, X / (2 * Math.PI * 50)) };
  }

  private trG(e: El) {
    const p = e.p;
    const U1 = pn(p, "U1");
    const U2 = pn(p, "U2");
    const S = pn(p, "S");
    const L1 = (U1 * U1) / (2 * Math.PI * 50 * 0.05 * S);
    const L2 = L1 * (U2 / U1) ** 2;
    const k = 0.995;
    const M = k * Math.sqrt(L1 * L2);
    const det = L1 * L2 - M * M;
    return [
      [L2 / det, -M / det],
      [-M / det, L1 / det],
    ];
  }

  private dcmPar(e: El) {
    const p = e.p;
    const Un = pn(p, "Un");
    const In = pn(p, "Pn") / (0.75 * Un);
    const wn = (pn(p, "nn") * 2 * Math.PI) / 60;
    const kf = (0.9 * Un) / wn;
    return { Ra: (0.1 * Un) / In, kf, wn, In, b: (kf * In * 0.8) / wn };
  }
  private dcmRa(e: El) {
    return this.dcmPar(e).Ra;
  }

  // ── doğrusal olmayan elemanlar: terminal akımları (elemana giren) ─────────
  private nlI(e: El, v: (i: number) => number): number[] {
    const p = e.p;
    const V = e.n.map(v);
    switch (e.k) {
      case "d": {
        const [a, c] = V;
        const vd = a - c;
        let i: number;
        if (p.type === "led_d") {
          const nVt = 2 * VT;
          const Is = pn(p, "Imax") / (Math.exp(pn(p, "Vf") / nVt) - 1);
          i = dI(vd, Is, nVt);
        } else if (p.type === "zener") {
          i = dI(vd, 1e-12, VT * 1.2) - dI(-vd - pn(p, "Vz"), 1e-12, VT * 1.2);
        } else i = dI(vd, 1e-8, 1.8 * VT);
        i += GMIN * vd;
        return [i, -i];
      }
      case "br": {
        // 0: ~1, 1: ~2, 2: +, 3: −   (anot → katot)
        const d = (an: number, ka: number) => dI(V[an] - V[ka], 1e-8, 1.8 * VT);
        const i1 = d(0, 2);
        const i2 = d(1, 2);
        const i3 = d(3, 0);
        const i4 = d(3, 1);
        return [i1 - i3, i2 - i4, -i1 - i2, i3 + i4];
      }
      case "bjt": {
        const s = p.type === "pnp" ? -1 : 1;
        const [vb, vc, ve] = V;
        const Is = 1e-14;
        const bf = pn(p, "beta");
        const ef = dI(s * (vb - ve), Is, VT);
        const er = dI(s * (vb - vc), Is, VT);
        const ic = ef - er - er / 1;
        const ib = ef / bf + er / 1;
        return [s * ib + GMIN * (vb - ve), s * ic, -s * (ic + ib) - GMIN * (vb - ve)];
      }
      case "mos": {
        const [vg, vd0, vs0] = V;
        let vd = vd0;
        let vs = vs0;
        let sg = 1;
        if (vd < vs) {
          [vd, vs] = [vs, vd];
          sg = -1;
        }
        const vov = sp(vg - vs - pn(p, "Vth"), 0.03);
        const vds = vd - vs;
        const K = pn(p, "K");
        const id = (vds < vov ? K * (vov * vds - (vds * vds) / 2) : (K / 2) * vov * vov) * (1 + 0.01 * vds);
        return [GMIN * (vg - vs0), sg * id, -sg * id];
      }
      case "reg": {
        const [vi, vo, vg] = V;
        const uo = e.st.sd ? 0 : pn(p, "Uo");
        const vt = vg + smin(uo, sp(vi - vg - 2, 0.05), 0.05);
        const raw = (vo - vt) / 0.05;
        const Im = pn(p, "Imax");
        const io = -Im + sp(raw + Im, 1e-3 * Im);
        const ii = (vi - vg > 0.5 ? 5e-3 : 0) + sp(-io, 1e-4);
        return [ii, io, -(ii + io)];
      }
      case "op": {
        const [vm, vp, vo, vpp, vnn] = V;
        const half = Math.max(0.05, (vpp - vnn) / 2 - 1);
        const mid = (vpp + vnn) / 2;
        const vt = mid + half * Math.tanh((pn(p, "A") * (vp - vm)) / half);
        const io = (vo - vt) / 50;
        const ip = 1e-3 + sp(-io, 1e-4);
        return [GMIN * vm, GMIN * vp, io, ip, -(ip + io)];
      }
    }
    return V.map(() => 0);
  }

  // ── bir zaman adımı ──────────────────────────────────────────────────────
  private step() {
    const n = this.n;
    const dt = this.dt;
    if (this.dirty) {
      this.buildBase();
      if (!this.hasNL && n) {
        this.A.set(this.base);
        luFactor(this.A, n, this.piv);
      }
      this.dirty = false;
    }
    // mikrodenetleyici pinleri değiştiyse matris yenilenir
    for (const e of this.els)
      if (e.k === "mcu" && this.on(e)) {
        const pins = this.mcuPins(e);
        const ch = pins.powered !== !!e.st.pw || pins.d.some((d, k) => d !== e.st[`d${k}`]);
        if (ch) {
          this.dirty = true;
          this.buildBase();
          if (!this.hasNL && n) {
            this.A.set(this.base);
            luFactor(this.A, n, this.piv);
          }
          this.dirty = false;
        }
      }
    this.t += dt;
    // sağ taraf: kaynaklar + geçmiş terimleri
    const rhsBase = new Float64Array(n);
    this.rhs = rhsBase;
    for (const e of this.els) {
      if (!this.on(e) && e.k !== "vs") continue;
      const [a, b] = e.n;
      switch (e.k) {
        case "vs":
          if (!this.srcOpen(e)) this.stampI(b, a, this.srcEmf(e) / this.srcR(e));
          break;
        case "v3":
          for (let k = 0; k < 3; k++) this.stampI(e.n[3], e.n[k], this.emf3(e, k) / R_GRID);
          break;
        case "m3":
          for (let k = 0; k < 3; k++) this.stampI(e.n[6 + k], e.n[k + 3], e.st[`i${k}`] ?? 0);
          break;
        case "fg":
          this.stampI(b, a, this.fgEmf(e) / 50);
          break;
        case "c":
          this.stampI(b, a, (pn(e.p, "C") / dt) * (e.st.v ?? 0));
          break;
        case "l":
          this.stampI(a, b, e.st.i ?? 0);
          break;
        case "mot":
          if (!e.st.prot) this.stampI(e.n[2], b, e.st.iL ?? 0);
          break;
        case "tr":
          this.stampI(e.n[0], e.n[1], e.st.i1 ?? 0);
          this.stampI(e.n[2], e.n[3], e.st.i2 ?? 0);
          break;
        case "dcm": {
          const { Ra, kf } = this.dcmPar(e);
          this.stampI(b, a, (kf * (e.st.w ?? 0)) / Ra);
          break;
        }
        case "mcu":
          if (e.st.pw) this.stampI(e.n[0], e.n[1], 0.015);
          break;
      }
    }
    if (n === 0) return;
    if (!this.hasNL) {
      const b = rhsBase.slice();
      luSolve(this.A, n, this.piv, b);
      this.x = b;
    } else this.newton(rhsBase);
    this.afterStep();
  }

  private newton(rhs0: Float64Array) {
    const n = this.n;
    const x = this.x.slice();
    const nlEls = this.els.filter((e) => e.nl && this.on(e));
    const h = 1e-7;
    for (let it = 0; it < 60; it++) {
      const A = this.A;
      A.set(this.base);
      const b = rhs0.slice();
      const vx = (i: number) => (i < 0 ? 0 : x[i]);
      for (const e of nlEls) {
        const i0 = this.nlI(e, vx);
        const uniq = [...new Set(e.n.filter((q) => q >= 0))];
        const J: number[][] = uniq.map((u) => {
          const keep = x[u];
          x[u] = keep + h;
          const i1 = this.nlI(e, vx);
          x[u] = keep;
          return i1.map((c, k) => (c - i0[k]) / h);
        });
        e.n.forEach((nk, k) => {
          if (nk < 0) return;
          let lin = i0[k];
          uniq.forEach((u, ui) => {
            A[nk * n + u] += J[ui][k];
            lin -= J[ui][k] * x[u];
          });
          b[nk] -= lin;
        });
      }
      luFactor(A, n, this.piv);
      luSolve(A, n, this.piv, b);
      // adım sınırlama: Newton büyük sıçramalarda kaçmasın
      let dmax = 0;
      for (let i = 0; i < n; i++) dmax = Math.max(dmax, Math.abs(b[i] - x[i]));
      const lim = dmax > 2 ? 2 / dmax : 1;
      let conv = true;
      for (let i = 0; i < n; i++) {
        const nx = x[i] + (b[i] - x[i]) * lim;
        if (Math.abs(nx - x[i]) > 1e-6 + 1e-6 * Math.abs(nx)) conv = false;
        x[i] = nx;
      }
      if (conv && lim === 1) break;
    }
    this.x = x;
  }

  /** Adım sonrası: durum değişkenleri, akımlar, birikimler. */
  private afterStep() {
    const dt = this.dt;
    const vx = (i: number) => (i < 0 ? 0 : this.x[i]);
    this.inj.fill(0);
    this.els.forEach((e, ei) => {
      const I = this.elCurrents(e, vx);
      const V = e.n.map(vx);
      let P = 0;
      for (let k = 0; k < I.length; k++) {
        e.sI[k] += I[k];
        e.sI2[k] += I[k] * I[k];
        P += V[k] * I[k];
        const ti = this.termOfEl[ei][k];
        if (ti >= 0) this.inj[ti] += I[k];
      }
      e.sP += P;
      const u = V[0] - (V[1] ?? 0);
      e.st.su = (e.st.su ?? 0) + u;
      e.st.su2 = (e.st.su2 ?? 0) + u * u;
      // durum güncellemeleri
      this.iRing[ei * RING + this.ringPos] = e.k === "bjt" || e.k === "mos" || e.k === "reg" ? I[1] : I[0];
      switch (e.k) {
        case "m3": {
          const { L } = this.m3Z(e);
          const wt = 2 * Math.PI * 50 * this.t;
          for (let k = 0; k < 3; k++) {
            e.st[`i${k}`] = (e.st[`i${k}`] ?? 0) + (dt / L) * (V[6 + k] - V[k + 3]);
            const u = V[k] - V[k + 3];
            e.st[`c${k}`] = (e.st[`c${k}`] ?? 0) + u * Math.cos(wt);
            e.st[`s${k}`] = (e.st[`s${k}`] ?? 0) + u * Math.sin(wt);
          }
          break;
        }
        case "c":
          e.st.v = V[0] - V[1];
          break;
        case "l":
          e.st.i = (e.st.i ?? 0) + (dt / pn(e.p, "L")) * (V[0] - V[1]);
          break;
        case "mot":
          if (!e.st.prot) e.st.iL = (e.st.iL ?? 0) + (dt / this.motZ(e).L) * (V[2] - V[1]);
          else e.st.iL = 0;
          break;
        case "tr": {
          const G = this.trG(e);
          const u1 = V[0] - V[1];
          const u2 = V[2] - V[3];
          e.st.i1 = (e.st.i1 ?? 0) + dt * (G[0][0] * u1 + G[0][1] * u2);
          e.st.i2 = (e.st.i2 ?? 0) + dt * (G[1][0] * u1 + G[1][1] * u2);
          break;
        }
        case "dcm": {
          const { kf, b } = this.dcmPar(e);
          const i = I[0];
          const J = b * 3; // ~0,25 s hızlanma
          e.st.w = Math.max(-1e5, (e.st.w ?? 0) + (dt * (kf * i - b * (e.st.w ?? 0))) / J);
          break;
        }
      }
    });
    // kablo akımları: yapraktan köke alt ağaç toplamı
    const sub = this.inj.slice();
    for (const tr of this.tree) {
      const c = sub[tr.child];
      if (tr.wire >= 0) {
        const iw = tr.sign * c; // çocuk tarafı akım çekiyorsa akım ebeveynden çocuğa akar (a→b pozitif)
        this.wS[tr.wire] += iw;
        this.wS2[tr.wire] += iw * iw;
      }
      sub[tr.parent] += c;
    }
    // osiloskop halkası
    const n = this.n;
    const base = this.ringPos * n;
    for (let i = 0; i < n; i++) this.ring[base + i] = this.x[i];
    this.ringPos = (this.ringPos + 1) % RING;
    this.ringFill = Math.min(RING, this.ringFill + 1);
    this.winSteps++;
    this.winT += dt;
    if (this.winT >= WIN - 1e-12) this.endWindow();
  }

  /** Eleman terminal akımları (elemana giren yönde). */
  private elCurrents(e: El, v: (i: number) => number): number[] {
    if (!this.on(e) && e.k !== "vs") return e.n.map(() => 0);
    const [a, b] = e.n.map(v);
    const dt = this.dt;
    switch (e.k) {
      case "vs": {
        if (this.srcOpen(e)) return [0, 0];
        const i = (a - b - this.srcEmf(e)) / this.srcR(e);
        return [i, -i];
      }
      case "v3": {
        const vn = v(e.n[3]);
        const I = [0, 1, 2].map((k) => (e.p.enabled === false || e.st.trip ? 0 : (v(e.n[k]) - vn - this.emf3(e, k)) / R_GRID));
        return [...I, -(I[0] + I[1] + I[2])];
      }
      case "p3": {
        const I = [0, 0, 0, 0, 0, 0];
        if (this.closed3(e))
          for (let k = 0; k < 3; k++) {
            const i = (v(e.n[k]) - v(e.n[k + 3])) * G_SW;
            I[k] = i;
            I[k + 3] = -i;
          }
        return I;
      }
      case "m3": {
        const { R } = this.m3Z(e);
        const I = new Array(9).fill(0);
        for (let k = 0; k < 3; k++) {
          const i = (v(e.n[k]) - v(e.n[6 + k])) / R;
          I[k] += i;
          I[k + 3] -= i;
        }
        // köprüler
        for (const [x, y] of this.m3Bridges(e)) {
          const i = (v(e.n[x]) - v(e.n[y])) * G_SW;
          I[x] += i;
          I[y] -= i;
        }
        return I;
      }
      case "fg": {
        const i = (a - b - this.fgEmf(e)) / 50;
        return [i, -i];
      }
      case "sw": {
        const i = this.closed(e) ? (a - b) * G_SW : 0;
        return [i, -i];
      }
      case "co": {
        const c = v(e.n[2]);
        const up = this.closed(e);
        const i = up ? (a - c) * G_SW : (a - b) * G_SW;
        return up ? [i, 0, -i] : [i, -i, 0];
      }
      case "r": {
        const i = (a - b) / this.resOf(e);
        return [i, -i];
      }
      case "pot": {
        const w = v(e.n[2]);
        const R = pn(e.p, "R");
        const pos = Math.min(1, Math.max(0, pn(e.p, "pos")));
        const i1 = (a - w) / Math.max(0.5, R * pos);
        const i2 = (w - b) / Math.max(0.5, R * (1 - pos));
        return [i1, -i2, i2 - i1];
      }
      case "mot": {
        if (e.st.prot) return [0, 0, 0];
        const m = v(e.n[2]);
        const i = (a - m) / this.motZ(e).R;
        return [i, -i, 0];
      }
      case "c": {
        const i = (pn(e.p, "C") / dt) * (a - b - (e.st.v ?? 0));
        return [i, -i];
      }
      case "l": {
        const i = (e.st.i ?? 0) + (dt / pn(e.p, "L")) * (a - b);
        return [i, -i];
      }
      case "tr": {
        const G = this.trG(e);
        const u1 = a - b;
        const u2 = v(e.n[2]) - v(e.n[3]);
        const i1 = (e.st.i1 ?? 0) + dt * (G[0][0] * u1 + G[0][1] * u2);
        const i2 = (e.st.i2 ?? 0) + dt * (G[1][0] * u1 + G[1][1] * u2);
        return [i1, -i1, i2, -i2];
      }
      case "dcm": {
        const { Ra, kf } = this.dcmPar(e);
        const i = (a - b - kf * (e.st.w ?? 0)) / Ra;
        return [i, -i];
      }
      case "mcu": {
        const I = [0, 0, 0, 0, 0, 0];
        if (e.st.pw) {
          I[0] += 0.015;
          I[1] -= 0.015;
        }
        const vc = v(e.n[0]);
        const vg = v(e.n[1]);
        for (let k = 0; k < 4; k++) {
          const d = e.st[`d${k}`] ?? -1;
          const vp = v(e.n[2 + k]);
          if (d >= 0) {
            const ih = d > 0 ? ((vp - vc) / 25) * d : 0;
            const il = d < 1 ? ((vp - vg) / 25) * (1 - d) : 0;
            I[2 + k] = ih + il;
            I[0] -= ih;
            I[1] -= il;
          }
        }
        return I;
      }
    }
    if (e.nl) return this.nlI(e, v);
    return e.n.map(() => 0);
  }

  // ── pencere sonu: RMS, ısınma, yanma, bobinler, koruma ───────────────────
  private endWindow() {
    const N = Math.max(1, this.winSteps);
    const W = this.winT;
    for (const e of this.els) {
      for (let k = 0; k < e.n.length; k++) {
        e.Imean[k] = e.sI[k] / N;
        e.Irms[k] = Math.sqrt(Math.max(0, e.sI2[k] / N));
        e.sI[k] = 0;
        e.sI2[k] = 0;
      }
      e.P = e.sP / N;
      e.sP = 0;
      e.Umean = (e.st.su ?? 0) / N;
      e.Urms = Math.sqrt(Math.max(0, (e.st.su2 ?? 0) / N));
      e.st.su = 0;
      e.st.su2 = 0;
      this.slowUpdate(e, W);
    }
    for (let w = 0; w < this.wS.length; w++) {
      this.wMean[w] = this.wS[w] / N;
      this.wRms[w] = Math.sqrt(Math.max(0, this.wS2[w] / N));
      this.wS[w] = 0;
      this.wS2[w] = 0;
    }
    this.winSteps = 0;
    this.winT = 0;
    // bobinler
    const next: Record<string, boolean> = {};
    for (const e of this.els) {
      if (!["coil", "relay_ss", "tcoil"].includes(e.p.type)) continue;
      const Uc = pn(e.p, "U");
      const was = !!this.energized[e.p.label];
      const on = e.st.burnt ? false : was ? e.Urms > 0.45 * Uc : e.Urms >= 0.75 * Uc;
      next[e.p.label] = next[e.p.label] || on;
    }
    for (const [k, v] of Object.entries(next))
      if (!!this.energized[k] !== v) {
        this.toggles.push(this.t);
        this.dirty = true;
      }
    if (Object.keys(next).length || Object.keys(this.energized).length) {
      for (const k of Object.keys(this.energized)) if (!(k in next)) this.dirty = true;
      this.energized = next;
    }
    this.toggles = this.toggles.filter((tt) => this.t - tt < 1);
    this.chatter = this.toggles.length > 12;
  }

  private slowUpdate(e: El, W: number) {
    const p = e.p;
    const st = e.st;
    const heat = (key: string, cond: boolean, limit: number) => {
      st[key] = cond ? (st[key] ?? 0) + W : 0;
      if (st[key] > limit && !st.burnt) {
        st.burnt = 1;
        this.dirty = true;
      }
    };
    const I = e.Irms[0] ?? 0;
    switch (e.k) {
      case "v3": {
        if (p.enabled === false || st.trip) break;
        const r = Math.max(e.Irms[0], e.Irms[1], e.Irms[2]) / pn(p, "In");
        st.H = Math.max(0, (st.H ?? 0) * 0.995 + Math.max(0, r * r - 1.3) * W);
        if (r > 5 || st.H > 25) {
          st.trip = 1;
          this.short = r > 5;
          this.dirty = true;
        }
        break;
      }
      case "p3": {
        const Imax = Math.max(e.Irms[0], e.Irms[1], e.Irms[2]);
        if (p.type === "q3" && !st.trip && Imax > 13 * pn(p, "In")) {
          st.trip = 1;
          this.dirty = true;
        }
        if (p.type === "ol3" && !this.selfHeld[p.label]) {
          const r = Imax / pn(p, "Ie");
          st.H = Math.max(0, (st.H ?? 0) * Math.exp(-W / 60) + Math.max(0, r * r - 1.1) * W);
          if (st.H > 120) {
            this.selfHeld[p.label] = true;
            st.H = 0;
            this.dirty = true;
          }
        }
        break;
      }
      case "m3": {
        const N = Math.max(1, W / this.dt);
        const ph = [0, 1, 2].map((k) => ({ re: (2 * (st[`c${k}`] ?? 0)) / N, im: (-2 * (st[`s${k}`] ?? 0)) / N }));
        for (let k = 0; k < 3; k++) {
          st[`c${k}`] = 0;
          st[`s${k}`] = 0;
        }
        const m = ph.map((q) => Math.hypot(q.re, q.im) / Math.SQRT2);
        const max = Math.max(...m);
        const min = Math.min(...m);
        let target = 0;
        st.fault = 0;
        if (max < 23) target = 0;
        else if (min < 0.6 * max) st.fault = 1;
        else {
          const cross = ph[0].im * ph[1].re - ph[0].re * ph[1].im;
          st.dir = cross >= 0 ? 1 : -1;
          target = Math.min(1.2, min / pn(p, "Un"));
        }
        const w = st.w ?? 0;
        const nw = st.fault ? Math.max(0, w - W / 1.5) : w + (target - w) * Math.min(1, W / (target > w ? 0.8 : 1.5));
        if (Math.abs(nw - w) > 0.01) this.dirty = true;
        st.w = nw;
        st.tgt = target;
        const { IN } = this.m3Z(e);
        const r = Math.max(e.Irms[0], e.Irms[1], e.Irms[2]) / IN;
        const Tt = T_AMB + 75 * r * r;
        st.T = (st.T ?? T_AMB) + (Tt - (st.T ?? T_AMB)) * Math.min(1, W / 20);
        heat("hot", st.T > 180, 1);
        break;
      }
      case "vs": {
        if (this.srcOpen(e)) break;
        const In = p.type === "rail_l" ? 16 : pn(p, "In");
        const r = I / In;
        st.H = Math.max(0, (st.H ?? 0) * 0.995 + Math.max(0, r * r - 1.3) * W);
        if (r > 5 || st.H > 25) {
          st.trip = 1;
          this.short = r > 5;
          this.dirty = true;
        }
        break;
      }
      case "r":
        this.loadUpdate(e, W, heat);
        break;
      case "pot": {
        const T = T_AMB + e.P * (100 / pn(p, "Pmax"));
        st.T = (st.T ?? T_AMB) + (T - (st.T ?? T_AMB)) * Math.min(1, W / 2);
        heat("hot", st.T > 350, 0.5);
        break;
      }
      case "mot": {
        const Un = pn(p, "Un");
        const U = e.Urms;
        const w = st.w ?? 0;
        const target = !st.prot && U > 0.7 * Un ? Math.min(1.05, U / Un) : U > 0.4 * Un && w > 0.5 && !st.prot ? 0.9 : 0;
        const nw = w + (target - w) * Math.min(1, W / (target > w ? 0.6 : 1.2));
        if (Math.abs(nw - w) > 0.01) this.dirty = true;
        st.w = nw;
        const In = pn(p, "Pn") / (0.75 * pn(p, "cos") * Un);
        const r = I / In;
        const Tt = T_AMB + 75 * r * r;
        st.T = (st.T ?? T_AMB) + (Tt - (st.T ?? T_AMB)) * Math.min(1, W / 8);
        if (ps(p, "prot") === "on") {
          if (!st.prot && st.T > 130) {
            st.prot = 1;
            this.dirty = true;
          } else if (st.prot && st.T < 70) {
            st.prot = 0;
            this.dirty = true;
          }
        } else heat("hot", st.T > 180, 1);
        break;
      }
      case "c": {
        const Um = pn(p, "Umax");
        const v = st.v ?? 0;
        heat("ov", Math.abs(v) > 1.2 * Um || (p.type === "ecap" && v < -1.5), 0.15);
        break;
      }
      case "d":
      case "br": {
        const Imax = pn(p, p.type === "zener" ? "Pmax" : "Imax");
        if (p.type === "zener") heat("hot", Math.abs(e.P) > 2 * Imax, 0.3);
        else heat("hot", Math.max(...e.Irms) > 2.2 * Imax, Math.max(...e.Irms) > 10 * Imax ? 0 : p.type === "led_d" ? 0.3 : 0.5);
        break;
      }
      case "bjt":
      case "mos":
        heat("hot", (e.Irms[1] ?? 0) > 2 * pn(p, "Imax"), 0.3);
        break;
      case "reg": {
        const Pd = Math.max(0, e.P);
        const Rth = ps(p, "sink") === "yes" ? 8 : 50;
        const Tt = T_AMB + Pd * Rth;
        st.T = (st.T ?? T_AMB) + (Tt - (st.T ?? T_AMB)) * Math.min(1, W / 3);
        if (!st.sd && st.T > 150) st.sd = 1;
        else if (st.sd && st.T < 120) st.sd = 0;
        break;
      }
      case "tr": {
        const S = (e.Irms[2] ?? 0) * Math.abs(pn(p, "U2"));
        heat("hot", S > 1.6 * pn(p, "S"), 8);
        break;
      }
      case "dcm": {
        const { In } = this.dcmPar(e);
        heat("hot", I > 3 * In, 5);
        break;
      }
    }
  }

  private loadUpdate(e: El, W: number, heat: (k: string, c: boolean, l: number) => void) {
    const p = e.p;
    const st = e.st;
    const U = e.Urms;
    switch (p.type) {
      case "lamp":
        heat("ov", e.P > 1.8 * pn(p, "Pn"), e.P > 6 * pn(p, "Pn") ? 0 : 0.12);
        break;
      case "led":
        heat("ov", U > 1.35 * pn(p, "Un"), U > 3 * pn(p, "Un") ? 0 : 0.25);
        break;
      case "fluo": {
        const Un = pn(p, "Un");
        if (!st.lit && U >= 0.85 * Un) {
          st.lit = 1;
          st.strike = this.t;
          this.dirty = true;
        } else if (st.lit && U < 0.45 * Un) {
          st.lit = 0;
          this.dirty = true;
        }
        heat("ov", U > 1.35 * Un, U > 3 * Un ? 0 : 0.3);
        break;
      }
      case "heater": {
        const Tt = T_AMB + 400 * (e.P / pn(p, "Pn"));
        st.T = (st.T ?? T_AMB) + (Tt - (st.T ?? T_AMB)) * Math.min(1, W / 15);
        heat("ov", e.P > 2 * pn(p, "Pn"), 2);
        break;
      }
      case "coil":
      case "relay_ss":
      case "tcoil":
        heat("ov", U > 1.3 * pn(p, "U"), U > 4 * pn(p, "U") ? 0 : 3);
        break;
      case "res": {
        const Tt = T_AMB + e.P * (100 / pn(p, "Pmax"));
        st.T = (st.T ?? T_AMB) + (Tt - (st.T ?? T_AMB)) * Math.min(1, W / 1.5);
        heat("smoke", st.T > 350, 0.4);
        break;
      }
      case "fuse": {
        const In = pn(p, "In");
        const r = (e.Irms[0] ?? 0) / In;
        const ch = ps(p, "ch");
        const inst = ch === "B" ? 5 : ch === "C" ? 10 : ch === "F" ? 4 : 1e9;
        st.H = Math.max(0, (st.H ?? 0) * 0.995 + Math.max(0, r * r - 1.3) * W);
        const lim = ch === "F" ? 2 : ch === "gG" ? 15 : 25;
        if (r > inst || st.H > lim) {
          st.burnt = 1;
          this.dirty = true;
        }
        break;
      }
    }
  }

  // ── dış arayüz ───────────────────────────────────────────────────────────
  setInputs(inp: EngineInputs) {
    const same =
      JSON.stringify(inp.act) === JSON.stringify(this.inputs.act) &&
      JSON.stringify(inp.timerDone) === JSON.stringify(this.inputs.timerDone) &&
      JSON.stringify(inp.held) === JSON.stringify(this.inputs.held);
    this.inputs = inp;
    if (!same) this.dirty = true;
  }

  /** Gerçek zamanda ilerle (saniye). Ağır devrede yavaşlar; slow oranı raporlanır. */
  run(realDt: number) {
    const want = Math.min(0.05, Math.max(0, realDt));
    const steps = Math.ceil(want / this.dt);
    const t0 = performance.now();
    let done = 0;
    for (; done < steps; done++) {
      this.step();
      if ((done & 15) === 15 && performance.now() - t0 > 18) break;
    }
    this.lastLoad = performance.now() - t0;
    this.slow = steps ? Math.min(1, (done + 1) / steps) : 1;
  }

  get load() {
    return this.lastLoad;
  }

  /** Yanmış/atmış parçayı yenile (simülasyonda tıklayınca). */
  repair(partId: string): boolean {
    let any = false;
    for (const e of this.byPart.get(partId) ?? [])
      if (e.st.burnt || e.st.trip) {
        e.st.burnt = 0;
        e.st.trip = 0;
        e.st.H = 0;
        e.st.ov = 0;
        e.st.hot = 0;
        e.st.smoke = 0;
        any = true;
      }
    for (const e of this.byPart.get(partId) ?? [])
      if (e.p.type === "ol3" && this.selfHeld[e.p.label]) {
        delete this.selfHeld[e.p.label];
        any = true;
      }
    if (any) {
      this.dirty = true;
      this.short = false;
    }
    return any;
  }

  isBroken(partId: string) {
    return (this.byPart.get(partId) ?? []).some((e) => e.st.burnt || e.st.trip || (e.p.type === "ol3" && this.selfHeld[e.p.label]));
  }

  /** Osiloskop: iki düğüm arası gerilim ve (varsa) parçanın akımı, en eski → en yeni. */
  waveData(a: number, b: number, partId?: string): { v: Float32Array; i: Float32Array | null; dt: number } {
    const n = this.n;
    const cnt = this.ringFill;
    const v = new Float32Array(cnt);
    const ei = partId ? this.els.findIndex((e) => e.p.id === partId) : -1;
    const i = ei >= 0 ? new Float32Array(cnt) : null;
    for (let s = 0; s < cnt; s++) {
      const pos = (this.ringPos - cnt + s + RING) % RING;
      v[s] = (a < 0 ? 0 : this.ring[pos * n + a]) - (b < 0 ? 0 : this.ring[pos * n + b]);
      if (i) i[s] = this.iRing[ei * RING + pos];
    }
    return { v, i, dt: this.dt };
  }

  nodeOf(tid: string): number | undefined {
    return this.tIdx.get(tid);
  }

  /** İki düğüm arasındaki gerilim (son pencere + osiloskop izi). */
  read(a: number, b: number): Reading {
    const n = this.n;
    const cnt = this.ringFill;
    const wave: number[] = [];
    for (let s = 0; s < cnt; s++) {
      const pos = (this.ringPos - cnt + s + RING) % RING;
      const va = a < 0 ? 0 : this.ring[pos * n + a];
      const vb = b < 0 ? 0 : this.ring[pos * n + b];
      wave.push(va - vb);
    }
    const win = Math.max(1, Math.min(wave.length, Math.round(WIN / this.dt)));
    const last = wave.slice(-win);
    const mean = last.reduce((s, x) => s + x, 0) / last.length;
    const ms = last.reduce((s, x) => s + x * x, 0) / last.length;
    let cross = 0;
    for (let i = 1; i < wave.length; i++) if (wave[i - 1] - mean < 0 && wave[i] - mean >= 0) cross++;
    const span = wave.length * this.dt;
    const ac = Math.sqrt(Math.max(0, ms - mean * mean));
    return {
      dc: mean,
      rms: Math.sqrt(Math.max(0, ms)),
      ac,
      min: Math.min(...last),
      max: Math.max(...last),
      f: ac > 1e-3 && cross >= 2 ? cross / span : 0,
      wave,
      dt: this.dt,
    };
  }

  wireReading(wireId: string): { rms: number; dc: number } | null {
    const i = this.wireIdx.get(wireId);
    return i === undefined ? null : { rms: this.wRms[i], dc: this.wMean[i] };
  }

  /** Parçanın canlı değerleri (özellik paneli + ölçü aleti). */
  partReading(partId: string): PartReading | null {
    const list = this.byPart.get(partId);
    if (!list?.length) return null;
    const e = list[0];
    const p = e.p;
    const r: PartReading = {
      U: e.Urms,
      Udc: e.Umean,
      I: e.Irms[0] ?? 0,
      Idc: e.Imean[0] ?? 0,
      P: list.reduce((s, x) => s + x.P, 0),
    };
    if (e.k === "bjt" || e.k === "mos") {
      r.I = e.Irms[1];
      r.Idc = e.Imean[1];
    }
    if (e.k === "reg") {
      r.I = e.Irms[1];
      r.Idc = e.Imean[1];
    }
    if (e.k === "tr") r.I = e.Irms[0];
    if (e.k === "r") r.R = this.resOf(e);
    if (e.k === "pot") r.R = pn(p, "R");
    if (e.st.T !== undefined) r.T = e.st.T;
    if (e.k === "mot") r.rpm = (e.st.w ?? 0) * pn(p, "nn");
    if (e.k === "m3") r.rpm = ((e.st.tgt ?? 0) > 0 && !e.st.fault ? (e.st.w ?? 0) : 0) * pn(p, "nn");
    if (e.k === "dcm") r.rpm = ((e.st.w ?? 0) * 60) / (2 * Math.PI);
    r.state = e.st.burnt
      ? p.type === "fuse"
        ? "blown"
        : p.type === "res"
          ? "smoke"
          : "burnt"
      : e.st.trip
        ? "trip"
        : e.st.prot
          ? "prot"
          : e.st.sd
            ? "sd"
            : undefined;
    return r;
  }

  /** Çizim katmanı için anlık görüntü. */
  snapshot(): SimResult & { temp: Record<string, number>; state: Record<string, string>; rpm: Record<string, number> } {
    const res = {
      hasSource: this.els.some((e) => e.k === "vs" || e.k === "fg"),
      short: this.short,
      chatter: this.chatter,
      energized: { ...this.energized },
      level: {} as Record<string, number>,
      flow: {} as Record<string, number>,
      dir: {} as Record<string, number>,
      closed: {} as Record<string, boolean>,
      burnt: {} as Record<string, boolean>,
      motor: {} as Record<string, MotorState>,
      temp: {} as Record<string, number>,
      state: {} as Record<string, string>,
      rpm: {} as Record<string, number>,
    };
    for (const e of this.els) {
      const p = e.p;
      const id = p.id;
      if (e.k === "sw" || e.k === "co") res.closed[id] = this.closed(e);
      if (e.k === "vs") res.closed[id] = !this.srcOpen(e);
      if (e.k === "p3") res.closed[id] = p.type === "ol3" ? !this.heldEff()[p.label] : this.closed3(e);
      if (e.k === "m3") {
        const w = e.st.w ?? 0;
        res.motor[id] = e.st.fault ? { speed: 0, dir: 0, fault: "phase" } : { speed: (e.st.tgt ?? 0) > 0 ? w : 0, dir: w > 0.02 ? (e.st.dir ?? 1) : 0 };
        res.rpm[id] = (res.motor[id].speed ?? 0) * pn(p, "nn");
      }
      if (e.st.burnt) res.burnt[id] = true;
      const rd = this.partReading(id);
      if (rd?.state) res.state[id] = rd.state;
      if (rd?.T !== undefined) res.temp[id] = rd.T;
      if (rd?.rpm !== undefined) res.rpm[id] = rd.rpm;
      let lvl = 0;
      switch (p.type) {
        case "lamp":
        case "heater":
          lvl = e.P / pn(p, "Pn");
          break;
        case "led":
          lvl = e.Urms >= 0.7 * pn(p, "Un") ? e.P / pn(p, "Pn") : 0;
          break;
        case "fluo":
          lvl = e.st.lit ? Math.min(1.2, e.P / pn(p, "Pn")) : 0;
          break;
        case "led_d":
          lvl = Math.min(1.5, Math.max(0, e.Imean[0]) / pn(p, "Imax"));
          break;
        case "motor":
          lvl = e.st.w ?? 0;
          res.motor[id] = { speed: e.st.w ?? 0, dir: (e.st.w ?? 0) > 0.02 ? 1 : 0 };
          break;
        case "dcmotor": {
          const wn = this.dcmPar(e).wn;
          const w = (e.st.w ?? 0) / wn;
          lvl = Math.abs(w);
          res.motor[id] = { speed: Math.min(1.3, Math.abs(w)), dir: w > 0.02 ? 1 : w < -0.02 ? -1 : 0 };
          break;
        }
        case "coil":
        case "relay_ss":
        case "tcoil":
          lvl = e.Urms / pn(p, "U");
          break;
        default:
          lvl = 0;
      }
      if (e.st.burnt) lvl = 0;
      res.level[id] = lvl;
    }
    this.wires.forEach((w, i) => {
      const I = this.wRms[i];
      res.flow[w.id] = this.short && I > 100 ? 100 : I > 2e-4 ? 1 : 0;
      // DC: ortalama yön; AC: 0 (çizim tarafında ileri-geri salınan animasyon)
      res.dir[w.id] = Math.abs(this.wMean[i]) > 0.3 * I ? Math.sign(this.wMean[i]) : 0;
    });
    return res;
  }
}
