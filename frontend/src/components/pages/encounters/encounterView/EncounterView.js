import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../api";
import "../myEncounters/Encounters.css";

export default function EncounterView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEncounter = async () => {
      try {
        setLoading(true);
        // Ensure you are fetching the data with a valid token
        const response = await API.get(`encounters/${id}/`);
        setEncounter(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEncounter();
  }, [id]);

  if (loading) {
    return <p>Loading encounter details...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!encounter) {
    return <p>Encounter not found.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Encounters
      </button>

      <h1>{encounter.name}</h1>
      <p>{encounter.description}</p>
      <hr />

      <div className="section-container">
        <div className="section-block">
          <h3>Players</h3>
          <ul className="detail-list">
            {encounter.player_data.map((data) => (
              <li key={data.id} className="detail-item">
                <p>
                  <strong>Name:</strong>{" "}
                  {/* FIX: Check for the nested object or fall back to the custom name */}
                  {data.player_character?.character_name || data.name}
                </p>
                <p>
                  <strong>Initiative:</strong> {data.initiative || "0"}
                </p>
                <p>
                  <strong>Current HP:</strong> {data.current_hp || "0"}
                </p>
                <p>
                  <strong>Notes:</strong> {data.notes || "-"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="section-block">
          <h3>Monsters</h3>
          <ul className="detail-list">
            {encounter.monster_data.map((data) => (
              <li key={data.id} className="detail-item">
                <p>
                  <strong>Name:</strong>{" "}
                  {/* FIX: Check for the nested object or fall back to the custom name */}
                  {data.monster?.name || data.name}
                </p>
                <p>
                  <strong>Initiative:</strong> {data.initiative || "0"}
                </p>
                <p>
                  <strong>Current HP:</strong> {data.current_hp || "0"}
                </p>
                <p>
                  <strong>Notes:</strong> {data.notes || "-"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}