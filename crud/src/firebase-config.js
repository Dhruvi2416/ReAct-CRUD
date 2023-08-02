// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5iLaNjei0_--a3bkjyf6jWuADe-ZRerg",
  authDomain: "react-crud-3ebbb.firebaseapp.com",
  projectId: "react-crud-3ebbb",
  storageBucket: "react-crud-3ebbb.appspot.com",
  messagingSenderId: "781931586032",
  appId: "1:781931586032:web:a4b3de42b3aa8b54e57d35",
  measurementId: "G-7ZVMEKG9PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export {storage};
export const db = getFirestore(app);