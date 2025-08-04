import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const skilledServices = [
  { name: 'Electrician', icon: '💡' },
  { name: 'Motor Mechanic', icon: '🛠️' },
  { name: 'Electronic Services', icon: '📺' },
  { name: 'Tutor', icon: '📚' },
  { name: 'AC Technician', icon: '❄️' },
  { name: 'Carpenter', icon: '🪚' }
];

const supportServices = [
  { name: 'Driver', icon: '🚗' },
  { name: 'Laundry', icon: '🧺' },
  { name: 'Housekeeping', icon: '🧹' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Cook', icon: '👨‍🍳' },
  { name: 'Pest Control', icon: '🐜' }
];

const HomePage = () => {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [showArrow, setShowArrow] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const target = bottomRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowArrow(!entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, []);

  const getColor = (name) => {
    switch (name) {
      case 'Electrician': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 'Motor Mechanic': return 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'Electronic Services': return 'bg-purple-100 hover:bg-purple-200 text-purple-800';
      case 'Tutor': return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'Plumber': return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 'Carpenter': return 'bg-amber-100 hover:bg-amber-200 text-amber-800';
      case 'Driver': return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800';
      case 'Laundry': return 'bg-pink-100 hover:bg-pink-200 text-pink-800';
      case 'Housekeeping': return 'bg-lime-100 hover:bg-lime-200 text-lime-800';
      case 'AC Technician': return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800';
      case 'Cook': return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
      case 'Pest Control': return 'bg-teal-100 hover:bg-teal-200 text-teal-800';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  const renderTiles = (services) =>
    services.map(({ name, icon }) => (
      <button
        key={name}
        onClick={() => navigate(`/${name.toLowerCase().replace(/\s+/g, '-')}`)}
        className={`rounded-xl px-6 py-4 w-full font-semibold text-lg shadow-md border border-gray-200 transition-all duration-200 flex items-center justify-center gap-2 ${getColor(name)}`}
      >
        <span className="text-xl">{icon}</span> {name}
      </button>
    ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BFFFED]">
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 relative" style={{ backgroundColor: '#BFFFED' }}>
      
      {/* 👇 Floating Scroll Hint Near Bottom */}
      {showArrow && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-40 text-center">
          <div className="text-gray-700 text-sm font-medium">More</div>
          <div className="text-2xl">⬇️</div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-10 drop-shadow">
        What Service Do You Need?
      </h1>

      <div className="max-w-5xl mx-auto">
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Technical & Skilled Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderTiles(skilledServices)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Daily Help & Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {renderTiles(supportServices)}
          </div>
        </section>

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ➕ Add Service Button */}
      <button
        onClick={() => navigate('/login')}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg text-lg hover:bg-blue-700 transition duration-200"
      >
        + Add Service
      </button>
    </div>
  );
};

export default HomePage;
