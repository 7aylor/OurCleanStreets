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
    <table className='markers-table'>
      <tbody>
        {markers?.length > 0 &&
          markers.map((marker: ICoordinate, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>Lat: {marker.lat}</td>
              <td>Lng: {marker.lng}</td>
              <td
                className={`${index === 0 ? 'disabled' : 'hover'}`}
                onClick={index > 0 ? () => moveMarker(index, 'up') : undefined}
              >
                <ArrowUp />
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
                <ArrowDown />
              </td>
              <td
                onClick={() => removeMarker(index)}
                className='remove-marker hover'
              >
                <Trash2 size='16' />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default MarkersTable;
