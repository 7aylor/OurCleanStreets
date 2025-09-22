import express, { Request, Response } from 'express';
// @ts-ignore
import polyline from '@mapbox/polyline';
// @ts-ignore
import Openrouteservice from 'openrouteservice-js';
import { RouteCoordinates } from '@ocs/types';
// @ts-ignore
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 5000;

const allowedOrigins = [
  'http://localhost:5174',
  'https://agreeable-forest-01a6d8e0f.2.azurestaticapps.net',
];

app.use(
  cors({
    // @ts-ignore
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

let orsDirections = new Openrouteservice.Directions({
  api_key: process.env.OSR_API,
});

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.OCS_DB } },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

type Coordinate = { lat: number; lng: number };
interface CoordsRequestBody {
  coordinates: Coordinate[];
}

app.post(
  '/get-route',
  async (req: Request<{}, {}, CoordsRequestBody>, res: Response) => {
    try {
      const { coordinates } = req.body;
      let response = await orsDirections.calculate({
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
  }
);

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await prisma.books.findMany();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// // Add a book
// app.post('/books', async (req, res) => {
//   const { id, title, author } = req.body;
//   try {
//     const book = await prisma.books.create({
//       data: { id, title, author },
//     });
//     res.json(book);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to create book' });
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
