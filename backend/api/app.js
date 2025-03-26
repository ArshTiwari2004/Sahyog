import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { connectDB } from './utils/db';

// Load environment variables
config(); 

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection
connectDB();

export default app;