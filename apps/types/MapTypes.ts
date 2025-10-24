export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface ILatLng {
  LatLng: ICoordinate;
}

export type RouteCoordinate = [number, number];
export type RouteCoordinates = RouteCoordinate[];

export interface IGeocode {
  features: {
    geometry: {
      coordinates: RouteCoordinate;
    };
    properties: {
      country: string;
      label: string;
    };
  }[];
}

export type MapSearchMatch = {
  address: string;
  coordinates: RouteCoordinate;
  country: string;
};
