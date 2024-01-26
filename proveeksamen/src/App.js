import Home from './Home';
import CreateTicket from './CreateTicket';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Ticket from './Ticket';
import { useEffect } from 'react';

function App() {

  async function mekking() {
    fetch("/get").then(async (res) => {
      console.log(res.json())
    }).then((data) => {
      console.log(data.message)
    })
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:ticket" element={<Ticket />} />
        <Route path='/create' element={<CreateTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
