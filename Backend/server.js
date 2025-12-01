import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/post.routes.js";
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

app.use('/api/posts', productRoutes);
app.use('/api/users', userRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
  app.use(express.static(path.join(__dirname, "Frontend")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "index.html"));
  });
}


app.listen(5000, () => {
    connectDB();
    console.log('Server is running on http://localhost:5000');
});

