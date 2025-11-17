import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

/*
 * Validates the provided token.
 * Use for every route that user needs to be authorized for.
 */
export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  // jwt is split into 3 sections: header (metadata explaining the type of encryption,
  // payload (the actual content of the token), and signature (anti tampering info)
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = payload.userId;

    // calls the next middleware in the middleware pipeline
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
}
