// src/utils/getAllProviders.js
import { providers as defaultProviders } from '../data/providers';

export const getAllProviders = () => {
  const stored = localStorage.getItem('registeredProviders');
  const registered = stored ? JSON.parse(stored) : [];

  // Add a `location` field for consistent filtering
  const normalized = registered.map((p) => ({
    ...p,
    location: p.location || `${p.area}, ${p.locality}`,
  }));

  return [...defaultProviders, ...normalized];
};
