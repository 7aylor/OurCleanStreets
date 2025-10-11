import { Router } from 'express';
import {
  getUserActivities,
  logActivity,
} from '../controllers/activityController';
import { authenticateJWT } from '../middleware/authMiddleware';

const activityRouter = Router();

activityRouter.post('/log-activity', authenticateJWT, logActivity);
activityRouter.post('/get-user-activities', authenticateJWT, getUserActivities);

export default activityRouter;
