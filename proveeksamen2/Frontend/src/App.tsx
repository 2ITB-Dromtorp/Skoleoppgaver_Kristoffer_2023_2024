import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import HomePage from './Components/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            {/*<Route path="login" element={<Login />} />*/}
            {/*<Route path="signup" element={<Signup />} />*/}
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
