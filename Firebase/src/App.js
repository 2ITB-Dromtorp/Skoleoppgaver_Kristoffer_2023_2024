
import './App.css';

import { Home } from './home';
import { Signup } from './signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from './login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
