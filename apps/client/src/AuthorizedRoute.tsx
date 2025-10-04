import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { AuthRootState } from './store/store';

export const AuthorizedRoute = () => {
  const accessToken = useSelector(
    (state: AuthRootState) => state.auth.accessToken
  );

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  // Otherwise render nested route
  return <Outlet />;
};
