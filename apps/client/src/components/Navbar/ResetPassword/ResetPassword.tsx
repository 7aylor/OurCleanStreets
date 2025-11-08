import { useRef, useState } from 'react';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticateFetch';
import {
  DEFAULT_BTN,
  DEFAULT_BTN_DISABLED,
  DEFAULT_INPUT,
} from '../../../helpers/style-contants';
import { OCS_API_URL } from '../../../helpers/constants';

const ResetPassword = () => {
  const [resetPasswordStatus, setResetPasswordStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const authenticateFetch = useAuthenticatedFetch();

  const currPassword = useRef('');
  const newPassword = useRef('');
  const confirmNewPassowrd = useRef('');

  const onSubmitResetPassword = async (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    e.preventDefault();

    if (
      !currPassword.current ||
      !newPassword.current ||
      !confirmNewPassowrd.current
    ) {
      setResetPasswordStatus('All fields must not be blank');
      return;
    }

    if (newPassword.current !== confirmNewPassowrd.current) {
      setResetPasswordStatus(
        'New Password and Confirm New Password must match'
      );
      return;
    }

    setSubmitting(true);

    const resetUrl = `${OCS_API_URL}/user/reset-password`;

    try {
      const response = await authenticateFetch(resetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currPassword.current,
          newPassword: newPassword.current,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResetPasswordStatus(() => data?.message);
      } else {
        const data = await response.json();
        console.error('Login failed:', data);
        if (data.success === false && data.message) {
          setResetPasswordStatus(data.message);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className='text-2xl mb-2'>Reset Your Password</h2>
      <form className='flex flex-col w-64'>
        <input
          name='current-password'
          id='current-password'
          placeholder='Current Password'
          className={`${DEFAULT_INPUT} block mt-1`}
          type='password'
          onChange={(e) => (currPassword.current = e.target.value)}
        />
        <input
          name='new-password'
          id='new-password'
          placeholder='New Password'
          className={`${DEFAULT_INPUT} block mt-1 mb-1`}
          type='password'
          onChange={(e) => (newPassword.current = e.target.value)}
        />
        <input
          name='confirm-new-password'
          id='confirm-new-password'
          placeholder='Confirm New Password'
          className={`${DEFAULT_INPUT} block mt-1`}
          type='password'
          onChange={(e) => (confirmNewPassowrd.current = e.target.value)}
        />
        <button
          onClick={onSubmitResetPassword}
          className={`mt-2  ${submitting ? DEFAULT_BTN_DISABLED : DEFAULT_BTN}`}
          type='submit'
          disabled={submitting}
        >
          Submit
        </button>
      </form>
      {resetPasswordStatus && (
        <p className='text-red-500 text-sm mt-[10px] block'>
          {resetPasswordStatus}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
