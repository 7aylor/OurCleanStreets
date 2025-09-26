import { Request, Response } from 'express';
// @ts-ignore
import polyline from '@mapbox/polyline';
import { ICoordinate, RouteCoordinates } from '@ocs/types';
import { getOrsDirections } from '../utils/ors';

interface CoordsRequestBody {
  coordinates: ICoordinate[];
}

export const getRoute = async (
  req: Request<{}, {}, CoordsRequestBody>,
  res: Response
) => {
  try {
    const { coordinates } = req.body;

    let response = await getOrsDirections().calculate({
      coordinates,
      profile: 'foot-walking',
      format: 'json',
    });

    const decodedPolyCoords: RouteCoordinates = polyline.decode(
      response.routes[0].geometry
    );

    // Leaflet expects [lat, lng], polyline.decode returns [lat, lng] already
    // but OpenRouteService uses [lon, lat] internally, so we’re safe here
    const routeCoords: RouteCoordinates = decodedPolyCoords.map(
      ([lat, lng]) => [lat, lng]
    );

    res.json(routeCoords);
  } catch (error) {
    console.log(error);
  }
};
