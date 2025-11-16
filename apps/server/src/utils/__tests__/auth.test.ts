import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../auth';

const mockPrisma = {
  refreshToken: {
    create: vi.fn(),
  },
};

vi.mock('../prisma', () => ({
  getPrismaClient: vi.fn(() => mockPrisma),
}));

vi.spyOn(crypto, 'randomBytes').mockImplementation(() => {
  return Buffer.from('a'.repeat(64));
});

vi.spyOn(jwt, 'sign');

describe('auth token helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAccesToken()', () => {
    it('creates a valid access token with correct payload and expiration', () => {
      process.env.JWT_SECRET = 'testsecret';

      const token = createAccessToken('user123');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        'testsecret',
        {
          expiresIn: '15m',
        }
      );

      expect(typeof token).toBe('string');
    });
  });

  describe('createRefreshToken', () => {
    it('creates a refresh token and saves it in the database', async () => {
      const mockCreate = vi.fn().mockResolvedValueOnce({
        token: '61'.repeat(64),
      });

      mockPrisma.refreshToken.create = mockCreate;

      const userId = 'user123';
      const { token, expiresAt } = (await createRefreshToken(userId)) ?? {};

      // '61' rather than 'a' because createRefreshToken converts to hex
      expect(token).toBe('61'.repeat(64));

      // Verify expiresAt is 7 days ahead
      const sevenDaysMs = 1000 * 60 * 60 * 24 * 7;
      const now = Date.now();
      expect(expiresAt?.getTime()).toBeGreaterThanOrEqual(
        now + sevenDaysMs - 1000
      );
      expect(expiresAt?.getTime()).toBeLessThanOrEqual(
        now + sevenDaysMs + 1000
      );

      // Ensure prisma insert was called with correct structure
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
    });

    it('logs an error if creating refresh token fails', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const mockError = vi.fn().mockRejectedValue(new Error('DB error'));

      mockPrisma.refreshToken.create.mockRejectedValueOnce(mockError);

      const result = await createRefreshToken('user123');

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('logs an error if db returns no refresh token', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const mockError = vi
        .fn()
        .mockRejectedValue(
          new Error('Failed to created refreshToken for user user123')
        );

      mockPrisma.refreshToken.create.mockReturnValueOnce(null);

      const result = await createRefreshToken('user123');

      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
