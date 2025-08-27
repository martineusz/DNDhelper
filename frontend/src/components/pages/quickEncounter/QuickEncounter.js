import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function QuickEncounter() {
  const [participants, setParticipants] = useState([
    {
      id: Date.now(),
      initiative: "",
      name: "",
      currentHp: "",
      damageTaken: "",
      tags: "",
    },
  ]);

  const handleAddParticipant = () => {
    const newParticipant = {
      id: Date.now(),
      initiative: "",
      name: "",
      currentHp: "",
      damageTaken: "",
      tags: "",
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleDeleteParticipant = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
  };

  const handleParticipantChange = (id, field, value) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSubtractDamage = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((p) => {
        if (p.id === id) {
          const newHp = Math.max(
            0,
            (parseInt(p.currentHp, 10) || 0) - (parseInt(p.damageTaken, 10) || 0)
          );
          return { ...p, currentHp: newHp, damageTaken: "" };
        }
        return p;
      })
    );
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    return (b.initiative || 0) - (a.initiative || 0);
  });

  return (
    <div className="p-6 bg-white h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        Quick Encounter
      </h1>

      <div className="rounded-md border border-green-200">
        <div className="grid grid-cols-[1fr,2fr,2fr,2fr,auto] gap-2 p-2 bg-green-100 font-semibold text-green-700">
          <div>Init</div>
          <div>Name</div>
          <div>HP</div>
          <div>Tags</div>
          <div></div>
        </div>
        {sortedParticipants.map((participant, index) => (
          <div key={participant.id} className="grid grid-cols-[1fr,2fr,2fr,2fr,auto] gap-2 p-2 items-center border-b border-green-100 last:border-b-0">
            <Input
              type="number"
              value={participant.initiative}
              placeholder="0"
              onChange={(e) =>
                handleParticipantChange(
                  participant.id,
                  "initiative",
                  e.target.value
                )
              }
              className="bg-green-50 border-green-200 text-green-700"
            />
            <Input
              type="text"
              value={participant.name}
              placeholder="Character"
              onChange={(e) =>
                handleParticipantChange(participant.id, "name", e.target.value)
              }
              className="bg-green-50 border-green-200 text-green-700"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={participant.currentHp}
                placeholder="HP"
                onChange={(e) =>
                  handleParticipantChange(
                    participant.id,
                    "currentHp",
                    e.target.value
                  )
                }
                className="bg-green-50 border-green-200 text-green-700 w-20"
              />
              <div className="flex flex-grow items-center">
                <Input
                  type="number"
                  value={participant.damageTaken}
                  placeholder="Damage"
                  onChange={(e) =>
                    handleParticipantChange(
                      participant.id,
                      "damageTaken",
                      e.target.value
                    )
                  }
                  className="bg-green-50 border-green-200 text-green-700 w-full"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-1 shrink-0 bg-green-700 text-white hover:bg-green-600 border-green-800"
                  onClick={() => handleSubtractDamage(participant.id)}
                >
                  -
                </Button>
              </div>
            </div>
            <Input
              type="text"
              value={participant.tags}
              placeholder="Conditions"
              onChange={(e) =>
                handleParticipantChange(participant.id, "tags", e.target.value)
              }
              className="bg-green-50 border-green-200 text-green-700"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDeleteParticipant(participant.id)}
            >
              &times;
            </Button>
          </div>
        ))}
      </div>
      <Button
        className="mt-4 w-full bg-green-700 text-white hover:bg-green-600"
        onClick={handleAddParticipant}
      >
        Add Participant
      </Button>
    </div>
  );
}