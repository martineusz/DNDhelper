import React, {useEffect, useState} from "react";
import {Input} from "../../../ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../../../ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../../../ui/table";

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
                console.error("Error fetching compendium:", err);
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
        <div className="p-6 bg-white h-screen overflow-y-auto">
            <h1 className="text-2xl font-semibold text-green-700 mb-6">
                Monster Browser
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
                        placeholder="Search monsters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="type-filter" className="text-sm text-green-600 mb-1">
                        Type
                    </label>
                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                        <SelectTrigger
                            id="type-filter"
                            className="w-40 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300"
                        >
                            <SelectValue placeholder="All Types"/>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-green-200 shadow-lg">
                            <SelectItem value="all" className="hover:bg-green-100 focus:bg-green-100">All
                                Types</SelectItem>
                            <SelectItem value="beast"
                                        className="hover:bg-green-100 focus:bg-green-100">Beast</SelectItem>
                            <SelectItem value="undead"
                                        className="hover:bg-green-100 focus:bg-green-100">Undead</SelectItem>
                            <SelectItem value="dragon"
                                        className="hover:bg-green-100 focus:bg-green-100">Dragon</SelectItem>
                            <SelectItem value="fiend"
                                        className="hover:bg-green-100 focus:bg-green-100">Fiend</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="sort-by" className="text-sm text-green-600 mb-1">
                        Sort By
                    </label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger
                            id="sort-by"
                            className="w-40 bg-green-50 border-green-200 focus:border-green-300 focus:ring-green-300"
                        >
                            <SelectValue placeholder="Name"/>
                        </SelectTrigger>
                        <SelectContent className="bg-white border-green-200 shadow-lg">
                            <SelectItem value="name" className="hover:bg-green-100 focus:bg-green-100">Name</SelectItem>
                            <SelectItem value="cr" className="hover:bg-green-100 focus:bg-green-100">Challenge
                                Rating</SelectItem>
                            <SelectItem value="ac" className="hover:bg-green-100 focus:bg-green-100">Armor
                                Class</SelectItem>
                            <SelectItem value="hp" className="hover:bg-green-100 focus:bg-green-100">Hit
                                Points</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Monster table */}
            <div className="overflow-x-auto rounded-md border border-green-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-100 hover:bg-green-100">
                            <TableHead className="text-green-700 font-semibold">Name</TableHead>
                            <TableHead className="text-green-700 font-semibold">Type</TableHead>
                            <TableHead className="text-green-700 font-semibold">CR</TableHead>
                            <TableHead className="text-green-700 font-semibold">AC</TableHead>
                            <TableHead className="text-green-700 font-semibold">HP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((monster) => (
                            <TableRow key={monster.id} className="hover:bg-green-50">
                                <TableCell>
                                    {monster.url ? (
                                        <a
                                            href={monster.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:underline font-medium"
                                        >
                                            {monster.name}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 font-medium">{monster.name}</span>
                                    )}
                                </TableCell>
                                <TableCell>{monster.type}</TableCell>
                                <TableCell>{monster.cr}</TableCell>
                                <TableCell>{monster.ac}</TableCell>
                                <TableCell>{monster.hp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}