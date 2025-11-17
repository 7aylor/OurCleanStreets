import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../authMiddleware';

describe('authenticateJWT middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();

    vi.restoreAllMocks();
  });

  it('returns 401 when Authorization header is missing', () => {
    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing or invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is malformed', () => {
    req.headers.authorization = 'malformed token';

    authenticateJWT(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Missing or invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when JWT verification fails', () => {
    req.headers.authorization = 'Bearer badtoken';

    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('invalid');
    });

    authenticateJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      'badtoken',
      process.env.JWT_SECRET!
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token expired or invalid',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.userId and calls next() when token is valid', () => {
    req.headers.authorization = 'Bearer goodtoken';
    process.env.JWT_SECRET = 'testsecret';

    vi.spyOn(jwt, 'verify').mockReturnValue({
      userId: 'user123',
    });

    authenticateJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('goodtoken', 'testsecret');

    expect(req.userId).toBe('user123');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
