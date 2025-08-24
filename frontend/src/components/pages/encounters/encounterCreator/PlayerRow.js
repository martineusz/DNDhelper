import React, { useState, useEffect } from "react";

const PlayerRow = ({ player, onUpdate, onDelete }) => {
  const [editedPlayer, setEditedPlayer] = useState(player);

  const handleNameChange = (e) => {
    const combinedValue = e.target.value;
    const match = combinedValue.match(/(.*?)\s*\((.*?)\)$/);

    if (match) {
      setEditedPlayer(prevPlayer => ({
        ...prevPlayer,
        character_name: match[1].trim(),
        player_name: match[2].trim(),
      }));
    } else {
      setEditedPlayer(prevPlayer => ({
        ...prevPlayer,
        character_name: combinedValue,
        player_name: "",
      }));
    }
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setEditedPlayer(prevPlayer => ({
      ...prevPlayer,
      [name]: Number(value) || value,
    }));
  };

  useEffect(() => {
    onUpdate(editedPlayer);
  }, [editedPlayer, onUpdate]);

  const combinedName = `${editedPlayer.character_name} (${editedPlayer.player_name})`;

  return (
    <div className="player-row">
      <p>
        <input
          type="text"
          value={combinedName}
          onChange={handleNameChange}
          style={{ fontWeight: "bold", border: "none", width: "250px" }}
        />
        <br />
        Level: <input type="number" name="character_level" value={editedPlayer.character_level} onChange={handleStatChange} style={{ width: "50px" }} />
        | HP: <input type="number" name="hp" value={editedPlayer.hp} onChange={handleStatChange} style={{ width: "50px" }} />
        | AC: <input type="number" name="ac" value={editedPlayer.ac} onChange={handleStatChange} style={{ width: "50px" }} />
        {editedPlayer.url && (
          <a href={editedPlayer.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", textDecoration: "none" }}>
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