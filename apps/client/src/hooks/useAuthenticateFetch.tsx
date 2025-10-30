import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { OCS_API_URL } from '../helpers/constants';
import type { RootState } from '../store/store';

export const useAuthenticatedFetch = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { accessToken, email, userId, username, zipcode } = auth;
  const dispatch = useDispatch();

  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    let response;

    // Attach access token to headers
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // inject user info into body if JSON
    let userInjectedBody;
    try {
      const parsedBody =
        options?.body && typeof options.body === 'string'
          ? JSON.parse(options.body)
          : '';
      userInjectedBody = JSON.stringify({
        ...parsedBody,
        userId,
        username,
      });
    } catch {
      console.warn('Request body not valid JSON — skipping user injection.');
    }

    try {
      response = await fetch(endpoint, {
        ...options,
        method: options.method || 'POST',
        credentials: 'include',
        headers,
        body: userInjectedBody,
      });

      // If unauthorized, try to refresh the token
      if (response.status === 401) {
        const refreshResponse = await fetch(`${OCS_API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          dispatch(
            login({
              accessToken: refreshData.accessToken,
              email,
              userId,
              username,
              zipcode,
            })
          );

          // Retry the original request with the new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${refreshData.accessToken}`,
          };

          response = await fetch(endpoint, {
            ...options,
            method: options.method || 'POST',
            credentials: 'include',
            headers: retryHeaders,
            body: userInjectedBody,
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
