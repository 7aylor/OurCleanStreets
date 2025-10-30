import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/Navbar/Login/Login.tsx';
import Layout from './Layout.tsx';
import Signup from './components/Navbar/Signup/Signup.tsx';
import store from './store/store.ts';
import Welcome from './components/Welcome.tsx';
import UserProfile from './components/UserProfile/UserProfile.tsx';
import { AuthorizedRoute } from './AuthorizedRoute.tsx';
import LogActivity from './components/Activities/LogActivity.tsx';
import Activities from './components/Activities/Activities.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ActivityDetails from './components/Activities/ActivityDetails.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';

const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path='/' element={<Welcome />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route element={<AuthorizedRoute />}>
                  <Route path='/user-profile' element={<UserProfile />} />
                  <Route path='/log-activity' element={<LogActivity />} />
                  <Route path='/dashboard' element={<Dashboard />} />
                  <Route
                    path='/activity-details/:id'
                    element={<ActivityDetails />}
                  />
                  <Route path='/activities' element={<Activities />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
