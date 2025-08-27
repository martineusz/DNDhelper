import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../api";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Label } from "../../../ui/label";

// A component for a single participant row, handling its own state for damage input
function ParticipantRow({ participant, onUpdate, onDamage, onDelete }) {
  const [damageTaken, setDamageTaken] = useState("");

  const handleDamageChange = (e) => {
    setDamageTaken(e.target.value);
  };

  const handleSubtractDamage = () => {
    onDamage(participant.tempId, parseInt(damageTaken, 10) || 0);
    setDamageTaken("");
  };

  const handleInputChange = (field) => (e) => {
    onUpdate(participant.tempId, field, e.target.value);
  };

  return (
    <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-green-50 border border-green-200 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 flex-grow">
        <div className="flex flex-col">
          <Label htmlFor={`initiative-${participant.tempId}`} className="text-xs text-green-600">Initiative</Label>
          <Input
            id={`initiative-${participant.tempId}`}
            type="number"
            value={participant.initiative || ""}
            placeholder="0"
            onChange={handleInputChange("initiative")}
            className="bg-green-50 border-green-200"
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label className="text-xs text-green-600">Name</Label>
          <Input
            type="text"
            value={participant.display_name}
            onChange={handleInputChange("display_name")}
            className="bg-green-50 border-green-200"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`hp-${participant.tempId}`} className="text-xs text-green-600">HP</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`hp-${participant.tempId}`}
              type="number"
              value={participant.current_hp || ""}
              placeholder="HP"
              onChange={handleInputChange("current_hp")}
              className="bg-green-50 border-green-200 w-16"
            />
            <div className="flex flex-grow items-center">
              <Input
                type="number"
                value={damageTaken}
                placeholder="Dmg"
                onChange={handleDamageChange}
                className="bg-green-50 border-green-200 w-20"
              />
              <Button
                variant="outline"
                size="icon"
                className="ml-1 shrink-0 text-white bg-green-900 hover:bg-green-800 border-green-950"
                onClick={handleSubtractDamage}
              >
                -
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`ac-${participant.tempId}`} className="text-xs text-green-600">AC</Label>
          <Input
            id={`ac-${participant.tempId}`}
            type="number"
            value={participant.ac || ""}
            placeholder="AC"
            onChange={handleInputChange("ac")}
            className="bg-green-50 border-green-200"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`notes-${participant.tempId}`} className="text-xs text-green-600">Notes</Label>
          <Input
            id={`notes-${participant.tempId}`}
            type="text"
            value={participant.notes || ""}
            placeholder="Notes"
            onChange={handleInputChange("notes")}
            className="bg-green-50 border-green-200"
          />
        </div>
      </div>
      <div className="flex items-center justify-end md:ml-4 mt-2 md:mt-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-white bg-green-900 hover:bg-green-800 border-green-950 mr-2"
          onClick={() => onDelete(participant.tempId)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

// The main Encounter View component
export default function EncounterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchEncounter = async () => {
      try {
        const response = await API.get(`encounters/${id}/`);
        const fetchedEncounter = response.data;
        setEncounter(fetchedEncounter);
        setEditableName(fetchedEncounter.name);

        const combinedParticipants = [
          ...fetchedEncounter.player_data.map((p, index) => ({
            ...p,
            type: "player",
            display_name: p.player_character?.character_name || p.name,
            original_id: p.player_character?.id,
            tempId: `player-${p.id || index}`,
          })),
          ...fetchedEncounter.monster_data.map((m, index) => ({
            ...m,
            type: "monster",
            display_name: m.monster?.name || m.name,
            ac: m.ac,
            original_id: m.monster?.id,
            tempId: `monster-${m.id || index}`,
          })),
        ];
        setParticipants(combinedParticipants);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEncounter();
  }, [id]);

  const handleUpdateParticipant = (tempId, field, value) => {
    setParticipants((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    );
  };

  const handleNameChange = (e) => {
    setEditableName(e.target.value);
  };

  const handleDamage = (tempId, damage) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.tempId === tempId) {
          const newHp = Math.max(0, (parseInt(p.current_hp, 10) || 0) - damage);
          return { ...p, current_hp: newHp };
        }
        return p;
      })
    );
  };

  const handleDeleteParticipant = async (tempId) => {
    const participantToDelete = participants.find(p => p.tempId === tempId);
    if (!participantToDelete || !participantToDelete.id) {
      return;
    }

    const endpoint = participantToDelete.type === 'player'
      ? `encounters/player_data/${participantToDelete.id}/`
      : `encounters/monster_data/${participantToDelete.id}/`;

    try {
      await API.delete(endpoint);
      setParticipants(prevParticipants => prevParticipants.filter(p => p.tempId !== tempId));
    } catch (err) {
      console.error("Failed to delete participant:", err);
    }
  };

  const handleAddPlayer = () => {
    const newPlayer = {
      type: "player",
      display_name: "New Player",
      initiative: null,
      current_hp: null,
      ac: null,
      notes: "",
      tempId: `new-player-${Date.now()}`,
    };
    setParticipants((prev) => [...prev, newPlayer]);
  };

  const handleAddMonster = () => {
    const newMonster = {
      type: "monster",
      display_name: "New Monster",
      initiative: null,
      current_hp: null,
      ac: null,
      notes: "",
      tempId: `new-monster-${Date.now()}`,
    };
    setParticipants((prev) => [...prev, newMonster]);
  };

  const handleSaveEncounter = async () => {
    setIsSaving(true);
    try {
      const playerPayload = participants
        .filter((p) => p.type === "player")
        .map((p) => ({
          id: p.id,
          player_character_id: p.original_id || null,
          name: p.display_name,
          initiative: p.initiative,
          current_hp: p.current_hp,
          notes: p.notes,
          ac: p.ac,
        }));

      const monsterPayload = participants
        .filter((p) => p.type === "monster")
        .map((p) => ({
          id: p.id,
          monster_id: p.original_id || null,
          name: p.display_name,
          initiative: p.initiative,
          current_hp: p.current_hp,
          notes: p.notes,
          ac: p.ac,
        }));

      const payload = {
          name: editableName,
          description: encounter.description,
          player_data: playerPayload,
          monster_data: monsterPayload,
      };

      await API.put(`encounters/${id}/`, payload);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    return (b.initiative || 0) - (a.initiative || 0);
  });

  if (loading) return <p className="p-6 text-gray-700">Loading encounter...</p>;
  if (error) return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;
  if (!encounter) return <p className="p-6 text-gray-700">Encounter not found.</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="bg-green-100 text-green-700 hover:bg-green-200">
          &larr; Back
        </Button>
        <div className="text-center flex-grow">
          <Input
            type="text"
            value={editableName}
            onChange={handleNameChange}
            className="text-2xl font-bold text-center text-green-700 mb-1 border-none bg-transparent focus-visible:ring-0"
          />
          <p className="text-green-600 text-sm">{encounter.description}</p>
        </div>
        <div className="flex gap-2">
            <Button
              onClick={handleAddPlayer}
              variant="outline"
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              Add Player
            </Button>
            <Button
              onClick={handleAddMonster}
              variant="outline"
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              Add Monster
            </Button>
            <Button
              onClick={handleSaveEncounter}
              disabled={isSaving}
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              {isSaving ? "Saving..." : "Save Encounter"}
            </Button>
        </div>
      </div>

      <div className="rounded-md border border-green-200">
        <div className="hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2 bg-green-100 font-semibold text-green-700">
          <div>Initiative</div>
          <div className="col-span-1">Name</div>
          <div>HP</div>
          <div>AC</div>
          <div>Notes</div>
        </div>
        {sortedParticipants.map((p) => (
          <ParticipantRow
            key={p.tempId}
            participant={p}
            onUpdate={handleUpdateParticipant}
            onDamage={handleDamage}
            onDelete={handleDeleteParticipant}
          />
        ))}
      </div>
    </div>
  );
}