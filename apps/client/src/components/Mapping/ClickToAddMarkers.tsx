import { useMapEvents } from 'react-leaflet';

function ClickToAddMarkers({
  onMapClick,
}: {
  onMapClick: (latlng: ICoordinate) => void;
}) {
  // This component now only listens for clicks and calls the passed callback
  useMapEvents({
    click(e: any) {
      onMapClick(e.latlng);
    },
  });

  return null;
}

export default ClickToAddMarkers;
