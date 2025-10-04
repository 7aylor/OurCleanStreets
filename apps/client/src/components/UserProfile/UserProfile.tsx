import { useSelector } from 'react-redux';
import type { AuthRootState } from '../../store/store';
import { useState } from 'react';

const RESET_PASSWORD = 'Reset Password';

const UserProfile = () => {
  const email = useSelector((state: AuthRootState) => state.auth.email);
  const [resetPassword, setResetPassword] = useState(RESET_PASSWORD);

  const onResetPasswordClick = () => {
    setResetPassword(() =>
      resetPassword === RESET_PASSWORD ? 'Cancel' : RESET_PASSWORD
    );
  };

  return (
    <div>
      <h2>Hello, {email}</h2>
      <button
        onClick={onResetPasswordClick}
        className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200'
      >
        {resetPassword}
      </button>
      {resetPassword === 'Cancel' && (
        <div>
          <input
            name='current-password'
            id='current-password'
            placeholder='Current Password'
            className='block border-black border-1 rounded-sm mt-3 mb-3 pl-[4px]'
            type='password'
          />
          <input
            name='confirm-password'
            id='confirm-password'
            placeholder='Confirm Password'
            className='block border-black border-1 rounded-sm mt-3 mb-3 pl-[4px]'
            type='password'
          />
          <input
            name='new-password'
            id='new-password'
            placeholder='New Password'
            className='block border-black border-1 rounded-sm mt-3 mb-3 pl-[4px]'
            type='password'
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
