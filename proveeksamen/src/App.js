import Home from './Home';
import CreateTicket from './CreateTicket';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Ticket from './Ticket';
import { useEffect } from 'react';

function App() {

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
