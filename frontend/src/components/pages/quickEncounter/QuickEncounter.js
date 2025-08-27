import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";

// A component for a single participant row, handling its own state for damage input
function QuickEncounterRow({ participant, onUpdate, onDamage, onDelete }) {
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

// The main Quick Encounter component
export default function QuickEncounter() {
  const [participants, setParticipants] = useState([]);

  const handleAddParticipant = () => {
    const newParticipant = {
      tempId: Date.now(),
      initiative: null,
      display_name: "",
      current_hp: null,
      ac: null,
      notes: "",
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleDeleteParticipant = (tempId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.tempId !== tempId)
    );
  };

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

  const sortedParticipants = [...participants].sort((a, b) => {
    return (b.initiative || 0) - (a.initiative || 0);
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Quick Encounter</h1>
        <Button
          onClick={handleAddParticipant}
          variant="outline"
          className="bg-green-600 hover:bg-green-500 text-white"
        >
          Add Participant
        </Button>
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
          <QuickEncounterRow
            key={p.tempId}
            participant={p}
            onUpdate={handleUpdateParticipant}
            onDamage={handleDamage}
            onDelete={handleDeleteParticipant}
          />
        ))}
      </div>
      <div className="text-center mt-4">
        {participants.length === 0 && (
            <p className="text-gray-500">Add a participant to begin.</p>
        )}
      </div>
    </div>
  );
}