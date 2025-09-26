import { Request, Response, NextFunction } from 'express';
import { verifyToken, AppError, formatApiResponse } from '@/utils';
import { prisma } from '@/config/database';
import type { AuthRequest } from '@/types';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token is required', 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (payload.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        language: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
        formatApiResponse(false, null, error.message)
      );
    } else {
      res.status(401).json(
        formatApiResponse(false, null, 'Invalid or expired token')
      );
    }
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // TODO: Implement admin role check when admin system is added
  // For now, we'll implement a simple admin email list
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim());
  
  if (!req.user || !adminEmails.includes(req.user.email)) {
    res.status(403).json(
      formatApiResponse(false, null, 'Admin access required')
    );
    return;
  }
  
  next();
};