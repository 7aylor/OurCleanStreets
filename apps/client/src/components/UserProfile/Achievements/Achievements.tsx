import type { Achievement } from '@ocs/types';
import { useEffect, useState } from 'react';
import { Badge } from './Badge';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>();

  useEffect(() => {
    // make api call
    const acs: Achievement[] = [
      {
        type: 'weight',
        level: 1,
        value: 11,
        nextLevel: 25,
        label: 'Trash Collector',
      },
      {
        type: 'distance',
        level: 2,
        value: 8,
        nextLevel: 10,
        label: 'Traveler',
      },
      {
        type: 'duration',
        level: 3,
        value: 48,
        nextLevel: 60,
        label: 'Timekeeper',
      },
      {
        type: 'weight',
        level: 4,
        value: 11,
        nextLevel: 25,
        label: 'Trash Collector',
      },
      {
        type: 'distance',
        level: 5,
        value: 8,
        nextLevel: 10,
        label: 'Traveler',
      },
      {
        type: 'duration',
        level: 6,
        value: 48,
        nextLevel: 60,
        label: 'Timekeeper',
      },
      {
        type: 'weight',
        level: 7,
        value: 11,
        nextLevel: 25,
        label: 'Trash Collector',
      },
      {
        type: 'distance',
        level: 8,
        value: 8,
        nextLevel: 10,
        label: 'Traveler',
      },
      {
        type: 'duration',
        level: 9,
        value: 48,
        nextLevel: 60,
        label: 'Timekeeper',
      },
      {
        type: 'duration',
        level: 10,
        value: 48,
        nextLevel: 60,
        label: 'Timekeeper',
      },
    ];
    setAchievements(acs);
  }, []);

  return (
    <div>
      <h1 className='text-4xl text-center'>Achievements</h1>
      <div className='flex justify-center'>
        <div>
          <Badge
            type='weight'
            level={10}
            value={11}
            nextLevel={25}
            label='Trash Collector'
          />
        </div>
        <div>
          <Badge
            type='distance'
            level={4}
            value={19}
            nextLevel={25}
            label='Traveler'
          />
        </div>
        <div>
          <Badge
            type='duration'
            level={2}
            value={3}
            nextLevel={25}
            label='Timekeeper'
          />
        </div>
      </div>
    </div>
  );
};

export default Achievements;
