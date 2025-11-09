import express from 'express';
// @ts-ignore
import cors from 'cors';
import mapRoutes from './routes/mapRoutes';
import authRoutes from './routes/authRoutes';
// @ts-ignore
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import activityRoutes from './routes/activityRoutes';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://agreeable-forest-01a6d8e0f.2.azurestaticapps.net',
  'ourcleanstreets.quest',
  'www.ourcleanstreets.quest',
  'https://ourcleanstreets.quest',
  'https://api.ourcleanstreets.quest',
  'https://www.ourcleanstreets.quest',
];

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    // @ts-ignore
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} Not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/map', mapRoutes);
app.use('/user', userRoutes);
app.use('/activity', activityRoutes);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
