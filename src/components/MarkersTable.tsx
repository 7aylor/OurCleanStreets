import './MarkersTable.css';
import { Trash2 } from 'lucide-react';

const MarkersTable = ({
  markers,
  removeMarker,
}: {
  markers: ICoordinate[];
  removeMarker: (index: number) => {};
}) => {
  return (
    <table className='markers-table'>
      <tbody>
        {markers?.length > 0 &&
          markers.map((marker: ICoordinate, index: number) => (
            <tr key={index}>
              <td onClick={() => removeMarker(index)} className='remove-marker'>
                <Trash2 size='16' />
              </td>
              <td>{index + 1}</td>
              <td>Lat: {marker.lat}</td>
              <td>Lng: {marker.lng}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default MarkersTable;
