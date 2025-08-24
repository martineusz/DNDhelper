// EncounterSummary.js
import React from "react";

const EncounterSummary = ({
  totalPlayers,
  totalMonsters,
  totalMonsterXp,
  xpThresholds,
  onSave // The prop that handles the save logic
}) => {
  return (
    <div style={{
      flex: "1 1 300px",
      minWidth: 0,
      padding: "20px",
      border: "2px solid #333",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2>Encounter Summary</h2>
      <hr />
      <p>
        <strong>Total Players:</strong> {totalPlayers}
      </p>
      <p>
        <strong>Total Monsters:</strong> {totalMonsters}
      </p>
      <hr/>
      <h3>Party XP Thresholds</h3>
      <p>
        <strong>Easy:</strong> {xpThresholds.easy} XP
      </p>
      <p>
        <strong>Medium:</strong> {xpThresholds.medium} XP
      </p>
      <p>
        <strong>Hard:</strong> {xpThresholds.hard} XP
      </p>
      <p>
        <strong>Deadly:</strong> {xpThresholds.deadly} XP
      </p>
      <hr/>
      <p>
        <strong>Total Monster XP:</strong> {totalMonsterXp} XP
      </p>
      <button
        onClick={onSave} // Calls the onSave function from the parent
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Save Encounter
      </button>
    </div>
  );
};

export default EncounterSummary;