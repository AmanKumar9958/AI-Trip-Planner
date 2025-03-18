// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFireStore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBA4B04rVhvA3l98oRoO2PeFGCqf-VGRhk",
    authDomain: "ai-trip-genius.firebaseapp.com",
    projectId: "ai-trip-genius",
    storageBucket: "ai-trip-genius.firebasestorage.app",
    messagingSenderId: "837231796444",
    appId: "1:837231796444:web:db911c416a9184fdca1419",
    measurementId: "G-EKNMQ7L36V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFireStore(app);