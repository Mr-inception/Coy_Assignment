import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const getProfile = db.prepare(
  "SELECT id, name, age, photo, bio, city, interests, likes_me FROM profiles WHERE id = ?"
);
const getSwipe = db.prepare("SELECT 1 FROM swipes WHERE profile_id = ?");
const insertSwipe = db.prepare("INSERT INTO swipes (profile_id, action) VALUES (?, ?)");
const insertMatch = db.prepare("INSERT INTO matches (profile_id) VALUES (?)");

// the whole swipe + match check runs atomically
const recordSwipe = db.transaction((profileId, action) => {
  const profile = getProfile.get(profileId);
  if (!profile) return { error: "Profile not found", status: 404 };
  if (getSwipe.get(profileId)) return { error: "Already swiped on this profile", status: 409 };

  insertSwipe.run(profileId, action);

  // match only if the user liked AND that profile had already liked the user
  const isMatch = action === "like" && profile.likes_me === 1;
  if (isMatch) insertMatch.run(profileId);

  return { isMatch, profile };
});

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const profileId = Number(body?.profileId);
  const action = body?.action;

  if (!Number.isInteger(profileId) || !["like", "pass"].includes(action)) {
    return NextResponse.json(
      { error: "profileId (integer) and action ('like' | 'pass') are required" },
      { status: 400 }
    );
  }

  const result = recordSwipe(profileId, action);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // profile details are returned ONLY when it's a mutual match
  if (result.isMatch) {
    const { likes_me, ...p } = result.profile;
    return NextResponse.json({
      match: true,
      profile: { ...p, interests: JSON.parse(p.interests) },
    });
  }

  return NextResponse.json({ match: false });
}