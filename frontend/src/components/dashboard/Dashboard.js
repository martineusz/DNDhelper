import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top panel */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="text-xl font-bold text-gray-800">DnDHelper</div>
        {/* Menu buttons */}
        <nav className="flex space-x-2">
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/quick">Quick Combat</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/encounter-creator">New Encounter</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/encounters">My Encounters</Link>
            </Button>
            {/* <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/campaigns">Campaigns</Link>
            </Button> */}
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/players">Players</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/monsters">Monsters</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:bg-gray-200">
                <Link to="/dashboard/spells">Spells</Link>
            </Button>
        </nav>
        <div className="flex items-center">
          <Button variant="outline" className="text-gray-700">User</Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <main className="mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}