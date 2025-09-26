import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import * as Sentry from '@sentry/node';
import { AppError, formatApiResponse } from '@/utils';
import { config } from '@/config';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Log error to Sentry if configured
  if (config.sentry.dsn) {
    Sentry.captureException(error);
  }

  // Log error to console in development
  if (config.app.env === 'development') {
    console.error('Error:', error);
  }

  // Handle different types of errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      formatApiResponse(false, null, error.message)
    );
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    let message = 'Database error';
    let statusCode = 500;

    switch (error.code) {
      case 'P2002':
        message = 'A record with this data already exists';
        statusCode = 409;
        break;
      case 'P2025':
        message = 'Record not found';
        statusCode = 404;
        break;
      case 'P2003':
        message = 'Invalid reference';
        statusCode = 400;
        break;
      default:
        message = 'Database operation failed';
    }

    res.status(statusCode).json(
      formatApiResponse(false, null, message)
    );
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json(
      formatApiResponse(false, null, 'Validation failed', [error.message])
    );
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json(
      formatApiResponse(false, null, 'Invalid token')
    );
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json(
      formatApiResponse(false, null, 'Token expired')
    );
    return;
  }

  // Default error response
  res.status(500).json(
    formatApiResponse(false, null, config.app.env === 'production' ? 'Internal server error' : error.message)
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(
    formatApiResponse(false, null, `Route ${req.method} ${req.path} not found`)
  );
};