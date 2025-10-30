import { useRef, useState } from 'react';
import { OCS_API_URL } from '../../../helpers/constants';
import { DEFAULT_BTN, DEFAULT_INPUT } from '../../../helpers/style-contants';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticateFetch';
import type { MapSearchMatch, RouteCoordinate } from '@ocs/types';
import { X } from 'lucide-react';

export const Search = ({
  updateLocation,
}: {
  updateLocation: (coords: RouteCoordinate) => void;
}) => {
  const [searchResults, setSearchResults] = useState<MapSearchMatch[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef('');
  const authenticatedFetch = useAuthenticatedFetch();
  const [lastSearchText, setLastSearchText] = useState('');

  const onSearch = async () => {
    try {
      if (searchRef.current === lastSearchText) {
        setShowResults(true);
        return;
      }
      const mapUrl = `${OCS_API_URL}/map/search`;

      let response = await authenticatedFetch(mapUrl, {
        body: JSON.stringify({ text: searchRef.current }),
      });

      setLastSearchText(searchRef.current);

      if (response.ok) {
        const json = await response.json();
        setSearchResults(json.matches);
        setShowResults(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  const onClickAddress = (coords: RouteCoordinate) => {
    updateLocation(coords);
    setShowResults(false);
  };

  const clickX = () => {
    setShowResults(false);
  };

  return (
    <>
      <div className='flex gap-1'>
        <div className='relative flex-1'>
          <input
            placeholder='Search for Address'
            className={`${DEFAULT_INPUT} pr-8`}
            onChange={(e) => (searchRef.current = e.target.value)}
            onKeyDown={onKeyDown}
          />
          {showResults && (
            <X
              className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:cursor-pointer'
              onClick={clickX}
            />
          )}
        </div>
        <button className={DEFAULT_BTN} onClick={onSearch} type='button'>
          Search
        </button>
      </div>
      {showResults && searchResults?.length > 0 && (
        <div className='absolute rounded-md border w-97/100 mt-0.5 ml-0.5 bg-white border-black z-10000 max-h-24 shadow-md overflow-y-scroll focus:outline-none'>
          <ul className='p-2'>
            {searchResults.map((res) => (
              <li
                key={res.address + res.country}
                onClick={() => onClickAddress(res.coordinates)}
                className='hover:bg-violet-600 hover:text-white hover:cursor-pointer'
              >
                {res.address}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
