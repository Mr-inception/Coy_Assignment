import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { profiles } from "./seed";

function init() {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });

  const db = new Database(path.join(dir, "coy.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      city TEXT NOT NULL,
      interests TEXT NOT NULL,
      likes_me INTEGER NOT NULL DEFAULT 0
    );

    -- one swipe per profile: the PRIMARY KEY guarantees no profile is swiped twice
    CREATE TABLE IF NOT EXISTS swipes (
      profile_id INTEGER PRIMARY KEY REFERENCES profiles(id),
      action TEXT NOT NULL CHECK (action IN ('like', 'pass')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS matches (
      profile_id INTEGER PRIMARY KEY REFERENCES profiles(id),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const { c } = db.prepare("SELECT COUNT(*) AS c FROM profiles").get();
  if (c === 0) {
    const insert = db.prepare(
      `INSERT INTO profiles (id, name, age, photo, bio, city, interests, likes_me)
       VALUES (@id, @name, @age, @photo, @bio, @city, @interests, @likesMe)`
    );
    const seedAll = db.transaction((rows) => {
      for (const p of rows) insert.run({ ...p, interests: JSON.stringify(p.interests) });
    });
    seedAll(profiles);
  }

  return db;
}

// reuse one connection across hot reloads in dev
export const db = globalThis.__coyDb ?? (globalThis.__coyDb = init());