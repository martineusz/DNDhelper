import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";
import API from "../../../../api";
import { useDarkMode } from "../../../../context/DarkModeContext";

export default function SpellPage() {
  const { darkMode } = useDarkMode();
  const { slug } = useParams();
  const [spell, setSpell] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpell = async () => {
      try {
        const response = await API.get(`spells/${encodeURIComponent(slug)}/`);
        setSpell(response.data);
      } catch (err) {
        console.error("Error fetching spell:", err);
        setError(err.response?.data?.detail || "Spell not found");
      } finally {
        setLoading(false);
      }
    };
    fetchSpell();
  }, [slug]);

  if (loading) return <div className={`p-6 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Loading spell...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!spell) return null;

  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";
  const textMain = darkMode ? "text-green-300" : "text-green-700";
  const cardBg = darkMode ? "bg-gray-800 border-green-700" : "bg-green-50 border-green-200";
  const badgeOutline = darkMode ? "border-green-400 text-green-200" : "border-green-400 text-green-700";
  const badgeSecondary = darkMode ? "bg-green-700 text-white" : "bg-green-200 text-green-800";
  const descriptionText = darkMode ? "text-gray-200" : "text-gray-700";

  return (
    <div className={`${darkMode ? "bg-gray-900" : "bg-white"} p-6 min-h-screen`}>
      <Card className={`${cardBg}`}>
        <CardHeader>
          <CardTitle className={`capitalize ${textMain}`}>
            {spell.name.replace(/-/g, " ")}
          </CardTitle>
          <CardDescription>
            <Badge variant="outline" className={`mr-2 ${badgeOutline}`}>{`Level ${spell.level}`}</Badge>
            <Badge variant="secondary" className={`mr-2 ${badgeSecondary}`}>{spell.school}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${textMuted}`}>Cast Time</span>
              <span className={`text-base ${textMain}`}>{spell.cast_time}</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${textMuted}`}>Range</span>
              <span className={`text-base ${textMain}`}>{spell.range}</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${textMuted}`}>Duration</span>
              <span className={`text-base ${textMain}`}>{spell.duration}</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${textMuted}`}>Components</span>
              <div className="flex items-center gap-1">
                {spell.verbal && <Badge className={`${badgeSecondary}`}>V</Badge>}
                {spell.somatic && <Badge className={`${badgeSecondary}`}>S</Badge>}
                {spell.material && <Badge className={`${badgeSecondary}`}>M</Badge>}
              </div>
            </div>
          </div>

          <Separator className={`${darkMode ? "bg-green-600" : "bg-green-200"}`} />

          <div className="flex flex-col">
            <span className={`text-sm font-medium ${textMuted}`}>Classes</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {spell.classes.map((cls) => (
                <Badge key={cls} variant="outline" className={`${badgeOutline}`}>{cls}</Badge>
              ))}
            </div>
          </div>

          {spell.material_cost && (
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${textMuted}`}>Material Cost</span>
              <span className={`text-base ${textMain}`}>{spell.material_cost}</span>
            </div>
          )}

          <Separator className={`${darkMode ? "bg-green-600" : "bg-green-200"}`} />

          <div className="flex flex-col">
            <span className={`text-sm font-medium ${textMuted}`}>Description</span>
            <p className={`text-sm leading-relaxed mt-1 ${descriptionText}`}>{spell.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}