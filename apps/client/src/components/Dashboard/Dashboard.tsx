import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import Map from '../Mapping/MapParts/Map';
// @ts-ignore
import type { LatLngBoundsExpression } from 'leaflet';
import { OCS_API_URL } from '../../helpers/constants';
import { useAuthenticatedFetch } from '../../hooks/useAuthenticateFetch';

const Dashboard: React.FC = () => {
  const { zipcode } = useSelector((state: RootState) => state.auth);
  const [boundingBox, setBoundingBox] = useState<LatLngBoundsExpression | null>(
    null
  );
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const mapUrl = `${OCS_API_URL}/map/get-routes-by-zipcode`;
        const response = await authenticatedFetch(mapUrl, {
          body: JSON.stringify({ zipcode }),
        });

        if (response.ok) {
          const json = await response.json();
          console.log(json);
          // setData(json);
        } else {
          console.error('Failed to fetch dashboard data:', response.status);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  console.log(zipcode);

  // const getZipBB = useCallback(async () => {
  //   const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipcode}&country=us&format=json`;

  //   const res = await fetch(url, {
  //     headers: {
  //       'User-Agent': 'OurCleanStreets/0.3 (ASU student project)',
  //     },
  //   });
  //   const bbResult = await res.json();

  //   if (bbResult?.length > 0) {
  //     const bb = bbResult[0].boundingbox.map(Number); // convert strings → numbers
  //     // boundingbox = [south, north, west, east]
  //     const bounds: LatLngBoundsExpression = [
  //       [bb[0], bb[2]], // southwest
  //       [bb[1], bb[3]], // northeast
  //     ];
  //     setBoundingBox(bounds);
  //     console.log('Bounds:', bounds);
  //   }
  // }, [zipcode]);

  // useEffect(() => {
  //   getZipBB();
  // }, [getZipBB]);

  return (
    <>
      {boundingBox && (
        // <Map editable={true} bounds={boundingBox} style={{ height: '50vh' }} />
        <Map editable={true} center={boundingBox} style={{ height: '50vh' }} />
      )}
    </>
  );
};

export default Dashboard;
