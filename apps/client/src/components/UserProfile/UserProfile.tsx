import { useSelector } from 'react-redux';
import type { AuthRootState } from '../../store/store';
import { useState } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';
import { DEFAULT_BTN, DEFAULT_INPUT } from '../../helpers/style-contants';

const RESET_PASSWORD = 'Reset Password';

const UserProfile = () => {
  const email = useSelector((state: AuthRootState) => state.auth.email);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordStatus, setResetPasswordStatus] = useState('');
  const authenticateFetch = useAuthenticatedFetch();

  const onSubmitResetPassword = async () => {
    const result = await authenticateFetch('/user/reset-password');

    if (result.ok) {
      const data = result.json();
      console.log(data);
    }
  };

  return (
    <div>
      <h2>Hello, {email}</h2>
      {!resetPassword && (
        <button
          onClick={() => setResetPassword(true)}
          className={`${DEFAULT_BTN} mt-1`}
        >
          Reset Password
        </button>
      )}
      {resetPassword && (
        <div>
          <input
            name='current-password'
            id='current-password'
            placeholder='Current Password'
            className={`${DEFAULT_INPUT} w-min block mt-1`}
            type='password'
          />
          <input
            name='confirm-password'
            id='confirm-password'
            placeholder='Confirm Password'
            className={`${DEFAULT_INPUT} w-min block mt-1`}
            type='password'
          />
          <input
            name='new-password'
            id='new-password'
            placeholder='New Password'
            className={`${DEFAULT_INPUT} w-min block mt-1 mb-1`}
            type='password'
          />
          <div className='flex'>
            <button
              onClick={onSubmitResetPassword}
              className={`${DEFAULT_BTN}`}
            >
              Submit
            </button>
            <button
              onClick={() => setResetPassword(false)}
              className={`${DEFAULT_BTN} ml-1`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {resetPasswordStatus && (
        <p className='text-red-500'>{resetPasswordStatus}</p>
      )}
    </div>
  );
};

export default UserProfile;
