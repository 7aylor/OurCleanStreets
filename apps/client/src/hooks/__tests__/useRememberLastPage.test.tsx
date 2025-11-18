import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRememberLastRoute } from '../useRemeberLastPage';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('useRememberLastRoute', () => {
  let useSelectorMock: any;
  let useLocationMock: any;

  beforeEach(async () => {
    localStorage.clear();

    const redux = await import('react-redux');
    useSelectorMock = redux.useSelector as unknown as ReturnType<typeof vi.fn>;

    useLocationMock = (await import('react-router-dom'))
      .useLocation as unknown as ReturnType<typeof vi.fn>;
  });

  it('saves current route to localStorage if logged in', () => {
    useSelectorMock.mockReturnValue('token'); // logged in
    useLocationMock.mockReturnValue({
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'abc',
    });

    renderHook(() => useRememberLastRoute());

    expect(localStorage.getItem('lastRoute')).toBe('/dashboard');
  });

  it('does not save if not logged in', () => {
    useSelectorMock.mockReturnValue(null); // not logged in
    useLocationMock.mockReturnValue({
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'abc',
    });

    renderHook(() => useRememberLastRoute());

    expect(localStorage.getItem('lastRoute')).toBeNull();
  });
});
