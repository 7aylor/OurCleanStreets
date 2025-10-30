import { useParams } from 'react-router-dom';
import { DEFAULT_H1 } from '../../helpers/style-contants';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { IActivity } from '@ocs/types';
import ActivityFields from './ActivityFields';
import Map from '../Mapping/MapParts/Map';
import { Polyline } from 'react-leaflet';
import { getRouteColorByDate } from '../../helpers/utils';
import FitMapToRoute from '../Mapping/MapParts/FitMapToRoute';

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

  const routeColor = useMemo(() => {
    if (date) {
      return getRouteColorByDate(date);
    } else {
      return 'blue';
    }
  }, [date]);

  const route = selectedActivity?.cleanUpRoute?.coordinates;

  return (
    <div>
      <h1 className={DEFAULT_H1}>Activity Details</h1>
      <Map center={route?.[0]} style={{ height: '50vh' }} editable={false}>
        {route && (
          <>
            <Polyline
              positions={route}
              // @ts-ignore
              weight={5}
              color={routeColor}
            />
            <FitMapToRoute route={route} />
          </>
        )}
      </Map>
      <ActivityFields
        {...selectedActivity}
        {...selectedActivity?.cleanUpRoute}
      />
    </div>
  );
};

export default ActivityDetails;
