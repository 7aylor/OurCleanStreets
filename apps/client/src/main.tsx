import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Navbar/Login/Login.tsx';
import EventMap from './components/Mapping/EventMap.tsx';
import Layout from './Layout.tsx';
import Signup from './components/Navbar/Signup/Signup.tsx';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import Welcome from './components/Welcome.tsx';
import UserProfile from './components/UserProfile/UserProfile.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Welcome />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/user-profile' element={<UserProfile />} />
            <Route path='/map' element={<EventMap />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
