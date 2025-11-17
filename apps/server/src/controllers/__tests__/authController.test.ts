import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { login, signup, refresh, logout } from '../authController';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '../../utils/auth';
import { loginSchema, signupSchema } from '../../utils/zod-schemas';
import * as prisma from '../../utils/prisma';

vi.mock('../src/utils/prisma');
vi.mock('bcryptjs');
vi.mock('../src/utils/auth');

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  refreshToken: {
    findUnique: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('../../utils/prisma', () => ({
  getPrismaClient: vi.fn(() => mockPrisma),
}));

vi.mock('../../utils/auth', () => ({
  createAccessToken: vi.fn().mockReturnValue('mock_access_token'),
  createRefreshToken: vi.fn(),
}));

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn();
  res.clearCookie = vi.fn();
  res.sendStatus = vi.fn();
  return res;
};

describe('authController', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    req = { body: {}, cookies: {} };
    res = mockRes();
    process.env.JWT_SECRET = 'secret';
    process.env.DOMAIN = 'example.com';
    process.env.SALT_ITR = '10';
  });

  describe('login()', () => {
    it('returns 400 for invalid schema', async () => {
      req.body = {};

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array),
      });
    });

    it('returns 401 when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      req.body = { email: 'test@test.com', password: '%T6y7u8i9o0p' };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Login Failed. Invalid credentials or user not found'],
      });
    });

    it('returns 401 for invalid password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'user',
        zipcode: '12345',
        passwordHash: 'hash',
      });

      (bcrypt.compare as Mock).mockResolvedValue(false);

      req.body = { email: 'test@test.com', password: '%T6y7u8i9o0p' };
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Login Failed. Invalid credentials or user not found'],
      });
    });

    it('returns 500 if refresh token creation fails', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'user',
        zipcode: '12345',
        passwordHash: 'hash',
      });

      (bcrypt.compare as Mock).mockResolvedValue(true);
      (createAccessToken as Mock).mockReturnValue('access123');
      (createRefreshToken as Mock).mockResolvedValue(null);

      req.body = { email: 'test@test.com', password: '%T6y7u8i9o0p' };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: ['Login failed: Please try again.'],
      });
    });

    it('returns 200 and sets cookies on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        username: 'user',
        zipcode: '12345',
        passwordHash: 'hash',
      });

      (bcrypt.compare as Mock).mockResolvedValue(true);
      (createAccessToken as Mock).mockReturnValue('access123');
      (createRefreshToken as Mock).mockResolvedValue({
        token: 'refresh123',
        expiresAt: new Date(),
      });

      req.body = { email: 'test@test.com', password: '%T6y7u8i9o0p' };

      await login(req, res);

      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        accessToken: 'access123',
        message: 'Login successful',
        user: {
          email: 'test@test.com',
          userId: '1',
          username: 'user',
          zipcode: '12345',
        },
      });
    });

    it('returns 500 if unknown error occurs', async () => {
      vi.spyOn(loginSchema, 'safeParse').mockImplementation(() => {
        throw new Error('Unknown parsing error');
      });
      const consoleSpy = vi.spyOn(console, 'error');

      req.body = {
        email: 'test@test.com',
        password: '%T6y7u8i9o0p',
      };

      await login(req, res);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unknown parsing error',
        })
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: [`Login failed: Please try again.`],
      });
    });
  });

  describe('signup()', () => {
    it('returns 400 for invalid schema', async () => {
      req.body = {};
      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'An error has occurred',
        errors: expect.any(Array),
      });
    });

    it('returns 400 if username already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: '1' });

      req.body = {
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
        password: '%T6y7u8i9o0p',
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'An error has occurred',
        errors: ['Signup failed, please try again'],
      });
    });

    it('returns 400 if email already exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null) //username not found
        .mockResolvedValueOnce({ id: '1' }); // email found

      req.body = {
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
        password: '%T6y7u8i9o0p',
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'An error has occurred',
        errors: expect.any(Array),
      });
    });

    it('creates a user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      (bcrypt.hash as Mock).mockResolvedValue('hashed_pw');

      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
      });

      (createAccessToken as Mock).mockReturnValue('access123');
      (createRefreshToken as Mock).mockResolvedValue({
        token: 'refresh123',
        expiresAt: new Date(),
      });

      req.body = {
        username: 'test',
        email: 'test@test.com',
        zipcode: '12435',
        password: '%T6y7u8i9o0p',
      };

      await signup(req, res);

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.cookie).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        accessToken: 'access123',
        message: 'Signup successful',
        user: {
          email: 'test@test.com',
          userId: '1',
          username: 'test',
          zipcode: '12345',
        },
      });
    });

    it('returns 500 if refresh token fails', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null); // username
      mockPrisma.user.findUnique.mockResolvedValueOnce(null); // email

      (bcrypt.hash as Mock).mockResolvedValue('hashed');
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
      });

      (createRefreshToken as Mock).mockResolvedValue(null);

      req.body = {
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
        password: '%T6y7u8i9o0p',
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array),
      });
    });

    it('returns 500 if unknown error occurs', async () => {
      vi.spyOn(signupSchema, 'safeParse').mockImplementation(() => {
        throw new Error('Unknown parsing error');
      });
      const consoleSpy = vi.spyOn(console, 'error');

      req.body = {
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
        password: '%T6y7u8i9o0p',
      };

      await signup(req, res);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unknown parsing error',
        })
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.any(Array),
      });
    });
  });

  describe('refresh()', () => {
    it('returns 401 if no cookie token', async () => {
      req.cookies = {};
      await refresh(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('returns 403 for invalid or expired refresh token', async () => {
      req.cookies.refreshToken = 'badtoken';
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await refresh(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('returns new access token on success', async () => {
      req.cookies.refreshToken = 'goodtoken';

      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        token: 'goodtoken',
        expiresAt: new Date(Date.now() + 10000),
        userId: '1',
        user: {
          username: 'test',
          email: 'test@test.com',
          zipcode: '12345',
        },
      });

      (createAccessToken as Mock).mockReturnValue('new_access');

      await refresh(req, res);

      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'new_access',
        userId: '1',
        username: 'test',
        email: 'test@test.com',
        zipcode: '12345',
      });
    });

    it('returns 403 if unknown error occurs', async () => {
      vi.spyOn(prisma, 'getPrismaClient').mockImplementation(() => {
        throw new Error('Unknown error');
      });
      const consoleSpy = vi.spyOn(console, 'error');

      req.cookies.refreshToken = 'goodtoken';

      await refresh(req, res);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unknown error',
        })
      );

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Invalid token'],
      });
    });
  });

  describe('logout()', () => {
    it('clears cookie and deletes token when token present', async () => {
      req.cookies.refreshToken = 'refresh123';

      await logout(req, res);

      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('still returns 200 if no token provided', async () => {
      req.cookies = {};

      await logout(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('returns 403 on error', async () => {
      mockPrisma.refreshToken.deleteMany.mockRejectedValue(
        new Error('DB error')
      );
      req.cookies.refreshToken = 'refresh123';

      await logout(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
