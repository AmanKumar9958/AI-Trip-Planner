import React, { useState, useRef } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const LocationSearch = ({onChange}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchRef = useRef(null); 

  const API_KEY = import.meta.env.VITE_PLACE_API; 

  const timerRef = useRef(null);
  const fetchSuggestions = async (q) => {
    const query = q.trim();
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(query)}&limit=5&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(q), 500);
    setSelectedIndex(-1); 
  };

  const handleSelect = (location) => {
    const locationName = location.display_name || location.name || "Unknown Location";
    setQuery(locationName);
    setSelectedLocation(location);
    setSuggestions([]);
    if (onChange) {
      onChange(locationName);
    }
};

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative group">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Where do you want to go?"
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-slate-100 rounded-xl mt-2 shadow-2xl max-h-64 overflow-auto z-50 divide-y divide-slate-50">
          {suggestions.map((location, index) => (
            <li
              key={`${location.place_id}-${index}`} 
              className={`p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                selectedIndex === index ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
              }`}
              onClick={() => handleSelect(location)}
            >
              <div className="bg-slate-100 p-2 rounded-full">
                <FaMapMarkerAlt className="text-slate-400" />
              </div>
              <span className="truncate font-medium">{location.display_name}</span>
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3 animate-fade-in">
          <FaMapMarkerAlt className="text-indigo-500 mt-1" />
          <div>
              <p className="font-semibold text-slate-800">Selected Location</p>
              <p className="text-sm text-slate-600">{selectedLocation.display_name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;