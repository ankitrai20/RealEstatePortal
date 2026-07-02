import { useState } from "react";

function SearchBar({ onSearch, onSort }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All");

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-5 max-w-4xl mx-auto">

      <div className="flex flex-col md:flex-row items-center gap-4">

        {/* Location */}
        <input
          type="text"
          placeholder="📍 Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Property Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>House</option>
        </select>

        {/* Sort */}
        <select
          onChange={(e) => onSort(e.target.value)}
          className="w-full md:w-48 border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Sort Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        {/* Search Button */}
        <button
          onClick={() => onSearch(location, type)}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Search
        </button>

      </div>

    </div>
  );
}

export default SearchBar;