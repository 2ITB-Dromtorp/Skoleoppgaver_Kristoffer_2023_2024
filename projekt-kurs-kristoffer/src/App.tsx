
import { useEffect, useState } from "react";
import "./index.css"
import Kurs from "./Popup";


function App() {

  fetch("http://localhost:3000/getKurs")
    .then(res => res.json())
    .then(res => console.log(res));

  return (
    <div className="Container flex flex-col h-screen overflow-hidden">

      <div className="Header w-full bg-red-100 flex justify-between p-5 items-center">

        <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>

        <div className="Profile flex flex-row-reverse items-center gap-5">
          <p>Lorem Ipsum</p>
          <img src="blank-profile.webp" className="w-12"></img>
        </div>

      </div>

      <div className="Main flex h-screen items-center justify-center flex-row-reverse gap-16 m-10">

        <div className="Tilgjenlig-Kurs bg-gray-300 grow h-full grid grid-cols-3">
          <Kurs title={"test"} />
        </div>

        <div className="Påmeldt-Kurs bg-gray-300 h-full grid grid-rows-4 w-64 row-span-3">

        </div>

      </div>

    </div>
  )
}

export default App
