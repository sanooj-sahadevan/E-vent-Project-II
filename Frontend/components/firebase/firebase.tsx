// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyxhXhtA1IuW-410Lyc3D0tW5fbjw-6F0",
  authDomain: "event-management-9b86d.firebaseapp.com",
  projectId: "event-management-9b86d",
  storageBucket: "event-management-9b86d.appspot.com",
  messagingSenderId: "583260155328",
  appId: "1:583260155328:web:f016abcbef3aa09a5eec25",
  measurementId: "G-MM9Y0ZN7LT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);