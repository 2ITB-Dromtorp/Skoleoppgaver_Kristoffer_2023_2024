import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import { Link } from 'react-router-dom';

export function Home() {

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
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

    return (
        <>
            <nav>
                <p className="text-3xl font-bold underline">
                    Welcome Home
                </p>

                <Link to="/login"></Link>
            </nav>
        </>
    )
}

export default Home