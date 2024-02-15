import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Board from './Board';
import { io } from 'socket.io-client';


import Player from './Player';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/host" element={<Board />} />
        <Route path="/join" element={<Player />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;

export const socket = io("http://localhost:8080")