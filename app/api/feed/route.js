import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  // likes_me is deliberately NOT selected: the client can never see who liked them
  const rows = db
    .prepare(
      `SELECT id, name, age, photo, bio, city, interests
       FROM profiles p
       WHERE NOT EXISTS (SELECT 1 FROM swipes s WHERE s.profile_id = p.id)
       ORDER BY id`
    )
    .all();

  return NextResponse.json({
    profiles: rows.map((r) => ({ ...r, interests: JSON.parse(r.interests) })),
  });
}