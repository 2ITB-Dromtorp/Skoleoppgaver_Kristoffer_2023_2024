import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Board from './Board';
import { io } from 'socket.io-client';
import Join from './Join';
import Player from './Player';
import Host from './Host';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/host" element={<Host />} />
        <Route path="/board/:HostID" element={<Board />} />
        <Route path="/join" element={<Join />} />
        <Route path="/player/:PlayerName/:HostID" element={<Player />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;

export const socket = io("http://localhost:8080")