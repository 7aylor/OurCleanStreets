// @ts-ignore
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getPrismaClient } from './prisma';

/*
 * Creates Access token (short lived token)
 */
export const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

/*
 * creates the refresh token (long lived token)
 */
export async function createRefreshToken(userId: string) {
  try {
    const token = crypto.randomBytes(64).toString('hex');

    const prisma = getPrismaClient();

    const dayMs = 1000 * 60 * 60 * 24;
    const expiresAt = new Date(Date.now() + dayMs * 7);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return { token, expiresAt };
  } catch (e) {
    console.log(e);
  }
}
