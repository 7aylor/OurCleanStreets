import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from './store/store';

export const AuthorizedRoute = () => {
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    // show loader while checking token
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800'></div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to='/login' replace />;
  }

  // Otherwise render nested route
  return <Outlet />;
};
