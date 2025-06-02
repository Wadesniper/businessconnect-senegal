import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import jobRoutes from './jobs';
import subscriptionRoutes from './subscriptions';

export const routes = {
  auth: authRoutes,
  users: userRoutes,
  jobs: jobRoutes,
  subscriptions: subscriptionRoutes
}; 