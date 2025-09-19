export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface ILatLng {
  LatLng: ICoordinate;
}

export type RouteCoordinate = [number, number];
export type RouteCoordinates = RouteCoordinate[];
