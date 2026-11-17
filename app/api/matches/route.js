import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = db
    .prepare(
      `SELECT p.id, p.name, p.age, p.photo, p.bio, p.city, p.interests, m.created_at AS matchedAt
       FROM matches m
       JOIN profiles p ON p.id = m.profile_id
       ORDER BY m.created_at DESC, p.id DESC`
    )
    .all();

  return NextResponse.json({
    matches: rows.map((r) => ({ ...r, interests: JSON.parse(r.interests) })),
  });
}