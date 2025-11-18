import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// helper function for filling the form
const fillForm = ({
  username = 'testuser',
  email = 'test@example.com',
  zipcode = '12345',
  password = 'password123',
  confirmPassword = 'password123',
} = {}) => {
  fireEvent.change(screen.getByPlaceholderText(/create a username/i), {
    target: { value: username },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText(/zipcode/i), {
    target: { value: zipcode },
  });
  fireEvent.change(screen.getAllByPlaceholderText(/enter your password/i)[0], {
    target: { value: password },
  });
  fireEvent.change(
    screen.getAllByPlaceholderText(/re-enter your password/i)[0],
    { target: { value: confirmPassword } }
  );
};

describe('Signup component', () => {
  it('renders the form fields and button', () => {
    render(<Signup />);
    expect(
      screen.getByRole('heading', { name: /sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/create a username/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/zipcode/i)).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(/enter your password/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByPlaceholderText(/re-enter your password/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('shows error if fields are empty', async () => {
    render(<Signup />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(
      await screen.findByText(/all fields must not be blank/i)
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows error if passwords do not match', async () => {
    render(<Signup />);
    fillForm({ password: 'password1', confirmPassword: 'password2' });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(
      await screen.findByText(/passwords do no match/i)
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('calls API and dispatches login on successful signup', async () => {
    render(<Signup />);
    fillForm();

    const fakeResponse = {
      ok: true,
      json: async () => ({
        accessToken: 'token123',
        user: {
          email: 'test@example.com',
          userId: '1',
          username: 'testuser',
          zipcode: '12345',
        },
      }),
    };
    (fetch as any).mockResolvedValue(fakeResponse);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'auth/login',
        payload: {
          accessToken: 'token123',
          email: 'test@example.com',
          userId: '1',
          username: 'testuser',
          zipcode: '12345',
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith('/user-profile');
    });
  });

  it('shows errors from API response when signup fails', async () => {
    render(<Signup />);
    fillForm();

    const fakeResponse = {
      ok: false,
      json: async () => ({ success: false, errors: ['Email already exists'] }),
    };
    (fetch as any).mockResolvedValue(fakeResponse);

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText(/email already exists/i)
    ).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('disables button while submitting', async () => {
    render(<Signup />);
    fillForm();

    let resolveFetch: (value: any) => void;
    const fetchPromise = new Promise((res) => {
      resolveFetch = res;
    });
    (fetch as any).mockReturnValue(fetchPromise);

    const button = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(button);
    expect(button).toBeDisabled();

    resolveFetch!({
      ok: true,
      json: async () => ({ accessToken: 'token', user: {} }),
    });
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
