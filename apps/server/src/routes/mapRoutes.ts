import { Router } from 'express';
import { getRoute, getRoutesByZip, search } from '../controllers/mapController';
import { authenticateJWT } from '../middleware/authMiddleware';

const mapRouter = Router();

mapRouter.post('/get-route', authenticateJWT, getRoute);
mapRouter.post('/get-routes-by-zipcode', authenticateJWT, getRoutesByZip);
mapRouter.post('/search', authenticateJWT, search);

export default mapRouter;
