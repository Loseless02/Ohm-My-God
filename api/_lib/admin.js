// Ortak admin yardımcıları (alt çizgiyle başlayan klasör Vercel'de endpoint olmaz).
// Gerekli ortam değişkenleri (Vercel → Settings → Environment Variables):
//   ADMIN_PASSWORD  en az 12 karakter, uzun ve tahmin edilemez olsun
//   GITHUB_TOKEN    fine-grained token: sadece bu repo, "Contents: Read and write"
//   GITHUB_REPO     sahip/repo   (ör. kullanici/Ohm-My-God)
//   GITHUB_BRANCH   deploy edilen dal
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const TTL_S = 12 * 60 * 60; // jeton 12 saat geçerli

const sha = (s) => createHash("sha256").update(String(s)).digest();

export function passwordOk(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || real.length < 12 || typeof input !== "string") return false;
  return timingSafeEqual(sha(input), sha(real)); // sabit süreli karşılaştırma
}

const sign = (exp) =>
  createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(`omg-admin:${exp}`).digest("base64url");

export function issueToken() {
  const exp = Math.floor(Date.now() / 1000) + TTL_S;
  return `${exp}.${sign(exp)}`;
}

export function tokenOk(header) {
  if (!process.env.ADMIN_PASSWORD || typeof header !== "string") return false;
  const m = /^Bearer (\d{10})\.([\w-]{43})$/.exec(header);
  if (!m) return false;
  const exp = Number(m[1]);
  if (exp * 1000 < Date.now()) return false;
  const a = Buffer.from(m[2]);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}

export const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
