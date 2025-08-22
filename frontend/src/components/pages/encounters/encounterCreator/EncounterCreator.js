import React, { useState, useEffect } from "react";
import Select from "react-select";
import API from "../../../../api";

// A simple component to display a single player's info
const PlayerRow = ({ player, onUpdate }) => {
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
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
    }}>
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
      </p>
    </div>
  );
};

// A simple component to display a single monster's info
const MonsterRow = ({ monster, onUpdate }) => {
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
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
    }}>
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
      </p>
    </div>
  );
};

export default function EncounterCreator() {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [availableMonsters, setAvailableMonsters] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([]);
  const [customPlayerName, setCustomPlayerName] = useState("");
  const [customMonsterName, setCustomMonsterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextId, setNextId] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const playersResponse = await API.get("characters/");
      setAvailablePlayers(playersResponse.data);
      const monstersResponse = await API.get("monsters/");
      setAvailableMonsters(monstersResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      prevPlayers.map(p =>
        p.id === updatedPlayer.id ? updatedPlayer : p
      )
    );
  };

  const handleMonsterUpdate = (updatedMonster) => {
    setSelectedMonsters(prevMonsters =>
      prevMonsters.map(m =>
        m.id === updatedMonster.id ? updatedMonster : m
      )
    );
  };

  // XP threshold data for D&D 5e
  const xpThresholds = {
    1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3: { easy: 75, medium: 150, hard: 225, deadly: 300 },
    4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 4100, hard: 6100, deadly: 9200 },
    18: { easy: 2100, medium: 4900, hard: 7300, deadly: 10900 },
    19: { easy: 2400, medium: 5700, hard: 8500, deadly: 12700 },
    20: { easy: 2800, medium: 6600, hard: 9900, deadly: 14800 },
  };

  // XP values for D&D 5e CR
  const crToXp = {
    "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
    "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400,
    "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000,
    "20": 24000, "21": 28000, "22": 33000, "23": 41000, "24": 50000, "25": 62000, "26": 75000,
    "27": 90000, "28": 105000, "29": 120000, "30": 155000
  };

  // Calculate the party's total XP threshold
  const calculatePartyXpThreshold = () => {
    const totalXp = selectedPlayers.reduce((sum, player) => {
      const level = player.character_level;
      if (xpThresholds[level]) {
        return sum + xpThresholds[level].medium;
      }
      return sum;
    }, 0);
    return totalXp;
  };

  // Calculate the total XP for all selected monsters
  const calculateMonsterXp = () => {
    const totalXp = selectedMonsters.reduce((sum, monster) => {
      const xpValue = crToXp[monster.cr];
      if (xpValue) {
        return sum + xpValue;
      }
      return sum;
    }, 0);
    return totalXp;
  };

  const totalPartyXp = calculatePartyXpThreshold();
  const totalMonsterXp = calculateMonsterXp();

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

  return (
    <div style={{ padding: "20px", height: "100vh", overflowY: "scroll" }}>
      <h1>Encounter Creator</h1>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        marginTop: "20px"
      }}>
        {/* Left Panel: Players */}
        <div>
          <h2>Player Characters</h2>
          <hr />
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {selectedPlayers.length > 0 && (
              <div>
                {selectedPlayers.map((player) => (
                  <PlayerRow key={player.id} player={player} onUpdate={handlePlayerUpdate} />
                ))}
              </div>
            )}
          </div>
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
              }),
            }}
          />
        </div>

        {/* Right Panel: Enemies */}
        <div>
          <h2>Enemies</h2>
          <hr />
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {selectedMonsters.length > 0 && (
              <div>
                {selectedMonsters.map((monster) => (
                  <MonsterRow key={monster.id} monster={monster} onUpdate={handleMonsterUpdate} />
                ))}
              </div>
            )}
          </div>
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
              }),
            }}
          />
        </div>
      </div>

      {/* Panel at the bottom of the page */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        border: "2px solid #333",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2>Encounter Summary</h2>
        <hr />
        <p>
          <strong>Total Players:</strong> {selectedPlayers.length}
        </p>
        <p>
          <strong>Total Monsters:</strong> {selectedMonsters.length}
        </p>
        <p>
          <strong>Party XP Threshold (Medium):</strong> {totalPartyXp} XP
        </p>
        <p>
          <strong>Total Monster XP:</strong> {totalMonsterXp} XP
        </p>
      </div>
    </div>
  );
}