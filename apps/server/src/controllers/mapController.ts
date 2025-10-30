import { Request, Response } from 'express';
// @ts-ignore
import polyline from '@mapbox/polyline';
import { ICoordinate, IGeocode, RouteCoordinates } from '@ocs/types';
import { getOrsDirections, getOrsGeocode } from '../utils/ors';
import { getPrismaClient } from '../utils/prisma';
import { zipcodeSchema } from '../utils/zod-schemas';

interface getRouteRequestBody {
  coordinates: ICoordinate[];
}

interface getRoutesByZipRequestBody {
  zipcode: string;
}

export const getRoute = async (
  req: Request<{}, {}, getRouteRequestBody>,
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

    const { distance, duration } = response.routes[0].summary;

    // Leaflet expects [lat, lng], polyline.decode returns [lat, lng] already
    // but OpenRouteService uses [lon, lat] internally, so we’re safe here
    const routeCoords: RouteCoordinates = decodedPolyCoords.map(
      ([lat, lng]) => [lat, lng]
    );

    res.json({
      distance,
      duration,
      coordinates: routeCoords,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRoutesByZip = async (
  req: Request<{}, {}, getRoutesByZipRequestBody>,
  res: Response
) => {
  try {
    const parseResult = zipcodeSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.message;
      return res.status(400).json({ error: errorMessage });
    }

    const { zipcode } = parseResult.data;

    const prisma = getPrismaClient();

    // get routes + userId
    const routes = await prisma.cleanUpRoute.findMany({
      where: { zipcode },
      include: {
        activity: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!routes || routes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No routes found for this zipcode.' });
    }

    return res.status(200).json(routes);
  } catch (error) {
    console.error('Error fetching routes by zipcode:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    const geocode = getOrsGeocode();

    let response: IGeocode = await geocode.geocode({
      text,
    });

    const matches = response.features.map((match) => {
      const flippedCoord = [
        match.geometry.coordinates[1],
        match.geometry.coordinates[0],
      ];

      return {
        address: match.properties.label,
        coordinates: flippedCoord,
        country: match.properties.country,
      };
    });

    res.json({
      matches,
    });
  } catch (error) {
    console.log(error);
  }
};
