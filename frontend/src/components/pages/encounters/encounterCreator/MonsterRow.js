import React, { useState, useEffect } from "react";

const MonsterRow = ({ monster, onUpdate, onDelete }) => {
  const [editedMonster, setEditedMonster] = useState(monster);

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setEditedMonster(prevMonster => ({
      ...prevMonster,
      [name]: name === 'cr' ? value : Number(value) || value,
    }));
  };

  useEffect(() => {
    onUpdate(editedMonster);
  }, [editedMonster, onUpdate]);

  return (
    <div className="monster-row">
      <p>
        <input type="text" name="name" value={editedMonster.name} onChange={handleStatChange} style={{ fontWeight: "bold", border: "none", width: "200px" }} />
        <br />
        CR: <input type="text" name="cr" value={editedMonster.cr} onChange={handleStatChange} style={{ width: "50px" }} />
        | HP: <input type="number" name="hp" value={editedMonster.hp} onChange={handleStatChange} style={{ width: "50px" }} />
        | AC: <input type="number" name="ac" value={editedMonster.ac} onChange={handleStatChange} style={{ width: "50px" }} />
        {editedMonster.url && (
          <a href={editedMonster.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "10px", textDecoration: "none" }}>
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