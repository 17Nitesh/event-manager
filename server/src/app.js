import express from 'express';
import cors from 'cors';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoute.js';
import eventRoutes from './routes/eventRoute.js';
// import eventRoutes from './routes/eventRoutes';

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

export default app;