import './App.css';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Layout from './Components/Layout';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AddEquipment from './Components/AddEquipment';
import Equipment from './Components/Equipment';

function App() {


  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="addEquip" element={<AddEquipment />} />
            <Route path="equipments" element={<Equipment />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
