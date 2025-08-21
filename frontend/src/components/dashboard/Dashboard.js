// Dashboard.js (refactored as layout)
import React from "react";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Top panel */}
      <header className="top-panel">
        <div className="top-left">DnDHelper</div>
        <div className="top-right">
          <button className="top-button">User</button>
          <button className="top-button">Settings</button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Left panel */}
        <nav className="left-panel">
          <div className="menu-buttons">
            <a href="/dashboard/encounters" className="menu-button">Encounters</a>
            <a href="/dashboard/quick" className="menu-button">Quick Encounter</a>
            <a href="/dashboard/campaigns" className="menu-button">Campaigns</a>
            <a href="/dashboard/players" className="menu-button">Players</a>
            <a href="/dashboard/monsters" className="menu-button">Monsters</a>
            <a href="/dashboard/spells" className="menu-button">Spells</a>
          </div>
        </nav>

        <main className="center-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
