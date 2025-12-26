import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());

// CORS configuration - allow requests from frontend
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In production, allow specific origins or all if FRONTEND_URL not set
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Allow all origins for deployment flexibility
        callback(null, true);
      }
    } else {
      // In development, allow all
      callback(null, true);
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const __dirname = path.resolve();

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "Frontend", "dist");
  app.use(express.static(staticPath));

  // Catch-all route for SPA - must be last (Express 5 compatible)
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    // Serve index.html for all other routes (SPA routing)
    const indexPath = path.resolve(staticPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).json({ error: 'Page not found' });
      }
    });
  });
}

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    // Server started successfully
    // Connect to database in background (non-blocking)
    connectDB().catch(() => {
        // Database connection failed, but server continues running
    });
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    // Handle unhandled promise rejections
});

