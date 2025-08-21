import React, {useEffect, useState} from "react";

// Reusable component for displaying a single player character card
function PlayerCard({player}) {
    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
            }}
        >
            <h3>{player.character_name}</h3>
            <p>
                <strong>Player:</strong> {player.player_name}
            </p>
            <p>
                <strong>AC:</strong> {player.ac ?? "N/A"}
            </p>
            <p>
                <strong>Class:</strong> {player.character_class}
            </p>
            <p>
                <strong>Race:</strong> {player.character_race}
            </p>
            {player.info && (
                <p>
                    <strong>Info:</strong> {player.info}
                </p>
            )}
        </div>
    );
}

export default function Players() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (!token) return; // optional: redirect to login

        async function fetchPlayers() {
            try {
                const response = await fetch("http://localhost:8000/api/characters/", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    throw new Error("Unauthorized: token invalid or expired");
                }

                const data = await response.json();
                setPlayers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, [token]);


    if (loading) return <p>Loading players...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{padding: "20px"}}>
            <h1>Player Roster</h1>
            <p>Browse all available player characters.</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                    marginTop: "20px",
                }}
            >
                {players.map((player) => (
                    <PlayerCard key={player.id} player={player}/>
                ))}
            </div>
        </div>
    );
}
