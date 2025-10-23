// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- IMPORTANT ---
// 1. Replace the placeholder values below with your actual Firebase project configuration.
//    You can find this in your Firebase project settings under "General".
// 2. Go to your Firebase Console -> Authentication -> Sign-in method.
// 3. Make sure to ENABLE the "Email/Password" provider.
//    The 'auth/operation-not-allowed' error occurs when this is disabled.
const firebaseConfig = {
  apiKey: "AIzaSyAG2uceowOsDd_lMYVBzzNbIgxU8U4Xv1k",
  authDomain: "ai-group-diet-tracker.firebaseapp.com",
  projectId: "ai-group-diet-tracker",
  storageBucket: "ai-group-diet-tracker.firebasestorage.app",
  messagingSenderId: "397607706246",
  appId: "1:397607706246:web:011d05d419bae7aae3fb07",
  measurementId: "G-Z42D477Z8Y"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };