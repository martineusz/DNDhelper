import React from "react";

const MonsterRow = ({ monster, onUpdate, onDelete }) => {
  // This single handler updates the monster object with any stat change
  const handleStatChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      ...monster,
      [name]: name === 'cr' ? value : Number(value) || value,
    });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    onUpdate({
      ...monster,
      name: value,
    });
  };

  return (
    <div className="monster-row">
      <p>
        <input
          type="text"
          name="name"
          // FIX: The value should always be linked to monster.name
          value={monster.name || ''}
          onChange={handleNameChange}
          style={{ fontWeight: "bold", border: "none", width: "200px" }}
        />
        <br />
        CR: <input type="text" name="cr" value={monster.cr || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        | HP: <input type="number" name="current_hp" value={monster.current_hp || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        | AC: <input type="number" name="ac" value={monster.ac || ''} onChange={handleStatChange} style={{ width: "50px" }} />
        {monster.url && (
          <a href={monster.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", textDecoration: "none" }}>
            Details
          </a>
        )}
        <button onClick={() => onDelete(monster.id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Delete
        </button>
      </p>
    </div>
  );
};

export default MonsterRow;