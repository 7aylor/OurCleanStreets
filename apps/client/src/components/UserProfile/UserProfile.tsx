import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Achievements from './Achievements/Achievements';
import { CircleUser } from 'lucide-react';

const UserProfile = () => {
  const { username, zipcode } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className='border-2 bg-blue-900 rounded-lg text-white p-5 flex align-middle mb-3'>
        <CircleUser size={50} />
        <div className='ml-3'>
          <p className='text-xl font-bold'>{username}</p>
          <p>{zipcode}</p>
        </div>
      </div>
      <Achievements />
    </>
  );
};

export default UserProfile;
