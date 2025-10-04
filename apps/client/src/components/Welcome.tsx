import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AuthRootState } from '../store/store';

function Welcome() {
  const navigate = useNavigate();

  const loggedIn = useSelector(
    (state: AuthRootState) => state.auth.accessToken
  );

  const onGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br to-blue-100'>
      <div className='text-center max-w-lg p-8 bg-white/80 backdrop-blur rounded-2xl shadow-lg'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-gray-800 mb-4'>
          Welcome to <span className='text-green-600'>Our Clean Streets!</span>
        </h1>
        <p className='text-lg text-gray-600 mb-6'>
          The community app that helps keep your neighborhood clean and thriving
          — together.
        </p>
        {!loggedIn && (
          <button
            onClick={onGetStarted}
            className='px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-green-700 transition'
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}

export default Welcome;
