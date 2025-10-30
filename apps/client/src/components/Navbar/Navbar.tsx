import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { OCS_API_URL } from '../../helpers/constants';
import { logout } from '../../store/authSlice';
import type { RootState } from '../../store/store';

const Navbar = () => {
  const loggedIn = useSelector((state: RootState) => !!state.auth.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <div>
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
            <Link to='/user-profile' className='m-2 hover:text-gray-300'>
              Profile
            </Link>
            <button
              onClick={onLogout}
              className='m-2 hover:text-gray-300 hover:cursor-pointer'
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
