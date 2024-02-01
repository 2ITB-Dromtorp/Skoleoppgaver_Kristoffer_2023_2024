import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Quiz from './Quiz';
import Home from './Home';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:Tema/:Page" element={<Quiz />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
