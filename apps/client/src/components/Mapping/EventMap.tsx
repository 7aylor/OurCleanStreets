import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import './EventMap.css';
import ClickToAddMarkers from './ClickToAddMarkers.tsx';
// @ts-ignore
import L from 'leaflet';
import { primaryColors as colors, type NamedColor } from '../../types/types.ts';
import MarkersTable from './MarkersTable.tsx';
import 'leaflet/dist/leaflet.css';
import type {
  ICoordinate,
  RouteCoordinate,
  RouteCoordinates,
} from '@ocs/types';

const createNumberedIcon = (color: NamedColor, number: number) =>
  new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      color: white;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      font-size: 14px;
    ">
      ${number}
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15], // bottom-center
  });

const EventMap = () => {
  const [markers, setMarkers] = useState<ICoordinate[]>([]);
  const [route, setRoute] = useState<RouteCoordinates>([]);

  const [location, setLocation] = useState<RouteCoordinate | null>();
  const [, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator?.geolocation) {
      setError('Geolocation is not supported by your browser');
      console.log('Geolocation is not supported by your browser');
      setLocation([33.424564, -111.928001]); // Default to ASU lat/lng
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setError(null);
      },
      (err) => {
        setError(err.message);
        console.log(err.message);
        setLocation([33.424564, -111.928001]);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getCoordinates = async (coords: ICoordinate[]) => {
    const coordsArr = coords.map((coord: ICoordinate) => [
      coord.lng,
      coord.lat,
    ]);

    const ocsServerUrl =
      import.meta.env.VITE_OCS_API_URL ?? 'http://localhost:5000';

    let response = await fetch(`${ocsServerUrl}/get-route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates: coordsArr }),
    });

    if (response.ok) {
      const routeCoords: RouteCoordinates = await response.json();
      setRoute(routeCoords);
    }
  };

  // Toggle when the map is clicked
  const handleMapClick = (latlng: ICoordinate) => {
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
  const removeMarker = (index: number) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const moveMarker = (index: number, dir: 'up' | 'down') => {
    setMarkers((prev) => {
      const newMarkers = [...prev]; // copy array

      if (dir === 'up' && index > 0) {
        // swap with the previous marker
        [newMarkers[index - 1], newMarkers[index]] = [
          newMarkers[index],
          newMarkers[index - 1],
        ];
      } else if (dir === 'down' && index < newMarkers.length - 1) {
        // swap with the next marker
        [newMarkers[index], newMarkers[index + 1]] = [
          newMarkers[index + 1],
          newMarkers[index],
        ];
      }

      return newMarkers;
    });
  };

  const onCalculate = () => {
    if (markers.length > 1) {
      getCoordinates(markers);
    }
  };

  return (
    <div className='event-map-container'>
      {location && (
        // @ts-ignore
        <MapContainer center={location} zoom={20} style={{ height: '50vh' }}>
          <TileLayer
            // @ts-ignore
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <ClickToAddMarkers onMapClick={handleMapClick} />
          {markers.map((position, index) => (
            <Marker
              key={index}
              position={position}
              eventHandlers={{
                click: () => removeMarker(index),
              }}
              // @ts-ignore
              icon={createNumberedIcon(
                colors[index % colors.length],
                index + 1
              )}
            >
              <Popup>Marker {index + 1}</Popup>
            </Marker>
          ))}
          <Polyline
            positions={route}
            // @ts-ignore
            weight={8}
            color='green'
          />
        </MapContainer>
      )}

      <div className='event-panel'>
        <MarkersTable
          markers={markers}
          removeMarker={removeMarker}
          moveMarker={moveMarker}
        />
        <button onClick={onCalculate}>Calculate Route</button>
      </div>
    </div>
  );
};

export default EventMap;
