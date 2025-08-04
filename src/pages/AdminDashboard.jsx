import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 Check if user is admin
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/unauthorized");
        return;
      }

      // ✅ Option 1: Email-based admin
      if (user.email === "admin@firstdial.com") {
        fetchProviders();
        return;
      }

      // ✅ Option 2: Firestore role check
      const userDoc = await getDoc(doc(db, "providers", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        fetchProviders();
      } else {
        navigate("/unauthorized");
      }
    });

    return () => unsubscribe();
  }, [navigate]); // ✅ Fixed warning

  const fetchProviders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "providers"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this provider?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "providers", id));
      setProviders((prev) => prev.filter((provider) => provider.id !== id));
    } catch (error) {
      console.error("Error deleting provider:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Service</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Area</th>
              <th className="py-2 px-4">Available Time</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.id} className="border-t">
                <td className="py-2 px-4">{provider.name}</td>
                <td className="py-2 px-4">{provider.service}</td>
                <td className="py-2 px-4">{provider.contact}</td>
                <td className="py-2 px-4">
                  {provider.locality}, {provider.district}
                </td>
                <td className="py-2 px-4">{provider.availability}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(provider.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
