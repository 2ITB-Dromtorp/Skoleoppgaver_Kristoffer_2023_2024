import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Layout from './Components/Layout/Layout';
import HomePage from './Components/HomePage';
import Login from './Components/Login/Login';
import { GetUserData } from './utils/getUserData';
import { useEffect, useState } from 'react';
import { User } from './utils/types';
import TournamentPage from './Components/Tournament/TournamentPage';
import RegisteredTournamentPage from './Components/Registered_Tournament/RegisteredTournamentPage';

function App() {

  const [userdata, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const data = GetUserData();
    setUserData(data);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout userdata={userdata} setUserData={setUserData} />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login setUserData={setUserData} />} />
          <Route path='tournaments' element={<TournamentPage userdata={userdata} />} />
          <Route path='registered' element={<RegisteredTournamentPage />} />
          <Route path='user/:userID' /> 
          {/*<Route path="signup" element={<Signup />} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
