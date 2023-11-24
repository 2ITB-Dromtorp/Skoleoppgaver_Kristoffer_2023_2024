import { useState } from "react";

async function LoginUser(username: string, password: string) {
    return fetch('http://localhost:3000/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
}


export default function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="login">
            <label>
                <p>Username</p>
                <input type="text" onChange={e => setUserName(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <div>
                <button type="submit" onClick={() => LoginUser(username, password)}>Submit</button>
            </div>
        </div>
    )
}