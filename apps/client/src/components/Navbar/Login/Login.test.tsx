import { render, screen } from '@testing-library/react';
import Login from './Login';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// Mock Redux and Router hooks
// vi.mock('react-redux', async () => {
//   const actual = await vi.importActual<typeof import('react-router-dom')>(
//     'react-redux'
//   );
//   return {
//     ...actual,
//     useDispatch: vi.fn(),
//   };
// });

// vi.mock('react-router-dom', async () => {
//   const actual = await vi.importActual<typeof import('react-router-dom')>(
//     'react-router-dom'
//   );
//   return {
//     ...actual,
//     useNavigate: vi.fn(),
//   };
// });

// const mockDispatch = vi.fn();
// const mockNavigate = vi.fn();

// beforeEach(() => {
//   require('react-redux').useDispatch.mockReturnValue(mockDispatch);
//   require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
//   global.fetch = vi.fn();
// });

// afterEach(() => {
//   vi.clearAllMocks();
// });

const renderLogin = () => {
  render(
    <Provider
      store={
        {
          getState: () => ({}),
          subscribe: () => {},
          dispatch: vi.fn(),
        } as any
      }
    >
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );
};

describe('Login.tsx', () => {
  it('renders login form correctly', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('', () => {});

  // it('submits login successfully and dispatches', async () => {
  //   global.fetch = vi.fn().mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({
  //       accessToken: 'abc123',
  //       user: { email: 'test@example.com' },
  //     }),
  //   });

  //   renderLogin();

  //   await MouseEvent.type(
  //     screen.getByPlaceholderText(/enter your email/i),
  //     'test@example.com'
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/enter your password/i),
  //     'password123'
  //   );
  //   await userEvent.click(screen.getByRole('button', { name: /login/i }));

  //   await waitFor(() => {
  //     expect(mockDispatch).toHaveBeenCalledWith({
  //       type: 'auth/login',
  //       payload: { accessToken: 'abc123', email: 'test@example.com' },
  //     });
  //     expect(mockNavigate).toHaveBeenCalledWith('/user-profile');
  //   });
  // });

  // it('shows error messages from API', async () => {
  //   global.fetch = vi.fn().mockResolvedValueOnce({
  //     ok: false,
  //     json: async () => ({
  //       success: false,
  //       errors: ['Invalid credentials'],
  //     }),
  //   });

  //   renderLogin();

  //   await userEvent.type(
  //     screen.getByPlaceholderText(/enter your email/i),
  //     'wrong@example.com'
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/enter your password/i),
  //     'badpassword'
  //   );
  //   await userEvent.click(screen.getByRole('button', { name: /login/i }));

  //   expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  // });

  // it('navigates to signup when clicking Sign Up link', async () => {
  //   renderLogin();

  //   await userEvent.click(screen.getByText(/sign up/i));

  //   expect(mockNavigate).toHaveBeenCalledWith('/signup');
  // });

  // it('disables login button when submitting', async () => {
  //   global.fetch = vi.fn().mockImplementationOnce(
  //     () =>
  //       new Promise((resolve) =>
  //         setTimeout(
  //           () =>
  //             resolve({
  //               ok: true,
  //               json: async () => ({
  //                 accessToken: '123',
  //                 user: { email: 'a@b.com' },
  //               }),
  //             }),
  //           100
  //         )
  //       )
  //   );

  //   renderLogin();

  //   await userEvent.type(
  //     screen.getByPlaceholderText(/enter your email/i),
  //     'a@b.com'
  //   );
  //   await userEvent.type(
  //     screen.getByPlaceholderText(/enter your password/i),
  //     'password'
  //   );
  //   await userEvent.click(screen.getByRole('button', { name: /login/i }));

  //   expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  // });

  // it('shows validation error when fields are empty', async () => {
  //   renderLogin();

  //   const loginButton = screen.getByRole('button', { name: /login/i });

  //   await userEvent.click(loginButton);

  //   // The fetch call should NOT happen because the form is invalid
  //   expect(global.fetch).not.toHaveBeenCalled();

  //   // The error message should appear
  //   expect(
  //     await screen.findByText(/all fields must not be blank/i)
  //   ).toBeInTheDocument();
  // });
});
