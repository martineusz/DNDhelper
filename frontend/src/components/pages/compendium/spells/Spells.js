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
import { Badge } from "../../../ui/badge";

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
    <div className="p-6 bg-white h-screen overflow-y-auto">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        Spell Browser
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="search" className="text-sm text-green-600 mb-1">
            Search
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search spells..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="school-filter" className="text-sm text-green-600 mb-1">
            School
          </label>
          <Select
            value={schoolFilter}
            onValueChange={(value) => setSchoolFilter(value)}
          >
            <SelectTrigger id="school-filter" className="w-40 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
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
          <label htmlFor="sort-by" className="text-sm text-green-600 mb-1">
            Sort By
          </label>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger id="sort-by" className="w-40 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300">
              <SelectValue placeholder="Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spell table */}
      <div className="overflow-x-auto rounded-md border border-green-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-100 hover:bg-green-100">
              <TableHead className="text-green-700">Name</TableHead>
              <TableHead className="text-green-700">School</TableHead>
              <TableHead className="text-green-700">Level</TableHead>
              <TableHead className="text-green-700">Classes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((spell) => (
              <TableRow key={spell.id} className="hover:bg-green-50">
                <TableCell>
                  <Link
                    to={`/dashboard/spells/${spell.slug}`}
                    className="text-green-600 hover:underline font-medium"
                  >
                    {spell.name}
                  </Link>
                </TableCell>
                <TableCell>{spell.school}</TableCell>
                <TableCell>{spell.level}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {spell.classes.map((cls) => (
                      <Badge key={cls} variant="secondary">{cls}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}