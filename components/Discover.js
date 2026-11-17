"use client";
import { useEffect, useRef, useState } from "react";
import SwipeCard, { CardFace } from "./SwipeCard";
import MatchOverlay from "./MatchOverlay";

export default function Discover({ onViewMatches }) {
  const [queue, setQueue] = useState(null);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    fetch("/api/feed", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setQueue(d.profiles))
      .catch(() => setError("Could not load profiles."));
  }, []);

  // desktop: arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (match) return;
      if (e.key === "ArrowRight") cardRef.current?.swipe(1);
      if (e.key === "ArrowLeft") cardRef.current?.swipe(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [match]);

  const handleSwiped = async (profile, action) => {
    setQueue((q) => q.filter((p) => p.id !== profile.id));
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, action }),
      });
      const data = await res.json();
      if (data.match) setMatch(data.profile);
    } catch {
      setError("Could not save your swipe.");
    }
  };

  if (error) return <div className="empty"><h2>Something went wrong</h2><p>{error}</p></div>;
  if (queue === null) return <div className="empty"><p>Loading…</p></div>;

  const top = queue[0];
  const next = queue[1];

  return (
    <div className="discover">
      {top ? (
        <>
          <div className="stack">
            {next && (
              <div key={next.id} className="card" style={{ transform: "scale(0.95) translateY(10px)", cursor: "default" }}>
                <CardFace profile={next} />
              </div>
            )}
            <SwipeCard key={top.id} ref={cardRef} profile={top} onSwiped={handleSwiped} />
          </div>
          <div className="actions">
            <button className="round pass" aria-label="Pass" onClick={() => cardRef.current?.swipe(-1)}>✕</button>
            <button className="round like" aria-label="Like" onClick={() => cardRef.current?.swipe(1)}>♥</button>
          </div>
        </>
      ) : (
        <div className="empty">
          <h2>You&apos;re all caught up</h2>
          <p>No more profiles for now. Check back later.</p>
        </div>
      )}
      {match && (
        <MatchOverlay
          profile={match}
          onClose={() => setMatch(null)}
          onViewMatches={() => { setMatch(null); onViewMatches?.(); }}
        />
      )}
    </div>
  );
}