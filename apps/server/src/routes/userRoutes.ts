import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { resetPassword } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/reset-password', authenticateJWT, resetPassword);

export default userRouter;
