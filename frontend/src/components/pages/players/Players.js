import React, {useEffect, useState} from "react";
import API from "../../../api";

// Reusable component for a single player character card.
function PlayerCard({player, onCardClick}) {
    const displayValue = (val) => {
        if (val === null || val === undefined || val === "") return "-";
        return val;
    };

    return (
        <div
            onClick={() => onCardClick(player)}
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <h3>{displayValue(player.character_name)}</h3>
            <p>
                <strong>Player:</strong> {displayValue(player.player_name)}
            </p>
            <p>
                <strong>Level:</strong> {displayValue(player.character_level)}
            </p>
            <p>
                <strong>AC:</strong> {displayValue(player.ac)}
            </p>
            <p>
                <strong>Class:</strong> {displayValue(player.character_class)}
            </p>
            <p>
                <strong>Race:</strong> {displayValue(player.character_race)}
            </p>
            <p>
                <strong>Info:</strong>{" "}
                {player.info ? player.info.substring(0, 50) + "..." : "-"}
            </p>
        </div>
    );
}

// New component for the "add" button
function AddPlayerCard({onCardClick}) {
    return (
        <div
            onClick={onCardClick}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                fontSize: "4rem",
                color: "#ccc",
                minHeight: "150px", // Consistent with other cards
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            +
        </div>
    );
}

// Modal component to display and edit/create character information.
function CharacterDetailModal({player, onClose, onSave}) {
    const [editablePlayer, setEditablePlayer] = useState(player || {});
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditablePlayer({...editablePlayer, [name]: value});
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        await onSave(editablePlayer);
        setIsSaving(false);
        onClose();
    };

    const modalBackdropStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
        width: "90%",
        position: "relative",
    };

    const scrollableContentStyle = {
        maxHeight: "70vh",
        overflowY: "auto",
        paddingRight: "10px",
    };

    const closeButtonStyle = {
        position: "absolute",
        top: "10px",
        right: "10px",
        border: "none",
        background: "transparent",
        fontSize: "24px",
        cursor: "pointer",
    };

    const inputStyle = {
        width: "100%",
        padding: "8px",
        margin: "5px 0 15px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
    };

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose}>
                    &times;
                </button>
                <h2>
                    {player && player.id ? `Edit ${player.character_name}` : "Create New Character"}
                </h2>
                <div style={scrollableContentStyle}>
                    <label>
                        <strong>Character's name:</strong>
                        <input
                            type="text"
                            name="character_name"
                            value={editablePlayer.character_name || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Player:</strong>
                        <input
                            type="text"
                            name="player_name"
                            value={editablePlayer.player_name || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Level:</strong>
                        <input
                            type="number"
                            name="character_level"
                            value={editablePlayer.character_level || 1}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>

                    <label>
                        <strong>Experience:</strong>
                        <input
                            type="number"
                            name="character_experience"
                            value={editablePlayer.character_experience || 0}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>

                    <label>
                        <strong>Class:</strong>
                        <input
                            type="text"
                            name="character_class"
                            value={editablePlayer.character_class || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Subclass:</strong>
                        <input
                            type="text"
                            name="character_subclass"
                            value={editablePlayer.character_subclass || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Race:</strong>
                        <input
                            type="text"
                            name="character_race"
                            value={editablePlayer.character_race || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Subrace:</strong>
                        <input
                            type="text"
                            name="character_subrace"
                            value={editablePlayer.character_subrace || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Armor Class (AC):</strong>
                        <input
                            type="number"
                            name="ac"
                            value={editablePlayer.ac || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Hit Points (HP):</strong>
                        <input
                            type="number"
                            name="hp"
                            value={editablePlayer.hp || ""}
                            onChange={handleInputChange}
                            style={inputStyle}
                        />
                    </label>
                    <label>
                        <strong>Info:</strong>
                        <textarea
                            name="info"
                            value={editablePlayer.info || ""}
                            onChange={handleInputChange}
                            rows="4"
                            style={{...inputStyle, resize: "vertical"}}
                        />
                    </label>
                </div>

                <button
                    onClick={handleSaveClick}
                    disabled={isSaving}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}

// This is the main component that should be exported.
export default function Players() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null); // New state for save errors
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const token = localStorage.getItem("access_token");

    async function fetchPlayers() {
        try {
            setLoading(true);
            const response = await API.get("characters/");  // 👈 axios handles token + refresh
            setPlayers(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (updatedCharacter) => {
        try {
            const url = updatedCharacter.id
                ? `characters/${updatedCharacter.id}/`
                : "characters/";
            const method = updatedCharacter.id ? "patch" : "post";

            const response = await API[method](url, updatedCharacter);

            setSaveError(null);
            await fetchPlayers(); // refresh list
        } catch (err) {
            setSaveError(err.response?.data?.detail || err.message);
        }
    };

    useEffect(() => {
        if (!token) {
            setError("No authentication token found. Please log in.");
            setLoading(false);
            return;
        }
        fetchPlayers();
    }, [token]);

    if (loading) return <p>Loading players...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{padding: "20px"}}>
            <h1>Player Roster</h1>
            <p>Click on a character card to view and edit their details, or add a new one.</p>
            {saveError && (
                <p style={{color: "red", fontWeight: "bold"}}>
                    Error saving: {saveError}
                </p>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {players.map((player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        onCardClick={setSelectedPlayer}
                    />
                ))}
                <AddPlayerCard onCardClick={() => setSelectedPlayer({})}/>
            </div>

            {selectedPlayer && (
                <CharacterDetailModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}