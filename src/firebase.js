import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS with the config object you copied from Firebase in Phase 1
const firebaseConfig = {
  apiKey: "AIzaSyDDnN-BBZXmjsTuErnGvDEGoXNNW0yGka0",
  authDomain: "exam-system-89b8a.firebaseapp.com",
  projectId: "exam-system-89b8a",
  storageBucket: "exam-system-89b8a.firebasestorage.app",
  messagingSenderId: "888902503885",
  appId: "1:888902503885:web:e850ac871cadc7d072c884"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);