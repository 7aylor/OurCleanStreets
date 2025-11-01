import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { OCS_API_URL } from '../helpers/constants';
import { useNavigate } from 'react-router-dom';

/*
 * Hook to validate browser's cookie on a refresh/load
 * to determine if user should stay logged in
 */
export const useAuthenticateOnLoad = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${OCS_API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          dispatch(
            login({
              accessToken: data.accessToken,
              email: data.email,
              userId: data.userId,
              username: data.username,
              zipcode: data.zipcode,
            })
          );
          navigate(localStorage.getItem('lastRoute') ?? '/user-profile');
        } else {
          dispatch(logout());
        }
      } catch (e) {
        console.error('Auth check failed', e);
        dispatch(logout());
      }
    };

    checkAuth();
  }, [dispatch]);
};
