import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1>OurCleanStreets</h1>
      <div>
        <Link to='/map' className='m-2 hover:text-gray-300'>
          Event Map
        </Link>
        <Link to='/login' className='m-2 hover:text-gray-300'>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
