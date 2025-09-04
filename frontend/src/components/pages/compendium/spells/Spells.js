import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Spells() {
  const { darkMode } = useDarkMode();
  const [spells, setSpells] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const response = await API.get("spells/");
        setSpells(response.data);
        setFiltered(response.data);
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

  const inputClasses = darkMode
    ? "bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500 focus:ring-gray-500"
    : "bg-green-50 text-gray-900 border-green-200 focus:border-green-300 focus:ring-green-300";

  const selectTriggerClasses = darkMode
    ? "bg-gray-700 text-gray-100 border-gray-600 focus:border-gray-500 focus:ring-gray-500"
    : "bg-green-50 text-gray-900 border-green-200 focus:border-green-300 focus:ring-green-300";

  const tableHeaderClasses = darkMode
    ? "bg-gray-800 text-gray-200 font-semibold"
    : "bg-green-100 text-green-700 font-semibold";

  const tableRowClasses = darkMode
    ? "hover:bg-gray-700"
    : "hover:bg-green-50";

  const tableCellLinkClasses = darkMode
    ? "text-blue-400 hover:underline font-medium"
    : "text-green-600 hover:underline font-medium";

  const tableCellTextClasses = darkMode
    ? "text-gray-200 font-medium"
    : "text-gray-700 font-medium";

  const tableBorderClasses = darkMode
    ? "border-gray-600"
    : "border-green-200";

  const badgeClasses = darkMode
    ? "inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-100"
    : "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800";

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1
        className={`text-2xl font-semibold mb-6 ${
          darkMode ? "text-gray-100" : "text-green-700"
        }`}
      >
        Spell Browser
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
            placeholder="Search spells..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-64 ${inputClasses}`}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="school-filter"
            className={`text-sm mb-1 ${darkMode ? "text-gray-200" : "text-green-600"}`}
          >
            School
          </label>
          <Select value={schoolFilter} onValueChange={(value) => setSchoolFilter(value)}>
            <SelectTrigger id="school-filter" className={`w-40 ${selectTriggerClasses}`}>
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent
              className={darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-green-200"}
            >
              <SelectItem value="all">All Schools</SelectItem>
              <SelectItem value="abjuration">Abjuration</SelectItem>
              <SelectItem value="conjuration">Conjuration</SelectItem>
              <SelectItem value="divination">Divination</SelectItem>
              <SelectItem value="enchantment">Enchantment</SelectItem>
              <SelectItem value="evocation">Evocation</SelectItem>
              <SelectItem value="illusion">Illusion</SelectItem>
              <SelectItem value="necromancy">Necromancy</SelectItem>
              <SelectItem value="transmutation">Transmutation</SelectItem>
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
              className={darkMode ? "bg-gray-800 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-green-200"}
            >
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spell Table */}
      <div className={`overflow-hidden rounded-md border ${tableBorderClasses}`}>
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className={tableHeaderClasses}>
                <TableHead>Name</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((spell) => (
                <TableRow key={spell.id} className={tableRowClasses}>
                  <TableCell>
                    <Link
                      to={`/dashboard/spells/${spell.slug}`}
                      className={tableCellLinkClasses}
                    >
                      {spell.name}
                    </Link>
                  </TableCell>
                  <TableCell className={tableCellTextClasses}>{spell.school}</TableCell>
                  <TableCell className={tableCellTextClasses}>{spell.level}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {spell.classes.map((cls) => (
                        <span key={cls} className={badgeClasses}>
                          {cls}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
