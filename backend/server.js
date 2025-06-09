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

// Parse CORS_ORIGIN into array of allowed origins
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://yummiz.vercel.app', 'https://yummiz-admin.vercel.app'];
console.log('✅ Allowed CORS origins:', corsOrigins);

// CORS middleware configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

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
app.use((err, _req, res, _next) => {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
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
