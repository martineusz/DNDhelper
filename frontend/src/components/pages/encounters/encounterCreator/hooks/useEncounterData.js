import { useState, useEffect } from "react";
import API from "../../../../../api";

export const useEncounterData = () => {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [availableMonsters, setAvailableMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playersResponse, monstersResponse] = await Promise.all([
          API.get("characters/"),
          API.get("monsters/")
        ]);
        setAvailablePlayers(playersResponse.data);
        setAvailableMonsters(monstersResponse.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { availablePlayers, availableMonsters, loading, error };
};