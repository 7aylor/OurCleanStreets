import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
// @ts-ignore
import L from 'leaflet';
import type { RouteCoordinate, RouteCoordinates } from '@ocs/types';

const FitMapToRoute = ({
  route,
  padding,
}: {
  route: RouteCoordinates;
  padding?: RouteCoordinate;
}) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: padding ?? [10, 10] }); // adds some margin
    }
  }, [route, map]);

  return null;
};

export default FitMapToRoute;
