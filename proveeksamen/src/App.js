import Home from './Home';
import CreateTicket from './CreateTicket';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Ticket from './Ticket';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    fetch("/ingenbrukloljegbrukerikkebackendsorryassbror", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => console.error("Error sending data:", error))
  });



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
