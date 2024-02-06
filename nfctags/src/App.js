import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:Player/Roll" element={<Board />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
