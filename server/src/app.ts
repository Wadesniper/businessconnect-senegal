import express, { Request, Response } from 'express';

const app = express();

// Healthcheck endpoint (public)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
}); 