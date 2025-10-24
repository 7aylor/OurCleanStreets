import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      setTimeout(() => {
        map.invalidateSize();
        map.setView(center, 20);
      }, 50);
    }
  }, [center, map]);

  return null;
};
