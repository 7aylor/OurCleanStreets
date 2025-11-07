import { useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';
import { OCS_API_URL } from '../../helpers/constants';
import { LoaderCircle } from 'lucide-react';
import {
  DEFAULT_BTN,
  DEFAULT_H1,
  DEFAULT_SPINNER,
} from '../../helpers/style-contants';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { IActivity } from '@ocs/types';
import { useDispatch } from 'react-redux';
import { setActivities } from '../../store/activitiesSlice';
import { getFormattedDistance, getFormattedDuration } from '@ocs/library';

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const authenticatedFetch = useAuthenticatedFetch();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const mapUrl = `${OCS_API_URL}/activity/get-user-activities`;
      let response = await authenticatedFetch(mapUrl);

      if (response.ok) {
        return (await response.json()).activities as IActivity[];
      }
    },
  });

  useEffect(() => {
    if (activities) {
      dispatch(setActivities(activities));
    }
  }, [activities, dispatch]);

  const formattedActivities = useMemo(() => {
    if (activities) {
      return activities?.map((a) => {
        const { coordinates } = a.cleanUpRoute;
        const startLocation = coordinates?.[0];
        const endLocation = coordinates?.[coordinates.length - 1];
        const date = new Date(a.activityDate).toLocaleDateString();

        return {
          id: a.id,
          activityDate: date,
          mostCommonItem: a.mostCommonItem,
          trashWeight: a.trashWeight,
          duration: getFormattedDuration(a.cleanUpRoute.duration),
          distance: getFormattedDistance(a.cleanUpRoute.distance),
          startLocation,
          endLocation,
          key: crypto.randomUUID(),
        };
      });
    }
  }, [activities]);

  return (
    <div>
      <h1 className={DEFAULT_H1}>Your Cleanup Activities</h1>
      <div>
        <button className={DEFAULT_BTN}>
          <Link to='/log-activity'>Log Activity</Link>
        </button>
      </div>
      {isLoading && <LoaderCircle className={DEFAULT_SPINNER} />}
      {!isLoading && formattedActivities && formattedActivities.length > 0 && (
        <div className='overflow-x-auto mt-3'>
          <table className='table-auto w-full border-collapse'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-4 py-2 text-left'>Activity Date</th>
                <th className='px-4 py-2 text-left'>Most Common Item</th>
                <th className='px-4 py-2 text-left'>Est. Weight (lbs)</th>
                <th className='px-4 py-2 text-left'>Duration</th>
                <th className='px-4 py-2 text-left'>Distance</th>
                <th className='px-4 py-2 text-left'>Start Location</th>
                <th className='px-4 py-2 text-left'>End Location</th>
              </tr>
            </thead>
            <tbody>
              {formattedActivities.map((a) => (
                <tr key={a.key} className='border-b'>
                  <td className='px-4 py-2 hover:cursor-auto text-indigo-600'>
                    <Link to={`/activity-details/${a.id}`}>
                      {a.activityDate}
                    </Link>
                  </td>
                  <td className='px-4 py-2'>{a.mostCommonItem}</td>
                  <td className='px-4 py-2'>{a.trashWeight}</td>
                  <td className='px-4 py-2'>{a.duration}</td>
                  <td className='px-4 py-2'>{a.distance}</td>
                  <td className='px-4 py-2'>{a.startLocation?.join(', ')}</td>
                  <td className='px-4 py-2'>{a.endLocation?.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Activities;
