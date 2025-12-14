import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConnection.js';
import path from 'path';
dotenv.config();

const __dirname = path.resolve(); 
const app = express();

// Request logger middleware
function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
}

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(requestLogger);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || [FRONTEND_ORIGIN].includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Import routers
import authRoutes from './Modules/Authentication/auth.routes.js';
import userRoutes from './Modules/User/user.routes.js';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));


app.get(/\/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});


const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/kenyanlens';

const start = async () => {
  try {
    const connected = await connectDB(MONGO_URL);
    if (!connected) {
      console.error('Failed to connect to MongoDB. Exiting.');
      process.exit(1);
    }
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    return { status: 'ok', port: PORT };
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

start();