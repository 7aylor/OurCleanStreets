import type { RouteCoordinates } from './MapTypes';

export interface IActivityResponse {
  activities: IActivity[];
}

export interface IActivity {
  id: number;
  userId: string;
  activityDate: string;
  mostCommonItem: string | undefined;
  cleanUpRouteId: number;
  createdAt: string;
  updatedAt: string;
  cleanUpRoute: ICleanUpRoute;
}

export interface ICleanUpRoute {
  id: number;
  createdAt: string;
  coordinates: RouteCoordinates | undefined;
  distance: number;
  duration: number;
}
