import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
// Configure dotenv before any other imports
dotenv.config();

// Validate and configure Cloudinary
if (!process.env.CLOUDINARY_URL) {
    console.error('❌ CLOUDINARY_URL not defined in .env file');
    process.exit(1);
}

try {
    // Parse CLOUDINARY_URL and configure Cloudinary
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (!cloudinaryUrl) {
        throw new Error('CLOUDINARY_URL is not defined');
    }

    // Extract credentials from CLOUDINARY_URL
    const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@([^/]+)/);
    if (!match) {
        throw new Error('Invalid CLOUDINARY_URL format');
    }

    const [, api_key, api_secret, cloud_name] = match;
    
    cloudinary.config({
        cloud_name: cloud_name,
        api_key: api_key,
        api_secret: api_secret
    });

    console.log('✅ Cloudinary configured successfully');
} catch (error) {
    console.error('❌ Cloudinary configuration failed:', error.message);
    process.exit(1);
}
// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI', 'CLOUDINARY_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ ${envVar} not defined in .env file.`);
    process.exit(1);
  }
}

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRequestsRouter from "./routes/recipeRequests.js";
import notificationsRouter from "./routes/notifications.js";

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse and validate CORS origins
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://yummiz.vercel.app',
  'https://yummiz-admin.vercel.app',
  'https://yummiz-git-main.vercel.app',
  'https://yummiz.up.railway.app'
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With'
  ]
}));

// Log CORS settings in development
if (process.env.NODE_ENV !== 'production') {
  console.log('✅ Allowed CORS origins:', allowedOrigins);
}

// Serve static files with proper CORS headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// API routes
app.use("/api/recipe-requests", recipeRequestsRouter);
app.use("/api/food", foodRouter);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationsRouter);

// Health check route
app.get("/", (_req, res) => {
  res.send("API Working!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed'
    });
  }
  next(err);
});

// Async start
const startServer = async () => {
  try {    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("🔥 Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Global error catchers
process.on("unhandledRejection", (err) => {
  console.error("🧨 Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
  process.exit(1);
});
