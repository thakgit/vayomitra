// netlify/functions/turnstile-verify.js

// Change this if you prefer an env var:
//   In Netlify env, set EMAIL_WORKER_URL to your Worker capture endpoint.
//   Or leave as fallback below.
const WORKER_URL =
  process.env.EMAIL_WORKER_URL ||
  "https://vayomitraemail.thakkar-jayesh.workers.dev/capture";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Parse body
  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { cf_token, email } = body || {};
  if (!cf_token) return json({ error: "Missing token" }, 400);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.log("TURNSTILE_SECRET_KEY missing in env");
    return json({ error: "Server not configured" }, 500);
  }

  // 1) Verify with Cloudflare Turnstile
  let data;
  try {
    const resp = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: cf_token }),
      }
    );
    data = await resp.json();
  } catch (e) {
    console.log("Turnstile fetch error:", e.message);
    return json({ error: "Upstream verify error" }, 502);
  }

  console.log("Turnstile verify result:", JSON.stringify(data));

  if (!data?.success) {
    return json(
      { ok: false, error: "Captcha failed", codes: data?.["error-codes"] || [] },
      400
    );
  }

  // 2) Best-effort: push email to your Worker (NO secret)
  //    This does not block success if it fails.
  try {
    if (email && WORKER_URL) {
      await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(email).trim().toLowerCase(),
          ref: event.headers?.referer || "",
          ua: event.headers?.["user-agent"] || "",
          ip: event.headers?.["x-forwarded-for"] || "",
        }),
      });
    }
  } catch (e) {
    console.log("Email push to Worker failed:", e.message);
  }

  // 3) Mark success and set cookie
  const maxAge = 30 * 24 * 60 * 60; // 30 days
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      // If you don’t need a cookie, you can remove the next line.
      "Set-Cookie": `vm_auth=yes; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`,
    },
    body: JSON.stringify({ ok: true }),
  };
};

// small helper
function json(obj, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}
