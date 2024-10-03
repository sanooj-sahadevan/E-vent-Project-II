import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect } from "react";


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
// export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);

const useFirebaseAnalytics = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized:", analytics);
    }
  }, []);
};