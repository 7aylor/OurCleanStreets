import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { OCS_API_URL } from '../../helpers/constants';
import { logout } from '../../store/authSlice';
import type { RootState } from '../../store/store';
import { useState } from 'react';

const Navbar = () => {
  const loggedIn = useSelector((state: RootState) => !!state.auth.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const onLogout = async () => {
    const logoutUrl = `${OCS_API_URL}/auth/logout`;
    try {
      const response = await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(logout());
        navigate('/');
      } else {
        console.error('Logout failed:', await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav
      className='
        flex justify-between items-center
        h-[60px] px-2
        bg-green-800 text-white border-b-2 border-green-900
        font-[Verdana] font-light
      '
    >
      <div className='font-thin '>
        <Link to='/' className='m-2 hover:opacity-80 text-xl flex items-center'>
          <img src='/earth.png' height='40px' width='40px' className='mr-2' />
          <span>OurCleanStreets</span>
        </Link>
      </div>

      <div className='flex items-center'>
        {!loggedIn && (
          <Link to='/login' className='m-2 hover:text-gray-300'>
            Login
          </Link>
        )}

        {loggedIn && (
          <>
            <Link to='/dashboard' className='m-2 hover:text-gray-300'>
              Dashboard
            </Link>
            <Link to='/activities' className='m-2 hover:text-gray-300'>
              Activities
            </Link>

            <div
              className='relative inline-block'
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <Link
                to='/user-profile'
                className='m-2 hover:text-gray-300 inline-block'
                onMouseEnter={() => setShowProfileDropdown(true)}
              >
                Profile ▾
              </Link>

              {showProfileDropdown && (
                <div
                  className='
                    absolute right-0
                    w-40 bg-white text-gray-800
                    rounded-md shadow-lg z-50
                  '
                >
                  <Link
                    to='/reset-password'
                    className='block px-4 py-2 hover:bg-green-200 hover:rounded-t-md'
                  >
                    Reset Password
                  </Link>
                  <button
                    onClick={onLogout}
                    className='block w-full text-left px-4 py-2 hover:bg-green-200 hover:rounded-b-md hover:cursor-pointer'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
