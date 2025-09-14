import { useMapEvents } from 'react-leaflet';

function ClickToAddMarkers({ onMapClick }) {
  // This component now only listens for clicks and calls the passed callback
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
}

export default ClickToAddMarkers;
