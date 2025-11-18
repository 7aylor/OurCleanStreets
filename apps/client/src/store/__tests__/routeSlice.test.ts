import { describe, expect, it } from 'vitest';
import routeReducer, { currentRoute, type RouteState } from '../routeSlice';
import type { ICoordinate } from '@ocs/types';

describe('routeSlice', () => {
  const initialState: RouteState = {
    coordinates: [],
    duration: 0,
    distance: 0,
  };

  const mockCoordinates: ICoordinate[] = [
    { lat: 12.3, lng: -45.6 },
    { lat: 32.1, lng: -65.4 },
  ];

  const mockRoute: RouteState = {
    coordinates: mockCoordinates,
    duration: 1200,
    distance: 5000,
  };

  it('should return the initial state by default', () => {
    const nextState = routeReducer(undefined, { type: 'unknown' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle currentRoute', () => {
    const nextState = routeReducer(initialState, currentRoute(mockRoute));
    expect(nextState).toEqual(mockRoute);
  });

  it('should handle empty coordinates', () => {
    const nextState = routeReducer(
      initialState,
      currentRoute({ ...mockRoute, coordinates: [] })
    );
    expect(nextState.coordinates).toEqual([]);
    expect(nextState.duration).toBe(mockRoute.duration);
    expect(nextState.distance).toBe(mockRoute.distance);
  });

  it('should replace previous state when currentRoute is called', () => {
    const prevState: RouteState = {
      coordinates: [{ lat: 0, lng: 0 }],
      duration: 100,
      distance: 200,
    };
    const nextState = routeReducer(prevState, currentRoute(mockRoute));
    expect(nextState).toEqual(mockRoute);
  });

  it('should not mutate previous state', () => {
    const prevState: RouteState = { ...initialState };
    routeReducer(prevState, currentRoute(mockRoute));
    expect(prevState).toEqual(initialState);
  });
});
