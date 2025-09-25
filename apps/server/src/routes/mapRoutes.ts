import { Router } from 'express';
import { getRoute } from '../controllers/mapController';

const mapRouter = Router();

mapRouter.post('/get-route', getRoute);

export default mapRouter;
