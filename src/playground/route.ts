// ── Otomatik kablo yönlendirme (A*) ─────────────────────────────────────────
// Grid bir kez kurulur (parça gövdeleri engel, tüm terminal hücreleri serbest),
// her kablo bu grid üzerinde dik açılı yol arar. Dönüşler cezalıdır ki yol
// mümkün olduğunca düz gitsin. Yol bulunamazsa klasik dirsek çizilir.

import { GRID } from "./types";
import type { Box } from "./types";

export interface Pt {
  x: number;
  y: number;
}

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const TURN_COST = 0.7;
const MAX_CELLS = 260; // tek eksende en fazla hücre (sonsuz tuvalde sınırla)

export interface RouteGrid {
  blocked: Uint8Array;
  gx0: number; // grid'in dünya koordinatındaki başlangıcı (hücre cinsinden)
  gy0: number;
  gw: number; // hücre sayısı
  gh: number;
}

export function buildGrid(obstacles: Box[], frees: Pt[]): RouteGrid {
  // sınırlar: tüm serbest noktalar (terminaller) + kenar payı
  let minX = 0;
  let minY = 0;
  let maxX = 960;
  let maxY = 600;
  for (const p of frees) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const pad = 8 * GRID;
  const gx0 = Math.floor((minX - pad) / GRID);
  const gy0 = Math.floor((minY - pad) / GRID);
  const gw = Math.min(MAX_CELLS, Math.ceil((maxX + pad) / GRID) - gx0);
  const gh = Math.min(MAX_CELLS, Math.ceil((maxY + pad) / GRID) - gy0);
  const blocked = new Uint8Array((gw + 1) * (gh + 1));
  const idx = (x: number, y: number) => y * (gw + 1) + x;
  for (const r of obstacles) {
    const x1 = Math.max(0, Math.ceil(r.x1 / GRID) - gx0);
    const x2 = Math.min(gw, Math.floor(r.x2 / GRID) - gx0);
    const y1 = Math.max(0, Math.ceil(r.y1 / GRID) - gy0);
    const y2 = Math.min(gh, Math.floor(r.y2 / GRID) - gy0);
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) blocked[idx(x, y)] = 1;
  }
  // terminal hücreleri her zaman geçilebilir
  for (const p of frees) {
    const x = Math.round(p.x / GRID) - gx0;
    const y = Math.round(p.y / GRID) - gy0;
    if (x >= 0 && x <= gw && y >= 0 && y <= gh) blocked[idx(x, y)] = 0;
  }
  return { blocked, gx0, gy0, gw, gh };
}

function fallback(a: Pt, b: Pt): Pt[] {
  const my = Math.round((a.y + b.y) / 2 / GRID) * GRID;
  return [a, { x: a.x, y: my }, { x: b.x, y: my }, b];
}

export function routeWire(a: Pt, b: Pt, g: RouteGrid): Pt[] {
  const { blocked, gx0, gy0, gw, gh } = g;
  const nIdx = (x: number, y: number) => y * (gw + 1) + x;
  const ax = Math.round(a.x / GRID) - gx0;
  const ay = Math.round(a.y / GRID) - gy0;
  const bx = Math.round(b.x / GRID) - gx0;
  const by = Math.round(b.y / GRID) - gy0;
  const inb = (x: number, y: number) => x >= 0 && x <= gw && y >= 0 && y <= gh;
  if (!inb(ax, ay) || !inb(bx, by)) return fallback(a, b);

  // durum: (düğüm, geliş yönü). yön 4 = başlangıç.
  const S = (gw + 1) * (gh + 1) * 5;
  const dist = new Float64Array(S).fill(Infinity);
  const prev = new Int32Array(S).fill(-1);
  const sKey = (x: number, y: number, d: number) => nIdx(x, y) * 5 + d;

  const heapK: number[] = [];
  const heapC: number[] = [];
  const push = (k: number, c: number) => {
    heapK.push(k);
    heapC.push(c);
    let i = heapK.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heapC[p] <= heapC[i]) break;
      [heapC[p], heapC[i]] = [heapC[i], heapC[p]];
      [heapK[p], heapK[i]] = [heapK[i], heapK[p]];
      i = p;
    }
  };
  const pop = (): number => {
    const k = heapK[0];
    const lk = heapK.pop()!;
    const lc = heapC.pop()!;
    if (heapK.length) {
      heapK[0] = lk;
      heapC[0] = lc;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        if (l < heapK.length && heapC[l] < heapC[m]) m = l;
        if (r < heapK.length && heapC[r] < heapC[m]) m = r;
        if (m === i) break;
        [heapC[m], heapC[i]] = [heapC[i], heapC[m]];
        [heapK[m], heapK[i]] = [heapK[i], heapK[m]];
        i = m;
      }
    }
    return k;
  };

  const h = (x: number, y: number) => Math.abs(x - bx) + Math.abs(y - by);
  const start = sKey(ax, ay, 4);
  dist[start] = 0;
  push(start, h(ax, ay));

  let goal = -1;
  while (heapK.length) {
    const k = pop();
    const d = k % 5;
    const n = (k - d) / 5;
    const x = n % (gw + 1);
    const y = (n - x) / (gw + 1);
    if (x === bx && y === by) {
      goal = k;
      break;
    }
    for (let nd = 0; nd < 4; nd++) {
      const nx = x + DIRS[nd][0];
      const ny = y + DIRS[nd][1];
      if (!inb(nx, ny)) continue;
      if (blocked[nIdx(nx, ny)] && !(nx === bx && ny === by) && !(nx === ax && ny === ay)) continue;
      const cost = dist[k] + 1 + (d !== 4 && d !== nd ? TURN_COST : 0);
      const nk = sKey(nx, ny, nd);
      if (cost < dist[nk]) {
        dist[nk] = cost;
        prev[nk] = k;
        push(nk, cost + h(nx, ny));
      }
    }
  }
  if (goal < 0) return fallback(a, b);

  const raw: Pt[] = [];
  for (let k = goal; k >= 0; k = prev[k]) {
    const n = (k - (k % 5)) / 5;
    const x = n % (gw + 1);
    const y = (n - x) / (gw + 1);
    raw.push({ x: (x + gx0) * GRID, y: (y + gy0) * GRID });
    if (k === start) break;
  }
  raw.reverse();

  const out: Pt[] = [raw[0]];
  for (let i = 1; i < raw.length - 1; i++) {
    const p = out[out.length - 1];
    const c = raw[i];
    const n = raw[i + 1];
    const col = (p.x === c.x && c.x === n.x) || (p.y === c.y && c.y === n.y);
    if (!col) out.push(c);
  }
  out.push(raw[raw.length - 1]);
  out[0] = a;
  out[out.length - 1] = b;
  return out;
}
