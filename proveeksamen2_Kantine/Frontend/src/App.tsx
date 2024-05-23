import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import HomePage from './Components/HomePage';

import { ThemeProvider } from '@mui/material';

import { createTheme } from '@mui/material/styles';
import ProductPage from './Components/ProductPage';
import Login from './Components/Login';
import { useEffect, useState } from 'react';
import { User } from './utils/types';
import { GetUserData } from './utils/getUserData';
import Cart from './Components/Cart';
import OrderPage from './Components/Orders';


const theme = createTheme({
  palette: {
  },
});

function App() {
  const [userdata, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const data = GetUserData();
    setUserData(data);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Layout userdata={userdata} setUserData={setUserData} />}
          >
            <Route index element={<HomePage />} />
            <Route path='/login' element={<Login setUserData={setUserData} />} />
            <Route path='/product/:id' element={<ProductPage />} />
            <Route path='/cart/' element={<Cart />} />
            <Route path='/orders' element={<OrderPage />} />
            <Route path='/viewmore/:category'></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
