import { useParams } from 'react-router-dom';
import { DEFAULT_H1 } from '../../helpers/style-contants';
import EventMap from '../Mapping/EventMap';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { IActivity } from '@ocs/types';

const ActivityDetails = () => {
  const { id } = useParams();
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>();

  const activities = useSelector((state: RootState) => state.activities);

  useEffect(() => {
    if (activities) {
      const activity = activities.find((a) => a.id === Number(id));
      if (activity) {
        setSelectedActivity(activity);
      }
    }
    // TODO: Add else which fetches activities if not populated (if the user refreshes on this page
    // or browses to the url directly). Could integrate automatic redux rehydration with localstate, too.
  }, [activities]);

  const date = selectedActivity?.activityDate
    ? new Date(selectedActivity?.activityDate)
    : new Date();

  return (
    <div>
      <h1 className={DEFAULT_H1}>Activity Details</h1>
      <EventMap
        editable={false}
        existingRoute={selectedActivity?.cleanUpRoute.coordinates}
        existingDate={date}
      />
    </div>
  );
};

export default ActivityDetails;
