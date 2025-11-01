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

export type DashboardData = {
  activityDate: Date;
  coordinates: RouteCoordinates | undefined;
  zipcode: string;
  userId: string;
  distance: number;
  duration: number;
  trashWeight: number;
};

export type GeocodeResult = {
  features: GeocodeFeature[];
};

export type GeocodeFeature = {
  properties?: {
    postalcode?: string;
  };
};
