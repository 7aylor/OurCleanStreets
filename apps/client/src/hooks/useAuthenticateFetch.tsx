import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { OCS_API_URL } from '../helpers/constants';
import type { AuthRootState } from '../store/store';

export const useAuthenticatedFetch = () => {
  const auth = useSelector((state: AuthRootState) => state.auth);
  const { accessToken, email } = auth;
  const dispatch = useDispatch();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    let response;

    // Attach access token to headers
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      response = await fetch(`${OCS_API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // send cookies (refresh token)
      });

      // If unauthorized, try to refresh the token
      if (response.status === 401) {
        const refreshResponse = await fetch(`${OCS_API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          dispatch(login({ accessToken: refreshData.accessToken, email }));

          // Retry the original request with the new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          };

          response = await fetch(`${OCS_API_URL}${endpoint}`, {
            ...options,
            headers: retryHeaders,
            credentials: 'include',
          });
        } else {
          dispatch(logout());
          throw new Error('Session expired. Please log in again.');
        }
      }

      return response;
    } catch (err) {
      console.error('Fetch error:', err);
      throw err;
    }
  };

  return fetchWithAuth;
};
