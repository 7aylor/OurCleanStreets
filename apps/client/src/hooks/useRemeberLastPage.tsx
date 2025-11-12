import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';

export const useRememberLastRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Save current route whenever it changes (if logged in)
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('lastRoute', location.pathname);
    }
  }, [location.pathname]);

  // Restore on app load
  useEffect(() => {
    const lastRoute = localStorage.getItem('lastRoute');
    if (accessToken && lastRoute && lastRoute !== location.pathname) {
      navigate(lastRoute, { replace: true });
    }
  }, []);
};
