import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
async function registerUser(username: string, password: string, navigate: Function) {
    fetch('/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then((response) => response.text())
        .then((response) => {
            if (response === "success") {
                navigate("/")
            } else {
                console.log("fail")
            }
        })
}

export function Register() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [secondpassword, setsecondPassword] = useState("");

    const navigate = useNavigate()

    const handleSignup = async () => {
        if (secondpassword == password) {
            await registerUser(username, password, navigate);
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">

            <div className="register max-w-md w-full bg-white rounded p-6 space-y-4">
                <div className="mb-4">
                    <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>
                    <p className="text-gray-600">Lag ny Konto</p>
                </div>
                <label>
                    <p>Brukernavn</p>
                    <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Passord</p>
                    <input type="password" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    <p>Bekreft Passord</p>
                    <input type="password" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setsecondPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold text-gray-50 transition duration-200" onClick={handleSignup}>Signup</button>
                </div>
                <Link to="/">Allerede har konto?</Link>
            </div>

        </div>
    )
}