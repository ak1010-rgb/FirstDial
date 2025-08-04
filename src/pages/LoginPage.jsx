import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDirectLogin, setShowDirectLogin] = useState(false);

  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        toast.success("Verification email sent! Please verify before login.");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (!userCred.user.emailVerified) {
          toast.warning("Please verify your email. Check spam if not received.");
          return;
        }
        navigate('/complete-profile');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setShowDirectLogin(true); // show modal
      } else if (err.code === 'auth/wrong-password') {
        toast.error("Incorrect password.");
      } else if (err.code === 'auth/user-not-found') {
        toast.error("User not found. Please register.");
        setIsRegistering(true);
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/complete-profile');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDirectLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (!userCred.user.emailVerified) {
        toast.warning("Please verify your email before login.");
        return;
      }
      toast.success("Logged in successfully!");
      navigate('/complete-profile');
    } catch (err) {
      toast.error("Login failed. Check credentials.");
    }
    setShowDirectLogin(false); // close popup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow relative">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isRegistering ? 'Create an Account' : 'Login to FirstDial'}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full border rounded p-2 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-blue-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          
          <p className="text-right text-sm text-blue-600 hover:underline cursor-pointer mt-1">
           <a href="/forgot-password">Forgot Password?</a>
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            
            {isRegistering ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'New here? Create Account'}
        </p>

        <div className="my-4 border-t text-center relative">
          <span className="bg-white px-2 text-gray-500 absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded flex justify-center items-center gap-2"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* 🚨 Popup for direct login */}
        {showDirectLogin && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center space-y-4 max-w-sm">
              <h3 className="text-lg font-semibold text-red-600">Email already in use</h3>
              <p className="text-gray-600">Would you like to login with the same credentials?</p>
              <button
                onClick={handleDirectLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Yes, Login
              </button>
              <button
                onClick={() => setShowDirectLogin(false)}
                className="text-gray-500 hover:underline block mx-auto text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
