
import { useEffect, useState } from "react";
import "./index.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Page from "./Page";

async function LoginUser(username: string, password: string) {
  return fetch('http://localhost:3000/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })
}

async function registerUser(username: string, password: string) {
  return fetch('http://localhost:3000/register', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })
}

export function Login() {
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

export function Register() {
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


function App() {

  /*const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) {
    return <Login />
  }*/

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
