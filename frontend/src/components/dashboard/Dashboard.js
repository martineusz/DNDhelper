import React from "react";
import { Outlet, Link } from "react-router-dom"; // import Link
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Top panel */}
      <header className="top-panel">
        <div className="top-left">DnDHelper</div>
        <div className="top-right">
          <button className="top-button">User</button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Left panel */}
        <nav className="left-panel">
          <div className="menu-buttons">
            <Link to="/dashboard/encounter-creator" className="menu-button">New Encounter</Link>
            <Link to="/dashboard/encounters" className="menu-button">My Encounters</Link>
            <Link to="/dashboard/quick" className="menu-button">Quick Encounter</Link>
            <Link to="/dashboard/campaigns" className="menu-button">Campaigns</Link>
            <Link to="/dashboard/players" className="menu-button">Players</Link>
            <Link to="/dashboard/monsters" className="menu-button">Monsters</Link>
            <Link to="/dashboard/spells" className="menu-button">Spells</Link>
          </div>
        </nav>

        <main className="center-panel">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
