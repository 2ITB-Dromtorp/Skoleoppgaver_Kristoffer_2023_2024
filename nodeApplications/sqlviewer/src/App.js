
import { useState } from "react";
import { Select } from "./select";
import { Update } from "./update";
import { Insert } from "./insert";
import { Delete } from "./delete";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

export function Navbar() {
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

  function deletePush() {
    setContent(<Delete />);
  }

  return (<div className="Container flex flex-col h-screen bg-gradient-to-r from-cyan-500 to-blue-500">

    <div className="Navbar w-full flex justify-between p-5 items-center shadow-2xl">
      <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={selectPush}>SELECT</button>
      <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={updatePush}>UPDATE</button>
      <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={insertPush}>INSERT</button>
      <button className="middle none center rounded-lg bg-pink-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" onClick={deletePush}>DELETE</button>
    </div>

    {content}


  </div >)
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>  </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
