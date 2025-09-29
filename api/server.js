// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.js';
import categoriesRouter from './routes/categories.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes (GET only for A2)
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
