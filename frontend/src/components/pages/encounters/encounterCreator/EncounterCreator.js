import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import PlayerRow from "./PlayerRow";
import MonsterRow from "./MonsterRow";
import EncounterSummary from "./EncounterSummary";
import {useEncounterData} from "./hooks/useEncounterData";
import {calculateMonsterXp, calculatePartyXpThresholds} from "./utils/EncounterCalculations";
import "./EncounterCreator.css";

// This import assumes your api.js is located four directories up.
// Adjust the path if your file structure is different.
import API from "../../../../api";

export default function EncounterCreator() {
    const {availablePlayers, availableMonsters, loading, error, refreshData} = useEncounterData();
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [customPlayerName, setCustomPlayerName] = useState("");
    const [customMonsterName, setCustomMonsterName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isCreatingCustom, setIsCreatingCustom] = useState(false);

    const navigate = useNavigate();

    const handleAddCustomPlayer = async () => {
        if (!customPlayerName) return;

        setIsCreatingCustom(true);
        try {
            // Step 1: Create the new PlayerCharacter in the database
            const response = await API.post("/characters/", {
                character_name: customPlayerName,
                // Add any other required fields for a new character
            });
            const newPlayer = response.data;

            // Step 2: Add the newly created character (with a real ID) to the selected list
            setSelectedPlayers([...selectedPlayers, newPlayer]);
            setCustomPlayerName("");
            // Refresh the available players list
            refreshData();
            alert(`New character "${newPlayer.character_name}" created and added!`);
        } catch (error) {
            console.error("Failed to create custom player:", error);
            alert("Failed to create custom player.");
        } finally {
            setIsCreatingCustom(false);
        }
    };

    const handleAddCustomMonster = async () => {
        if (!customMonsterName) return;

        setIsCreatingCustom(true);
        try {
            // Step 1: Create the new Monster in the database
            const response = await API.post("/monsters/", {
                name: customMonsterName,
                // Add any other required fields for a new monster
                cr: "0",
                hp: 0,
                ac: 0,
            });
            const newMonster = response.data;

            // Step 2: Add the newly created monster (with a real ID) to the selected list
            setSelectedMonsters([...selectedMonsters, newMonster]);
            setCustomMonsterName("");
            // Refresh the available monsters list
            refreshData();
            alert(`New monster "${newMonster.name}" created and added!`);
        } catch (error) {
            console.error("Failed to create custom monster:", error);
            alert("Failed to create custom monster.");
        } finally {
            setIsCreatingCustom(false);
        }
    };

    const handlePlayerSelect = (selectedOption) => {
        if (selectedOption) {
            const playerToAdd = availablePlayers.find(p => p.id === selectedOption.value);
            if (playerToAdd) {
                // Add the existing player object directly
                setSelectedPlayers([...selectedPlayers, playerToAdd]);
            }
        }
    };

    const handleMonsterSelect = (selectedOption) => {
        if (selectedOption) {
            const monsterToAdd = availableMonsters.find(m => m.id === selectedOption.value);
            if (monsterToAdd) {
                // Add the existing monster object directly
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
        // FIX: Change `Token` to `Bearer` to match the backend's JWT configuration
        const authToken = localStorage.getItem('access_token');

        if (!authToken) {
            alert("Authentication token not found. Please log in.");
            navigate("/login");
            return;
        }

        setIsSaving(true);

        try {
            const playerPayload = selectedPlayers.map(player => ({
                player_character: player.id,
                initiative: player.initiative,
                current_hp: player.current_hp,
                notes: player.notes,
            }));

            const monsterPayload = selectedMonsters.map(monster => ({
                monster: monster.id,
                initiative: monster.initiative,
                current_hp: monster.current_hp,
                notes: monster.notes,
            }));

            const payload = {
                name: "My Encounter",
                description: "",
                player_data: playerPayload,
                monster_data: monsterPayload,
            };

            const response = await fetch(`${apiBaseUrl}/encounters/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // FIX IS HERE: Change the prefix from 'Token' to 'Bearer'
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
            alert(`Encounter "${newEncounter.name}" saved successfully!`);
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
            <h1>Encounter Creator</h1>

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
                            disabled={isCreatingCustom}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderLeft: "none",
                                borderRadius: "0 4px 4px 0",
                                cursor: "pointer",
                            }}
                        >
                            {isCreatingCustom ? "Creating..." : "Add"}
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
                            disabled={isCreatingCustom}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderLeft: "none",
                                borderRadius: "0 4px 4px 0",
                                cursor: "pointer",
                            }}
                        >
                            {isCreatingCustom ? "Creating..." : "Add"}
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