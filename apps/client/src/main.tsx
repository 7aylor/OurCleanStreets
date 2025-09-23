import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Navbar/Login/Login.tsx';
import EventMap from './components/Mapping/EventMap.tsx';
import Layout from './Layout.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<Login />} />
          <Route path='/map' element={<EventMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
