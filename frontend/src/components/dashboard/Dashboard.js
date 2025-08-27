import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import dndLogo from "../../assets/logo512.png"; // 👈 import logo

export default function Dashboard() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top panel */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <img src={dndLogo} alt="DnDHelper Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">DnDHelper</span>
        </div>

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

        {/* Auth buttons */}
        <div className="flex items-center space-x-2">
          {username ? (
            <>
              <Button variant="outline" className="text-gray-700">
                {username}
              </Button>
              <Button
                variant="destructive"
                className="px-4 text-white bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="text-gray-700">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
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
