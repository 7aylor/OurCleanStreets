import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login } from '../../store/authSlice';
import { OCS_API_URL } from '../../helpers/constants';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthenticatedFetch } from '../useAuthenticateFetch';

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const dispatchMock = vi.fn();
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    useDispatch: () => dispatchMock,
    useSelector: (fn: any) =>
      fn({
        auth: {
          accessToken: 'old-token',
          email: 'test@test.com',
          userId: '123',
          username: 'test',
          zipcode: '12345',
        },
      }),
  };
});

function makeStore(initialAuth = {}) {
  return configureStore({
    //@ts-ignore
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        accessToken: 'old-token',
        email: 'test@test.com',
        userId: '123',
        username: 'test',
        zipcode: '12345',
        ...initialAuth,
      },
    },
  });
}

describe('useAuthenticatedFetch', () => {
  let store: any;

  const wrapper = ({ children }: any) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    store = makeStore();
    mockFetch.mockReset();
    dispatchMock.mockReset();
  });

  it('attaches Authorization header', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}'));

    const { result } = renderHook(() => useAuthenticatedFetch(), { wrapper });

    await act(async () => {
      await result.current('/api/test', { body: '{}' });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer old-token',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('injects username + userId into JSON body', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}'));

    const { result } = renderHook(() => useAuthenticatedFetch(), { wrapper });

    await act(async () => {
      await result.current('/api/test', {
        method: 'POST',
        body: JSON.stringify({ test: 1 }),
      });
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);

    expect(body).toEqual({
      test: 1,
      userId: '123',
      username: 'test',
    });
  });

  it('refreshes token on 401 and retries request', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(null, { status: 401 })) // first call error
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'new-token' }), {
          status: 200,
        })
      ) // refresh
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      ); // retry

    const { result } = renderHook(() => useAuthenticatedFetch(), { wrapper });

    await act(async () => {
      await result.current('/api/protected', { body: '{}' });
    });

    expect(mockFetch.mock.calls[1][0]).toBe(`${OCS_API_URL}/auth/refresh`);

    expect(dispatchMock).toHaveBeenCalledWith(
      login({
        accessToken: 'new-token',
        email: 'test@test.com',
        userId: '123',
        username: 'test',
        zipcode: '12345',
      })
    );

    // retry uses new token
    const retryHeaders = mockFetch.mock.calls[2][1].headers;
    expect(retryHeaders.Authorization).toBe('Bearer new-token');
  });

  it('throws Session expired error when refresh fails', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response(null, { status: 401 })) // original request
      .mockResolvedValueOnce(new Response(null, { status: 500 })); // refresh fails

    const { result } = renderHook(() => useAuthenticatedFetch(), { wrapper });

    // Expect the hook call to throw the error
    await expect(
      result.current('/api/protected', { body: '{}' })
    ).rejects.toThrow('Session expired. Please log in again.');
  });

  it('skips user injection when body is invalid JSON', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{}'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useAuthenticatedFetch(), { wrapper });

    await act(async () => {
      await result.current('/api/test', {
        method: 'POST',
        body: 'not a json string',
      });
    });

    expect(warnSpy).toHaveBeenCalledWith(
      'Request body not valid JSON — skipping user injection.'
    );

    // body should not be modified
    expect(mockFetch.mock.calls[0][1].body).toBeUndefined();

    warnSpy.mockRestore();
  });
});
