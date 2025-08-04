// src/pages/Unauthorized.jsx

import React from "react";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-2">🚫 Access Denied</h1>
      <p className="text-gray-700">You do not have permission to view this page.</p>
    </div>
  </div>
);

export default Unauthorized;
