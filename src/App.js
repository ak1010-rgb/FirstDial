import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { providers } from './data/providers';
import ServiceCard from './components/ServiceCard';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ForgotPassword from './pages/ForgotPassword';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import reCAPTCHA
import ReCAPTCHA from 'react-google-recaptcha';

function AppRoutes() {
  const location = useLocation();

  // ✅ State for reCAPTCHA
  const [pendingService, setPendingService] = useState(null);
  const [verified, setVerified] = useState(false);
  const [verificationTime, setVerificationTime] = useState(null);

  const siteKey = "6Le9t60rAAAAAGLmZNR4AnFasqKJKF7F2MJTOxuB"; // 🔑 replace with your visible reCAPTCHA site key

  // ✅ Expire verification after 10 minutes
  useEffect(() => {
    if (verified && verificationTime) {
      const timer = setTimeout(() => {
        setVerified(false);
        setVerificationTime(null);
        toast.info("Verification expired. Please verify again.");
      }, 10 * 60 * 1000); // 10 minutes

      return () => clearTimeout(timer);
    }
  }, [verified, verificationTime]);

  // ✅ Handle captcha completion
  const handleCaptcha = (token) => {
    if (token && pendingService) {
      setVerified(true);
      setVerificationTime(Date.now());
      toast.success(`Access granted to ${pendingService.name}`);
      console.log("Proceeding with service:", pendingService);
      setPendingService(null); // reset
    }
  };

  // ✅ When service clicked → show captcha
  const handleServiceClick = (service) => {
    if (!verified) {
      setPendingService(service);
    } else {
      toast.info(`Already verified. Proceeding with ${service.name}`);
      console.log("Proceeding with service:", service);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category" element={<CategoryPage key={location.pathname} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* ❌ Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🌐 Fallback Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-100 p-6">
              <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-700">
                  Available Service Providers
                </h1>
                <div className="flex flex-wrap gap-4 justify-center">
                  {providers.map((p) => (
                    <div key={p.id} onClick={() => handleServiceClick(p)}>
                      <ServiceCard {...p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ reCAPTCHA only shows when needed */}
              {pendingService && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center">
                      Verify to continue with {pendingService.name}
                    </h2>
                    <ReCAPTCHA sitekey={siteKey} onChange={handleCaptcha} />
                  </div>
                </div>
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={4000} pauseOnHover theme="colored" />
    </Router>
  );
}

export default App;
