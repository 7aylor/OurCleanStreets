import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_BTN, DEFAULT_H1 } from '../../helpers/style-contants.ts';
import EventMap from '../Mapping/EventMap.tsx';
import type { RootState } from '../../store/store.ts';
import { useEffect, useState } from 'react';
``;
import { OCS_API_URL } from '../../helpers/constants.ts';
import { currentRoute } from '../../store/routeSlice.ts';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch.tsx';
import ActivityFields from './ActivityFields.tsx';

const LogActivity = () => {
  const { coordinates, duration, distance } = useSelector(
    (state: RootState) => state.route
  );

  const [saveResult, setSaveResult] = useState('');

  const [activityDate, setActivityDate] = useState('');
  const [mostCommonItem, setMostCommonItem] = useState('');
  const authenticatedFetch = useAuthenticatedFetch();

  const dispatch = useDispatch();

  useEffect(() => {
    // reset current Route since this is a new activity
    dispatch(currentRoute({ coordinates: [], duration: 0, distance: 0 }));
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      coordinates,
      distance,
      duration,
      activityDate: activityDate,
      mostCommonItem: mostCommonItem,
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

    if (response.ok) {
      const json = await response.json();
      setSaveResult(json.message);
    }
  };

  const onActivityDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActivityDate(e.target.value);
  const onMostCommonItemChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMostCommonItem(e.target.value);

  return (
    <div>
      <h1 className={DEFAULT_H1}>Log Cleanup Activity</h1>
      <form>
        <div>
          <EventMap />
        </div>
        <div className='grid grid-cols-4 gap-3 mt-3'>
          <ActivityFields
            activityDate={activityDate}
            mostCommonItem={mostCommonItem}
            distance={distance}
            duration={duration}
            events={{
              activityDateChange: onActivityDateChange,
              mostCommonItemChange: onMostCommonItemChange,
            }}
          />
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
      {saveResult && (
        <div className='text-red-700 text-center mt-2'>
          <p>{saveResult}</p>
        </div>
      )}
    </div>
  );
};

export default LogActivity;
