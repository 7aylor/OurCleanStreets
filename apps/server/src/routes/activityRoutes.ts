import { Router } from 'express';
import {
  getUserActivities,
  getUserStats,
  logActivity,
} from '../controllers/activityController';
import { authenticateJWT } from '../middleware/authMiddleware';

const activityRouter = Router();

activityRouter.post('/log-activity', authenticateJWT, logActivity);
activityRouter.post('/get-user-activities', authenticateJWT, getUserActivities);
activityRouter.post('/get-user-stats', authenticateJWT, getUserStats);

export default activityRouter;
