import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../utils/prisma';
import { IUser } from '@ocs/types';
import { loginSchema, signupSchema } from '../utils/zod-schemas';
import { createAccessToken, createRefreshToken } from '../utils/auth';

export const login = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const prisma = getPrismaClient();
    const user = _req.body;

    const parseResult = loginSchema.safeParse(user);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { email, password } = parseResult.data;

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    const LOGIN_ERROR = 'Login Failed. Invalid credentials or user not found';

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        errors: [LOGIN_ERROR],
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      foundUser.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({ success: false, errors: [LOGIN_ERROR] });
    }

    const accessToken = createAccessToken(foundUser.id);
    const refreshToken = await createRefreshToken(foundUser.id);

    if (!refreshToken) {
      return res.status(500).json({
        success: false,
        errors: [`Login failed: Please try again.`],
      });
    }

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshToken.expiresAt,
      path: '/auth',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        email: foundUser.email,
        username: foundUser.username,
        userId: foundUser.id,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errors: [`Login failed: Please try again.`],
    });
  }
};

export const signup = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const prisma = getPrismaClient();
    const user = _req.body;

    const parseResult = signupSchema.safeParse(user);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'An error has occurred',
        errors: parseResult.error.issues.map((err) => err.message),
      });
    }

    const { username, email, zipcode, password } = parseResult.data;

    const foundUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (foundUsername) {
      return res.status(400).json({
        success: false,
        message: 'An error has occurred',
        errors: ['Signup failed, please try again'],
      });
    }

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      return res.status(400).json({
        success: false,
        message: 'An error has occurred',
        errors: ['Signup failed, please try again'],
      });
    }

    const hash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ITR) ?? 10
    );

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        zipcode,
        passwordHash: hash,
        updatedAt: new Date(),
      },
    });

    const accessToken = createAccessToken(newUser.id);
    const refreshToken = await createRefreshToken(newUser.id);

    if (!refreshToken) {
      return res.status(500).json({
        success: false,
        errors: [`Login failed: Please try again.`],
      });
    }

    // Send refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshToken.expiresAt,
      path: '/auth',
    });

    return res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: {
        email: newUser.email,
        username: newUser.username,
        userId: newUser.id,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errors: [`Signup failed, please try again`],
    });
  }
};

export const refresh = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const token = _req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const prisma = getPrismaClient();

    const dbRefreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!dbRefreshToken || dbRefreshToken.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ message: 'Invalid or expired refresh token' });
    }

    const accessToken = createAccessToken(dbRefreshToken.userId);
    res.json({
      accessToken,
      userId: dbRefreshToken.userId,
      username: dbRefreshToken.user.username,
      email: dbRefreshToken.user.email,
    });
  } catch (e) {
    console.log(e);
    res.status(403).json({ errors: ['Invalid token'] });
  }
};

export const logout = async (_req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const token = _req.cookies.refreshToken;
    if (token) {
      const prisma = getPrismaClient();
      await prisma.refreshToken.deleteMany({ where: { token } });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth',
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(403).json({ errors: ['Invalid token'] });
  }
};
