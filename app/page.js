"use client";
import { useState } from "react";
import DiscoverTab from "@/components/DiscoverTab";

export default function Page() {
  const [tab, setTab] = useState("discover");

  return (
    <div className="app">
      <div className="content">
        {tab === "home" ? <div className="home" /> : <DiscoverTab />}
      </div>
      <nav className="tabbar">
        <button
          className={`tab ${tab === "home" ? "active" : ""}`}
          onClick={() => setTab("home")}
        >
          Home
        </button>
        <button
          className={`tab ${tab === "discover" ? "active" : ""}`}
          onClick={() => setTab("discover")}
        >
          Discover
        </button>
      </nav>
    </div>
  );
}