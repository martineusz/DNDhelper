import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card";

// Reusable component for a single encounter card.
function EncounterCard({ encounter, onCardClick }) {
  // Extract the first three player names
  const playerNames = encounter.player_data
    .slice(0, 3)
    .map((p) => (p.player_character ? p.player_character.character_name : p.name));
  const playerNamesString = playerNames.join(", ");

  // Extract the first three monster names
  const monsterNames = encounter.monster_data
    .slice(0, 3)
    .map((m) => (m.monster ? m.monster.name : m.name));
  const monsterNamesString = monsterNames.join(", ");

  return (
    <Card
      onClick={() => onCardClick(encounter)}
      className="bg-green-50 border border-green-200 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md"
    >
      <CardHeader>
        <CardTitle className="text-green-700">
          {encounter.name}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {encounter.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong className="text-green-600">Players:</strong>{" "}
          {encounter.player_data.length} ({playerNamesString})
        </p>
        <p>
          <strong className="text-green-600">Monsters:</strong>{" "}
          {encounter.monster_data.length} ({monsterNamesString})
        </p>
      </CardContent>
    </Card>
  );
}

// New component for the "add" button
function AddEncounterCard({ onCardClick }) {
  return (
    <div
      onClick={onCardClick}
      className="flex justify-center items-center border-2 border-dashed border-green-300 rounded-lg p-4 shadow-md bg-green-50 cursor-pointer hover:scale-105 transition-transform duration-200 min-h-[150px]"
    >
      <span className="text-green-500 text-6xl font-light">+</span>
    </div>
  );
}

// Main component to display all encounters.
export default function Encounters() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Handle click to navigate to an existing encounter's details page
  const handleCardClick = (encounter) => {
    navigate(`${encounter.id}`);
  };

  // Handle click to navigate to the new encounter creation page
  const handleNewEncounterClick = () => {
    navigate("../encounter-creator");
  };

  if (loading) return <p className="p-6 text-gray-700">Loading encounters...</p>;
  if (error) return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;

  return (
    <div className="p-6 bg-white h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold text-green-700 mb-2">My Encounters</h1>
      <p className="text-gray-600 mb-6">
        Click on an encounter card to view its details, or create a new one.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {encounters.map((encounter) => (
          <EncounterCard
            key={encounter.id}
            encounter={encounter}
            onCardClick={handleCardClick}
          />
        ))}
        <AddEncounterCard onCardClick={handleNewEncounterClick} />
      </div>
    </div>
  );
}