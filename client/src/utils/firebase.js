import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCW4OzuR_HWG28C5IwFjGbjj1MwBYprCjI",
  authDomain: "my-firebase-e3f67.firebaseapp.com",
  projectId: "my-firebase-e3f67",
  storageBucket: "my-firebase-e3f67.appspot.com",
  messagingSenderId: "23221906205",
  appId: "1:23221906205:web:e74bd13c02cd0b0ec9cff4",
  measurementId: "G-VZ9C4S4N5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);