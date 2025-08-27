import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../../api";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Label } from "../../../ui/label";

// A component for a single participant row, handling its own state for damage input
function ParticipantRow({ participant, onUpdate, onDamage, onDetails }) {
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
    <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-gray-50 border border-gray-200 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 flex-grow">
        <div className="flex flex-col">
          <Label htmlFor={`initiative-${participant.tempId}`} className="text-xs text-gray-500">Initiative</Label>
          <Input
            id={`initiative-${participant.tempId}`}
            type="number"
            value={participant.initiative || ""}
            placeholder="0"
            onChange={handleInputChange("initiative")}
            className="bg-gray-100 border-gray-200"
          />
        </div>
        <div className="flex flex-col col-span-2 sm:col-span-1">
          <Label className="text-xs text-gray-500">Name</Label>
          <span className="font-semibold text-base break-words text-gray-800">
            {participant.display_name}
          </span>
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`hp-${participant.tempId}`} className="text-xs text-gray-500">HP</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`hp-${participant.tempId}`}
              type="number"
              value={participant.current_hp || ""}
              placeholder="HP"
              onChange={handleInputChange("current_hp")}
              className="bg-gray-100 border-gray-200 w-16"
            />
            <div className="flex flex-grow items-center">
              <Input
                type="number"
                value={damageTaken}
                placeholder="Damage"
                onChange={handleDamageChange}
                className="bg-gray-100 border-gray-200 w-20"
              />
              <Button
                variant="outline"
                size="icon"
                className="ml-1 shrink-0 text-white bg-red-600 hover:bg-red-500 border-red-700"
                onClick={handleSubtractDamage}
              >
                -
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`ac-${participant.tempId}`} className="text-xs text-gray-500">AC</Label>
          <Input
            id={`ac-${participant.tempId}`}
            type="number"
            value={participant.ac || ""}
            placeholder="AC"
            onChange={handleInputChange("ac")}
            className="bg-gray-100 border-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`notes-${participant.tempId}`} className="text-xs text-gray-500">Notes</Label>
          <Input
            id={`notes-${participant.tempId}`}
            type="text"
            value={participant.notes || ""}
            placeholder="Notes"
            onChange={handleInputChange("notes")}
            className="bg-gray-100 border-gray-200"
          />
        </div>
      </div>
      <Button
        onClick={() => onDetails(participant)}
        variant="outline"
        disabled={!participant.original_id}
        className="mt-4 md:mt-0 w-full md:w-auto"
      >
        Details
      </Button>
    </Card>
  );
}

// The main Encounter View component
export default function EncounterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState(null);
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

  const handleDetailsClick = (participant) => {
    if (participant.type === "player" && participant.original_id) {
      navigate(`/dashboard/players/${participant.original_id}`);
    } else if (participant.type === "monster" && participant.original_id) {
      navigate(`/dashboard/compendium/${participant.original_id}`);
    }
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
        name: encounter.name,
        description: encounter.description,
        player_data: playerPayload,
        monster_data: monsterPayload,
      };

      await API.put(`encounters/${id}/`, payload);
      alert("Encounter saved successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      alert(`Failed to save encounter: ${err.message}`);
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
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          &larr; Back
        </Button>
        <div className="text-center flex-grow">
          <h1 className="text-2xl font-bold text-gray-800">{encounter.name}</h1>
          <p className="text-gray-500 text-sm">{encounter.description}</p>
        </div>
        <Button onClick={handleSaveEncounter} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Encounter"}
        </Button>
      </div>

      <div className="rounded-md border border-gray-200">
        <div className="hidden md:grid grid-cols-[1fr,2fr,2fr,1fr,2fr,auto] gap-2 p-2 bg-gray-100 font-semibold text-gray-700">
          <div>Initiative</div>
          <div>Name</div>
          <div>Current HP</div>
          <div>AC</div>
          <div>Notes</div>
          <div>Actions</div>
        </div>
        {sortedParticipants.map((p) => (
          <ParticipantRow
            key={p.tempId}
            participant={p}
            onUpdate={handleUpdateParticipant}
            onDamage={handleDamage}
            onDetails={handleDetailsClick}
          />
        ))}
      </div>
    </div>
  );
}