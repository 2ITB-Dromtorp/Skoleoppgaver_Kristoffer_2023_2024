
import { useState } from "react";
import { Select } from "./select";
import { Update } from "./update";
import { Insert } from "./insert";
import './App.css';

function App() {

  const [content, setContent] = useState(<Select />)

  function selectPush() {
    setContent(<Select />);
  }

  function updatePush() {
    setContent(<Update />);
  }

  function insertPush() {
    setContent(<Insert />);
  }
  /*
    function updateDelete() {
      setContent(<Delete />);
    }*/

  return (
    <div className="Container flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-blue-500">

      <div className="Navbar w-full bg-white flex justify-between p-5 items-center shadow-2xl">
        <button className="navbar-item" onClick={selectPush}>SELECT</button>
        <button className="navbar-item" onClick={updatePush}>UPDATE</button>
        <button className="navbar-item" onClick={insertPush}>INSERT</button>
      </div>

      {content}


    </div >
  )
}

export default App;
