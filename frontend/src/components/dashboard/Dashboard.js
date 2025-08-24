// Dashboard.js
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Top panel */}
      <header className="top-panel">
        <div className="top-left">DnDHelper</div>
        {/* Menu buttons now in the top-panel */}
        <nav className="menu-buttons">
            <Link to="/dashboard/quick" className="menu-button">Quick Combat</Link>
            <Link to="/dashboard/encounter-creator" className="menu-button">New Encounter</Link>
            <Link to="/dashboard/encounters" className="menu-button">My Encounters</Link>
            <Link to="/dashboard/campaigns" className="menu-button">Campaigns</Link>
            <Link to="/dashboard/players" className="menu-button">Players</Link>
            <Link to="/dashboard/monsters" className="menu-button">Monsters</Link>
            <Link to="/dashboard/spells" className="menu-button">Spells</Link>
        </nav>
        <div className="top-right">
          <button className="top-button">User</button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        <main className="center-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}