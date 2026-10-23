
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// FIT5032 Firebase Web App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvUcR9U6jBqjksd0-7QhaP7OdHyDavfG0",
  authDomain: "fit5032-48f1a.firebaseapp.com",
  projectId: "fit5032-48f1a",
  storageBucket: "fit5032-48f1a.firebasestorage.app",
  messagingSenderId: "412781111949",
  appId: "1:412781111949:web:6f8be77329954fb7f310c4"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export Firestore Database
export default db;
