import {
  DEFAULT_BTN,
  DEFAULT_INPUT,
  DEFAULT_INPUT_LABEL,
} from '../../helpers/style-contants';
import EventMap from '../Mapping/EventMap';

const Activity = () => {
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
            <input type='date' className={DEFAULT_INPUT} />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>
              Most Common Item Found:
            </label>
            <input type='text' className={`${DEFAULT_INPUT}`} />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Distance:</label>
            <input
              type='text'
              className={`${DEFAULT_INPUT}`}
              disabled
              placeholder='To be calculated...'
            />
          </div>
          <div>
            <label className={DEFAULT_INPUT_LABEL}>Duration</label>
            <input
              type='text'
              className={`${DEFAULT_INPUT}`}
              disabled
              placeholder='To be calculated...'
            />
          </div>
        </div>
        <div className='flex justify-center'>
          <button className={`${DEFAULT_BTN} mt-4 w-155 self-center`}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Activity;
