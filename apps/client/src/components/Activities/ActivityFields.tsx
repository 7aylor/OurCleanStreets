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
  readonly = true,
}: {
  activityDate?: string;
  mostCommonItem?: string;
  duration?: number;
  distance?: number;
  events?: {
    activityDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    mostCommonItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  readonly?: boolean;
}) => {
  const formattedDuration = useMemo(() => {
    const { hours, minutes, seconds } = getDurationParts(duration ?? 0);
    return `${hours}h ${minutes}m ${seconds}s`;
  }, [duration]);

  const formattedDistance = useMemo(() => `${duration}m`, [duration]);
  return (
    <div className='grid grid-cols-4 gap-3 mt-3'>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Date:</label>
        <input
          type={activityDate ? 'text' : 'date'}
          onChange={events && events.activityDateChange}
          className={DEFAULT_INPUT}
          value={activityDate ?? ''}
          disabled={readonly}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Most Common Item:</label>
        <input
          type='text'
          onChange={events && events.mostCommonItemChange}
          className={`${DEFAULT_INPUT}`}
          value={mostCommonItem ?? ''}
          disabled={readonly}
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
    </div>
  );
};

export default ActivityFields;
