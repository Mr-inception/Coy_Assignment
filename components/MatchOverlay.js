"use client";

export default function MatchOverlay({ profile, onClose, onViewMatches }) {
  return (
    <div className="overlay">
      <h1>It&apos;s a match!</h1>
      <p>You and {profile.name} liked each other.</p>
      <img src={profile.photo} alt={profile.name} />
      <button className="btn" onClick={onClose}>Keep swiping</button>
      <button className="btn ghost" onClick={onViewMatches}>View matches</button>
    </div>
  );
}