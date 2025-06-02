import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoint (public) - DOIT ÊTRE AVANT LES AUTRES ROUTES
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Autres routes et middlewares ici

export default app; 