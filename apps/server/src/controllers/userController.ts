import { Request, Response } from 'express';
import { getPrismaClient } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from '../utils/zod-schemas';

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const prisma = getPrismaClient();
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current and new passwords are required',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const parseResult = loginSchema.safeParse(user);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'An error has occurred',
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid current password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashed, updatedAt: new Date() },
    });

    res
      .status(200)
      .json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Error updating password' });
  }
};
