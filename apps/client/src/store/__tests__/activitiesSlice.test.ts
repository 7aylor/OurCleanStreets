import { describe, expect, it } from 'vitest';
import activitiesReducer, { setActivities } from '../activitiesSlice';
import type { IActivity, ICleanUpRoute } from '@ocs/types';

describe('activitiesSlice', () => {
  const initialState: IActivity[] = [];

  const mockRoute: ICleanUpRoute = {
    id: 1,
    createdAt: '2025-11-16T00:00:00Z',
    coordinates: undefined,
    distance: 1000,
    duration: 600,
  };

  const mockActivities: IActivity[] = [
    {
      id: 1,
      userId: 'user1',
      activityDate: '2025-11-15',
      mostCommonItem: 'Plastic Bottle',
      cleanUpRouteId: 1,
      trashWeight: 5,
      createdAt: '2025-11-15T10:00:00Z',
      updatedAt: '2025-11-15T10:00:00Z',
      cleanUpRoute: mockRoute,
    },
    {
      id: 2,
      userId: 'user2',
      activityDate: '2025-11-14',
      mostCommonItem: undefined,
      cleanUpRouteId: 2,
      trashWeight: 3,
      createdAt: '2025-11-14T10:00:00Z',
      updatedAt: '2025-11-14T10:00:00Z',
      cleanUpRoute: mockRoute,
    },
  ];

  it('should return the initial state by default', () => {
    const nextState = activitiesReducer(undefined, { type: 'unknown' });
    expect(nextState).toEqual(initialState);
  });

  it('should handle setActivities', () => {
    const nextState = activitiesReducer(
      initialState,
      setActivities(mockActivities)
    );
    expect(nextState).toEqual(mockActivities);
  });

  it('should replace previous state when setActivities is called', () => {
    const prevState: IActivity[] = [
      {
        id: 3,
        userId: 'user3',
        activityDate: '2025-11-13',
        mostCommonItem: 'Can',
        cleanUpRouteId: 3,
        trashWeight: 2,
        createdAt: '2025-11-13T10:00:00Z',
        updatedAt: '2025-11-13T10:00:00Z',
        cleanUpRoute: mockRoute,
      },
    ];

    const nextState = activitiesReducer(
      prevState,
      setActivities(mockActivities)
    );

    expect(nextState).toEqual(mockActivities);
  });
});
