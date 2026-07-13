import { useState } from "react";

function SearchBar({ onSearch, onSort }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All");

  return (
    <div className="w-full max-w-5xl mx-auto">

      <div className="bg-white rounded-2xl shadow-2xl p-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Location */}
          <input
            type="text"
            placeholder="📍 Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-14 rounded-xl border border-gray-300 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          {/* Property Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-14 rounded-xl border border-gray-300 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>All</option>
            <option>Apartment</option>
            <option>Villa</option>
            <option>House</option>
          </select>

          {/* Sort */}
          <select
            onChange={(e) => onSort(e.target.value)}
            className="h-14 rounded-xl border border-gray-300 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="default">Sort Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>

          {/* Search */}
          <button
            onClick={() => onSearch(location, type)}
            className="h-14 rounded-xl bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 transition"
          >
            🔍 Search
          </button>

        </div>

      </div>

    </div>
  );
}

export default SearchBar;