import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDE9gSo3H_BHZljgA-jIMu5DGO8O-gTBLU",
  authDomain: "appflowdesk-99410.firebaseapp.com",
  projectId: "appflowdesk-99410",
  storageBucket: "appflowdesk-99410.firebasestorage.app",
  messagingSenderId: "916547078750",
  appId: "1:916547078750:web:4d1d4c0abb8c1aff2f42cf",
  measurementId: "G-CKGZJTNWL7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
