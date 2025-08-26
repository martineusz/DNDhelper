import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import PlayerRow from "./PlayerRow";
import MonsterRow from "./MonsterRow";
import EncounterSummary from "./EncounterSummary";
import {useEncounterData} from "./hooks/useEncounterData";
import {calculateMonsterXp, calculatePartyXpThresholds} from "./utils/EncounterCalculations";
import "./EncounterCreator.css";

export default function EncounterCreator() {
    const {availablePlayers, availableMonsters, loading, error, refreshData} = useEncounterData();
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [customPlayerName, setCustomPlayerName] = useState("");
    const [customMonsterName, setCustomMonsterName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    // State for the user-defined encounter name
    const [encounterName, setEncounterName] = useState("Encounter Name");

    const navigate = useNavigate();

    const handleAddCustomPlayer = () => {
        if (!customPlayerName) return;

        // Create a temporary object with a unique negative ID to distinguish from database IDs
        const newPlayer = {
            id: -(new Date().getTime()),
            name: customPlayerName,
            initiative: 0,
            current_hp: 0,
            notes: "",
        };

        setSelectedPlayers([...selectedPlayers, newPlayer]);
        setCustomPlayerName("");
    };

    const handleAddCustomMonster = () => {
        if (!customMonsterName) return;

        // Create a temporary object with a unique negative ID
        const newMonster = {
            id: -(new Date().getTime()),
            name: customMonsterName,
            initiative: 0,
            current_hp: 0,
            ac: 0,
            notes: "",
            cr: "0",
            xp: 0,
        };

        setSelectedMonsters([...selectedMonsters, newMonster]);
        setCustomMonsterName("");
    };

    const handlePlayerSelect = (selectedOption) => {
        if (selectedOption) {
            const playerToAdd = availablePlayers.find(p => p.id === selectedOption.value);
            if (playerToAdd) {
                const newPlayer = {
                    ...playerToAdd,
                    initiative: playerToAdd.initiative || 0,
                    current_hp: playerToAdd.hp || 0,
                    notes: playerToAdd.notes || "",
                };
                setSelectedPlayers([...selectedPlayers, newPlayer]);
            }
        }
    };

    const handleMonsterSelect = (selectedOption) => {
        if (selectedOption) {
            const monsterToAdd = availableMonsters.find(m => m.id === selectedOption.value);
            if (monsterToAdd) {
                const newMonster = {
                    ...monsterToAdd,
                    initiative: monsterToAdd.initiative || 0,
                    current_hp: monsterToAdd.hp || 0,
                    ac: monsterToAdd.ac || 0,
                    notes: monsterToAdd.notes || "",
                };
                setSelectedMonsters([...selectedMonsters, newMonster]);
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
        const authToken = localStorage.getItem('access_token');

        if (!authToken) {
            alert("Authentication token not found. Please log in.");
            navigate("/login");
            return;
        }

        setIsSaving(true);

        try {
            const playerPayload = selectedPlayers.map(player => {
                // For both custom and existing players, use the 'name' field
                // if it exists, otherwise use 'character_name' or a default
                const playerName = player.name || player.character_name || "Unnamed Character";

                if (player.id > 0) { // Existing player
                    return {
                        player_character: player.id,
                        name: playerName, // Corrected line: Add the name
                        initiative: player.initiative,
                        current_hp: player.current_hp,
                        notes: player.notes,
                        ac: player.ac,
                    };
                } else { // Custom player
                    return {
                        name: playerName, // Corrected line: Use the determined name
                        player_character: null,
                        initiative: player.initiative,
                        current_hp: player.current_hp,
                        notes: player.notes,
                        ac: player.ac,
                    };
                }
            });

            const monsterPayload = selectedMonsters.map(monster => {
                // For both custom and existing monsters, use the 'name' field
                const monsterName = monster.name || "Unnamed Monster";

                if (monster.id > 0) { // Existing monster
                    return {
                        monster: monster.id,
                        name: monsterName, // Corrected line: Add the name
                        initiative: monster.initiative,
                        current_hp: monster.current_hp,
                        notes: monster.notes,
                        ac: monster.ac,
                    };
                } else { // Custom monster
                    return {
                        name: monsterName, // Corrected line: Use the determined name
                        monster: null,
                        initiative: monster.initiative,
                        current_hp: monster.current_hp,
                        notes: monster.notes,
                        ac: monster.ac,
                    };
                }
            });

            const payload = {
                name: encounterName,
                description: "",
                player_data: playerPayload,
                monster_data: monsterPayload,
            };

            const response = await fetch(`${apiBaseUrl}/encounters/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 401) {
                    throw new Error("Unauthorized. Your session may have expired. Please log in again.");
                } else {
                    throw new Error(`Failed to save encounter: ${response.status} ${response.statusText} - ${errorText}`);
                }
            }

            const newEncounter = await response.json();
            console.log("Saved Encounter:", newEncounter);

        } catch (error) {
            console.error("Failed to save encounter:", error);
            alert(`Failed to save encounter: ${error.message}`);
        } finally {
            setIsSaving(false);
            navigate("/dashboard/encounters");
            window.location.reload();
        }
    };

    const partyXpThresholds = calculatePartyXpThresholds(selectedPlayers);
    const totalMonsterXp = calculateMonsterXp(selectedMonsters);

    const playerOptions = availablePlayers
        .map(player => ({
            value: player.id,
            label: player.character_name,
        }));

    const monsterOptions = availableMonsters
        .map(monster => ({
            value: monster.id,
            label: monster.name,
        }));

    if (loading) return <p>Loading data...</p>;
    if (error) return <p style={{color: "red"}}>Error: {error}</p>;

    return (
        <div className="encounter-creator-container">
            {/* Input field for the encounter name without full width */}
            <input
                type="text"
                className="encounter-name-input"
                placeholder="Encounter Name"
                value={encounterName}
                onChange={(e) => setEncounterName(e.target.value)}
                style={{
                    fontSize: "2rem",
                    padding: "15px",
                    boxSizing: "border-box",
                    marginBottom: "20px",
                    textAlign: "center"
                }}
            />

            <div style={{
                display: "flex",
                gap: "40px",
                marginTop: "20px",
                justifyContent: "space-between",
                flexWrap: "wrap",
            }}>
                {/* Left Panel: Players */}
                <div style={{flex: "1 1 300px", minWidth: 0}}>
                    <h2>Player Characters</h2>
                    <hr/>
                    <div style={{display: "flex", alignItems: "center", marginBottom: "10px", marginTop: "10px"}}>
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
                            disabled={isSaving}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderLeft: "none",
                                borderRadius: "0 4px 4px 0",
                                cursor: "pointer",
                            }}
                        >
                            {isSaving ? "Adding..." : "Add"}
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
                                    <PlayerRow key={player.id} player={player} onUpdate={handlePlayerUpdate}
                                               onDelete={handlePlayerDelete}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{flex: "1 1 300px", minWidth: 0}}>
                    <h2>Enemies</h2>
                    <hr/>
                    <div style={{display: "flex", alignItems: "center", marginBottom: "10px", marginTop: "10px"}}>
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
                            disabled={isSaving}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderLeft: "none",
                                borderRadius: "0 4px 4px 0",
                                cursor: "pointer",
                            }}
                        >
                            {isSaving ? "Adding..." : "Add"}
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
                                    <MonsterRow key={monster.id} monster={monster} onUpdate={handleMonsterUpdate}
                                                onDelete={handleMonsterDelete}/>
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
                    onSave={handleSaveEncounter}
                    isSaving={isSaving}
                />
            </div>
        </div>
    );
}