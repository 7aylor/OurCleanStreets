import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Achievements from './Achievements/Achievements';
import { CircleUser } from 'lucide-react';

const UserProfile = () => {
  const { username, zipcode } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className='border-2 bg-purple-800 rounded-lg text-white p-5 w-min absolute h-7/8'>
        <CircleUser size={75} />
        <p className='text-2xl font-bold'>{username}</p>
        <p>{zipcode}</p>
      </div>
      <Achievements />
    </>
  );
};

export default UserProfile;
