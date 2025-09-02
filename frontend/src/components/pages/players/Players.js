import React, { useEffect, useState } from "react";
import API from "../../../api";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { useDarkMode } from "../../../context/DarkModeContext";

// Reusable component for a single player character card.
function PlayerCard({ player, onCardClick, darkMode }) {
  const displayValue = (val) => (val == null || val === "" ? "-" : val);

  const cardClasses = darkMode
    ? "bg-gray-800 border-gray-700 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md"
    : "bg-green-50 border border-green-200 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md";

  const titleClasses = darkMode ? "text-gray-100" : "text-green-700";
  const descriptionClasses = darkMode ? "text-gray-400" : "text-gray-500";
  const labelClasses = darkMode ? "text-gray-200 font-semibold" : "text-green-600 font-semibold";

  return (
    <Card onClick={() => onCardClick(player)} className={cardClasses}>
      <CardHeader>
        <CardTitle className={titleClasses}>
          {displayValue(player.character_name)}
        </CardTitle>
        <CardDescription className={descriptionClasses}>
          {displayValue(player.player_name)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong className={labelClasses}>Level:</strong>{" "}
          {displayValue(player.character_level)}
        </p>
        <p>
          <strong className={labelClasses}>AC:</strong> {displayValue(player.ac)}
        </p>
        <p>
          <strong className={labelClasses}>Class:</strong>{" "}
          {displayValue(player.character_class)}
        </p>
        <p>
          <strong className={labelClasses}>Race:</strong>{" "}
          {displayValue(player.character_race)}
        </p>
        <p>
          <strong className={labelClasses}>Info:</strong>{" "}
          {player.info ? player.info.substring(0, 50) + "..." : "-"}
        </p>
      </CardContent>
    </Card>
  );
}

// New component for the "add" button
function AddPlayerCard({ onCardClick, darkMode }) {
  const bgClass = darkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-green-50 border-green-300 text-green-500";

  return (
    <div
      onClick={onCardClick}
      className={`flex justify-center items-center border-2 border-dashed rounded-lg p-4 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200 min-h-[150px] ${bgClass}`}
    >
      <span className="text-6xl font-light">+</span>
    </div>
  );
}

// Modal component to display and edit/create character information.
function CharacterDetailModal({ player, onClose, onSave, darkMode }) {
  const [editablePlayer, setEditablePlayer] = useState(player || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePlayer({ ...editablePlayer, [name]: value });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(editablePlayer);
    setIsSaving(false);
    onClose();
  };

  const bgClass = darkMode ? "bg-gray-900 border-gray-700 text-gray-100" : "bg-white border-green-200 text-gray-900";
  const labelClass = darkMode ? "text-gray-200 font-medium" : "text-green-700 font-medium";
  const inputClass = darkMode ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-gray-500 focus:border-gray-500" : "bg-green-50 border-green-200 focus:ring-green-300 focus:border-green-300";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[500px] p-6 rounded-lg shadow-xl border ${bgClass}`}>
        <DialogHeader>
          <DialogTitle className={labelClass}>
            {player && player.id ? `Edit ${player.character_name}` : "Create New Character"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          {[
            { label: "Character's name", name: "character_name", type: "text" },
            { label: "Player", name: "player_name", type: "text" },
            { label: "Level", name: "character_level", type: "number" },
            { label: "Experience", name: "character_experience", type: "number" },
            { label: "Class", name: "character_class", type: "text" },
            { label: "Subclass", name: "character_subclass", type: "text" },
            { label: "Race", name: "character_race", type: "text" },
            { label: "Subrace", name: "character_subrace", type: "text" },
            { label: "Armor Class (AC)", name: "ac", type: "number" },
            { label: "Hit Points (HP)", name: "hp", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className={labelClass}>{field.label}</label>
              <Input
                type={field.type}
                name={field.name}
                value={editablePlayer[field.name] || ""}
                onChange={handleInputChange}
                className={`mt-1 ${inputClass}`}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>Info</label>
            <textarea
              name="info"
              value={editablePlayer.info || ""}
              onChange={handleInputChange}
              rows="4"
              className={`mt-1 w-full p-2 rounded-md resize-y focus:outline-none focus:ring-2 ${inputClass}`}
            />
          </div>
        </div>

        <Button
          onClick={handleSaveClick}
          disabled={isSaving}
          className={`w-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-100" : "bg-green-700 hover:bg-green-600 text-white"}`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Main component
export default function Players() {
  const { darkMode } = useDarkMode();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const token = localStorage.getItem("access_token");

  async function fetchPlayers() {
    try {
      setLoading(true);
      const response = await API.get("characters/");
      setPlayers(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (updatedCharacter) => {
    try {
      const url = updatedCharacter.id ? `characters/${updatedCharacter.id}/` : "characters/";
      const method = updatedCharacter.id ? "patch" : "post";

      await API[method](url, updatedCharacter);
      setSaveError(null);
      await fetchPlayers();
    } catch (err) {
      setSaveError(err.response?.data?.detail || err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    fetchPlayers();
  }, [token]);

  if (loading) return <p className={`p-6 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Loading players...</p>;
  if (error) return <p className={`p-6 font-bold ${darkMode ? "text-red-400" : "text-red-500"}`}>Error: {error}</p>;

  return (
    <div className={`p-6 h-screen overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <h1 className={`text-2xl font-semibold mb-2 ${darkMode ? "text-gray-100" : "text-green-700"}`}>Player Roster</h1>
      <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
        Click on a character card to view and edit their details, or add a new one.
      </p>
      {saveError && (
        <p className={`mb-4 font-bold ${darkMode ? "text-red-400" : "text-red-500"}`}>
          Error saving: {saveError}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} onCardClick={setSelectedPlayer} darkMode={darkMode} />
        ))}
        <AddPlayerCard onCardClick={() => setSelectedPlayer({})} darkMode={darkMode} />
      </div>

      {selectedPlayer && (
        <CharacterDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onSave={handleSave}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
