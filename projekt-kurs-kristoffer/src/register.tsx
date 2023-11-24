import { useState } from "react";

async function registerUser(username: string, password: string) {
    return fetch('http://localhost:3000/register', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
}

export default function Register() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="register">
            <label>
                <p>Username</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
                <button type="submit" onClick={() => registerUser(username, password)} >Submit</button>
            </div>
        </div>
    )
}