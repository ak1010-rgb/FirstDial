// src/components/Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../logo.svg'; // ✅ Update if your logo file differs

const categories = [
  'Electrician', 'Motor Mechanic', 'Electronic Services', 'Tutor', 'Plumber',
  'Carpenter', 'Driver', 'Laundry', 'Housekeeping', 'AC Technician', 'Cook', 'Pest Control'
];

const Navbar = () => {
  const location = useLocation();
  const currentPath = decodeURIComponent(location.pathname).slice(1);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ${
              location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
            }`}
          >
            🏠 Home
          </Link>
        </div>
      </div>

      {/* Scrollable Category Links */}
      <div className="overflow-x-auto whitespace-nowrap px-4 py-2 border-t border-gray-200 bg-white">
        <div className="inline-flex gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/${encodeURIComponent(category)}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition duration-200 ${
                currentPath === category
                  ? 'bg-blue-200 text-blue-800 font-semibold'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
