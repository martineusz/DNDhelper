import { useParams } from "react-router-dom";

export default function SpellPage() {
  const { spellName } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        {spellName.replace(/-/g, " ")}
      </h1>
    </div>
  );
}
