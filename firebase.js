// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm1VYVOyosydvWrKLb6Wv0aDOCg2WHavs",
  authDomain: "inventory-management-a93e5.firebaseapp.com",
  projectId: "inventory-management-a93e5",
  storageBucket: "inventory-management-a93e5.appspot.com",
  messagingSenderId: "806450887745",
  appId: "1:806450887745:web:edeacdef71d06d29755ac0",
  measurementId: "G-QD12LYSDJF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};