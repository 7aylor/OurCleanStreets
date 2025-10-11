import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT_BTN,
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
} from '../../helpers/style-contants';
import EventMap from '../Mapping/EventMap';
import type { RootState } from '../../store/store';
import { useEffect, useMemo, useRef } from 'react';
import { getDurationParts, OCS_API_URL } from '../../helpers/constants';
import { currentRoute } from '../../store/routeSlice';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch.tsx';

const Activity = () => {
  const { coordinates, duration, distance } = useSelector(
    (state: RootState) => state.route
  );

  const activityDateRef = useRef('');
  const mostCommonItemRef = useRef('');
  const authenticatedFetch = useAuthenticatedFetch();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentRoute({ coordinates: [], duration: 0, distance: 0 }));
  }, []);

  const formattedDuration = useMemo(() => {
    const { hours, minutes, seconds } = getDurationParts(duration);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [duration]);

  const formattedDistance = useMemo(() => `${duration}m`, [duration]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      coordinates,
      distance,
      duration,
      activityDate: activityDateRef.current,
      mostCommonItem: mostCommonItemRef.current,
    };
    console.log(payload);

    const mapUrl = `${OCS_API_URL}/activity/log-activity`;

    let response = await authenticatedFetch(mapUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(response);
  };

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-900 tracking-tight text-center'>
        Log Cleanup Activity
      </h1>
      <form>
        <div>
          <EventMap />
        </div>
        <div className='grid grid-cols-4 gap-3 mt-3'>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Date:</label>
            <input
              type='date'
              onChange={(e) => (activityDateRef.current = e.target.value)}
              className={DEFAULT_INPUT}
            />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Most Common Item:</label>
            <input
              type='text'
              onChange={(e) => (mostCommonItemRef.current = e.target.value)}
              className={`${DEFAULT_INPUT}`}
            />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Distance:</label>
            <input
              type='text'
              className={`${DEFAULT_INPUT} border-black text-gray-400`}
              placeholder='To be calculated...'
              disabled
              value={distance > 0 ? formattedDistance : ''}
            />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Duration</label>
            <input
              type='text'
              className={`${DEFAULT_INPUT} border-black text-gray-400`}
              placeholder='To be calculated...'
              disabled
              value={duration > 0 ? formattedDuration : ''}
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button
            className={`${DEFAULT_BTN} mt-4 w-155 self-center`}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Activity;
