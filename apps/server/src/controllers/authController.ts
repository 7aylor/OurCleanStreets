import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../utils/prisma';
import { IUser } from '@ocs/types';
import { userSchema } from '../utils/zod-schemas';

export const login = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const prisma = getPrismaClient();
    const { email, password } = _req.body;

    const hash = await bcrypt.hash(password ?? '', process.env.SALT_ITR ?? 10);

    const user = prisma.users.findUnique({
      where: { email: email, passwordHash: hash },
    });
  } catch (error) {
    console.error(error);
  }
};

export const signup = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const prisma = getPrismaClient();
    const user = _req.body;

    const parseResult = userSchema.safeParse(user);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, password } = parseResult.data;

    const hash = await bcrypt.hash(password, process.env.SALT_ITR ?? 10);

    const newUser = await prisma.users.create({
      data: { email, passwordHash: hash, updatedAt: new Date() },
    });

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error(error);
  }
};
