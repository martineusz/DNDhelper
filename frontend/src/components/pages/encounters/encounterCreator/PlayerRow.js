import React from "react";

const PlayerRow = ({ player, onUpdate, onDelete }) => {
  // Logic to determine the display name
  const nameToDisplay = player.character_name || player.name || "Unnamed Character";

  // This single handler updates the player object with any stat change
  const handleStatChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      ...player,
      [name]: Number(value) || value, // Convert to number, but handle non-numeric input
    });
  };

  // This handler is for the name field, which is handled differently
  const handleNameChange = (e) => {
    const value = e.target.value;
    onUpdate({
      ...player,
      name: value,
    });
  };

  return (
    <div className="player-row">
      <p>
        <input
          type="text"
          // FIX: Use 'player.name' for custom players and 'player.character_name' for existing ones
          value={player.name || player.character_name || ''}
          onChange={handleNameChange}
          style={{ fontWeight: "bold", border: "none", width: "250px" }}
        />
        <br />
        Level: <input type="number" name="character_level" value={player.character_level || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        | HP: <input type="number" name="current_hp" value={player.current_hp || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        | AC: <input type="number" name="ac" value={player.ac || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        {player.url && (
          <a href={player.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", textDecoration: "none" }}>
            Details
          </a>
        )}
        <button onClick={() => onDelete(player.id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Delete
        </button>
      </p>
    </div>
  );
};

export default PlayerRow;