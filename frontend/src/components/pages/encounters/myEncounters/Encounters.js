import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import "./Encounters.css";

// Reusable component for a single encounter card.
function EncounterCard({ encounter, onCardClick }) {
  return (
    <div onClick={() => onCardClick(encounter)} className="encounter-card">
      <h3>{encounter.name}</h3>
      <p>
        {encounter.description
          ? encounter.description.substring(0, 50) + "..."
          : "No description."}
      </p>
      <p>
        <strong>Players:</strong> {encounter.player_data.length}
      </p>
      <p>
        <strong>Monsters:</strong> {encounter.monster_data.length}
      </p>
    </div>
  );
}

// New component for the "add" button
function AddEncounterCard({ onCardClick }) {
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
        minHeight: "150px",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      +
    </div>
  );
}

// Main component to display all encounters.
export default function Encounters() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  async function fetchEncounters() {
    try {
      setLoading(true);
      const response = await API.get("encounters/");
      setEncounters(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }
    fetchEncounters();
  }, [token]);

  // Handle click to navigate to an existing encounter's details page
  const handleCardClick = (encounter) => {
    navigate(`${encounter.id}`);
  };

  // Handle click to navigate to the new encounter creation page
  const handleNewEncounterClick = () => {
    navigate("../encounter-creator");
  };

  if (loading) return <p>Loading encounters...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Encounters</h1>
      <p>Click on an encounter card to view its details, or create a new one.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {encounters.map((encounter) => (
          <EncounterCard
            key={encounter.id}
            encounter={encounter}
            onCardClick={handleCardClick}
          />
        ))}
        {/* Add the new card component here */}
        <AddEncounterCard onCardClick={handleNewEncounterClick} />
      </div>
    </div>
  );
}