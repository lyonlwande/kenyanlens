import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConnection.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Request logger middleware
function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
}

const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security headers middleware
function securityHeaders(req, res, next) {
  // Remove any restrictive CSP headers first
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  
  // Set proper CSP headers
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' data: https:; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://kenyanlens.onrender.com;"
  );
  
  // Other security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
}

app.use(requestLogger);
app.use(securityHeaders); // Add this middleware
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

// Serve static files from frontend with proper headers
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'dist', 'assets'), {
  maxAge: '1y',
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

app.use(express.static(path.join(__dirname, 'frontend', 'dist'), {
  maxAge: '1h',
  setHeaders: (res, path) => {
    // Remove any restrictive CSP for static files
    res.removeHeader('Content-Security-Policy');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "font-src 'self' data: https:; " +
      "img-src 'self' data: https:;"
    );
  }
}));

// Import routers
import authRoutes from './Modules/Authentication/auth.routes.js';
import userRoutes from './Modules/User/user.routes.js';

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Catch-all route for SPA
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Skip if it looks like a file request (has an extension)
  if (req.path.includes('.')) {
    return next();
  }
  // Otherwise send the React app
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
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