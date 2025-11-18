import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPassword from './ResetPassword';
import { DEFAULT_BTN_DISABLED } from '../../../helpers/style-contants';
import { OCS_API_URL } from '../../../helpers/constants';

const mockAuthenticateFetch = vi.fn();

vi.mock('../../../hooks/useAuthenticateFetch', () => ({
  useAuthenticatedFetch: () => mockAuthenticateFetch,
}));

const fillInputs = (current: string, newPass: string, confirm: string) => {
  fireEvent.change(screen.getByPlaceholderText('Current Password'), {
    target: { value: current },
  });
  fireEvent.change(screen.getByPlaceholderText('New Password'), {
    target: { value: newPass },
  });
  fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
    target: { value: confirm },
  });
};

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders form correctly', () => {
    render(<ResetPassword />);

    expect(
      screen.getByRole('heading', { name: /Reset Your Password/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Current Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm New Password')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('shows error if fields are empty', async () => {
    render(<ResetPassword />);
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText('All fields must not be blank')
      ).toBeInTheDocument();
    });
  });

  it('shows error if new password and confirm password do not match', async () => {
    render(<ResetPassword />);
    fillInputs('current123', 'newpass123', 'different123');

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText('New Password and Confirm New Password must match')
      ).toBeInTheDocument();
    });
  });

  it('calls API and sets status on success', async () => {
    render(<ResetPassword />);

    fillInputs('current123', 'newpass123', 'newpass123');

    const successMessage = 'Password updated successfully';
    mockAuthenticateFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: successMessage }),
    } as any);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockAuthenticateFetch).toHaveBeenCalledWith(
        `${OCS_API_URL}/user/reset-password`,
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(screen.getByText(successMessage)).toBeInTheDocument();
    });
  });

  it('sets status on API failure', async () => {
    render(<ResetPassword />);

    fillInputs('current123', 'newpass123', 'newpass123');

    const errorMessage = 'Invalid current password';
    mockAuthenticateFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: errorMessage }),
    } as any);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('disables button while submitting', async () => {
    render(<ResetPassword />);

    fillInputs('current123', 'newpass123', 'newpass123');

    let resolveFetch: any;
    mockAuthenticateFetch.mockReturnValue(
      new Promise((res) => (resolveFetch = res))
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass(DEFAULT_BTN_DISABLED);

    resolveFetch({ ok: true, json: async () => ({ message: 'ok' }) });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});
