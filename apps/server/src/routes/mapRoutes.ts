import { Router } from 'express';
import { getRoute } from '../controllers/mapController';
import { authenticateJWT } from '../middleware/authMiddleware';

const mapRouter = Router();

mapRouter.post('/get-route', authenticateJWT, getRoute);

export default mapRouter;
