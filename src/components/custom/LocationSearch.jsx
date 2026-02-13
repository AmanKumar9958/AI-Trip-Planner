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
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-lg" />
        <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Where do you want to go?"
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-border rounded-xl text-foreground text-lg font-medium placeholder:text-muted-foreground shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border-2 border-border rounded-xl mt-2 shadow-2xl max-h-64 overflow-auto z-50 divide-y-2 divide-gray-100">
          {suggestions.map((location, index) => (
            <li
              key={`${location.place_id}-${index}`} 
              className={`p-3 cursor-pointer flex items-center gap-3 transition-all ${
                selectedIndex === index ? "bg-primary/5 text-primary" : "hover:bg-gray-50 text-slate-600"
              }`}
              onClick={() => handleSelect(location)}
            >
              <div className={`p-2 rounded-full ${selectedIndex === index ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-400"}`}>
                <FaMapMarkerAlt />
              </div>
              <span className="truncate font-semibold text-base">{location.display_name}</span>
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-primary/20 shadow-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
             <FaMapMarkerAlt className="text-lg" />
          </div>
          <div>
              <p className="font-bold text-foreground text-base">Selected Location</p>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{selectedLocation.display_name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;