import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Board from './Components/Board';
import { io } from 'socket.io-client';
import NFC from './Components/NFC';
import Home from './Components/Home';
import Player from './Components/Player';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/host" element={<Board />} />
        <Route path="/join" element={<Player />} />
        <Route path='/' element={<Home />} />
        <Route path="/nfc/:PlayerName/:HostID" element={<NFC />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;

export const socket = io()