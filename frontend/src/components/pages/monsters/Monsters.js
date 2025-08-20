import React, { useEffect, useState } from "react";

export default function Monsters() {
  const [monsters, setMonsters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/monsters/");
        const data = await response.json();
        setMonsters(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching monsters:", err);
      }
    };
    fetchMonsters();
  }, []);

  // Apply search, filter, and sort
  useEffect(() => {
    let result = [...monsters];

    if (search) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (m) => m.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "cr") return parseFloat(a.cr) - parseFloat(b.cr);
      if (sortBy === "ac") return a.ac - b.ac;
      if (sortBy === "hp") return a.hp - b.hp;
      return 0;
    });

    setFiltered(result);
  }, [search, typeFilter, sortBy, monsters]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monster Browser</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search monsters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="beast">Beast</option>
          <option value="undead">Undead</option>
          <option value="dragon">Dragon</option>
          <option value="fiend">Fiend</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="name">Name</option>
          <option value="cr">Challenge Rating</option>
          <option value="ac">Armor Class</option>
          <option value="hp">Hit Points</option>
        </select>
      </div>

      {/* Monster table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">CR</th>
              <th className="border px-4 py-2 text-left">AC</th>
              <th className="border px-4 py-2 text-left">HP</th>
              <th className="border px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((monster) => (
              <tr key={monster.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{monster.name}</td>
                <td className="border px-4 py-2">{monster.type}</td>
                <td className="border px-4 py-2">{monster.cr}</td>
                <td className="border px-4 py-2">{monster.ac}</td>
                <td className="border px-4 py-2">{monster.hp}</td>
                <td className="border px-4 py-2">
                  <a
                    href={monster.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
