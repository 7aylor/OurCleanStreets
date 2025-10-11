import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from './store/store';

export const AuthorizedRoute = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  // Otherwise render nested route
  return <Outlet />;
};
