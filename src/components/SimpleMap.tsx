import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Openrouteservice from 'openrouteservice-js';
import ClickToAddMarkers from './ClickToAddMarkers';
import polyline from '@mapbox/polyline';
import MarkersList from './MarkersList';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let orsDirections = new Openrouteservice.Directions({
  api_key: import.meta.env.VITE_OSR_API_KEY,
});

const colors = ['red', 'blue', 'green', 'orange', 'purple', 'teal'];

const createColoredIcon = (color) =>
  new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const SimpleMap = () => {
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);

  const getCoordinates = async (coords: ICoordinate[]) => {
    console.log('getting route coordinates');

    const coordsArr = coords.map((coord: ICoordinate) => [
      coord.lng,
      coord.lat,
    ]);
    console.log(coordsArr);
    let response = await orsDirections.calculate({
      coordinates: coordsArr,
      profile: 'foot-walking',
      format: 'json',
    });

    console.log('response: ', response);

    const decodedPolyCoords = polyline.decode(response.routes[0].geometry);

    // Leaflet expects [lat, lng], polyline.decode returns [lat, lng] already
    // but OpenRouteService uses [lon, lat] internally, so we’re safe here
    const routeCoords = decodedPolyCoords.map(([lat, lng]) => [lat, lng]);
    setRoute(routeCoords);
  };

  // Toggle when the map is clicked
  const handleMapClick = (latlng) => {
    console.log(latlng);
    setMarkers((prev) => {
      const exists = prev.some(
        (marker) => marker.lat === latlng.lat && marker.lng === latlng.lng
      );

      if (exists) {
        // remove if exact same spot is clicked again
        return prev.filter(
          (marker) => marker.lat !== latlng.lat || marker.lng !== latlng.lng
        );
      } else {
        // add new marker
        return [...prev, latlng];
      }
    });
  };

  // Remove marker when the marker itself is clicked
  const handleMarkerClick = (index: number) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const onCalculate = () => {
    if (markers.length > 1) {
      getCoordinates(markers);
    }
  };

  return (
    <>
      <MapContainer
        center={[44.05207, -123.08675]}
        zoom={20}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ClickToAddMarkers onMapClick={handleMapClick} />
        {markers.map((position, index) => (
          <Marker
            key={index}
            position={position}
            eventHandlers={{
              click: () => handleMarkerClick(index),
            }}
            icon={createColoredIcon(colors[index % colors.length])}
          >
            <Popup>Marker {index + 1}</Popup>
          </Marker>
        ))}
        <Polyline positions={route} color='green' />
      </MapContainer>
      <button onClick={onCalculate}>Calculate</button>
      <MarkersList markers={markers} />
    </>
  );
};

export default SimpleMap;
