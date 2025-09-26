import express from 'express';
// @ts-ignore
import cors from 'cors';
import mapRoutes from './routes/mapRoutes';
import booksRoutes from './routes/booksRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:5174',
  'https://agreeable-forest-01a6d8e0f.2.azurestaticapps.net',
];

app.use(express.json());

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

app.use('/auth', authRoutes);
app.use('/map', mapRoutes);
app.use('/books', booksRoutes);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
