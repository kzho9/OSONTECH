import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { config } from '@/config';
import { redis } from '@/config/redis';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';

const app = express();

// Initialize Sentry if DSN is provided
if (config.sentry.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.app.env,
  });
  
  app.use(Sentry.Handlers.requestHandler());
}

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URLS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.app.env,
  });
});

// API Routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/user';
import publicRoutes from '@/routes/public';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', publicRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/webhooks', webhookRoutes);

// Error handlers
if (config.sentry.dsn) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Redis connection
const initializeRedis = async (): Promise<void> => {
  try {
    await redis.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    await initializeRedis();
    
    app.listen(config.app.port, () => {
      console.log(`Server running on port ${config.app.port}`);
      console.log(`Environment: ${config.app.env}`);
      console.log(`Health check: http://localhost:${config.app.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;