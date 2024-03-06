// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { initializeAdminApp } from 'firebase-admin/app';
import { getAdminAuth } from 'firebase-admin/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDa-gSPoHoT0UbCELFSGEvKdddJiY4c0E8",
    authDomain: "itb-mekkeprojekt.firebaseapp.com",
    projectId: "itb-mekkeprojekt",
    storageBucket: "itb-mekkeprojekt.appspot.com",
    messagingSenderId: "1071845364304",
    appId: "1:1071845364304:web:02ed1d9ef516fb56903755"
};
export const adminApp = initializeAdminApp();
export const adminAuth = getAdminAuth();
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;