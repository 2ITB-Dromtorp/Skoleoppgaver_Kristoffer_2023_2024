
import "./index.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Page from "./Page";
import { Login } from "./login";
import { Register } from "./register";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/page" element={<Page />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
