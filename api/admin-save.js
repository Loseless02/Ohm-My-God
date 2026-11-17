// Admin: Playground'daki devreyi "hazır devre" olarak repoya commit'ler.
// Vercel yeni commit'i görünce siteyi yeniden build eder (~1 dk) ve örnek herkese görünür.
import { json, tokenOk } from "./_lib/admin.js";

const PATH = "src/playground/custom-presets.json";
const MAX_BODY = 400_000;
const DOMAINS = { phys: ["main"], logic: ["main"], power: ["steuer", "last"] };
const ID = /^[\w-]{1,64}$/;
const TID = /^[\w-]{1,64}:\d{1,2}$/;
const KEEP_STR = { label: 24, group: 24, type: 24 };
const KEEP_ENUM = {
  tmode: ["ein", "aus", "impuls", "blink", "treppe"],
  color: ["red", "green", "yellow", "blue", "white"],
  conn: ["6", "Y", "D"],
};

// İstemci yüklerken de ayrıca doğruluyor; burada sadece bilinen alanları bırakıp boyutu sınırlıyoruz.
function cleanCircuit(c) {
  const parts = [];
  for (const p of Array.isArray(c?.parts) ? c.parts.slice(0, 1500) : []) {
    if (!p || typeof p.id !== "string" || !ID.test(p.id)) continue;
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    const q = { id: p.id, x: Math.round(p.x), y: Math.round(p.y) };
    for (const [k, n] of Object.entries(KEEP_STR)) if (typeof p[k] === "string") q[k] = p[k].slice(0, n);
    if (!q.type) continue;
    q.label ??= "";
    for (const k of ["volts", "delay", "rot"]) if (Number.isFinite(p[k])) q[k] = p[k];
    if (typeof p.enabled === "boolean") q.enabled = p.enabled;
    for (const [k, vals] of Object.entries(KEEP_ENUM)) if (vals.includes(p[k])) q[k] = p[k];
    parts.push(q);
  }
  const wires = [];
  for (const w of Array.isArray(c?.wires) ? c.wires.slice(0, 6000) : []) {
    if (w && ID.test(w.id ?? "") && TID.test(w.a ?? "") && TID.test(w.b ?? "")) wires.push({ id: w.id, a: w.a, b: w.b });
  }
  return { parts, wires };
}

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "devre";

async function gh(path, init = {}) {
  const repo = process.env.GITHUB_REPO;
  return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "ohm-my-god-admin",
      ...(init.headers ?? {}),
    },
  });
}

export async function POST(request) {
  if (!tokenOk(request.headers.get("authorization"))) return json(401, { error: "unauthorized" });
  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!GITHUB_TOKEN || !GITHUB_REPO) return json(500, { error: "server not configured" });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: "too large" });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "bad json" });
  }
  const domain = body?.domain;
  if (!DOMAINS[domain]) return json(400, { error: "bad domain" });
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!name) return json(400, { error: "name required" });
  const panes = {};
  for (const k of DOMAINS[domain]) panes[k] = cleanCircuit(body.panes?.[k]);
  const entry = {
    id: `${slug(name)}-${Date.now().toString(36)}`,
    name,
    desc: typeof body.desc === "string" ? body.desc.trim().slice(0, 400) : "",
    orient: body.orient === "h" ? "h" : "v",
    panes,
  };

  // aynı anda iki kayıt gelirse sha çakışır (409) → bir kez daha dene
  for (let attempt = 0; attempt < 2; attempt++) {
    const cur = await gh(`${PATH}?ref=${encodeURIComponent(branch)}`);
    if (!cur.ok) return json(502, { error: `github read ${cur.status}` });
    const file = await cur.json();
    let data;
    try {
      data = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
    } catch {
      data = {};
    }
    for (const d of Object.keys(DOMAINS)) if (!Array.isArray(data[d])) data[d] = [];
    data[domain].push(entry);
    const put = await gh(PATH, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: `Add example circuit: ${name}`,
        content: Buffer.from(JSON.stringify(data, null, 2) + "\n").toString("base64"),
        sha: file.sha,
        branch,
      }),
    });
    if (put.ok) return json(200, { ok: true, id: entry.id });
    if (put.status !== 409) return json(502, { error: `github write ${put.status}` });
  }
  return json(409, { error: "conflict, try again" });
}
