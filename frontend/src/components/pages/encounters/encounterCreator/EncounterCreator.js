import React, { useState } from "react";
import Select from "react-select";
import PlayerRow from "./PlayerRow";
import MonsterRow from "./MonsterRow";
import EncounterSummary from "./EncounterSummary";
import { useEncounterData } from "./hooks/useEncounterData";
import { calculatePartyXpThresholds, calculateMonsterXp } from "./utils/EncounterCalculations";
import "./EncounterCreator.css";

export default function EncounterCreator() {
  const { availablePlayers, availableMonsters, loading, error } = useEncounterData();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([]);
  const [customPlayerName, setCustomPlayerName] = useState("");
  const [customMonsterName, setCustomMonsterName] = useState("");
  const [nextId, setNextId] = useState(0);

  const handleAddCustomPlayer = () => {
    const newPlayer = {
      id: `new-player-${nextId}`,
      character_name: customPlayerName || "New Character",
      player_name: "unnamed player",
      character_level: 1,
      hp: 0,
      ac: 0,
      url: ""
    };
    setSelectedPlayers([...selectedPlayers, newPlayer]);
    setNextId(nextId + 1);
    setCustomPlayerName("");
  };

  const handleAddCustomMonster = () => {
    const newMonster = {
      id: `new-monster-${nextId}`,
      name: customMonsterName || "New Monster",
      cr: "0",
      hp: 0,
      ac: 0,
      url: ""
    };
    setSelectedMonsters([...selectedMonsters, newMonster]);
    setNextId(nextId + 1);
    setCustomMonsterName("");
  };

  const handlePlayerSelect = (selectedOption) => {
    if (selectedOption) {
      const playerToAdd = availablePlayers.find(p => p.id === selectedOption.value);
      if (playerToAdd && !selectedPlayers.some(p => p.id === playerToAdd.id)) {
        setSelectedPlayers([...selectedPlayers, playerToAdd]);
      }
    }
  };

  const handleMonsterSelect = (selectedOption) => {
    if (selectedOption) {
      const monsterToAdd = availableMonsters.find(m => m.id === selectedOption.value);
      if (monsterToAdd && !selectedMonsters.some(m => m.id === monsterToAdd.id)) {
        setSelectedMonsters([...selectedMonsters, monsterToAdd]);
      }
    }
  };

  const handlePlayerUpdate = (updatedPlayer) => {
    setSelectedPlayers(prevPlayers =>
      prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p)
    );
  };

  const handlePlayerDelete = (playerId) => {
    setSelectedPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
  };

  const handleMonsterUpdate = (updatedMonster) => {
    setSelectedMonsters(prevMonsters =>
      prevMonsters.map(m => m.id === updatedMonster.id ? updatedMonster : m)
    );
  };

  const handleMonsterDelete = (monsterId) => {
    setSelectedMonsters(prevMonsters => prevMonsters.filter(m => m.id !== monsterId));
  };

  const handleSaveEncounter = async () => {
    const apiBaseUrl = "http://localhost:8000/api";

    try {
      // 1. Prepare the nested data for players and monsters
      const playerPayload = selectedPlayers.map(player => ({
        player_character: player.id,
        initiative: 0,
        current_hp: player.hp,
        notes: "",
      }));

      const monsterPayload = selectedMonsters.map(monster => ({
        monster: monster.id,
        initiative: 0,
        current_hp: monster.hp,
        notes: "",
      }));

      // 2. Create the main Encounter object with nested player and monster data
      const payload = {
        name: "My New Encounter", // You can make this dynamic with a state variable
        description: "A new combat encounter.", // Same here
        player_data: playerPayload,
        monster_data: monsterPayload,
      };

      const response = await fetch(`${apiBaseUrl}/encounters/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save encounter: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const newEncounter = await response.json();
      alert(`Encounter "${newEncounter.name}" saved successfully!`);
      console.log("Saved Encounter:", newEncounter);

    } catch (error) {
      console.error("Failed to save encounter:", error);
      alert("Failed to save encounter. Check console for details.");
    }
  };


  const partyXpThresholds = calculatePartyXpThresholds(selectedPlayers);
  const totalMonsterXp = calculateMonsterXp(selectedMonsters);

  const playerOptions = availablePlayers
    .filter(player => !selectedPlayers.some(p => p.id === player.id))
    .map(player => ({
      value: player.id,
      label: player.character_name,
    }));

  const monsterOptions = availableMonsters
    .filter(monster => !selectedMonsters.some(m => m.id === monster.id))
    .map(monster => ({
      value: monster.id,
      label: monster.name,
    }));

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="encounter-creator-container">
      <h1>Encounter Creator</h1>

      <div style={{
        display: "flex",
        gap: "40px",
        marginTop: "20px",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}>
        {/* Left Panel: Players */}
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <h2>Player Characters</h2>
          <hr />
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Custom character name"
              value={customPlayerName}
              onChange={(e) => setCustomPlayerName(e.target.value)}
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 4px",
              }}
            />
            <button
              onClick={handleAddCustomPlayer}
              style={{
                padding: "8px 12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderLeft: "none",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <Select
            options={playerOptions}
            onChange={handlePlayerSelect}
            placeholder="Search and add a character..."
            value={null}
            isClearable={true}
            styles={{
              container: (provided) => ({
                ...provided,
                marginBottom: "20px",
              }),
            }}
          />
          <div className="scrollable-list">
            {selectedPlayers.length > 0 && (
              <div>
                {selectedPlayers.map((player) => (
                  <PlayerRow key={player.id} player={player} onUpdate={handlePlayerUpdate} onDelete={handlePlayerDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <h2>Enemies</h2>
          <hr />
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Custom monster name"
              value={customMonsterName}
              onChange={(e) => setCustomMonsterName(e.target.value)}
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 4px",
              }}
            />
            <button
              onClick={handleAddCustomMonster}
              style={{
                padding: "8px 12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderLeft: "none",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <Select
            options={monsterOptions}
            onChange={handleMonsterSelect}
            placeholder="Search and add an enemy..."
            value={null}
            isClearable={true}
            styles={{
              container: (provided) => ({
                ...provided,
                marginBottom: "20px",
              }),
            }}
          />
          <div className="scrollable-list">
            {selectedMonsters.length > 0 && (
              <div>
                {selectedMonsters.map((monster) => (
                  <MonsterRow key={monster.id} monster={monster} onUpdate={handleMonsterUpdate} onDelete={handleMonsterDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        <EncounterSummary
          totalPlayers={selectedPlayers.length}
          totalMonsters={selectedMonsters.length}
          xpThresholds={partyXpThresholds}
          totalMonsterXp={totalMonsterXp}
          onSave={handleSaveEncounter} // This is the line that passes the function
        />
      </div>
    </div>
  );
}