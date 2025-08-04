// src/components/LocationFilter.jsx

import React from 'react';

const LocationFilter = ({ selectedLocation, setSelectedLocation, locations }) => {
  return (
    <div className="my-4 w-full max-w-md mx-auto">
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
