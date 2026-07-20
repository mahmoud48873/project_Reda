import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3J1rqq5GdMdiDABWoyDNTFvfCJ6F7Ar0",
  authDomain: "project-1-5e4fa.firebaseapp.com",
  projectId: "project-1-5e4fa",
  storageBucket: "project-1-5e4fa.firebasestorage.app",
  messagingSenderId: "420127531170",
  appId: "1:420127531170:web:6757ad7122c7ee7e4e37fb",
  measurementId: "G-CEFMQM0CK7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (only in browser environment)
export const analytics = typeof window !== "undefined" 
  ? isSupported().then((supported) => supported ? getAnalytics(app) : null)
  : null;

export default app;
