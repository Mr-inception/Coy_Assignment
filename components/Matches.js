"use client";
import { useEffect, useState } from "react";

export default function Matches() {
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/matches", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMatches(d.matches))
      .catch(() => setError("Could not load matches."));
  }, []);

  if (error) return <div className="empty"><h2>Something went wrong</h2><p>{error}</p></div>;
  if (matches === null) return <div className="empty"><p>Loading…</p></div>;

  if (matches.length === 0) {
    return (
      <div className="empty">
        <h2>No matches yet</h2>
        <p>When you and someone else like each other, they&apos;ll show up here.</p>
      </div>
    );
  }

  return (
    <div className="matches">
      {matches.map((m) => (
        <div className="match-row" key={m.id}>
          <img src={m.photo} alt={m.name} />
          <div>
            <h3>{m.name}, {m.age}</h3>
            <p>📍 {m.city}</p>
            <p>{m.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}