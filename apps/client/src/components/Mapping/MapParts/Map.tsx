import type { RouteCoordinate } from '@ocs/types';
import type React from 'react';
import { MapContainer, TileLayer, type MapContainerProps } from 'react-leaflet';

interface IMapProps extends MapContainerProps {
  center?: RouteCoordinate;
  zoom?: number;
  editable: boolean;
}

const Map: React.FC<IMapProps> = ({
  center,
  zoom,
  style,
  editable,
  children,
  ...rest
}) => {
  return (
    <MapContainer
      // @ts-ignore
      center={center}
      zoom={zoom}
      style={style}
      scrollWheelZoom={editable}
      dragging={editable}
      doubleClickZoom={editable}
      zoomControl={editable}
      attributionControl={editable}
      keyboard={editable}
      touchZoom={editable}
      boxZoom={editable}
      {...rest}
    >
      <TileLayer
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {children}
    </MapContainer>
  );
};

export default Map;
