// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c1ac8.firebaseapp.com",
  projectId: "mern-estate-c1ac8",
  storageBucket: "mern-estate-c1ac8.appspot.com",
  messagingSenderId: "505002053772",
  appId: "1:505002053772:web:03ec89177dc7d21aa1aba9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);