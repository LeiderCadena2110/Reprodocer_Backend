// ============================================================
// index.ts – Express server entry point
// ============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = process.env.PORT ?? 3001;
const FRONTEND_URL = process.env.FRONTEND_URL ?? '*';

app.use(cors({
  origin: FRONTEND_URL === '*' ? true : FRONTEND_URL.split(',').map(u => u.trim()),
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api', router);

app.get('/', (_req, res) => res.json({ name: 'MusicFlow API', version: '2.0.0' }));

app.listen(PORT, () => {
  console.log(`🎵  MusicFlow API  →  http://localhost:${PORT}`);
  console.log(`    YouTube:  ${process.env.YOUTUBE_API_KEY ? '✓ configured' : '✗ not configured (set YOUTUBE_API_KEY)'}`);
});

export default app;
