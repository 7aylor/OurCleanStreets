import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { useAuthenticateOnLoad } from './hooks/useAuthenticateOnLoad';

function Layout() {
  //TODO: Setup Loader spinner to cover page while this loads
  useAuthenticateOnLoad();
  // useRememberLastRoute();
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
