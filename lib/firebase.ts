// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5emGFOFvtM3EQvsHLT4lMzsm7rHMwyBk",
  authDomain: "nuxtsah.firebaseapp.com",
  databaseURL: "https://nuxtsah.firebaseio.com",
  projectId: "nuxtsah",
  storageBucket: "nuxtsah.appspot.com",
  messagingSenderId: "598636459769",
  appId: "1:598636459769:web:0546634b0df47178195428",
  measurementId: "G-ZB6RLV2XVD"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();

export { app, db }
