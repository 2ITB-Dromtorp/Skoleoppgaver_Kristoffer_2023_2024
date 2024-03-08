// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
/*import { initializeAuth } from "firebase/auth";
import { browserSessionPersistence } from "firebase/auth";*/
//import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);

/*const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LfFxo0pAAAAAI8w-zm_TU6gdAZjxpDvYhRba2WE'),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});*/


export const auth = getAuth(app);

export default app;