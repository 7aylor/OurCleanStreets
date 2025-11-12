import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { useAuthenticateOnLoad } from './hooks/useAuthenticateOnLoad';
import Footer from './components/Footer/Footer';
import { useRememberLastRoute } from './hooks/useRemeberLastPage';

function Layout() {
  useAuthenticateOnLoad();
  useRememberLastRoute();
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <main className='p-4 min-h-[90vh]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
