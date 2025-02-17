import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHLDyxkYqjkZTuS-K0aSn_C30nSZVqqfA",
  authDomain: "budget-planner-c1af7.firebaseapp.com",
  projectId: "budget-planner-c1af7",
  storageBucket: "budget-planner-c1af7.firebasestorage.app",
  messagingSenderId: "78535276583",
  appId: "1:78535276583:web:5f7c5b0a033bb84319b602",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
