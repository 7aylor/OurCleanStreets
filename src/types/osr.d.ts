interface ICoordinate {
  lat: number;
  lng: number;
}

interface ILatLng {
  LatLng: ICoordinate;
}

type RouteCoordinate = [number, number];
type RouteCoordinates = RouteCoordinate[];
