import type { Achievement } from '@ocs/types';
import { Badge } from './Badge';
import { useQuery } from '@tanstack/react-query';
import { OCS_API_URL } from '../../../helpers/constants';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticateFetch';
import { LoaderCircle } from 'lucide-react';
import { DEFAULT_SPINNER } from '../../../helpers/style-contants';

const Achievements: React.FC = () => {
  const authenticatedFetch = useAuthenticatedFetch();

  // useEffect(() => {
  //   // make api call
  //   const acs: Achievement[] = [
  //     {
  //       type: 'weight',
  //       level: 1,
  //       value: 11,
  //       nextLevel: 25,
  //       label: 'Trash Collector',
  //     },
  //     {
  //       type: 'distance',
  //       level: 2,
  //       value: 8,
  //       nextLevel: 10,
  //       label: 'Traveler',
  //     },
  //     {
  //       type: 'duration',
  //       level: 3,
  //       value: 48,
  //       nextLevel: 60,
  //       label: 'Timekeeper',
  //     },
  //     {
  //       type: 'weight',
  //       level: 4,
  //       value: 11,
  //       nextLevel: 25,
  //       label: 'Trash Collector',
  //     },
  //     {
  //       type: 'distance',
  //       level: 5,
  //       value: 8,
  //       nextLevel: 10,
  //       label: 'Traveler',
  //     },
  //     {
  //       type: 'duration',
  //       level: 6,
  //       value: 48,
  //       nextLevel: 60,
  //       label: 'Timekeeper',
  //     },
  //     {
  //       type: 'weight',
  //       level: 7,
  //       value: 11,
  //       nextLevel: 25,
  //       label: 'Trash Collector',
  //     },
  //     {
  //       type: 'distance',
  //       level: 8,
  //       value: 8,
  //       nextLevel: 10,
  //       label: 'Traveler',
  //     },
  //     {
  //       type: 'duration',
  //       level: 9,
  //       value: 48,
  //       nextLevel: 60,
  //       label: 'Timekeeper',
  //     },
  //     {
  //       type: 'duration',
  //       level: 10,
  //       value: 48,
  //       nextLevel: 60,
  //       label: 'Timekeeper',
  //     },
  //   ];
  //   setAchievements(acs);
  // }, []);

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const statsUrl = `${OCS_API_URL}/activity/get-user-stats`;
      let response = await authenticatedFetch(statsUrl);

      if (response.ok) {
        return (await response.json()) as Achievement[];
      }
    },
  });

  return (
    <div>
      <h1 className='text-4xl text-center mb-6'>Achievements</h1>
      <div className='flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4'>
        {isLoading && (
          <LoaderCircle className={`${DEFAULT_SPINNER} w-full mt-2`} />
        )}
        {achievements &&
          achievements?.map((achievement) => (
            <Badge key={achievement.type} {...achievement} />
          ))}
      </div>
    </div>
  );
};

export default Achievements;
