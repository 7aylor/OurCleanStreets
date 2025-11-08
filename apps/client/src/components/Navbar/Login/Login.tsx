import { useDispatch } from 'react-redux';
import { login } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { OCS_API_URL } from '../../../helpers/constants';
import { useRef, useState } from 'react';
import {
  DEFAULT_BTN,
  DEFAULT_BTN_DISABLED,
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
  DEFAULT_SPINNER,
} from '../../../helpers/style-contants';
import { LoaderCircle } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onLogin = async (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!emailRef?.current || !passwordRef?.current) {
      setErrors(['All fields must not be blank']);
      return;
    }

    setSubmitting(true);
    const loginUrl = `${OCS_API_URL}/auth/login`;
    e.preventDefault();

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
          login({
            accessToken: data.accessToken,
            email: data.user.email,
            userId: data.user.userId,
            username: data.user.username,
            zipcode: data.user.zipcode,
          })
        );
        navigate('/dashboard');
      } else {
        const data = await response.json();
        if (data.success === false && data.errors?.length > 0) {
          setErrors(data.errors);
        }
      }
    } catch (err) {
      e.preventDefault();
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onSignup = () => {
    navigate('/signup');
  };

  return (
    <div className='flex justify-center min-h-screen bg-gray-100'>
      <form className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-semibold text-center mb-6'>Login</h2>

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

        <div>
          <button
            onClick={onLogin}
            className={`w-full ${
              submitting ? DEFAULT_BTN_DISABLED : DEFAULT_BTN
            }`}
            type='submit'
            name='login'
            disabled={submitting}
          >
            Login
          </button>
          {submitting && (
            <LoaderCircle className={`${DEFAULT_SPINNER} w-full mt-2`} />
          )}
        </div>

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

export default Login;
