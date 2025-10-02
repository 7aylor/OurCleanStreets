import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { OCS_API_URL } from '../../../helpers/constants';
import { useRef } from 'react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const onLogin = async () => {
    const loginUrl = `${OCS_API_URL}/auth/login`;

    try {
      let response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRef.current,
          password: passwordRef.current,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          login({ accessToken: data.accessToken, email: data.user.email })
        );
        navigate('/user-profile');
      } else {
        console.error('Login failed:', await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSignup = () => {
    navigate('/signup');
  };

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Login</h2>

        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-gray-700 font-medium mb-2'
          >
            Email
          </label>
          <input
            type='email'
            name='email'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter your email'
            onChange={(e) => (emailRef.current = e.target.value)}
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-medium mb-2'
          >
            Password
          </label>
          <input
            type='password'
            name='password'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Enter your password'
            onChange={(e) => (passwordRef.current = e.target.value)}
          />
        </div>

        <button
          className='w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200'
          onClick={onLogin}
        >
          Login
        </button>

        <div>
          <p>
            Not a member?{' '}
            <a
              onClick={onSignup}
              className='font-semibold text-indigo-600 hover:cursor-pointer mt-[10px] inline-block'
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
