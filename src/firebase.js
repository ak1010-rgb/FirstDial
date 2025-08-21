// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAwXirRSL77oXducINVYVb31KJq8OiF_xw",
  authDomain: "firstdial-4a62a.firebaseapp.com",
  projectId: "firstdial-4a62a",
  storageBucket: "firstdial-4a62a.appspot.com",
  messagingSenderId: "286173880841",
  appId: "1:286173880841:web:9d9ec4834ee49e0b390ed8",
  measurementId: "G-01ERY42G4E"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ App Check with reCAPTCHA v3
// 👉 Replace SITE_KEY with actual key from Firebase Console > App Check
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Le9t60rAAAAAGLmZNR4AnFasqKJKF7F2MJTOxuB"),
  isTokenAutoRefreshEnabled: true, // keeps token fresh
});
