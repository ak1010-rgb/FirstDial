// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ if using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAwXirRSL77oXducINVYVb31KJq8OiF_xw",
  authDomain: "firstdial-4a62a.firebaseapp.com",
  projectId: "firstdial-4a62a",
  storageBucket: "firstdial-4a62a.appspot.com",
  messagingSenderId: "286173880841",
  appId: "1:286173880841:web:9d9ec4834ee49e0b390ed8",
  measurementId: "G-01ERY42G4E"
};

const app = initializeApp(firebaseConfig);

// ✅ Export in correct order
export const auth = getAuth(app);
export const db = getFirestore(app);
