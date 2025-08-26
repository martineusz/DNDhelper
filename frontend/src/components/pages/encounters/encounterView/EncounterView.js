// EncounterView.jsx (updated)
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import API from "../../../../api";
import "./EncounterView.css";

// A component for a single participant row, handling its own state for damage input
function ParticipantRow({participant, onUpdate, onDamage, onDetails}) {
    const [damageTaken, setDamageTaken] = useState("");

    const handleDamageChange = (e) => {
        setDamageTaken(e.target.value);
    };

    const handleSubtractDamage = () => {
        onDamage(participant.tempId, parseInt(damageTaken, 10) || 0);
        setDamageTaken("");
    };

    const handleInputChange = (field) => (e) => {
        onUpdate(participant.tempId, field, e.target.value);
    };

    return (
        <div className="participant-row">
            <input
                type="number"
                value={participant.initiative || ""}
                placeholder="0"
                onChange={handleInputChange("initiative")}
            />
            <div className="participant-name">
                <span>{participant.display_name}</span>
            </div>
            <div className="hp-section">
                <input
                    type="number"
                    value={participant.current_hp || ""}
                    placeholder="HP"
                    onChange={handleInputChange("current_hp")}
                />
                <div className="damage-input">
                    <input
                        type="number"
                        value={damageTaken}
                        placeholder="Damage"
                        onChange={handleDamageChange}
                    />
                    <button className="damage-button" onClick={handleSubtractDamage}>
                        - HP
                    </button>
                </div>
            </div>
            <input
                type="number"
                value={participant.ac || ""}
                placeholder="AC"
                onChange={handleInputChange("ac")}
            />
            <input
                type="text"
                value={participant.notes || ""}
                placeholder="Notes"
                onChange={handleInputChange("notes")}
            />
            <button
                className="details-button"
                onClick={() => onDetails(participant)}
                disabled={!participant.original_id}
            >
                Details
            </button>
        </div>
    );
}

// The main Encounter View component
export default function EncounterView() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [encounter, setEncounter] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // Add saving state

    useEffect(() => {
        const fetchEncounter = async () => {
            try {
                const response = await API.get(`encounters/${id}/`);
                const fetchedEncounter = response.data;
                setEncounter(fetchedEncounter);

                // Combine and map participants with temporary IDs
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

    const handleUpdateParticipant = (tempId, field, value) => {
        setParticipants((prev) =>
            prev.map((p) => (p.tempId === tempId ? {...p, [field]: value} : p))
        );
    };

    const handleDamage = (tempId, damage) => {
        setParticipants((prev) =>
            prev.map((p) => {
                if (p.tempId === tempId) {
                    const newHp = Math.max(0, (parseInt(p.current_hp, 10) || 0) - damage);
                    return {...p, current_hp: newHp};
                }
                return p;
            })
        );
    };

    const handleDetailsClick = (participant) => {
        if (participant.type === "player" && participant.original_id) {
            navigate(`/dashboard/players/${participant.original_id}`);
        } else if (participant.type === "monster" && participant.original_id) {
            navigate(`/dashboard/compendium/${participant.original_id}`);
        }
    };

    // New function to handle saving the encounter
    const handleSaveEncounter = async () => {
        setIsSaving(true);
        try {
            const playerPayload = participants
                .filter((p) => p.type === "player")
                .map((p) => ({
                    // Include the ID of the PlayerEncounterData record
                    id: p.id,
                    // Use the write field for consistency
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
                    // Include the ID of the MonsterEncounterData record
                    id: p.id,
                    // Use the write field for consistency
                    monster_id: p.original_id || null,
                    name: p.display_name,
                    initiative: p.initiative,
                    current_hp: p.current_hp,
                    notes: p.notes,
                    ac: p.ac,
                }));

            const payload = {
                name: encounter.name,
                description: encounter.description,
                player_data: playerPayload,
                monster_data: monsterPayload,
            };

            await API.put(`encounters/${id}/`, payload);
            alert("Encounter saved successfully!");
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
            alert(`Failed to save encounter: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const sortedParticipants = [...participants].sort((a, b) => {
        return (b.initiative || 0) - (a.initiative || 0);
    });

    if (loading) return <p>Loading encounter...</p>;
    if (error)
        return <p style={{color: "red"}}>Error: {error}</p>;
    if (!encounter) return <p>Encounter not found.</p>;

    return (
        <div className="encounter-view-container">
            <div className="header-section">
                <button onClick={() => navigate(-1)} className="back-button">
                    &larr; Back
                </button>
                <h1>{encounter.name}</h1>
                <button
                    onClick={handleSaveEncounter}
                    className="save-button"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Encounter"}
                </button>
            </div>
            <p className="description-text">{encounter.description}</p>

            <div className="participant-list-container">
                <div className="participant-header">
                    <span>Initiative</span>
                    <span>Name</span>
                    <span>Current HP</span>
                    <span>AC</span>
                    <span>Notes</span>
                    <span>Details</span>
                </div>
                {sortedParticipants.map((p) => (
                    <ParticipantRow
                        key={p.tempId}
                        participant={p}
                        onUpdate={handleUpdateParticipant}
                        onDamage={handleDamage}
                        onDetails={handleDetailsClick}
                    />
                ))}
            </div>
        </div>
    );
}