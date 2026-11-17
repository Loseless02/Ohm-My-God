import { issueToken, json, passwordOk, sleep } from "./_lib/admin.js";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "bad request" });
  }
  if (!passwordOk(body?.password)) {
    await sleep(800); // deneme-yanılmayı yavaşlat
    return json(401, { error: "nope" });
  }
  return json(200, { token: issueToken() });
}
