import React, { useEffect, useState } from "react";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import API from "../../../../api";
import { useDarkMode } from "../../../../context/DarkModeContext";

export default function Monsters() {
  const { darkMode } = useDarkMode();

  const [monsters, setMonsters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        const response = await API.get("monsters/");
        setMonsters(response.data);
        setFiltered(response.data);
      } catch (err) {
        console.error("Error fetching monsters:", err);
      }
    };
    fetchMonsters();
  }, []);

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

  const inputClasses = darkMode
    ? "bg-gray-700 text-gray-100 border-green-600 focus:border-green-500 focus:ring-green-500"
    : "bg-green-50 text-gray-900 border-green-200 focus:border-green-300 focus:ring-green-300";

  const selectTriggerClasses = darkMode
    ? "bg-gray-700 text-gray-100 border-green-600 focus:border-green-500 focus:ring-green-500"
    : "bg-green-50 text-gray-900 border-green-200 focus:border-green-300 focus:ring-green-300";

  const tableHeaderClasses = darkMode
    ? "bg-green-900 text-green-200 font-semibold"
    : "bg-green-100 text-green-700 font-semibold";

  const tableRowClasses = darkMode
    ? "hover:bg-gray-700"
    : "hover:bg-green-50";

  const tableCellLinkClasses = darkMode
    ? "text-green-400 hover:underline font-medium"
    : "text-green-600 hover:underline font-medium";

  const tableCellTextClasses = darkMode
    ? "text-gray-200 font-medium"
    : "text-gray-700 font-medium";

  const tableBorderClasses = darkMode
    ? "border-green-600"
    : "border-green-200";

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1
        className={`text-2xl font-semibold mb-6 ${
          darkMode ? "text-green-400" : "text-green-700"
        }`}
      >
        Monster Browser
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="search"
            className={`text-sm mb-1 ${darkMode ? "text-gray-200" : "text-green-600"}`}
          >
            Search
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search monsters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-64 ${inputClasses}`}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="type-filter"
            className={`text-sm mb-1 ${darkMode ? "text-gray-200" : "text-green-600"}`}
          >
            Type
          </label>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
            <SelectTrigger id="type-filter" className={`w-40 ${selectTriggerClasses}`}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent
              className={darkMode ? "bg-gray-800 text-gray-100 border-green-600" : "bg-white text-gray-900 border-green-200"}
            >
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="beast">Beast</SelectItem>
              <SelectItem value="undead">Undead</SelectItem>
              <SelectItem value="dragon">Dragon</SelectItem>
              <SelectItem value="fiend">Fiend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="sort-by"
            className={`text-sm mb-1 ${darkMode ? "text-gray-200" : "text-green-600"}`}
          >
            Sort By
          </label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger id="sort-by" className={`w-40 ${selectTriggerClasses}`}>
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent
              className={darkMode ? "bg-gray-800 text-gray-100 border-green-600" : "bg-white text-gray-900 border-green-200"}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="cr">Challenge Rating</SelectItem>
              <SelectItem value="ac">Armor Class</SelectItem>
              <SelectItem value="hp">Hit Points</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Monster Table */}
      <div className={`overflow-hidden rounded-md border ${tableBorderClasses}`}>
        <div
          className="max-h-[70vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: `${darkMode ? '#22c55e' : '#86efac'} transparent`, // scrollbar thumb and track colors
          }}
        >
          <Table>
            <TableHeader>
              <TableRow className={tableHeaderClasses}>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>CR</TableHead>
                <TableHead>AC</TableHead>
                <TableHead>HP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((monster) => (
                <TableRow key={monster.id} className={tableRowClasses}>
                  <TableCell>
                    {monster.url ? (
                      <a
                        href={monster.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={tableCellLinkClasses}
                      >
                        {monster.name}
                      </a>
                    ) : (
                      <span className={tableCellTextClasses}>{monster.name}</span>
                    )}
                  </TableCell>
                  <TableCell className={tableCellTextClasses}>{monster.type}</TableCell>
                  <TableCell className={tableCellTextClasses}>{monster.cr}</TableCell>
                  <TableCell className={tableCellTextClasses}>{monster.ac}</TableCell>
                  <TableCell className={tableCellTextClasses}>{monster.hp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}