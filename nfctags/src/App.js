import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Board from './Board';
import io from "socket.io-client"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/host" element={<Board />} />
        <Route path="/client" element={<Board />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
export const socket = io("http://localhost:8080")