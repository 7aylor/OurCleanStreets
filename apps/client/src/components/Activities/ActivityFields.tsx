import {
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
} from '../../helpers/style-contants';
import {
  getFormattedDistance,
  getFormattedDuration,
} from '../../helpers/utils';

const ActivityFields = ({
  activityDate,
  mostCommonItem,
  trashWeight,
  duration,
  distance,
  events,
  readonly = true,
}: {
  activityDate?: string;
  mostCommonItem?: string;
  trashWeight?: number;
  duration?: number;
  distance?: number;
  events?: {
    activityDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    mostCommonItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    trashWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  readonly?: boolean;
}) => {
  return (
    <div className='grid grid-cols-5 gap-3 mt-3'>
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
        <label className={DEFAULT_INPUT_LABEL}>Trash Weight (lbs)</label>
        <input
          type='number'
          onChange={events && events.trashWeightChange}
          className={`${DEFAULT_INPUT}`}
          value={trashWeight ?? ''}
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
          value={distance && distance > 0 ? getFormattedDistance(distance) : ''}
        />
      </div>
      <div>
        <label className={DEFAULT_INPUT_LABEL}>Duration</label>
        <input
          type='text'
          className={`${DEFAULT_INPUT} border-black text-gray-400`}
          placeholder='To be calculated...'
          disabled
          value={duration && duration > 0 ? getFormattedDuration(duration) : ''}
        />
      </div>
    </div>
  );
};

export default ActivityFields;
