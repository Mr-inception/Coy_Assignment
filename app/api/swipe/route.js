import { NextResponse } from "next/server";
import { recordSwipe } from "@/lib/store";

export const dynamic = "force-dynamic";

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

  // profile details are returned ONLY on a mutual match
  if (result.isMatch) {
    return NextResponse.json({ match: true, profile: result.profile });
  }
  return NextResponse.json({ match: false });
}