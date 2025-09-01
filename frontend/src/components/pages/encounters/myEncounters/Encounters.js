import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../../../../api";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "../../../ui/card";
import {useDarkMode} from "../../../../context/DarkModeContext";

// Reusable component for a single encounter card.
function EncounterCard({encounter, onCardClick, darkMode}) {
    const playerNames = encounter.player_data
        .slice(0, 3)
        .map((p) => (p.player_character ? p.player_character.character_name : p.name));
    const playerNamesString = playerNames.join(", ");
    const playerCount = encounter.player_data.length;

    const monsterNames = encounter.monster_data
        .slice(0, 3)
        .map((m) => (m.monster ? m.monster.name : m.name));
    const monsterNamesString = monsterNames.join(", ");
    const monsterCount = encounter.monster_data.length;

    const cardClass = darkMode
        ? "bg-gray-800 border-gray-700 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md"
        : "bg-green-50 border border-green-200 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md";

    const titleClass = darkMode ? "text-gray-100" : "text-green-700";
    const descClass = darkMode ? "text-gray-300" : "text-gray-500";
    const labelClass = darkMode ? "text-gray-200 font-semibold" : "text-green-600 font-semibold";

    return (
        <Card onClick={() => onCardClick(encounter)} className={cardClass}>
            <CardHeader>
                <CardTitle className={titleClass}>{encounter.name}</CardTitle>
                <CardDescription className={descClass}>{encounter.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className={darkMode ? "text-white" : ""}>
                    <strong className={labelClass}>Players:</strong>{" "}
                    {playerCount > 0 ? `${playerCount} (${playerNamesString})` : playerCount}
                </p>
                <p className={darkMode ? "text-white" : ""}>
                    <strong className={labelClass}>Monsters:</strong>{" "}
                    {monsterCount > 0 ? `${monsterCount} (${monsterNamesString})` : monsterCount}
                </p>
            </CardContent>
        </Card>
    );
}

// Component for the "add" button
function AddEncounterCard({onCardClick, darkMode}) {
    const cardClass = darkMode
        ? "flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg p-4 shadow-md bg-gray-800 cursor-pointer hover:scale-105 transition-transform duration-200 min-h-[150px]"
        : "flex justify-center items-center border-2 border-dashed border-green-300 rounded-lg p-4 shadow-md bg-green-50 cursor-pointer hover:scale-105 transition-transform duration-200 min-h-[150px]";

    const plusClass = darkMode ? "text-gray-100 text-6xl font-light" : "text-green-500 text-6xl font-light";

    return (
        <div onClick={onCardClick} className={cardClass}>
            <span className={plusClass}>+</span>
        </div>
    );
}

// Main component to display all encounters
export default function Encounters() {
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {darkMode} = useDarkMode();

    const token = localStorage.getItem("access_token");

    async function fetchEncounters() {
        try {
            setLoading(true);
            const response = await API.get("encounters/my_encounters/");
            setEncounters(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }
        fetchEncounters();
    }, [token]);

    const handleCardClick = (encounter) => navigate(`${encounter.id}`);
    const handleNewEncounterClick = () => navigate("../encounter-creator");

    if (loading) return <p className="p-6 text-gray-700">Loading encounters...</p>;
    if (error) return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;

    return (
        <div className={`p-6 h-screen overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <h1 className={`${darkMode ? "text-gray-100" : "text-green-700"} text-2xl font-semibold mb-2`}>
                My Encounters
            </h1>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
                Click on an encounter card to view its details, or create a new one.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {encounters.map((encounter) => (
                    <EncounterCard
                        key={encounter.id}
                        encounter={encounter}
                        onCardClick={handleCardClick}
                        darkMode={darkMode}
                    />
                ))}
                <AddEncounterCard onCardClick={handleNewEncounterClick} darkMode={darkMode}/>
            </div>
        </div>
    );
}
