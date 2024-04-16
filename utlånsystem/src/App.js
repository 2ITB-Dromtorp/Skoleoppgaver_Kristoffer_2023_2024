import './App.css';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Layout from './Components/Layout';
import HomePage from './Components/HomePage';
import Login from './Components/Login';

function App() {


  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
