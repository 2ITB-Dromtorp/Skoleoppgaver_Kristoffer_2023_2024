import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import HomePage from './Components/Layout/HomePage';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import AddEquipment from './Components/AddEquipment/AddEquipment';
import Equipment from './Components/Equipment/Equipment';
import BorrowRequest from './Components/BorrowRequest/BorrowRequest';

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
          <Route path='borrow' element={<BorrowRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
