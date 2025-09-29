import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import eventsRouter from './routes/events.js';
import categoriesRouter from './routes/categories.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routers
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Root - avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('API OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
