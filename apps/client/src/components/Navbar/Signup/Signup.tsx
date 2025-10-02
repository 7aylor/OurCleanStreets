import { useRef, useState } from 'react';
import { OCS_API_URL } from '../../../helpers/constants';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/authSlice';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const [errors, setErrors] = useState<string[]>([]);

  const onSignup = async () => {
    if (passwordRef.current !== confirmPasswordRef.current) {
      setErrors(['Passwords do no match']);
      return;
    } else {
      setErrors([]);
    }

    const loginUrl = `${OCS_API_URL}/auth/signup`;

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
        const data = await response.json();
        console.error('Login failed:', data);
        if (data.success === false && data.errors?.length > 0) {
          setErrors(data.errors);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Sign Up</h2>

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

        <div className='mb-6'>
          <label
            htmlFor='password'
            className='block text-gray-700 font-medium mb-2'
          >
            Re-Enter Password
          </label>
          <input
            type='password'
            name='password'
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Re-Enter your password'
            onChange={(e) => (confirmPasswordRef.current = e.target.value)}
          />
        </div>

        <button
          onClick={onSignup}
          className='w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200'
        >
          Sign Up
        </button>

        {errors &&
          errors.map((err) => (
            <p
              key={err}
              className='text-red-500 text-sm mt-[10px] inline-block'
            >
              {err}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Signup;
