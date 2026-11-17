import { NextResponse } from "next/server";
import { getMatches } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ matches: getMatches() });
}