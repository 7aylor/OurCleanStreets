import type { ICoordinate } from '@ocs/types';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';

const MarkersTable = ({
  markers,
  removeMarker,
  moveMarker,
}: {
  markers: ICoordinate[];
  removeMarker: (index: number) => void;
  moveMarker: (index: number, dir: 'up' | 'down') => void;
}) => {
  function roundToDecimals(num: number, places: number = 1e5) {
    const rounded = Math.round(num * places) / places;

    // Convert to string without unnecessary trailing zeros
    return parseFloat(rounded.toString());
  }

  return (
    <div className='h-64 overflow-y-scroll'>
      <table className='border-collapse w-full text-sm'>
        <thead>
          <tr className='bg-gray-100'>
            <td className='border border-gray-400 p-1 w-6'></td>
            <td className='border border-gray-400 p-1 font-semibold'>
              Latitude
            </td>
            <td className='border border-gray-400 p-1 font-semibold'>
              Longitude
            </td>
            <td className='border border-gray-400 p-1 w-8'></td>
            <td className='border border-gray-400 p-1 w-8'></td>
            <td className='border border-gray-400 p-1 w-8'></td>
          </tr>
        </thead>
        <tbody>
          {markers?.length > 0 &&
            markers.map((marker: ICoordinate, index: number) => (
              <tr key={index} className='m-0 p-0'>
                <td className='border border-gray-400 p-1 text-center'>
                  {index + 1}
                </td>
                <td
                  className='border border-gray-400 p-1 text-sm'
                  title={`${marker.lat}`}
                >
                  {roundToDecimals(marker.lat)}
                </td>
                <td
                  className='border border-gray-400 p-1 text-sm'
                  title={`${marker.lng}`}
                >
                  {roundToDecimals(marker.lng)}
                </td>

                <td
                  className={`border border-gray-400 p-1 text-center ${
                    index === 0
                      ? 'text-gray-300 cursor-default'
                      : 'text-black hover:text-blue-600 cursor-pointer'
                  }`}
                  onClick={
                    index > 0 ? () => moveMarker(index, 'up') : undefined
                  }
                >
                  <ArrowUp size={16} />
                </td>

                <td
                  className={`border border-gray-400 p-1 text-center ${
                    index === markers.length - 1
                      ? 'text-gray-300 cursor-default'
                      : 'text-black hover:text-blue-600 cursor-pointer'
                  }`}
                  onClick={
                    index < markers.length - 1
                      ? () => moveMarker(index, 'down')
                      : undefined
                  }
                >
                  <ArrowDown size={16} />
                </td>

                <td
                  className='border border-gray-400 p-1 text-center text-black hover:text-blue-600 cursor-pointer'
                  onClick={() => removeMarker(index)}
                >
                  <Trash2 size={16} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkersTable;
