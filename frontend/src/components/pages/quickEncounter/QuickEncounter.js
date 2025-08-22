import React, { useState } from "react";
import "./QuickEncounter.css";

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

  // A function to handle adding a new participant
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

  // A function to handle deleting a participant
  const handleDeleteParticipant = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
  };

  // A function to handle changes in the input fields
  const handleParticipantChange = (id, field, value) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  // A function to handle damage subtraction
  const handleSubtractDamage = (id) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((p) => {
        if (p.id === id) {
          const newHp = Math.max(
            0,
            (parseInt(p.currentHp, 10) || 0) - (parseInt(p.damageTaken, 10) || 0)
          );
          return { ...p, currentHp: newHp, damageTaken: "" }; // Reset damageTaken after subtraction
        }
        return p;
      })
    );
  };

  // Auto-sort participants whenever the list changes
  const sortedParticipants = [...participants].sort((a, b) => {
    return (b.initiative || 0) - (a.initiative || 0);
  });

  return (
    <div className="quick-encounter-container">
      <h2>Quick Encounter</h2>

      <div className="encounter-grid">
        <div className="grid-header">
          <div className="grid-column">Initiative</div>
          <div className="grid-column">Name</div>
          <div className="grid-column">Current HP</div>
          <div className="grid-column">Tags</div>
          <div className="grid-column"></div> {/* Empty column for delete button */}
        </div>
        {sortedParticipants.map((participant) => (
          <div key={participant.id} className="grid-row">
            <input
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
            />
            <input
              type="text"
              value={participant.name}
              placeholder="Character/Monster"
              onChange={(e) =>
                handleParticipantChange(participant.id, "name", e.target.value)
              }
            />
            <div className="hp-section">
              <input
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
              />
              <div className="damage-input-group">
                <input
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
                />
                <button
                  className="damage-button"
                  onClick={() => handleSubtractDamage(participant.id)}
                >
                  - HP
                </button>
              </div>
            </div>
            <input
              type="text"
              value={participant.tags}
              placeholder="Condition, Status..."
              onChange={(e) =>
                handleParticipantChange(participant.id, "tags", e.target.value)
              }
            />
            <button
              className="delete-button"
              onClick={() => handleDeleteParticipant(participant.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <button className="add-button" onClick={handleAddParticipant}>
        Add
      </button>
    </div>
  );
}