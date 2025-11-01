import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Map from '../Mapping/MapParts/Map';
// @ts-ignore
import type { LatLngBoundsExpression } from 'leaflet';
import { OCS_API_URL } from '../../helpers/constants';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';
import type {
  DashboardData,
  RouteCoordinate,
  RouteCoordinates,
} from '@ocs/types';
import { Polyline } from 'react-leaflet';
import {
  getFormattedDistance,
  getFormattedDuration,
  getRouteColorByDate,
} from '../../helpers/utils';

type DashboardRoute = {
  coordinates: RouteCoordinates;
  color: string;
};

const Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  const [center, setCenter] = useState<RouteCoordinate | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();
  const [routes, setRoutes] = useState<DashboardRoute[]>([]);
  const [totalDuration, setTotalDuration] = useState('');
  const [totalDistance, setTotalDistance] = useState('');
  const [totalTrashWeight, setTotalTrashWeight] = useState(0);

  const { zipcode } = auth;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const mapUrl = `${OCS_API_URL}/map/get-routes-by-zipcode`;
        const response = await authenticatedFetch(mapUrl, {
          body: JSON.stringify({ zipcode }),
        });

        if (response.ok) {
          const json = (await response.json()) as DashboardData[];
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
          calculateTotalDistance(json);
          calculateTotalDuration(json);
          calculateTotalWeight(json);

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

  const getCenterPoint = (activities: DashboardData[]) => {
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

  const calculateTotalDistance = (activities: DashboardData[]) => {
    const total: number = activities.reduce(
      (acc: number, curr: DashboardData) => {
        return acc + curr.distance;
      },
      0
    );

    const miles = getFormattedDistance(total);
    setTotalDistance(miles);
  };

  const calculateTotalDuration = (activities: DashboardData[]) => {
    const total: number = activities.reduce(
      (acc: number, curr: DashboardData) => {
        return acc + curr.duration;
      },
      0
    );

    const duration = getFormattedDuration(total);
    setTotalDuration(duration);
  };

  const calculateTotalWeight = (activities: DashboardData[]) => {
    const total: number = activities.reduce(
      (acc: number, curr: DashboardData) => {
        return acc + curr.trashWeight;
      },
      0
    );

    setTotalTrashWeight(total);
  };

  return (
    <>
      <div className='mb-2 bg-white shadow-md rounded-2xl p-4 border border-gray-100'>
        <h2 className='text-3xl text-center font-semibold text-gray-800 mb-2'>
          Community Contributions - {zipcode}
        </h2>
        <hr className='mb-4 border-gray-200' />
        <div className='grid grid-cols-3 gap-6 text-center'>
          <div className='bg-gray-100 rounded-xl p-4'>
            <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Trash Collected (lbs)
            </h3>
            <p className='text-2xl font-semibold text-gray-800 mt-1'>
              {totalTrashWeight}
            </p>
          </div>
          <div className='bg-gray-100 rounded-xl p-4'>
            <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Total Cleanup Time
            </h3>
            <p className='text-2xl font-semibold text-gray-800 mt-1'>
              {totalDuration}
            </p>
          </div>
          <div className='bg-gray-100 rounded-xl p-4'>
            <h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Total Cleanup Distance
            </h3>
            <p className='text-2xl font-semibold text-gray-800 mt-1'>
              {totalDistance}
            </p>
          </div>
        </div>
      </div>
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
