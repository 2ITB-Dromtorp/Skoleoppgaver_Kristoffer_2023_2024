import { useState } from 'react';
import axios from "axios";

import './App.css';

function App() {

  const [password, setPassword] = useState("")
  const [hashed, setHashed] = useState("")

  const handleInputChange = (event) => {
    setPassword(event.target.value);
  }
  
  const submit = () => {
    axios
        .post("http://localhost:3001/hash", { Password: password },{ headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          setHashed(response.data)
        })
        .catch(error => console.log(error));
}
  return (
    <div className="App">
      <input value={password} onChange={handleInputChange}></input>
      <button onClick={submit}>submit</button>
      {hashed}
    </div>
  );
}

export default App;
