import React, { useState, useEffect, useRef, useCallback } from "react";

const LocationSearch = ({onChange}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const searchRef = useRef(null); // Reference for detecting outside clicks

  const API_KEY = import.meta.env.VITE_PLACE_API; // Ensure this is correctly set

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${query}&limit=5&format=json`
        );        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setSuggestions([]); // Reset suggestions on error
      }
    }, 500), // 500ms debounce time
    []
  );

  // Handle user input
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
    setSelectedIndex(-1); // Reset selection index
  };

  // Handle selection and console log the selected location
  const handleSelect = (location) => {
    console.log("Selected Location", location);
    const locationName = location.display_name || location.name || "Unknown Location";
    setQuery(locationName);
    setSelectedLocation(location);
    setSuggestions([]);
    if (onChange) {
      onChange(locationName);
    }
};

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter a location..."
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {suggestions.map((location, index) => (
            <li
              key={`${location.place_id}-${index}`} // Ensure unique keys
              className={`p-3 cursor-pointer ${
                selectedIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => handleSelect(location)}
            >
              {location.display_name}
            </li>
          ))}
        </ul>
      )}
      {selectedLocation && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md border-2">
          <p className="font-semibold">Selected Location:</p>
          <p>{selectedLocation.display_name}</p>
          <p className="text-sm text-gray-600">
            Latitude: {selectedLocation.lat}, Longitude: {selectedLocation.lon}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
