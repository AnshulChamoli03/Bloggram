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

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Frontend", "dist")));

  // Catch-all route for SPA - must be last (Express 5 compatible)
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    // Serve index.html for all other routes (SPA routing)
    const indexPath = path.resolve(__dirname, "Frontend", "dist", "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('Page not found');
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

