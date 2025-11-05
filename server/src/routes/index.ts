import { Express } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import subscriptionRoutes from './subscription';
import gamificationRoutes from './gamification';
import adminRoutes from './admin';
import chatRoutes from './chat';
import reportRoutes from './report';
import { apiLimiter } from '../middleware/rateLimit';

export const setupRoutes = (app: Express) => {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Vele API is running' });
  });

  // Apply general rate limiting to all API routes
  app.use('/api', apiLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/subscription', subscriptionRoutes);
  app.use('/api/gamification', gamificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/report', reportRoutes);
};

