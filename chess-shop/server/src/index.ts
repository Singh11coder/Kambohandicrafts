import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRouter from './routes/auth';
import productRouter from './routes/products';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});