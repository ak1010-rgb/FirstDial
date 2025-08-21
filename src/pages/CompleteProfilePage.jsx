import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const servicesList = [
  'Electrician', 'Plumber', 'Driver', 'Tutor', 'Cook', 'Housekeeping', 'Laundry',
  'AC Technician', 'Carpenter', 'Pest Control', 'Automobile Mechanic', 'Electronic Services'
];

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isExisting, setIsExisting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    availableTime: '',
    state: '',
    district: '',
    locality: '',
    pin: '',
    fullAddress: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, 'providers', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsExisting(true);
          setFormData((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('User not logged in');
      return;
    }

    try {
      const docRef = doc(db, 'providers', user.uid);
      await setDoc(docRef, {
        ...formData,
        email: user.email,
        uid: user.uid,
        updatedAt: new Date(),
      }, { merge: true });

      toast.success('Profile saved successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile.');
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'providers', user.uid));
      toast.success('Profile deleted successfully.');
      navigate('/');
    } catch (err) {
      console.error('Error deleting profile:', err);
      toast.error('Failed to delete profile.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
        {isExisting && (
          <p className="text-green-600 font-medium text-center border border-green-400 bg-green-100 p-2 rounded">
            ✏️ Editing existing profile
          </p>
        )}

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Complete Your Profile</h2>

        <input name="name" placeholder="Full Name" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.name} />
        <input name="phone" placeholder="Contact Number" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.phone} />
        
        <select name="service" className="w-full border p-2 rounded" required onChange={handleChange} value={formData.service}>
          <option value="" disabled>Select Your Service</option>
          {servicesList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input name="availableTime" placeholder="Available Time (e.g., 9AM - 6PM)" className="w-full border p-2 rounded" onChange={handleChange} value={formData.availableTime} />
        <input name="state" placeholder="State" className="w-full border p-2 rounded" onChange={handleChange} value={formData.state} />
        <input name="district" placeholder="District" className="w-full border p-2 rounded" onChange={handleChange} value={formData.district} />
        <input name="locality" placeholder="Locality" className="w-full border p-2 rounded" onChange={handleChange} value={formData.locality} />
        <input name="pin" placeholder="PIN Code" className="w-full border p-2 rounded" onChange={handleChange} value={formData.pin} />
        <input name="fullAddress" placeholder="Full Address" className="w-full border p-2 rounded" onChange={handleChange} value={formData.fullAddress} />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Save Profile
        </button>

        {isExisting && (
          <>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-2"
            >
              Delete Profile
            </button>

            {/* Custom Confirm Popup */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                  <p className="mb-4 text-lg font-semibold text-red-600">
                    Are you sure you want to delete your profile? This cannot be undone.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        handleDelete();
                      }}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default CompleteProfilePage;
