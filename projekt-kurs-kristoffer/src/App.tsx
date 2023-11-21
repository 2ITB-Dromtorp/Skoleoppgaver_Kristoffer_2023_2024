import "./index.css"
import Popup from "./popup"

function App() {
  return (
    <div className="Container">

      <div className="Header w-full bg-red-100 flex justify-between p-5 items-center">

        <img src="Viken_våpen.svg.png" className="w-12" alt="Logo"></img>

        <div className="Profile flex flex-row-reverse items-center gap-5">
          <p>Lorem Ipsum</p>
          <img src="blank_profile.webp" className="w-12"></img>
        </div>

      </div>

      <div className="Main flex justify-center items-center">
        <Popup />
      </div>

    </div>
  )
}

export default App
