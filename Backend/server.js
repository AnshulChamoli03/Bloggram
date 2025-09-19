import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
// import pg from "pg";

dotenv.config();

const app = express();

app.use(express.json());


app.use('/api/posts', productRoutes);


app.listen(5000, () => {
    connectDB();
    console.log('Server is running on http://localhost:5000');
});

