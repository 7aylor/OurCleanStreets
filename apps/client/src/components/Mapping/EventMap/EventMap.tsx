import { useEffect, useState } from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import ClickToAddMarkers from '../MapParts/ClickToAddMarkers.tsx';
// @ts-ignore
import L from 'leaflet';
import {
  primaryColors as colors,
  type NamedColor,
} from '../../../types/types.ts';
import MarkersTable from '../MarkersTable/MarkersTable.tsx';
import 'leaflet/dist/leaflet.css';
import type {
  ICoordinate,
  RouteCoordinate,
  RouteCoordinates,
} from '@ocs/types';
import { LoaderCircle } from 'lucide-react';
import { OCS_API_URL } from '../../../helpers/constants.ts';
import {
  DEFAULT_BTN,
  DEFAULT_BTN_DISABLED,
  DEFAULT_SPINNER,
} from '../../../helpers/style-contants.ts';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticateFetch.tsx';
import { currentRoute } from '../../../store/routeSlice.ts';
import { useDispatch } from 'react-redux';
import { Search } from '../MapParts/Search.tsx';
import { RecenterMap } from '../MapParts/RecenterMap.tsx';
import Map from '../MapParts/Map.tsx';

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
  const [loading, setLoading] = useState(false);
  const [componentHasMounted, setComponentHasMounted] = useState(false);

  const authenticatedFetch = useAuthenticatedFetch();
  const dispatch = useDispatch();

  const getBrowserLocation = () => {
    if (!navigator?.geolocation) {
      setError('Geolocation is not supported by your browser');
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
        setLocation([33.424564, -111.928001]);
      }
    );
  };

  useEffect(() => {
    getBrowserLocation();
    // necessary to prevent flicker due to map mounting
    setTimeout(() => setComponentHasMounted(true), 100);
  }, []);

  const getMapCoordinates = async (coords: ICoordinate[]) => {
    setLoading(true);
    const coordsArr = coords.map((coord: ICoordinate) => [
      coord.lng,
      coord.lat,
    ]);

    const mapUrl = `${OCS_API_URL}/map/get-route`;

    let response = await authenticatedFetch(mapUrl, {
      body: JSON.stringify({ coordinates: coordsArr }),
    });

    if (response.ok) {
      const json = await response.json();
      setRoute(json.coordinates);

      dispatch(
        currentRoute({
          coordinates: json.coordinates,
          distance: json.distance,
          duration: json.duration,
        })
      );
    }
    setLoading(false);
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

  const onCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (markers.length > 1) {
      getMapCoordinates(markers);
    }
  };

  const onClearAllMarkers = (e: React.FormEvent) => {
    e.preventDefault();
    setMarkers([]);
    setRoute([]);
  };

  const updateLocation = (coords: RouteCoordinate) => {
    setLocation(coords);
  };

  return (
    <>
      <Search updateLocation={updateLocation} />
      <div
        className={`p-2 border-1 border-e-blue-900 rounded-1xl mt-3 grid grid-cols-[4fr_1fr] gap-2 h-full`}
      >
        {location && (
          <Map
            // @ts-ignore
            center={location}
            zoom={20}
            editable={true}
            className='h-100'
          >
            <RecenterMap center={location} />
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
              weight={5}
              color='blue'
            />
          </Map>
        )}
        {componentHasMounted && (
          <div className='w-75 p-2 bg-gray-100'>
            <div className='flex items-center gap-1 mt-2'>
              <button
                onClick={onCalculate}
                className={
                  markers.length > 1 ? DEFAULT_BTN : DEFAULT_BTN_DISABLED
                }
                disabled={markers.length < 1}
                type='button'
              >
                Calculate Route
              </button>
              <button
                onClick={onClearAllMarkers}
                className={
                  markers.length === 0 ? DEFAULT_BTN_DISABLED : DEFAULT_BTN
                }
                type='button'
              >
                Clear All
              </button>
              {loading && <LoaderCircle className={DEFAULT_SPINNER} />}
            </div>
            <p className='text-xs'>
              Please note that during development, the first API call may take a
              while due to dev server limitations.
            </p>
            {markers.length > 0 && (
              <MarkersTable
                markers={markers}
                removeMarker={removeMarker}
                moveMarker={moveMarker}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EventMap;
