import { renderHook, act } from '@testing-library/react';
import { useAuthenticateOnLoad } from '../useAuthenticateOnLoad';
import { vi, describe, it, beforeEach, expect } from 'vitest';

const dispatchMock = vi.fn();
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-redux')>();
  return {
    ...actual,
    useDispatch: () => dispatchMock,
  };
});

const navigateMock = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('useAuthenticateOnLoad', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    navigateMock.mockClear();
    mockFetch.mockReset();
    localStorage.clear();
  });

  it('dispatches login and navigates when refresh succeeds', async () => {
    const fakeData = {
      accessToken: 'token123',
      email: 'test@test.com',
      userId: '123',
      username: 'tester',
      zipcode: '12345',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    localStorage.setItem('lastRoute', '/dashboard');

    renderHook(() => useAuthenticateOnLoad());

    await act(() => Promise.resolve());

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/login', payload: fakeData })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  it('dispatches logout when refresh fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    renderHook(() => useAuthenticateOnLoad());

    await act(() => Promise.resolve());

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/logout' })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('dispatches logout when fetch throws an error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderHook(() => useAuthenticateOnLoad());

    await act(() => Promise.resolve());

    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/logout' })
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/loading' })
    );
  });

  it('navigates to /user-profile if no lastRoute in localStorage', async () => {
    const fakeData = {
      accessToken: 'token123',
      email: 'test@test.com',
      userId: '123',
      username: 'tester',
      zipcode: '12345',
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    renderHook(() => useAuthenticateOnLoad());

    await act(() => Promise.resolve());

    expect(navigateMock).toHaveBeenCalledWith('/user-profile');
  });
});
