import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-G7_DKrxKT2whAFfxf3rGBdiIhmy05lI",
  authDomain: "controle-de-estoque-63df7.firebaseapp.com",
  projectId: "controle-de-estoque-63df7",
  storageBucket: "controle-de-estoque-63df7.firebasestorage.app",
  messagingSenderId: "857561362219",
  appId: "1:857561362219:web:d013a2648efe9cdde69f6e",
  measurementId: "G-JVJ6KPQ3BK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
