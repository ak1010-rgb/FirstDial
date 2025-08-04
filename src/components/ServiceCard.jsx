import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

const ServiceCard = ({ uid, name, service, locality, district, availableTime, phone }) => {
  const [callCount, setCallCount] = useState(0);

  useEffect(() => {
    if (uid) {
      const fetchCount = async () => {
        const ref = doc(db, 'providers', uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().callCount) {
          setCallCount(snap.data().callCount);
        }
      };
      fetchCount();
    }
  }, [uid]);

  const handleCallClick = async () => {
    if (!uid) return;
    const ref = doc(db, 'providers', uid);
    await updateDoc(ref, {
      callCount: increment(1),
    });
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-blue-700 mb-1">{name}</h3>
        <p className="text-gray-700 mb-1"><strong>Service:</strong> {service}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {locality}, {district}</p>
        {availableTime && (
          <p className="text-gray-700 mb-1"><strong>Available:</strong> {availableTime}</p>
        )}
        {phone && (
          <p className="text-gray-700 mb-1"><strong>Contact:</strong> {phone}</p>
        )}
        <p className="text-gray-600 mt-1 text-sm">📞 {callCount}+ calls</p>
      </div>

      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={handleCallClick}
          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded font-medium transition"
        >
          📞 Call Now
        </a>
      )}
    </div>
  );
};

export default ServiceCard;
