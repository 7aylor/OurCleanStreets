import { Link } from 'react-router-dom';
import './Navbar.css';
import { useSelector } from 'react-redux';

const Navbar = () => {
  // @ts-ignore
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  console.log(loggedIn);

  return (
    <div className='navbar'>
      <h1>
        <Link to='/' className='m-2 hover:text-gray-300'>
          OurCleanStreets
        </Link>
      </h1>
      <div>
        <Link to='/map' className='m-2 hover:text-gray-300'>
          Event Map
        </Link>
        {!loggedIn && (
          <>
            <Link to='/login' className='m-2 hover:text-gray-300'>
              Login
            </Link>
            <Link to='/signup' className='m-2 hover:text-gray-300'>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
