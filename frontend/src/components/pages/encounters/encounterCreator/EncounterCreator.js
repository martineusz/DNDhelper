import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useEncounterData } from "./hooks/useEncounterData";
import {
  calculateMonsterXp,
  calculatePartyXpThresholds,
} from "./utils/EncounterCalculations";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Badge } from "../../../ui/badge";
import API from "../../../../api";
import { useDarkMode } from "../../../../context/DarkModeContext";

import knightIcon from "../../../../assets/knight-helmet.svg";
import dragon1Icon from "../../../../assets/dragon1.svg";
import signIcon from "../../../../assets/sign.svg";

function MonsterRow({ monster, onUpdate, onDelete, darkMode }) {
  const handleStatChange = (e) => {
    const { name, value } = e.target;
    onUpdate({
      ...monster,
      [name]: name === "cr" ? value : Number(value) || value,
    });
  };

  const handleNameChange = (e) => onUpdate({ ...monster, name: e.target.value });

  const cardClass = darkMode
    ? "bg-gray-800 border-green-700"
    : "bg-green-50 border-green-200";

  const inputClass = darkMode
    ? "bg-gray-700 text-gray-100 border-green-600 placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
    : "bg-green-100 text-gray-900 border-green-200";

  const labelClass = darkMode ? "text-gray-400" : "text-green-600";
  const deleteButtonClass = darkMode
    ? "text-red-400 hover:bg-red-900/20"
    : "text-red-500 hover:bg-red-50 hover:text-red-700";

  return (
    <Card className={`p-4 mb-2 shadow-sm ${cardClass}`}>
      <div className="flex justify-between items-center mb-2">
        <Input
          type="text"
          name="name"
          value={monster.name || ""}
          onChange={handleNameChange}
          className={`font-bold text-lg border-none p-0 focus-visible:ring-0 ${
            darkMode
              ? "bg-gray-800 text-gray-100 placeholder-gray-400"
              : "bg-transparent text-gray-900"
          }`}
        />
        <Button variant="ghost" size="sm" onClick={() => onDelete(monster.id)} className={deleteButtonClass}>
          Delete
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        {["cr", "hp", "ac"].map((field) => (
          <div key={field} className="flex flex-col">
            <Label className={`text-xs ${labelClass}`}>
              {field.toUpperCase()}
            </Label>
            <Input
              type={field === "cr" ? "text" : "number"}
              name={field}
              value={monster[field] || ""}
              onChange={handleStatChange}
              className={`border px-2 py-1 rounded ${inputClass}`}
            />
          </div>
        ))}
      </div>
      {monster.url && (
        <a
          href={monster.url}
          target="_blank"
          rel="noopener noreferrer"
          className={darkMode ? "text-green-400 hover:underline" : "text-green-600 hover:underline"}
        >
          Details
        </a>
      )}
    </Card>
  );
}

function PlayerRow({ player, onUpdate, onDelete, darkMode }) {
  const handleStatChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...player, [name]: Number(value) || value });
  };

  const handleNameChange = (e) => onUpdate({ ...player, name: e.target.value });

  const displayName = player.character_name || player.name || "Unnamed Character";

  const cardClass = darkMode
    ? "bg-gray-800 border-green-700"
    : "bg-green-50 border-green-200";

  const inputClass = darkMode
    ? "bg-gray-700 text-gray-100 border-green-600 placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
    : "bg-green-100 text-gray-900 border-green-200";

  const labelClass = darkMode ? "text-gray-400" : "text-green-600";

  const deleteButtonClass = darkMode
    ? "text-red-400 hover:bg-red-900/20"
    : "text-red-500 hover:bg-red-50 hover:text-red-700";

  return (
    <Card className={`p-4 mb-2 shadow-sm ${cardClass}`}>
      <div className="flex justify-between items-center mb-2">
        <Input
          type="text"
          value={displayName}
          onChange={handleNameChange}
          className={`font-bold text-lg border-none p-0 focus-visible:ring-0 ${
            darkMode
              ? "bg-gray-800 text-gray-100 placeholder-gray-400"
              : "bg-transparent text-gray-900"
          }`}
        />
        <Button variant="ghost" size="sm" onClick={() => onDelete(player.id)} className={deleteButtonClass}>
          Delete
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        {["character_level", "hp", "ac"].map((field) => (
          <div key={field} className="flex flex-col">
            <Label className={`text-xs ${labelClass}`}>
              {field === "character_level" ? "Level" : field.toUpperCase()}
            </Label>
            <Input
              type="number"
              name={field}
              value={player[field] || ""}
              onChange={handleStatChange}
              className={`border px-2 py-1 rounded ${inputClass}`}
            />
          </div>
        ))}
      </div>
      {player.url && (
        <a
          href={player.url}
          target="_blank"
          rel="noopener noreferrer"
          className={darkMode ? "text-green-400 hover:underline" : "text-green-600 hover:underline"}
        >
          Details
        </a>
      )}
    </Card>
  );
}

function EncounterSummary({
  totalPlayers,
  totalMonsters,
  totalMonsterXp,
  xpThresholds,
  onSave,
  isSaving,
  darkMode,
}) {
  const getDifficultyBadge = () => {
    if (totalMonsterXp < xpThresholds.easy)
      return {
        text: "TRIVIAL",
        variant: "outline",
        color: darkMode ? "text-gray-400" : "text-gray-500",
      };
    if (totalMonsterXp < xpThresholds.medium)
      return {
        text: "EASY",
        variant: "secondary",
        color: darkMode ? "text-green-400" : "text-green-600",
      };
    if (totalMonsterXp < xpThresholds.hard)
      return {
        text: "MEDIUM",
        variant: "default",
        color: darkMode ? "text-yellow-400" : "text-yellow-600",
      };
    if (totalMonsterXp < xpThresholds.deadly)
      return {
        text: "HARD",
        variant: "destructive",
        color: darkMode ? "text-orange-400" : "text-orange-600",
      };
    return {
      text: "DEADLY",
      variant: "destructive",
      color: darkMode ? "text-red-400" : "text-red-600",
    };
  };

  const difficulty = getDifficultyBadge();

  return (
    <Card
      className={`flex-1 w-full p-6 border shadow-md ${
        darkMode ? "bg-gray-800 border-green-700" : "bg-green-50 border-green-200"
      }`}
    >
      <CardHeader className="p-0 mb-4 flex items-center space-x-2">
        {signIcon && (
          <img
            src={signIcon}
            alt=""
            className={`h-12 w-12 ${darkMode ? "filter invert" : "filter-none"}`}
          />
        )}
        <CardTitle
          className={`text-xl font-bold ${
            darkMode ? "text-green-400" : "text-green-700"
          }`}
        >
          Encounter Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-green-700"
              }`}
            >
              Total Players:
            </span>
            <Badge
              variant="secondary"
              className={`font-medium ${
                darkMode ? "text-gray-100 bg-gray-700" : ""
              }`}
            >
              {totalPlayers}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-200" : "text-green-700"
              }`}
            >
              Total Monsters:
            </span>
            <Badge
              variant="secondary"
              className={`font-medium ${
                darkMode ? "text-gray-100 bg-gray-700" : ""
              }`}
            >
              {totalMonsters}
            </Badge>
          </div>
        </div>
        <hr className={darkMode ? "border-green-600" : "border-green-300"} />
        <div className="space-y-1">
          <h3
            className={`text-md font-semibold ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            Party XP Thresholds
          </h3>
          {["EASY", "MEDIUM", "HARD", "DEADLY"].map((level) => (
            <div key={level} className="flex justify-between items-center">
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}:
              </span>
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {xpThresholds[level.toLowerCase()]} XP
              </span>
            </div>
          ))}
        </div>
        <hr className={darkMode ? "border-green-600" : "border-green-300"} />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-100" : "text-green-700"
              }`}
            >
              Total Monster XP:
            </span>
            <Badge
              variant="secondary"
              className={`font-medium ${
                darkMode ? "text-gray-100 bg-gray-700" : ""
              }`}
            >
              {totalMonsterXp} XP
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`font-semibold ${
                darkMode ? "text-gray-100" : "text-green-700"
              }`}
            >
              Difficulty:
            </span>
            <Badge variant={difficulty.variant} className={`font-bold ${difficulty.color}`}>
              {difficulty.text}
            </Badge>
          </div>
        </div>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className={`w-full ${
            darkMode
              ? "bg-green-700 hover:bg-green-600 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          {isSaving ? "Saving..." : "Save Encounter"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function EncounterCreator() {
  const { darkMode } = useDarkMode();
  const { availablePlayers, availableMonsters, loading, error } =
    useEncounterData();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedMonsters, setSelectedMonsters] = useState([]);
  const [customPlayerName, setCustomPlayerName] = useState("");
  const [customMonsterName, setCustomMonsterName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [encounterName, setEncounterName] = useState("Encounter Name");
  const navigate = useNavigate();

  // --- HANDLERS ---
  const handleAddCustomPlayer = () => {
    if (!customPlayerName) return;
    const newPlayer = {
      id: -Date.now(),
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
      id: -Date.now(),
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

  const handlePlayerSelect = (opt) => {
    if (!opt) return;
    const playerToAdd = availablePlayers.find((p) => p.id === opt.value);
    if (!playerToAdd) return;
    setSelectedPlayers([
      ...selectedPlayers,
      {
        ...playerToAdd,
        initiative: playerToAdd.initiative || 0,
        current_hp: playerToAdd.hp || 0,
        notes: playerToAdd.notes || "",
      },
    ]);
  };

  const handleMonsterSelect = (opt) => {
    if (!opt) return;
    const monsterToAdd = availableMonsters.find((m) => m.id === opt.value);
    if (!monsterToAdd) return;
    setSelectedMonsters([
      ...selectedMonsters,
      {
        ...monsterToAdd,
        initiative: monsterToAdd.initiative || 0,
        current_hp: monsterToAdd.hp || 0,
        ac: monsterToAdd.ac || 0,
        notes: monsterToAdd.notes || "",
      },
    ]);
  };

  const handlePlayerUpdate = (updatedPlayer) =>
    setSelectedPlayers((prev) =>
      prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
  const handlePlayerDelete = (id) =>
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== id));
  const handleMonsterUpdate = (updatedMonster) =>
    setSelectedMonsters((prev) =>
      prev.map((m) => (m.id === updatedMonster.id ? updatedMonster : m))
    );
  const handleMonsterDelete = (id) =>
    setSelectedMonsters((prev) => prev.filter((m) => m.id !== id));

  const handleSaveEncounter = async () => {
    if (!localStorage.getItem("access_token")) {
      alert("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: encounterName,
        description: "",
        player_data: selectedPlayers.map((p) => ({
          player_character: p.id > 0 ? p.id : null,
          name: p.name || p.character_name || "Unnamed Character",
          initiative: p.initiative,
          current_hp: p.current_hp,
          notes: p.notes,
          ac: p.ac,
        })),
        monster_data: selectedMonsters.map((m) => ({
          monster: m.id > 0 ? m.id : null,
          name: m.name || "Unnamed Monster",
          initiative: m.initiative,
          current_hp: m.current_hp,
          notes: m.notes,
          ac: m.ac,
        })),
      };
      const response = await API.post("encounters/", payload);
      console.log("Saved Encounter:", response.data);
    } catch (err) {
      console.error("Failed to save encounter:", err);
      if (err.response?.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
      } else alert(`Failed to save encounter: ${err.message}`);
    } finally {
      setIsSaving(false);
      navigate("/dashboard/encounters");
      window.location.reload();
    }
  };

  const partyXpThresholds = calculatePartyXpThresholds(selectedPlayers);
  const totalMonsterXp = calculateMonsterXp(selectedMonsters);

  if (loading)
    return (
      <p className={`p-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        Loading data...
      </p>
    );
  if (error) return <p className="p-6 text-red-500 font-bold">Error: {error}</p>;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
      borderColor: state.isFocused ? (darkMode ? "#22c55e" : "#4ade80") : (darkMode ? "#374151" : "#e5e7eb"),
      boxShadow: state.isFocused ? `0 0 0 1px ${darkMode ? "#22c55e" : "#4ade80"}` : "none",
      "&:hover": {
        borderColor: state.isFocused ? (darkMode ? "#22c55e" : "#4ade80") : (darkMode ? "#4b5563" : "#d1d5db"),
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: darkMode ? "#1f2937" : "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? (darkMode ? "#374151" : "#e5e7eb") : darkMode ? "#1f2937" : "#fff",
      color: darkMode ? "#f3f4f6" : "#111827",
    }),
    singleValue: (base) => ({ ...base, color: darkMode ? "#f3f4f6" : "#111827" }),
    placeholder: (base) => ({ ...base, color: darkMode ? "#9ca3af" : "#6b7280" }),
    input: (base) => ({ ...base, color: darkMode ? "#f3f4f6" : "#111827" }),
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <Input
        type="text"
        className={`w-full text-center text-5xl sm:text-6xl font-extrabold mb-6 transition-colors duration-200
          ${
            darkMode
              ? "bg-gray-800 border border-green-700 text-green-400 focus:border-green-500 focus:bg-gray-800"
              : "bg-green-100 border border-green-200 text-green-900 focus:border-green-300 focus:bg-green-100"
          }
          focus:outline-none focus-visible:ring-0`}
        placeholder="New Encounter"
        value={encounterName}
        onChange={(e) => setEncounterName(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Players Panel */}
        <div className="space-y-4">
          <h2
            className={`text-xl font-semibold flex items-center space-x-2 ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            <img
              src={knightIcon}
              alt="Allies"
              className={`h-6 w-6 ${darkMode ? "filter invert" : "filter-none"}`}
            />{" "}
            <span>Allies</span>
          </h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Custom character name"
              value={customPlayerName}
              onChange={(e) => setCustomPlayerName(e.target.value)}
              className={`flex-grow ${
                darkMode ? "bg-gray-800 text-gray-100 border-green-700" : "bg-white text-gray-900 border-green-200"
              }`}
            />
            <Button
              onClick={handleAddCustomPlayer}
              disabled={isSaving}
              className={
                darkMode
                  ? "bg-green-700 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }
            >
              Add
            </Button>
          </div>
          <Select
            options={availablePlayers.map((p) => ({
              value: p.id,
              label: p.character_name,
            }))}
            onChange={handlePlayerSelect}
            placeholder="Add existing character..."
            value={null}
            isClearable
            styles={selectStyles}
          />
          <div className="space-y-2 max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${darkMode ? '#22c55e' : '#86efac'} transparent` }}>
            {selectedPlayers.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                onUpdate={handlePlayerUpdate}
                onDelete={handlePlayerDelete}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>

        {/* Monsters Panel */}
        <div className="space-y-4">
          <h2
            className={`text-xl font-semibold flex items-center space-x-2 ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            <img
              src={dragon1Icon}
              alt="Enemies"
              className={`h-6 w-6 ${darkMode ? "filter invert" : "filter-none"}`}
            />{" "}
            <span>Enemies</span>
          </h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Custom monster name"
              value={customMonsterName}
              onChange={(e) => setCustomMonsterName(e.target.value)}
              className={`flex-grow ${
                darkMode ? "bg-gray-800 text-gray-100 border-green-700" : "bg-white text-gray-900 border-green-200"
              }`}
            />
            <Button
              onClick={handleAddCustomMonster}
              disabled={isSaving}
              className={
                darkMode
                  ? "bg-green-700 hover:bg-green-600 text-white"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }
            >
              Add
            </Button>
          </div>
          <Select
            options={availableMonsters.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            onChange={handleMonsterSelect}
            placeholder="Add existing enemy..."
            value={null}
            isClearable
            styles={selectStyles}
          />
          <div className="space-y-2 max-h-[500px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${darkMode ? '#22c55e' : '#86efac'} transparent` }}>
            {selectedMonsters.map((m) => (
              <MonsterRow
                key={m.id}
                monster={m}
                onUpdate={handleMonsterUpdate}
                onDelete={handleMonsterDelete}
                darkMode={darkMode}
              />
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
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}