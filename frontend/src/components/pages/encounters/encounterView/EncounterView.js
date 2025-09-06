import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import API from "../../../../api";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Card } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { useDarkMode } from "../../../../context/DarkModeContext";
import { useEncounterData } from "../encounterCreator/hooks/useEncounterData";

// Import your icon assets
import dragonIcon from "../../../../assets/dragon2.svg";
import knightHelmetIcon from "../../../../assets/knight-helmet.svg";
import trashIcon from "../../../../assets/trash.svg";

function ParticipantRow({ participant, onUpdate, onDelete, darkMode }) {
  const handleInputChange = (field) => (e) =>
    onUpdate(participant.tempId, field, e.target.value);

  const cardClass = darkMode
    ? "flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-gray-900 border-gray-700 shadow-sm"
    : "flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 mb-2 bg-green-50 border border-green-200 shadow-sm";

  const inputClass = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-green-500 focus:border-green-500"
    : "bg-green-50 border-green-200";

  const labelClass = darkMode ? "text-green-200 text-xs" : "text-green-600 text-xs";

  const iconClass = darkMode ? "w-8 h-8 filter invert" : "w-8 h-8";

  return (
    <Card className={cardClass}>
      <div className="flex items-center justify-center p-2">
        {participant.type === "monster" && (
          <img src={dragonIcon} alt="Monster" className={iconClass} />
        )}
        {participant.type === "player" && (
          <img src={knightHelmetIcon} alt="Player" className={iconClass} />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 flex-grow">
        <div className="flex flex-col">
          <Label htmlFor={`initiative-${participant.tempId}`} className={labelClass}>
            Initiative
          </Label>
          <Input
            id={`initiative-${participant.tempId}`}
            type="number"
            value={participant.initiative || ""}
            placeholder="0"
            onChange={handleInputChange("initiative")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col col-span-1">
          <Label className={labelClass}>Name</Label>
          <Input
            type="text"
            value={participant.display_name}
            onChange={handleInputChange("display_name")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`hp-${participant.tempId}`} className={labelClass}>
            HP
          </Label>
          <Input
            id={`hp-${participant.tempId}`}
            type="number"
            value={participant.current_hp || ""}
            placeholder="HP"
            onChange={handleInputChange("current_hp")}
            className={`${inputClass} w-20`}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`ac-${participant.tempId}`} className={labelClass}>
            AC
          </Label>
          <Input
            id={`ac-${participant.tempId}`}
            type="number"
            value={participant.ac || ""}
            placeholder="AC"
            onChange={handleInputChange("ac")}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor={`notes-${participant.tempId}`} className={labelClass}>
            Notes
          </Label>
          <Input
            id={`notes-${participant.tempId}`}
            type="text"
            value={participant.notes || ""}
            placeholder="Notes"
            onChange={handleInputChange("notes")}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex items-center justify-end md:ml-4 mt-2 md:mt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`${
            darkMode
              ? "ml-1 shrink-0 bg-green-700 hover:bg-green-600 border-green-700"
              : "ml-1 shrink-0 bg-green-900 hover:bg-green-800 border-green-950"
          } mr-2`}
          onClick={() => onDelete(participant.tempId)}
        >
          <img src={trashIcon} alt="Delete" className="w-4 h-4 filter invert" />
        </Button>
      </div>
    </Card>
  );
}

export default function EncounterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { availablePlayers, availableMonsters, loading: dataLoading, error: dataError } = useEncounterData();

  const [encounter, setEncounter] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [customPlayerName, setCustomPlayerName] = useState("");
  const [customMonsterName, setCustomMonsterName] = useState("");

  useEffect(() => {
    const fetchEncounter = async () => {
      try {
        const response = await API.get(`encounters/${id}/`);
        const fetchedEncounter = response.data;
        setEncounter(fetchedEncounter);
        setEditableName(fetchedEncounter.name);

        const combinedParticipants = [
          ...fetchedEncounter.player_data.map((p, index) => ({
            ...p,
            type: "player",
            display_name: p.player_character?.character_name || p.name,
            original_id: p.player_character?.id,
            tempId: `player-${p.id || index}`,
          })),
          ...fetchedEncounter.monster_data.map((m, index) => ({
            ...m,
            type: "monster",
            display_name: m.monster?.name || m.name,
            ac: m.ac,
            original_id: m.monster?.id,
            tempId: `monster-${m.id || index}`,
          })),
        ];
        setParticipants(combinedParticipants);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEncounter();
  }, [id]);

  const handleAddCustomPlayer = () => {
    if (!customPlayerName) return;
    setParticipants([...participants, {
      type: "player",
      display_name: customPlayerName,
      initiative: null,
      current_hp: null,
      ac: null,
      notes: "",
      tempId: `new-player-${Date.now()}`,
    }]);
    setCustomPlayerName("");
  };

  const handleAddCustomMonster = () => {
    if (!customMonsterName) return;
    setParticipants([...participants, {
      type: "monster",
      display_name: customMonsterName,
      initiative: null,
      current_hp: null,
      ac: null,
      notes: "",
      tempId: `new-monster-${Date.now()}`,
    }]);
    setCustomMonsterName("");
  };

  const handlePlayerSelect = (opt) => {
    if (!opt) return;
    const playerToAdd = availablePlayers.find((p) => p.id === opt.value);
    if (!playerToAdd) return;
    setParticipants([
      ...participants,
      {
        type: "player",
        display_name: playerToAdd.character_name || playerToAdd.name,
        initiative: playerToAdd.initiative || 0,
        current_hp: playerToAdd.hp || 0,
        ac: playerToAdd.ac || 0,
        notes: playerToAdd.notes || "",
        original_id: playerToAdd.id,
        tempId: `player-${Date.now()}`,
      },
    ]);
  };

  const handleMonsterSelect = (opt) => {
    if (!opt) return;
    const monsterToAdd = availableMonsters.find((m) => m.id === opt.value);
    if (!monsterToAdd) return;
    setParticipants([
      ...participants,
      {
        type: "monster",
        display_name: monsterToAdd.name,
        initiative: monsterToAdd.initiative || 0,
        current_hp: monsterToAdd.hp || 0,
        ac: monsterToAdd.ac || 0,
        notes: monsterToAdd.notes || "",
        original_id: monsterToAdd.id,
        tempId: `monster-${Date.now()}`,
      },
    ]);
  };

  const handleUpdateParticipant = (tempId, field, value) => {
    setParticipants((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    );
  };

  const handleNameChange = (e) => setEditableName(e.target.value);

  const handleDeleteParticipant = async (tempId) => {
    const participantToDelete = participants.find((p) => p.tempId === tempId);
    if (!participantToDelete || !participantToDelete.id) {
      setParticipants((prev) => prev.filter((p) => p.tempId !== tempId));
      return;
    }

    const endpoint =
      participantToDelete.type === "player"
        ? `encounters/player_data/${participantToDelete.id}/`
        : `encounters/monster_data/${participantToDelete.id}/`;

    try {
      await API.delete(endpoint);
      setParticipants((prev) => prev.filter((p) => p.tempId !== tempId));
    } catch (err) {
      console.error("Failed to delete participant:", err);
    }
  };

  const handleSaveEncounter = async () => {
    setIsSaving(true);
    try {
      const playerPayload = participants
        .filter((p) => p.type === "player")
        .map((p) => ({
          id: p.id,
          player_character_id: p.original_id || null,
          name: p.display_name,
          initiative: p.initiative,
          current_hp: p.current_hp,
          notes: p.notes,
          ac: p.ac,
        }));

      const monsterPayload = participants
        .filter((p) => p.type === "monster")
        .map((p) => ({
          id: p.id,
          monster_id: p.original_id || null,
          name: p.display_name,
          initiative: p.initiative,
          current_hp: p.current_hp,
          notes: p.notes,
          ac: p.ac,
        }));

      const payload = {
        name: editableName,
        description: encounter.description,
        player_data: playerPayload,
        monster_data: monsterPayload,
      };

      await API.put(`encounters/${id}/`, payload);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sortedParticipants = [...participants].sort(
    (a, b) => (b.initiative || 0) - (a.initiative || 0)
  );

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

  if (loading || dataLoading) return <p className="p-6 text-gray-700">Loading encounter...</p>;
  if (error || dataError) return <p className="p-6 text-red-500 font-bold">Error: {error || dataError}</p>;
  if (!encounter) return <p className="p-6 text-gray-700">Encounter not found.</p>;

  return (
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-950" : "bg-green-50"
      }`}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className={`${
              darkMode
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            &larr; Back
          </Button>
          <div className="text-center flex-grow">
            <Input
              type="text"
              value={editableName}
              onChange={handleNameChange}
              className={`text-2xl font-bold text-center mb-1 border-none bg-transparent focus-visible:ring-0 ${
                darkMode ? "text-gray-100" : "text-green-700"
              }`}
            />
            <p
              className={`${
                darkMode ? "text-gray-300" : "text-green-600"
              } text-sm`}
            >
              {encounter.description}
            </p>
          </div>
          <Button
            onClick={handleSaveEncounter}
            disabled={isSaving}
            className={`${
              darkMode
                ? "bg-green-900 hover:bg-green-800 text-white"
                : "bg-green-700 hover:bg-green-600 text-white"
            }`}
          >
            {isSaving ? "Saving..." : "Save Encounter"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold flex items-center space-x-2 ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              <img
                src={knightHelmetIcon}
                alt="Allies"
                className={`h-6 w-6 ${darkMode ? "filter invert" : "filter-none"}`}
              />{" "}
              <span>Add Allies</span>
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
          </div>
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold flex items-center space-x-2 ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              <img
                src={dragonIcon}
                alt="Enemies"
                className={`h-6 w-6 ${darkMode ? "filter invert" : "filter-none"}`}
              />{" "}
              <span>Add Enemies</span>
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
          </div>
        </div>
      </div>

      <div
        className={`rounded-md border ${
          darkMode ? "border-green-700" : "border-green-200"
        }`}
      >
        <div
          className={`hidden md:grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 p-2 font-semibold ${
            darkMode
              ? "bg-gray-800 text-gray-100"
              : "bg-green-100 text-green-700"
          }`}
        >
          <div className="text-center"></div>
          <div>Initiative</div>
          <div className="col-span-1">Name</div>
          <div>HP</div>
          <div>AC</div>
          <div>Notes</div>
        </div>
        {sortedParticipants.map((p) => (
          <ParticipantRow
            key={p.tempId}
            participant={p}
            onUpdate={handleUpdateParticipant}
            onDelete={handleDeleteParticipant}
            darkMode={darkMode}
          />
        ))}
      </div>
    </div>
  );
}