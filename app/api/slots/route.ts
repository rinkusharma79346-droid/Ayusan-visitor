import { NextResponse } from "next/server";
import { callPublicEdgeFunction } from "@/lib/ayusan-edge";

export const dynamic = "force-dynamic";
export async function GET() {
  const result = await callPublicEdgeFunction("public-slots", "GET");
  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
