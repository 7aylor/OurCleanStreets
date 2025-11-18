import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { login as loginAction } from '../../../store/authSlice';

let dispatchMock: ReturnType<typeof vi.fn>;
let navigateMock: ReturnType<typeof vi.fn>;

const renderLogin = () => {
  render(
    <Provider
      store={
        {
          getState: () => ({ auth: { accessToken: null } }),
          subscribe: () => {},
          dispatch: dispatchMock,
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
  beforeEach(() => {
    dispatchMock = vi.fn();
    navigateMock = vi.fn();

    vi.mock('react-redux', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        // @ts-ignore
        ...actual,
        useDispatch: () => dispatchMock,
      };
    });

    vi.mock('react-router-dom', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        // @ts-ignore
        ...actual,
        useNavigate: () => navigateMock,
      };
    });
  });

  it('renders login form correctly', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('shows error when fields are empty and login clicked', async () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(
        screen.getByText('All fields must not be blank')
      ).toBeInTheDocument();
    });
  });

  it('dispatches login and navigates on successful login', async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: 'token123',
        user: {
          email: 'test@example.com',
          userId: 'user123',
          username: 'tester',
          zipcode: '12345',
        },
      }),
    } as any);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        loginAction({
          accessToken: 'token123',
          email: 'test@example.com',
          userId: 'user123',
          username: 'tester',
          zipcode: '12345',
        })
      );
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });

    fetchMock.mockRestore();
  });

  it('shows errors when login fails', async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });

    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, errors: ['Invalid credentials'] }),
    } as any);

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('navigates to signup page when signup link clicked', () => {
    renderLogin();

    const signupLink = screen.getByText('Sign Up');
    fireEvent.click(signupLink);

    expect(navigateMock).toHaveBeenCalledWith('/signup');
  });
});
