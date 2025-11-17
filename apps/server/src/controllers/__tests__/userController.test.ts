import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../../utils/prisma';
import { passwordSchema } from '../../utils/zod-schemas';
import { resetPassword } from '../userController';

vi.mock('../../utils/prisma');
vi.mock('bcryptjs');

describe('resetPassword', () => {
  let prismaMock: any;
  let req: any;
  let res: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };
    (getPrismaClient as any).mockReturnValue(prismaMock);

    req = {
      body: { currentPassword: '%T6y7u8i9o0p', newPassword: '$R5t6y7u8i9o!' },
      userId: 'user123',
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it('returns 400 if current or new password missing', async () => {
    req.body = { currentPassword: '', newPassword: '' };
    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Both current and new passwords are required',
    });
  });

  it('returns 404 if user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('returns 400 if new password fails schema validation', async () => {
    const originalSafeParse = passwordSchema.safeParse;
    passwordSchema.safeParse = vi.fn().mockReturnValue({
      success: false,
      error: { issues: [{ message: 'Invalid password' }] },
    });

    prismaMock.user.findUnique.mockResolvedValue({ passwordHash: 'hash' });

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error has occurred',
      errors: ['Invalid password'],
    });

    passwordSchema.safeParse = originalSafeParse; // restore
  });

  it('returns 401 if current password is invalid', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ passwordHash: 'hash' });
    (bcrypt.compare as any).mockResolvedValue(false);

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid current password',
    });
  });

  it('updates password successfully', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      passwordHash: 'hash',
      id: 'user123',
    });
    (bcrypt.compare as Mock).mockResolvedValue(true);
    (bcrypt.hash as Mock).mockResolvedValue('newhash');

    await resetPassword(req, res);

    expect(bcrypt.hash).toHaveBeenCalled();
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'user123' },
      data: { passwordHash: 'newhash', updatedAt: expect.any(Date) },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Password updated successfully',
    });
  });

  it('handles unexpected errors and returns 500', async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error('DB failure'));

    const consoleSpy = vi.spyOn(console, 'error');

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error updating password',
    });
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });
});
