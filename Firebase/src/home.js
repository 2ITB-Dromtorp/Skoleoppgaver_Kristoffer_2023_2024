import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export function Home() {

    const [user, setUser] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setUser(user)
                // ...
                console.log("uid", uid)
                console.log("user is logged in")
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
        });

    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <p className="text-3xl font-bold underline">
                Welcome Home {user}
            </p>

            <div>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </>
    )
}

export default Home