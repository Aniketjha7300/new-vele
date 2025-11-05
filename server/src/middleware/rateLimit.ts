import rateLimit from 'express-rate-limit';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// General API rate limiter (more lenient in development)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // Much higher limit in development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Skip trust proxy validation (we trust Render's proxy)
  },
  skip: (req) => {
    // Skip rate limiting for health checks and gamification routes (they have their own limiter)
    return req.path === '/health' || req.path.startsWith('/gamification');
  },
});

// Auth rate limiter (stricter for login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  validate: {
    trustProxy: false, // Skip trust proxy validation (we trust Render's proxy)
  },
});

// Chat rate limiter
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'Too many messages, please slow down.',
  validate: {
    trustProxy: false, // Skip trust proxy validation (we trust Render's proxy)
  },
});

// Skip rate limiter
export const skipLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 skips per minute (prevents abuse)
  message: 'Too many skips, please wait a moment.',
  validate: {
    trustProxy: false, // Skip trust proxy validation (we trust Render's proxy)
  },
});

// Gamification rate limiter (more lenient for stats/streak)
// This is applied specifically to gamification routes to allow more frequent stats checks
export const gamificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: isDevelopment ? 500 : 100, // Very high limit in development, reasonable in production
  message: 'Too many gamification requests, please wait a moment.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Skip trust proxy validation (we trust Render's proxy)
  },
  // Note: In development, stats endpoint is read-only and safe, so we allow many requests
});

