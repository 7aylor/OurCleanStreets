import { render, screen } from '@testing-library/react';
import Login from './Login';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

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
});
