import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { formatApiResponse } from '@/utils';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        res.status(400).json(
          formatApiResponse(false, null, 'Validation failed', errors)
        );
      } else {
        res.status(400).json(
          formatApiResponse(false, null, 'Invalid request data')
        );
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        res.status(400).json(
          formatApiResponse(false, null, 'Query validation failed', errors)
        );
      } else {
        res.status(400).json(
          formatApiResponse(false, null, 'Invalid query parameters')
        );
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        res.status(400).json(
          formatApiResponse(false, null, 'Parameter validation failed', errors)
        );
      } else {
        res.status(400).json(
          formatApiResponse(false, null, 'Invalid route parameters')
        );
      }
    }
  };
};