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

// Reusable component for a single player character card.
function PlayerCard({ player, onCardClick }) {
  const displayValue = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    return val;
  };

  return (
    <Card
      onClick={() => onCardClick(player)}
      className="bg-green-50 border border-green-200 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md"
    >
      <CardHeader>
        <CardTitle className="text-green-700">
          {displayValue(player.character_name)}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {displayValue(player.player_name)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <strong className="text-green-600">Level:</strong>{" "}
          {displayValue(player.character_level)}
        </p>
        <p>
          <strong className="text-green-600">AC:</strong> {displayValue(player.ac)}
        </p>
        <p>
          <strong className="text-green-600">Class:</strong>{" "}
          {displayValue(player.character_class)}
        </p>
        <p>
          <strong className="text-green-600">Race:</strong>{" "}
          {displayValue(player.character_race)}
        </p>
        <p>
          <strong className="text-green-600">Info:</strong>{" "}
          {player.info ? player.info.substring(0, 50) + "..." : "-"}
        </p>
      </CardContent>
    </Card>
  );
}

// New component for the "add" button
function AddPlayerCard({ onCardClick }) {
  return (
    <div
      onClick={onCardClick}
      className="flex justify-center items-center border-2 border-dashed border-green-300 rounded-lg p-4 shadow-md bg-green-50 cursor-pointer hover:scale-105 transition-transform duration-200 min-h-[150px]"
    >
      <span className="text-green-500 text-6xl font-light">+</span>
    </div>
  );
}

// Modal component to display and edit/create character information.
function CharacterDetailModal({ player, onClose, onSave }) {
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white p-6 rounded-lg shadow-xl border border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-800">
            {player && player.id ? `Edit ${player.character_name}` : "Create New Character"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="text-sm font-medium text-green-700">Character's name</label>
            <Input
              type="text"
              name="character_name"
              value={editablePlayer.character_name || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Player</label>
            <Input
              type="text"
              name="player_name"
              value={editablePlayer.player_name || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Level</label>
            <Input
              type="number"
              name="character_level"
              value={editablePlayer.character_level || 1}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Experience</label>
            <Input
              type="number"
              name="character_experience"
              value={editablePlayer.character_experience || 0}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Class</label>
            <Input
              type="text"
              name="character_class"
              value={editablePlayer.character_class || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Subclass</label>
            <Input
              type="text"
              name="character_subclass"
              value={editablePlayer.character_subclass || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Race</label>
            <Input
              type="text"
              name="character_race"
              value={editablePlayer.character_race || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Subrace</label>
            <Input
              type="text"
              name="character_subrace"
              value={editablePlayer.character_subrace || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Armor Class (AC)</label>
            <Input
              type="number"
              name="ac"
              value={editablePlayer.ac || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Hit Points (HP)</label>
            <Input
              type="number"
              name="hp"
              value={editablePlayer.hp || ""}
              onChange={handleInputChange}
              className="mt-1 bg-green-50 border-green-200 focus:border-green-300"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-green-700">Info</label>
            <textarea
              name="info"
              value={editablePlayer.info || ""}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 w-full p-2 border border-green-200 rounded-md bg-green-50 resize-y focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="w-full bg-green-700 hover:bg-green-600 text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// This is the main component that should be exported.
export default function Players() {
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
      const url = updatedCharacter.id
        ? `characters/${updatedCharacter.id}/`
        : "characters/";
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

  if (loading) return <p className="p-6 text-gray-700">Loading players...</p>;
  if (error)
    return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;

  return (
    <div className="p-6 bg-white h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold text-green-700 mb-2">Player Roster</h1>
      <p className="text-gray-600 mb-6">
        Click on a character card to view and edit their details, or add a new one.
      </p>
      {saveError && (
        <p className="text-red-500 font-bold mb-4">
          Error saving: {saveError}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onCardClick={setSelectedPlayer}
          />
        ))}
        <AddPlayerCard onCardClick={() => setSelectedPlayer({})}/>
      </div>

      {selectedPlayer && (
        <CharacterDetailModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}