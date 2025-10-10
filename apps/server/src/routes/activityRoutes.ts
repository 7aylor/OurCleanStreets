import { Router } from 'express';
import { logActivity } from '../controllers/activityController';
import { authenticateJWT } from '../middleware/authMiddleware';

const activityRouter = Router();

activityRouter.post('/log-activity', authenticateJWT, logActivity);

export default activityRouter;
