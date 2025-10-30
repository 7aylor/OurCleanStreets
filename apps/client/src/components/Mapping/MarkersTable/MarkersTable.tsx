import type { ICoordinate } from '@ocs/types';
import './MarkersTable.css';
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
  return (
    <div className=' h-64 overflow-y-scroll'>
      <table className='markers-table'>
        <thead>
          <tr>
            <td></td>
            <td>Latitude</td>
            <td>Longitude</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {markers?.length > 0 &&
            markers.map((marker: ICoordinate, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className='text-sm'>{marker.lat}</td>
                <td className='text-sm'>{marker.lng}</td>
                <td
                  className={`${index === 0 ? 'disabled' : 'hover'}`}
                  onClick={
                    index > 0 ? () => moveMarker(index, 'up') : undefined
                  }
                >
                  <ArrowUp className='markers-cell-up' />
                </td>
                <td
                  className={`${
                    index === markers.length - 1 ? 'disabled' : 'hover'
                  }`}
                  onClick={
                    index < markers.length - 1
                      ? () => moveMarker(index, 'down')
                      : undefined
                  }
                >
                  <ArrowDown className='markers-cell-down' />
                </td>
                <td
                  onClick={() => removeMarker(index)}
                  className='remove-marker hover'
                >
                  <Trash2 size='16' className='markers-cell-delete' />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkersTable;
