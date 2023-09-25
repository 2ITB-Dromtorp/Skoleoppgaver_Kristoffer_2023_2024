import logo from './logo.svg';
import './App.css';
import { Page1 } from './Page1';
import { Page2 } from './Page2';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './Layout';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />} >
              <Route path="Page1" element={<Page1 />} />
              <Route path="Page2" element={<Page2 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
