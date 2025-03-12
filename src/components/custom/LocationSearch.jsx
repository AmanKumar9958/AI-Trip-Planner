import React, { useState, useEffect } from "react";

const LocationSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const API_KEY = "pk.4475df9ad8681f65abbddd4307eadc24"; // Replace with your key

  // Fetch suggestions from LocationIQ
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${query}&limit=5&format=json`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location data:", error);
      setSuggestions([]);
    }
  };

  // Handle user typing
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
    setSelectedIndex(-1); // Reset selection index
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      handleSelect(suggestions[selectedIndex]);
    }
  };

  // Handle selection
  const handleSelect = (location) => {
    setQuery(location.display_name);
    setSelectedLocation(location);
    setSuggestions([]); // Hide suggestions
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a location..."
        className="w-[20vw] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
          {suggestions.map((location, index) => (
            <li
              key={location.place_id}
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
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
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