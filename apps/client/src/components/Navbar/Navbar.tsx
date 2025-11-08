import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
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
      let response = await fetch(logoutUrl, {
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
    <div className='navbar'>
      <h1>
        <Link to='/' className='m-2 hover:text-gray-300'>
          OurCleanStreets
        </Link>
      </h1>
      <div className='flex'>
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
            <div onMouseLeave={() => setShowProfileDropdown(false)}>
              <Link
                to='/user-profile'
                className='m-2 hover:text-gray-300 inline-block'
                onMouseEnter={() => setShowProfileDropdown(true)}
              >
                Profile ▾
              </Link>

              {showProfileDropdown && (
                <div className='absolute right-0 w-40 bg-white text-gray-800 rounded-md shadow-lg z-50'>
                  <Link
                    to='/reset-password'
                    className='block px-4 py-2 hover:bg-gray-100'
                  >
                    Reset Password
                  </Link>
                  <button
                    onClick={onLogout}
                    className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* <button
              onClick={onLogout}
              className='m-2 hover:text-gray-300 hover:cursor-pointer'
            >
              Logout
            </button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
