import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callPublicEdgeFunction } from "@/lib/ayusan-edge";

import { signVerifiedRegistration } from "@/lib/registration-verification";

export const runtime = "nodejs";

const submission = z.object({
  name: z.string().max(80).optional().nullable(),
  phone: z.string().max(24).optional().nullable(),
  date_of_birth: z.string().max(10).optional().nullable(),
  slot_id: z.string().uuid(),
  extras: z.string().max(500).optional().nullable(),
  whatsapp_opt_in: z.boolean().default(false),
  call_opt_in: z.boolean().default(false),
  captcha_token: z.string().min(1).max(2048).optional(),
  "cf-turnstile-response": z.string().min(1).max(2048).optional(),
  client_submission_id: z.string().uuid(),
}).strict();

export async function POST(req: NextRequest) {
  const length = Number(req.headers.get("content-length") || "0");
  if (length > 12000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let raw: string;
  try { raw = await req.text(); }
  catch { return NextResponse.json({ error: "Cannot read request." }, { status: 400 }); }
  if (raw.length > 12000) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "Invalid form data." }, { status: 400 }); }
  const parsed = submission.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the form." }, { status: 400 });

  const data = parsed.data;
  const token = data["cf-turnstile-response"] || data.captcha_token || "";
  const requestHost =
    req.headers.get("origin") ||
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    undefined;
  let payload: Record<string, unknown>;
  try { payload = await signVerifiedRegistration({
    full_name: data.name?.trim() || null,
    phone: data.phone?.trim() || null,
    date_of_birth: data.date_of_birth || null,
    slot_id: data.slot_id,
    extras: data.extras?.trim() || null,
    whatsapp_opt_in: data.whatsapp_opt_in && Boolean(data.phone?.trim()),
    call_opt_in: data.call_opt_in && Boolean(data.phone?.trim()),
    client_submission_id: data.client_submission_id,
  }, token, requestHost);
  } catch (error) {
    const message=error instanceof Error?error.message:"Security verification is unavailable.";
    return NextResponse.json({error:message},{status:message.includes("not configured")?503:403});
  }
  const result = await callPublicEdgeFunction("submit-registration", "POST", payload);
  if (
    !result.ok &&
    result.status === 403 &&
    !payload.site_signature
  ) {
    const fallbackRef = `AYU-${data.client_submission_id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
    return NextResponse.json(
      { reference_code: fallbackRef, status: "pending" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
