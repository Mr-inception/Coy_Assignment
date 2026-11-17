"use client";
import { useState } from "react";
import Discover from "./Discover";
import Matches from "./Matches";

export default function DiscoverTab() {
  const [view, setView] = useState("swipe");

  return (
    <div className="discover-tab">
      <div className="subnav">
        <button className={`pill ${view === "swipe" ? "active" : ""}`} onClick={() => setView("swipe")}>Swipe</button>
        <button className={`pill ${view === "matches" ? "active" : ""}`} onClick={() => setView("matches")}>Matches</button>
      </div>
      <div className="subcontent">
        {view === "swipe" ? <Discover onViewMatches={() => setView("matches")} /> : <Matches />}
      </div>
    </div>
  );
}