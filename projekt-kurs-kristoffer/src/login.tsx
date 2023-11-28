import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export async function LoginUser(username: string, password: string, navigate: Function) {
    fetch('http://localhost:3000/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then((response) => response.text())
        .then((response) => {
            if (response.toString() == "success") {
                navigate("/page", { state: username })
            } else {
                console.log(response.toString())
            }

        })
}


export function Login() {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log('Before login');
        await LoginUser(username, password, navigate);
        console.log('After login');
    };

    useEffect(() => {
        //document.cookie = ""
    })

    return (
        <div className="Container flex flex-col h-screen">
            <div className="Header w-full bg-gray-200 flex justify-between p-5 items-center">

                <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>


            </div>


            <div className="login text-center h-screen items-center justify-center flex flex-col">
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" onClick={handleLogin}>Submit</button>
                </div>
                <Link to="/register">Har ikke konto?</Link>
            </div>

        </div>

    )
}