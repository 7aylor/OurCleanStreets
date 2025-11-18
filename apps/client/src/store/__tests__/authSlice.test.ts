import { describe, expect, it } from 'vitest';
import authReducer, { login, logout, loading } from '../authSlice';

interface AuthState {
  accessToken: string | null;
  email: string | null;
  userId: string | null;
  username: string | null;
  zipcode: string | null;
  loading: boolean | null;
}

describe('authSlice', () => {
  const initialState: AuthState = {
    accessToken: null,
    email: null,
    userId: null,
    username: null,
    zipcode: null,
    loading: true,
  };

  const mockPayload = {
    accessToken: 'token123',
    email: 'test@example.com',
    userId: 'user123',
    username: 'testuser',
    zipcode: '12345',
  };

  it('should return the initial state by default', () => {
    const nextState = authReducer(undefined, { type: 'unknown' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle login', () => {
    const nextState = authReducer(initialState, login(mockPayload));
    expect(nextState).toEqual({
      ...mockPayload,
      loading: true,
    });
  });

  it('should handle logout', () => {
    const prevState: AuthState = {
      accessToken: 'token123',
      email: 'test@example.com',
      userId: 'user123',
      username: 'testuser',
      zipcode: '12345',
      loading: false,
    };

    const nextState = authReducer(prevState, logout());
    expect(nextState).toEqual({
      accessToken: null,
      email: null,
      userId: null,
      username: null,
      zipcode: null,
      loading: false,
    });
  });

  it('should handle loading', () => {
    const nextState = authReducer(initialState, loading(false));
    expect(nextState.loading).toBe(false);

    const nextState2 = authReducer(nextState, loading(true));
    expect(nextState2.loading).toBe(true);
  });

  it('login should not mutate previous state', () => {
    const prevState = { ...initialState };
    authReducer(prevState, login(mockPayload));
    expect(prevState).toEqual(initialState);
  });

  it('logout should not mutate previous state', () => {
    const prevState = { ...mockPayload, loading: true };
    authReducer(prevState, logout());
    expect(prevState).toEqual({ ...mockPayload, loading: true });
  });
});
