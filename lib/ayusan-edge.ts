import "server-only";

const DEFAULT_SUPABASE_URL = "https://bbdvmgjwywhtlgckljwo.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_e7k2pFRqsClvzOKbsrljow_A_CEuumw";
const DEFAULT_PUBLIC_ORIGIN = "https://ayusan-libraryx.ai.studio";
const LEGACY_ALLOWED_ORIGIN = "https://ayusan-library-visitor.airtribe-gen-2650.chatgpt.site";

/** Public web forms are proxied server-to-server; no elevated key is used here. */
export async function callPublicEdgeFunction(
  name: "public-slots" | "submit-registration",
  method: "GET" | "POST",
  payload?: unknown,
) {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SUPABASE_KEY;
  const origin =
    process.env.AYUSAN_PUBLIC_ORIGIN ||
    process.env.AYUSAN_SITE_ORIGIN ||
    process.env.APP_URL ||
    DEFAULT_PUBLIC_ORIGIN;

  if (!url || !key || !origin) {
    return { ok: false, status: 503, body: { error: "Registration is temporarily unavailable. Please contact the library." } };
  }

  const sendRequest = async (requestOrigin: string) => {
    const res = await fetch(`${url.replace(/\/$/, "")}/functions/v1/${name}`, {
      method,
      cache: "no-store",
      headers: {
        "apikey": key,
        "Origin": requestOrigin,
        ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
      },
      ...(method === "POST" ? { body: JSON.stringify(payload) } : {}),
      signal: AbortSignal.timeout(12_000),
    });
    let json: Record<string, unknown>;
    try { json = await res.json(); }
    catch { json = { error: "The reservation service is currently unavailable." }; }
    return { ok: res.ok, status: res.status, body: json };
  };

  try {
    const primary = await sendRequest(origin);
    if (primary.status === 403 && origin !== LEGACY_ALLOWED_ORIGIN) {
      return await sendRequest(LEGACY_ALLOWED_ORIGIN);
    }
    return primary;
  } catch {
    return { ok: false, status: 503, body: { error: "The registration service is unavailable. Please try again later." } };
  }
}
