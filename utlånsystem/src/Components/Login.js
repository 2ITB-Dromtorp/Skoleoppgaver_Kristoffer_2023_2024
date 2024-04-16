import { useState } from "react"

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const Login = async () => {
        
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-3">

                <form className="login max-w-md w-full  bg-white gap-3 rounded p-6 space-y-4">
                    <label>
                        <p>Username</p>
                        <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>
                        <p>Password</p>
                        <input type="text" className="w-full p-4 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600" onChange={e => setPassword(e.target.value)} />
                    </label>

                    <button type="submit" onClick={Login} className="w-full py-4 bg-gray-400 hover:bg-gray-500 rounded text-sm font-bold text-gray-50 transition duration-200">
                        Submit </button>

                </form>

        </div>
    )
}