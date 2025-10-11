import { useRef, useState } from 'react';
import { OCS_API_URL } from '../../../helpers/constants';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../store/authSlice';
import {
  DEFAULT_BTN,
  DEFAULT_BTN_DISABLED,
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
  DEFAULT_SPINNER,
} from '../../../helpers/style-contants';
import { LoaderCircle } from 'lucide-react';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');
  const usernameRef = useRef('');
  const zipcodeRef = useRef('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onSignup = async (e: React.FormEvent) => {
    if (
      !usernameRef?.current ||
      !emailRef?.current ||
      !zipcodeRef.current ||
      !passwordRef?.current ||
      !confirmPasswordRef?.current
    ) {
      setErrors(['All fields must not be blank']);
      return;
    }

    if (passwordRef.current !== confirmPasswordRef.current) {
      e.preventDefault();
      setErrors(['Passwords do no match']);
      return;
    } else {
      setErrors([]);
    }

    setSubmitting(true);

    const loginUrl = `${OCS_API_URL}/auth/signup`;

    try {
      let response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameRef.current,
          email: emailRef.current,
          zipcode: zipcodeRef.current,
          password: passwordRef.current,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          login({
            accessToken: data.accessToken,
            email: data.user.email,
            userId: data.user.userId,
            username: data.user.username,
          })
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <form className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Sign Up</h2>

        <div className='mb-4'>
          <label htmlFor='username' className={DEFAULT_INPUT_LABEL}>
            Username
          </label>
          <input
            type='text'
            name='username'
            className={DEFAULT_INPUT}
            placeholder='Create a username'
            onChange={(e) => (usernameRef.current = e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='email' className={DEFAULT_INPUT_LABEL}>
            Email
          </label>
          <input
            type='email'
            name='email'
            className={DEFAULT_INPUT}
            placeholder='Enter your email'
            onChange={(e) => (emailRef.current = e.target.value)}
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='zipcode' className={DEFAULT_INPUT_LABEL}>
            Zipcode
          </label>
          <input
            type='text'
            name='zipcode'
            className={DEFAULT_INPUT}
            placeholder='Zipcode'
            onChange={(e) => (zipcodeRef.current = e.target.value)}
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='password' className={DEFAULT_INPUT_LABEL}>
            Password
          </label>
          <input
            type='password'
            name='password'
            className={DEFAULT_INPUT}
            placeholder='Enter your password'
            onChange={(e) => (passwordRef.current = e.target.value)}
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='password' className={DEFAULT_INPUT_LABEL}>
            Re-Enter Password
          </label>
          <input
            type='password'
            name='password'
            className={DEFAULT_INPUT}
            placeholder='Re-Enter your password'
            onChange={(e) => (confirmPasswordRef.current = e.target.value)}
            required
          />
        </div>

        <div>
          <button
            onClick={onSignup}
            className={`w-full ${
              submitting ? DEFAULT_BTN_DISABLED : DEFAULT_BTN
            }`}
            type='submit'
            disabled={submitting}
          >
            Sign Up
          </button>
          {submitting && <LoaderCircle className={DEFAULT_SPINNER} />}
        </div>

        {errors &&
          errors.map((err) => (
            <p
              key={err}
              className='text-red-500 text-sm mt-[10px] inline-block'
            >
              {err}
            </p>
          ))}
      </form>
    </div>
  );
};

export default Signup;
