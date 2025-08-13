// netlify/functions/turnstile-verify.js
export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch {}
  const { cf_token, email } = body || {};
  if (!cf_token) return json({ error: "Missing token" }, 400);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.log("TURNSTILE_SECRET_KEY missing in env");
    return json({ error: "Server not configured" }, 500);
  }

  // Verify with Cloudflare
  let data;
  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: cf_token }),
    });
    data = await resp.json();
  } catch (e) {
    console.log("Turnstile fetch error:", e.message);
    return json({ error: "Upstream verify error" }, 502);
  }

  // Log full result to Netlify logs
  console.log("Turnstile verify result:", JSON.stringify(data));

  if (!data.success) {
    return json(
      { ok: false, error: "Captcha failed", codes: data["error-codes"] || [] },
      400
    );
  }

  // Mark success and set cookie
  const maxAge = 30 * 24 * 60 * 60;
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `vm_auth=yes; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`,
    },
    body: JSON.stringify({ ok: true }),
  };
};

function json(obj, status = 200) {
  return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}
