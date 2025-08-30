import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";
import API from "../../../../api";

export default function SpellPage() {
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

  if (loading) return <div className="p-6">Loading spell...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!spell) return null;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">
            {spell.name.replace(/-/g, " ")}
          </CardTitle>
          <CardDescription>
            <Badge variant="outline" className="mr-2">{`Level ${spell.level}`}</Badge>
            <Badge variant="secondary" className="mr-2">{spell.school}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Cast Time</span>
              <span className="text-base">{spell.cast_time}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Range</span>
              <span className="text-base">{spell.range}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Duration</span>
              <span className="text-base">{spell.duration}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Components</span>
              <div className="flex items-center gap-1">
                {spell.verbal && <Badge>V</Badge>}
                {spell.somatic && <Badge>S</Badge>}
                {spell.material && <Badge>M</Badge>}
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Classes</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {spell.classes.map((cls) => (
                <Badge key={cls} variant="outline">{cls}</Badge>
              ))}
            </div>
          </div>
          {spell.material_cost && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">Material Cost</span>
              <span className="text-base">{spell.material_cost}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Description</span>
            <p className="text-sm text-gray-700 leading-relaxed mt-1">{spell.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
