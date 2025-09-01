import React from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {Button} from "../ui/button";
import {useDarkMode} from "../../context/DarkModeContext";

import dndLogo from "../../assets/logo512.png";
import swordsIcon from "../../assets/swords.svg";
import plusIcon from "../../assets/plus.svg";
import dungeonIcon from "../../assets/dungeon.svg";
import crusaderIcon from "../../assets/crusader.svg";
import dragonIcon from "../../assets/dragon2.svg";
import bookIcon from "../../assets/book.svg";
import darkModeIcon from "../../assets/dark-mode.svg"; // 👈 import your custom SVG

export default function Dashboard() {
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const {darkMode, setDarkMode} = useDarkMode(); // Dark mode hook

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    // Icon class adjusts for dark mode
    const iconClass = (size = "h-6 w-6") =>
        darkMode ? `${size} filter brightness-0 invert` : size;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* HEADER */}
            <header className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <img src={dndLogo} alt="DnDHelper Logo" className="h-8 w-8"/>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            DnDHelper
          </span>
                </div>

                {/* NAVIGATION */}
                <nav className="flex space-x-2">
                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/quick">
                            <img src={swordsIcon} alt="" className={iconClass()}/>
                            <span>Quick Combat</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/encounter-creator">
                            <img src={plusIcon} alt="" className={iconClass()}/>
                            <span>New Encounter</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/encounters">
                            <img src={dungeonIcon} alt="" className={iconClass("h-8 w-8")}/>
                            <span>My Encounters</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/players">
                            <img src={crusaderIcon} alt="" className={iconClass("h-8 w-8")}/>
                            <span>Player Characters</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/monsters">
                            <img src={dragonIcon} alt="" className={iconClass()}/>
                            <span>Monsters</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Link to="/dashboard/spells">
                            <img src={bookIcon} alt="" className={iconClass()}/>
                            <span>Spells</span>
                        </Link>
                    </Button>
                </nav>

                {/* PROFILE + TOGGLE + AUTH */}
                <div className="flex items-center space-x-2">
                    {username ? (
                        <>
                            <Button variant="outline" className="text-gray-700 dark:text-gray-200">
                                {username}
                            </Button>

                            {/* Dark Mode Toggle using custom SVG */}
                            <Button
                                variant="ghost"
                                onClick={() => setDarkMode(!darkMode)}
                                className="px-3"
                            >
                                <img
                                    src={darkModeIcon}
                                    alt="Toggle Dark Mode"
                                    className={`h-6 w-6 ${darkMode ? "filter brightness-0 invert" : ""}`}
                                />
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
                            <Button asChild variant="outline" className="text-gray-700 dark:text-gray-200">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild variant="default">
                                <Link to="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="flex-grow p-6 overflow-auto">
                <main className="mx-auto max-w-7xl">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}
