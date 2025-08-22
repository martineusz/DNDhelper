import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SpellPage() {
  const { slug } = useParams(); // <-- changed from spellName
  const [spell, setSpell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpell = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/spells/${encodeURIComponent(slug)}/`);
        if (!response.ok) throw new Error("Spell not found");
        const data = await response.json();
        setSpell(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSpell();
  }, [slug]); // <-- dependency updated

  if (loading) return <div className="p-6">Loading spell...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!spell) return null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {spell.name.replace(/-/g, " ")}
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 space-y-3">
        <p><strong>Level:</strong> {spell.level}</p>
        <p><strong>School:</strong> {spell.school}</p>
        <p><strong>Classes:</strong> {spell.classes.join(", ")}</p>
        <p><strong>Cast Time:</strong> {spell.cast_time}</p>
        <p><strong>Range:</strong> {spell.range}</p>
        <p><strong>Duration:</strong> {spell.duration}</p>
        <p><strong>Verbal:</strong> {spell.verbal ? "Yes" : "No"}</p>
        <p><strong>Somatic:</strong> {spell.somatic ? "Yes" : "No"}</p>
        <p><strong>Material:</strong> {spell.material ? "Yes" : "No"}</p>
        {spell.material_cost && <p><strong>Material Cost:</strong> {spell.material_cost}</p>}
        <p><strong>Description:</strong></p>
        <p>{spell.description}</p>
      </div>
    </div>
  );
}
