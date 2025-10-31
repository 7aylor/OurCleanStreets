import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Map from '../Mapping/MapParts/Map';
// @ts-ignore
import type { LatLngBoundsExpression } from 'leaflet';
import { OCS_API_URL } from '../../helpers/constants';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';
import type { BasicRoute, RouteCoordinate, RouteCoordinates } from '@ocs/types';
import { Polyline } from 'react-leaflet';
import { getRouteColorByDate } from '../../helpers/utils';

type DashboardRoute = {
  coordinates: RouteCoordinates;
  color: string;
};

const Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const [center, setCenter] = useState<RouteCoordinate | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();
  const [routes, setRoutes] = useState<DashboardRoute[]>([]);

  console.log(auth);

  const { zipcode } = auth;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const mapUrl = `${OCS_API_URL}/map/get-routes-by-zipcode`;
        const response = await authenticatedFetch(mapUrl, {
          body: JSON.stringify({ zipcode }),
        });

        if (response.ok) {
          const json = (await response.json()) as BasicRoute[];
          console.log(json);

          const resRoutes: DashboardRoute[] = json
            .sort(
              (a, b) =>
                new Date(a.activityDate).getTime() -
                new Date(b.activityDate).getTime()
            )
            .map((r) => {
              return {
                coordinates: r.coordinates ?? [],
                color: getRouteColorByDate(new Date(r.activityDate)),
              };
            });

          setRoutes(resRoutes);

          getCenterPoint(json);
        } else {
          console.error('Failed to fetch dashboard data:', response.status);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getCenterPoint = (activities: BasicRoute[]) => {
    const allPoints = activities.flatMap((r) => r.coordinates ?? []);

    if (allPoints.length === 0) return null;

    // Compute average -- the midpoint between all the route points
    const avgLat =
      allPoints.reduce((sum, point) => sum + point[0], 0) / allPoints.length;
    const avgLng =
      allPoints.reduce((sum, point) => sum + point[1], 0) / allPoints.length;
    const center: RouteCoordinate = [avgLat, avgLng];

    setCenter(center);
  };

  return (
    <>
      {center && (
        <Map
          editable={true}
          center={center}
          style={{ height: '60vh' }}
          zoom={16}
        >
          {routes?.length > 0 &&
            routes.map((route) => (
              <Polyline
                positions={route.coordinates}
                // @ts-ignore
                weight={5}
                color={route.color}
              />
            ))}
        </Map>
      )}
    </>
  );
};

export default Dashboard;
