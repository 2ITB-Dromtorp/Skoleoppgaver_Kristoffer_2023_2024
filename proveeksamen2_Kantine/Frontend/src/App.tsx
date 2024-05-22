import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import HomePage from './Components/HomePage';

import { ThemeProvider } from '@mui/material';

import { createTheme } from '@mui/material/styles';
import ProductPage from './Components/ProductPage';
import Login from './Components/Login';

const theme = createTheme({
  palette: {
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            {/*<Route path="signup" element={<Signup />} />*/}
            <Route path="/product/:id" element={<ProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
