import { useMemo } from 'react';
import {
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
} from '../../helpers/style-contants';
import { getDurationParts } from '../../helpers/constants';

const ActivityFields = ({
  activityDate,
  mostCommonItem,
  duration,
  distance,
  events,
}: {
  activityDate?: string;
  mostCommonItem?: string;
  duration?: number;
  distance?: number;
  events: {
    activityDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    mostCommonItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}) => {
  const formattedDuration = useMemo(() => {
    const { hours, minutes, seconds } = getDurationParts(duration ?? 0);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [duration]);

  const formattedDistance = useMemo(() => `${duration}m`, [duration]);
  return (
    <>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Date:</label>
        <input
          type='date'
          onChange={events.activityDateChange}
          className={DEFAULT_INPUT}
          value={activityDate}
        />
      </div>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Most Common Item:</label>
        <input
          type='text'
          onChange={events.mostCommonItemChange}
          className={`${DEFAULT_INPUT}`}
          value={mostCommonItem}
        />
      </div>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Distance:</label>
        <input
          type='text'
          className={`${DEFAULT_INPUT} border-black text-gray-400`}
          placeholder='To be calculated...'
          disabled
          value={distance && distance > 0 ? formattedDistance : ''}
        />
      </div>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Duration</label>
        <input
          type='text'
          className={`${DEFAULT_INPUT} border-black text-gray-400`}
          placeholder='To be calculated...'
          disabled
          value={duration && duration > 0 ? formattedDuration : ''}
        />
      </div>
    </>
  );
};

export default ActivityFields;
