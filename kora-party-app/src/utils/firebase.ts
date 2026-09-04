import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRcCp0or_EMRUOIq9_1fihmZXXa_CjOf0",
  authDomain: "kora-party.firebaseapp.com",
  databaseURL: "https://kora-party-default-rtdb.firebaseio.com",
  projectId: "kora-party",
  storageBucket: "kora-party.firebasestorage.app",
  messagingSenderId: "785400530791",
  appId: "1:785400530791:web:e7065c4177f812260351c2",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
