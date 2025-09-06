import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { useDarkMode } from "../../../context/DarkModeContext";

// Single participant row
function QuickEncounterRow({ participant, onUpdate, onDelete, darkMode }) {
  const handleInputChange = (field) => (e) =>
    onUpdate(participant.tempId, field, e.target.value);

  const cardClass = darkMode
    ? "flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-gray-800 border-green-700 shadow-sm"
    : "flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-green-50 border border-green-200 shadow-sm";

  const inputClass = darkMode
    ? "bg-gray-700 border-green-600 text-gray-100 focus:ring-green-500 focus:border-green-500"
    : "bg-green-50 border-green-200";

  const labelClass = darkMode ? "text-gray-200 text-xs" : "text-green-600 text-xs";
  const deleteButtonClass = darkMode
    ? "text-gray-100 hover:bg-green-900"
    : "text-green-700 hover:bg-green-200";

  return (
    <Card className={cardClass}>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 flex-grow">
        <div className="flex flex-col">
          <Label htmlFor={`initiative-${participant.tempId}`} className={labelClass}>
            Initiative
          </Label>
          <Input
            id={`initiative-${participant.tempId}`}
            type="number"
            value={participant.initiative || ""}
            placeholder="0"
            onChange={handleInputChange("initiative")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label className={labelClass}>Name</Label>
          <Input
            type="text"
            value={participant.display_name}
            onChange={handleInputChange("display_name")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`hp-${participant.tempId}`} className={labelClass}>
            HP
          </Label>
          <Input
            id={`hp-${participant.tempId}`}
            type="number"
            value={participant.current_hp || ""}
            placeholder="HP"
            onChange={handleInputChange("current_hp")}
            className={`${inputClass} w-20`}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`ac-${participant.tempId}`} className={labelClass}>
            AC
          </Label>
          <Input
            id={`ac-${participant.tempId}`}
            type="number"
            value={participant.ac || ""}
            placeholder="AC"
            onChange={handleInputChange("ac")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`notes-${participant.tempId}`} className={labelClass}>
            Notes
          </Label>
          <Input
            id={`notes-${participant.tempId}`}
            type="text"
            value={participant.notes || ""}
            placeholder="Notes"
            onChange={handleInputChange("notes")}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex items-center justify-end md:ml-4 mt-2 md:mt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`${deleteButtonClass} mr-2`}
          onClick={() => onDelete(participant.tempId)}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

// Main component
export default function QuickEncounter() {
  const { darkMode } = useDarkMode();
  const [participants, setParticipants] = useState([]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      {
        tempId: Date.now(),
        initiative: null,
        display_name: "",
        current_hp: null,
        ac: null,
        notes: "",
      },
    ]);
  };

  const handleDeleteParticipant = (tempId) => {
    setParticipants((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  const handleUpdateParticipant = (tempId, field, value) => {
    setParticipants((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    );
  };

  const sortedParticipants = [...participants].sort(
    (a, b) => (b.initiative || 0) - (a.initiative || 0)
  );

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-green-400" : "text-green-700"
          }`}
        >
          Quick Encounter
        </h1>
        <Button
          onClick={handleAddParticipant}
          className={
            darkMode
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
          }
        >
          Add Participant
        </Button>
      </div>

      <div
        className={`rounded-md border ${
          darkMode ? "border-green-700" : "border-green-200"
        }`}
      >
        <div
          className={`hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2 font-semibold ${
            darkMode
              ? "bg-green-900 text-green-200"
              : "bg-green-100 text-green-700"
          }`}
        >
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
            onDelete={handleDeleteParticipant}
            darkMode={darkMode}
          />
        ))}
      </div>

      {participants.length === 0 && (
        <div
          className={`text-center mt-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Add a participant to begin.
        </div>
      )}
    </div>
  );
}
