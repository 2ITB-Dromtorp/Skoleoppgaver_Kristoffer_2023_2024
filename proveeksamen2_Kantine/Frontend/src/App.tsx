import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import HomePage from './Components/HomePage';

import { ThemeProvider } from '@mui/material';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#e1f5fe',
      },
      secondary: {
        main: '#e3f2fd',
      },
    },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<HomePage />} />
              {/*<Route path="login" element={<Login />} />*/}
              {/*<Route path="signup" element={<Signup />} />*/}
              
            </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
