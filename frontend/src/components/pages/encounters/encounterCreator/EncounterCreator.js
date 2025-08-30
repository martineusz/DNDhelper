import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import Select from "react-select";
import {useEncounterData} from "./hooks/useEncounterData";
import {calculateMonsterXp, calculatePartyXpThresholds} from "./utils/EncounterCalculations";
import {Input} from "../../../ui/input";
import {Button} from "../../../ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "../../../ui/card";
import {Label} from "../../../ui/label";
import {Badge} from "../../../ui/badge";
import API from "../../../../api";


// MonsterRow component refactored to use shadcn/ui
function MonsterRow({monster, onUpdate, onDelete}) {
    const handleStatChange = (e) => {
        const {name, value} = e.target;
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
        <Card className="p-4 mb-2 shadow-sm bg-gray-50 border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <Input
                    type="text"
                    name="name"
                    value={monster.name || ''}
                    onChange={handleNameChange}
                    className="font-bold text-lg border-none bg-transparent p-0 focus-visible:ring-0"
                />
                <Button variant="ghost" size="sm" onClick={() => onDelete(monster.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700">
                    Delete
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">CR</Label>
                    <Input type="text" name="cr" value={monster.cr || ''} onChange={handleStatChange}
                           className="bg-gray-100 border-gray-200"/>
                </div>
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">HP</Label>
                    <Input type="number" name="current_hp" value={monster.current_hp || ''} onChange={handleStatChange}
                           className="bg-gray-100 border-gray-200"/>
                </div>
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">AC</Label>
                    <Input type="number" name="ac" value={monster.ac || ''} onChange={handleStatChange}
                           className="bg-gray-100 border-gray-200"/>
                </div>
            </div>
            {monster.url && (
                <a href={monster.url} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-blue-500 hover:underline">
                    Details
                </a>
            )}
        </Card>
    );
}

// PlayerRow component refactored to use shadcn/ui
function PlayerRow({player, onUpdate, onDelete}) {
    const handleStatChange = (e) => {
        const {name, value} = e.target;
        onUpdate({
            ...player,
            [name]: Number(value) || value,
        });
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        onUpdate({
            ...player,
            name: value,
        });
    };

    const nameToDisplay = player.character_name || player.name || "Unnamed Character";

    return (
        <Card className="p-4 mb-2 shadow-sm bg-gray-50 border-gray-200">
            <div className="flex justify-between items-center mb-2">
                <Input
                    type="text"
                    value={nameToDisplay}
                    onChange={handleNameChange}
                    className="font-bold text-lg border-none bg-transparent p-0 focus-visible:ring-0"
                />
                <Button variant="ghost" size="sm" onClick={() => onDelete(player.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700">
                    Delete
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">Level</Label>
                    <Input type="number" name="character_level" value={player.character_level || ''}
                           onChange={handleStatChange} className="bg-gray-100 border-gray-200"/>
                </div>
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">HP</Label>
                    <Input type="number" name="current_hp" value={player.current_hp || ''} onChange={handleStatChange}
                           className="bg-gray-100 border-gray-200"/>
                </div>
                <div className="flex flex-col">
                    <Label className="text-xs text-gray-500">AC</Label>
                    <Input type="number" name="ac" value={player.ac || ''} onChange={handleStatChange}
                           className="bg-gray-100 border-gray-200"/>
                </div>
            </div>
            {player.url && (
                <a href={player.url} target="_blank" rel="noopener noreferrer"
                   className="text-sm text-blue-500 hover:underline">
                    Details
                </a>
            )}
        </Card>
    );
}

// EncounterSummary component refactored to use shadcn/ui
function EncounterSummary({
                              totalPlayers,
                              totalMonsters,
                              totalMonsterXp,
                              xpThresholds,
                              onSave,
                              isSaving
                          }) {
    const getDifficultyBadge = () => {
        if (totalMonsterXp < xpThresholds.easy) return {text: "Trivial", variant: "outline", color: "text-gray-500"};
        if (totalMonsterXp < xpThresholds.medium) return {text: "Easy", variant: "secondary", color: "text-green-600"};
        if (totalMonsterXp < xpThresholds.hard) return {text: "Medium", variant: "default", color: "text-yellow-600"};
        if (totalMonsterXp < xpThresholds.deadly) return {
            text: "Hard",
            variant: "destructive",
            color: "text-orange-600"
        };
        return {text: "Deadly", variant: "destructive", color: "text-red-600"};
    };

    const difficulty = getDifficultyBadge();

    return (
        <Card className="flex-1 w-full p-6 bg-green-50 border-green-200 shadow-md">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-green-700">Encounter Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total Players:</span>
                        <Badge variant="secondary">{totalPlayers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total Monsters:</span>
                        <Badge variant="secondary">{totalMonsters}</Badge>
                    </div>
                </div>
                <hr className="border-green-300"/>
                <div className="space-y-1">
                    <h3 className="text-md font-semibold text-green-700">Party XP Thresholds</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Easy:</span>
                        <span className="text-sm font-medium text-gray-800">{xpThresholds.easy} XP</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Medium:</span>
                        <span className="text-sm font-medium text-gray-800">{xpThresholds.medium} XP</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Hard:</span>
                        <span className="text-sm font-medium text-gray-800">{xpThresholds.hard} XP</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Deadly:</span>
                        <span className="text-sm font-medium text-gray-800">{xpThresholds.deadly} XP</span>
                    </div>
                </div>
                <hr className="border-green-300"/>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-700">Total Monster XP:</span>
                        <Badge variant="secondary" className="font-medium">{totalMonsterXp} XP</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-700">Difficulty:</span>
                        <Badge variant={difficulty.variant}
                               className={`font-bold ${difficulty.color}`}>{difficulty.text}</Badge>
                    </div>
                </div>
                <Button onClick={onSave} disabled={isSaving}
                        className="w-full bg-green-700 hover:bg-green-600 text-white">
                    {isSaving ? "Saving..." : "Save Encounter"}
                </Button>
            </CardContent>
        </Card>
    );
}

// Main component
export default function EncounterCreator() {
    const {availablePlayers, availableMonsters, loading, error, refreshData} = useEncounterData();
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedMonsters, setSelectedMonsters] = useState([]);
    const [customPlayerName, setCustomPlayerName] = useState("");
    const [customMonsterName, setCustomMonsterName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [encounterName, setEncounterName] = useState("Encounter Name");

    const navigate = useNavigate();

    const handleAddCustomPlayer = () => {
        if (!customPlayerName) return;
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
        if (!localStorage.getItem('access_token')) {
            alert("Authentication token not found. Please log in.");
            navigate("/login");
            return;
        }

        setIsSaving(true);

        try {
            const playerPayload = selectedPlayers.map(player => {
                const playerName = player.name || player.character_name || "Unnamed Character";
                return {
                    player_character: player.id > 0 ? player.id : null,
                    name: playerName,
                    initiative: player.initiative,
                    current_hp: player.current_hp,
                    notes: player.notes,
                    ac: player.ac,
                };
            });

            const monsterPayload = selectedMonsters.map(monster => {
                const monsterName = monster.name || "Unnamed Monster";
                return {
                    monster: monster.id > 0 ? monster.id : null,
                    name: monsterName,
                    initiative: monster.initiative,
                    current_hp: monster.current_hp,
                    notes: monster.notes,
                    ac: monster.ac,
                };
            });

            const payload = {
                name: encounterName,
                description: "",
                player_data: playerPayload,
                monster_data: monsterPayload,
            };

            // Use axios API module
            const response = await API.post("encounters/", payload);

            console.log("Saved Encounter:", response.data);

        } catch (error) {
            console.error("Failed to save encounter:", error);
            if (error.response?.status === 401) {
                alert("Unauthorized. Your session may have expired. Please log in again.");
                navigate("/login");
            } else {
                alert(`Failed to save encounter: ${error.message}`);
            }
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

    if (loading) return <p className="p-6 text-gray-700">Loading data...</p>;
    if (error) return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Input
                type="text"
                className="w-full text-center text-5xl font-extrabold bg-transparent border-none focus:outline-none focus-visible:ring-0 mb-6 text-green-900"
                placeholder="Encounter Name"
                value={encounterName}
                onChange={(e) => setEncounterName(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Players Panel */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Player Characters</h2>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Custom character name"
                            value={customPlayerName}
                            onChange={(e) => setCustomPlayerName(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleAddCustomPlayer} disabled={isSaving} variant="outline">
                            Add
                        </Button>
                    </div>
                    <Select
                        options={playerOptions}
                        onChange={handlePlayerSelect}
                        placeholder="Search and add a character..."
                        value={null}
                        isClearable={true}
                    />
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {selectedPlayers.map((player) => (
                            <PlayerRow key={player.id} player={player} onUpdate={handlePlayerUpdate}
                                       onDelete={handlePlayerDelete}/>
                        ))}
                    </div>
                </div>

                {/* Monsters Panel */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Enemies</h2>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Custom monster name"
                            value={customMonsterName}
                            onChange={(e) => setCustomMonsterName(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleAddCustomMonster} disabled={isSaving} variant="outline">
                            Add
                        </Button>
                    </div>
                    <Select
                        options={monsterOptions}
                        onChange={handleMonsterSelect}
                        placeholder="Search and add an enemy..."
                        value={null}
                        isClearable={true}
                    />
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {selectedMonsters.map((monster) => (
                            <MonsterRow key={monster.id} monster={monster} onUpdate={handleMonsterUpdate}
                                        onDelete={handleMonsterDelete}/>
                        ))}
                    </div>
                </div>

                {/* Encounter Summary Panel */}
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