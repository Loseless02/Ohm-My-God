// Admin modu: şifre sunucuda (Vercel env) kontrol edilir, tarayıcı sadece süreli bir jeton tutar.
// Jeton sekme kapanınca silinir (sessionStorage). Şifrenin kendisi hiçbir yerde saklanmaz.
import type { Circuit, Domain, Orient } from "../playground/file";

const KEY = "omg-admin";

/** Geçerli (süresi dolmamış) jeton varsa döndürür. */
export function adminToken(): string | null {
  try {
    const tok = sessionStorage.getItem(KEY);
    if (!tok) return null;
    const exp = Number(tok.split(".")[0]);
    if (!Number.isFinite(exp) || exp * 1000 < Date.now()) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return tok;
  } catch {
    return null;
  }
}

/** Arama kutusuna yazılan metni şifre olarak dene. Başarısızsa sessizce false. */
export async function adminLogin(password: string): Promise<boolean> {
  try {
    const r = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) return false;
    const { token } = (await r.json()) as { token?: string };
    if (!token) return false;
    sessionStorage.setItem(KEY, token);
    return true;
  } catch {
    return false;
  }
}

export async function savePresetAsAdmin(p: {
  domain: Domain;
  name: string;
  desc: string;
  orient: Orient;
  panes: Record<string, Circuit>;
}): Promise<"ok" | "expired" | "error"> {
  const token = adminToken();
  if (!token) return "expired";
  try {
    const r = await fetch("/api/admin-save", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(p),
    });
    if (r.status === 401) {
      sessionStorage.removeItem(KEY);
      return "expired";
    }
    return r.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
