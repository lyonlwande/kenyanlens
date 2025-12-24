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
  origin: [
    'https://kenyanlens.onrender.com',
    'http://localhost:5173'
  ],
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

// Import and mount blog routes
import blogRoutes from './Modules/Blog/blog.routes.js';
app.use('/api/blogs', blogRoutes);


// Global error handler for detailed logging
app.use((err, req, res, next) => {
  // Enhanced Multer file size error logging
  let fileSize = null;
  if (err && err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    if (req && req.files) {
      const allFiles = Object.values(req.files).flat();
      if (allFiles.length) {
        fileSize = Math.max(...allFiles.map(f => f.size));
      }
    }
    console.error('[GlobalErrorHandler]', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      fileSize,
      ...('errors' in err ? { errors: err.errors } : {})
    });
  } else {
    console.error('[GlobalErrorHandler]', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      ...('errors' in err ? { errors: err.errors } : {})
    });
  }
  res.status(err.status || 500).json({
    error: err.message,
    ...(err.errors ? { errors: err.errors } : {})
  });
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Option 3: Handle all non-API routes explicitly
app.get(/^(?!\/api).*/, (req, res) => {
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