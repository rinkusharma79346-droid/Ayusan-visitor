import "server-only";

const DEFAULT_PUBLIC_ORIGIN = "https://ayusan-libraryx.ai.studio";
const KNOWN_DEPLOYMENT_ORIGINS = [
  "https://ayusan-libraryx.ai.studio",
  "https://ais-pre-2c7yo3g7iw3v4yo22yahph-60839985421.asia-southeast1.run.app",
  "https://ais-dev-2c7yo3g7iw3v4yo22yahph-60839985421.asia-southeast1.run.app",
  "https://ais-pre-s7wvbny6o5su3zjeui53zv-60839985421.asia-southeast1.run.app",
];

function getEnvCaseInsensitive(...names: string[]): string | undefined {
  for (const name of names) {
    const direct = process.env[name];
    if (direct) return direct;
  }
  const upperNames = new Set(names.map((n) => n.toUpperCase()));
  for (const [key, value] of Object.entries(process.env)) {
    if (value && upperNames.has(key.toUpperCase())) {
      return value;
    }
  }
  return undefined;
}

function normalizeHostname(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname.toLowerCase();
    }
    return new URL(`https://${trimmed}`).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function addHostWithCounterparts(hosts: Set<string>, raw?: string | null) {
  const host = normalizeHostname(raw);
  if (!host) return;
  hosts.add(host);
  if (host.startsWith("ais-dev-")) {
    hosts.add("ais-pre-" + host.slice("ais-dev-".length));
  } else if (host.startsWith("ais-pre-")) {
    hosts.add("ais-dev-" + host.slice("ais-pre-".length));
  }
}

function buildExpectedHostnames(origin: string, requestHost?: string): Set<string> {
  const hosts = new Set<string>();
  const explicit = (process.env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  for (const item of explicit) {
    addHostWithCounterparts(hosts, item);
  }
  const candidateOrigins = [
    origin,
    requestHost,
    process.env.AYUSAN_PUBLIC_ORIGIN,
    process.env.AYUSAN_SITE_ORIGIN,
    process.env.APP_URL,
    ...KNOWN_DEPLOYMENT_ORIGINS,
  ];
  for (const candidate of candidateOrigins) {
    addHostWithCounterparts(hosts, candidate);
  }
  return hosts;
}

/** Validate Turnstile on the Site server and sign the exact payload for Supabase. */
export async function signVerifiedRegistration(
  payload: Record<string, unknown>,
  token: string,
  requestHost?: string,
) {
  const secret = getEnvCaseInsensitive(
    "TURNSTILE_SECRET_KEY",
    "TURNSTILE_SECRET_key",
    "TURNSTILE_SECRET",
  );
  const signingKey = getEnvCaseInsensitive("AYUSAN_REGISTRATION_SIGNING_KEY");
  const origin =
    process.env.AYUSAN_PUBLIC_ORIGIN ||
    process.env.AYUSAN_SITE_ORIGIN ||
    process.env.APP_URL ||
    DEFAULT_PUBLIC_ORIGIN;
  if (!secret || !origin) throw new Error("Registration verification is not configured.");
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    throw new Error("Please complete security verification.");
  }
  const expectedHostnames = buildExpectedHostnames(origin, requestHost);
  if (expectedHostnames.size === 0) {
    throw new Error("Registration verification is not configured.");
  }
  const form = new URLSearchParams({ secret, response: token });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Security verification is temporarily unavailable.");
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
    "error-codes"?: string[];
  };
  if (!result.success) {
    const codes = Array.isArray(result["error-codes"]) && result["error-codes"].length > 0
      ? ` (${result["error-codes"].join(", ")})`
      : "";
    throw new Error(`Security verification failed${codes}. Please try again.`);
  }
  const verifiedHost = normalizeHostname(result.hostname);
  const isAllowedHost =
    Boolean(verifiedHost) &&
    (expectedHostnames.has(verifiedHost!) ||
      verifiedHost!.endsWith(".run.app") ||
      verifiedHost!.endsWith(".ai.studio") ||
      verifiedHost!.endsWith(".usercontent.goog") ||
      verifiedHost!.endsWith(".googleusercontent.com"));
  const isAllowedAction = !result.action || result.action === "register";
  if (!isAllowedHost || !isAllowedAction) {
    throw new Error("Security verification failed. Please try again.");
  }
  const signed = { ...payload, site_verified_at: Date.now() };
  if (!signingKey) {
    return { ...signed, captcha_token: token };
  }
  const key = await crypto.subtle.importKey("jwk", JSON.parse(signingKey), {name:"ECDSA",namedCurve:"P-256"}, false, ["sign"]);
  const signature = await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"}, key, new TextEncoder().encode(JSON.stringify(signed)));
  const encoded = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return { ...signed, site_signature: encoded };
}
