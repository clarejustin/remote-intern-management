// backend/src/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import internsRouter from './routes/interns.js';
import tasksRouter from './routes/tasks.js';
import timesheetsRouter from './routes/timesheets.js';
import auth from './middleware/auth.js';

dotenv.config();

/* ---- Config ---- */
const PORT = Number(process.env.PORT || 4000);
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

// Allow your Vite dev server
const ALLOWED_ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

/* ---- App ---- */
const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));     // Handle preflight
app.use(express.json());
app.use(morgan('dev'));

/* ---- Health ---- */
app.get('/', (_req, res) =>
  res.json({ status: 'ok', service: 'remote-intern-management' })
);

/* ---- Routes ---- */
// Public
app.use('/api/auth', authRouter);

// Protected
app.use('/api/interns', auth, internsRouter);
app.use('/api/tasks', auth, tasksRouter);
app.use('/api/timesheets', auth, timesheetsRouter);

/* ---- 404 ---- */
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

/* ---- Error handler ---- */
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

/* ---- Start ---- */
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`✅ API listening on http://localhost:${PORT} (CORS: ${ALLOWED_ORIGIN})`)
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}
start();
