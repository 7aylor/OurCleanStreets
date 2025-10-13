import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
// @ts-ignore
import L from 'leaflet';
import type { RouteCoordinates } from '@ocs/types';

const FitMapToRoute = ({ route }: { route: RouteCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [10, 10] }); // adds some margin
    }
  }, [route, map]);

  return null;
};

export default FitMapToRoute;
