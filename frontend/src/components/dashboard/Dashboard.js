import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import dndLogo from "../../assets/logo512.png"; // Logo

// 👇 Import icons directly from assets
import swordsIcon from "../../assets/swords.svg";
import plusIcon from "../../assets/plus.svg";
import dungeonIcon from "../../assets/dungeon.svg";
import crusaderIcon from "../../assets/crusader.svg";
import dragonIcon from "../../assets/dragon2.svg";
import bookIcon from "../../assets/book.svg";

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
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img src={dndLogo} alt="DnDHelper Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-gray-800">DnDHelper</span>
        </div>

        <nav className="flex space-x-2">
          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/quick">
              <img src={swordsIcon} alt="" className="h-6 w-6" />
              <span>Quick Combat</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/encounter-creator">
              <img src={plusIcon} alt="" className="h-6 w-6" />
              <span>New Encounter</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/encounters">
              <img src={dungeonIcon} alt="" className="h-8 w-8" />
              <span>My Encounters</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/players">
              <img src={crusaderIcon} alt="" className="h-8 w-8" />
              <span>Player Characters</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/monsters">
              <img src={dragonIcon} alt="" className="h-6 w-6" />
              <span>Monsters</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-200"
          >
            <Link to="/dashboard/spells">
              <img src={bookIcon} alt="" className="h-6 w-6" />
              <span>Spells</span>
            </Link>
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
                className="px-4 text-white bg-green-700 hover:bg-green-600"
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
