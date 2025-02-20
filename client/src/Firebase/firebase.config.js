import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCoQGbaKDTwYNwwnp5pJq7N_SNsRM6pG9U",
  authDomain: "flowtask-arijit.firebaseapp.com",
  projectId: "flowtask-arijit",
  storageBucket: "flowtask-arijit.firebasestorage.app",
  messagingSenderId: "1018383347864",
  appId: "1:1018383347864:web:b9ce5d84688346c1a920ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);