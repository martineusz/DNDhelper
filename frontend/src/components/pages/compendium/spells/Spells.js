import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Spells() {
    const [spells, setSpells] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [schoolFilter, setSchoolFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        const fetchSpells = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/spells/");
                const data = await response.json();
                setSpells(data);
                setFiltered(data);
            } catch (err) {
                console.error("Error fetching spells:", err);
            }
        };
        fetchSpells();
    }, []);

    useEffect(() => {
        let result = [...spells];

        if (search) {
            result = result.filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (schoolFilter !== "all") {
            result = result.filter(
                (s) => s.school.toLowerCase() === schoolFilter.toLowerCase()
            );
        }

        result.sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "level") return a.level - b.level;
            return 0;
        });

        setFiltered(result);
    }, [search, schoolFilter, sortBy, spells]);

    return (
        <div className="p-6 relative min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Spell Browser</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search spells..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    <option value="all">All Schools</option>
                    <option value="abjuration">Abjuration</option>
                    <option value="conjuration">Conjuration</option>
                    <option value="divination">Divination</option>
                    <option value="enchantment">Enchantment</option>
                    <option value="evocation">Evocation</option>
                    <option value="illusion">Illusion</option>
                    <option value="necromancy">Necromancy</option>
                    <option value="transmutation">Transmutation</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    <option value="name">Name</option>
                    <option value="level">Level</option>
                </select>
            </div>

            {/* Spell table */}
            <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-md bg-white">
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                                <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">Name</th>
                                <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">School</th>
                                <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">Level</th>
                                <th className="border-b px-4 py-3 text-left text-gray-700 font-semibold">Classes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((spell) => (
                                <tr key={spell.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="border-b px-4 py-2">
                                        <Link
                                            to={`/dashboard/spells/${spell.slug}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {spell.name}
                                        </Link>
                                    </td>
                                    <td className="border-b px-4 py-2 text-gray-600">{spell.school}</td>
                                    <td className="border-b px-4 py-2 text-gray-600">{spell.level}</td>
                                    <td className="border-b px-4 py-2 text-gray-600">
                                        {spell.classes.join(", ")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
