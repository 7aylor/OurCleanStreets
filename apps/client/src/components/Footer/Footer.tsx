import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='flex bg-green-600 text-white p-3'>
      <div className='flex flex-col md:flex-row justify-between items-center text-sm'>
        <p>© {new Date().getFullYear()} Our Clean Streets</p>
        <nav className='flex gap-4 ml-4'>
          <Link to='/about'>About</Link>
          <a href='https://github.com/7aylor/OurCleanStreets' target='_blank'>
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
