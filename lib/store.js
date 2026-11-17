import fs from "fs";
import path from "path";
import { profiles } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "db.json");

// Profiles are static seed data. Only the user's swipes and matches are persisted.
function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return { swipes: raw.swipes ?? {}, matches: raw.matches ?? [] };
  } catch {
    return { swipes: {}, matches: [] };
  }
}

function save(state) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
}

// likesMe is stripped here, so it can never leave the server
const publicProfile = ({ likesMe, ...rest }) => rest;

export function getFeed() {
  const { swipes } = load();
  return profiles.filter((p) => !swipes[p.id]).map(publicProfile);
}

// Read, check, write: no awaits in between, so it is atomic within the Node process.
export function recordSwipe(profileId, action) {
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return { error: "Profile not found", status: 404 };

  const state = load();
  if (state.swipes[profileId]) {
    return { error: "Already swiped on this profile", status: 409 };
  }

  const now = new Date().toISOString();
  state.swipes[profileId] = { action, at: now };

  // a match needs BOTH sides: the user liked, and that profile had already liked the user
  const isMatch = action === "like" && profile.likesMe === 1;
  if (isMatch) state.matches.push({ profileId, at: now });

  save(state);
  return { isMatch, profile: publicProfile(profile) };
}

export function getMatches() {
  const { matches } = load();
  return [...matches].reverse().map((m) => ({
    ...publicProfile(profiles.find((p) => p.id === m.profileId)),
    matchedAt: m.at,
  }));
}