import { useMapEvents } from 'react-leaflet';
import type { ICoordinate } from '@ocs/types';

function ClickToAddMarkers({
  onMapClick,
}: {
  onMapClick: (latlng: ICoordinate) => void;
}) {
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng);
    },
  });

  return null;
}

export default ClickToAddMarkers;
