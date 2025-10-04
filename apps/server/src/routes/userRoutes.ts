import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/reset-password', authenticateJWT);

export default userRouter;
