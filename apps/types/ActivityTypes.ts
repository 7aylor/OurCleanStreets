import type { RouteCoordinate } from './MapTypes';

export interface IActivityResponse {
  activities: IActivity[];
}

export interface IActivity {
  id: number;
  userId: string;
  activityDate: string;
  mostCommonItem: string | null;
  cleanUpRouteId: number;
  createdAt: string;
  updatedAt: string;
  cleanUpRoute: ICleanUpRoute;
}

export interface ICleanUpRoute {
  id: number;
  createdAt: string;
  coordinates: RouteCoordinate[] | null;
  distance: number;
  duration: number;
}
