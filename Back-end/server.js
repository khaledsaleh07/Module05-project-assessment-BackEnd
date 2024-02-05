import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";


// Middlewares
import connectToDatabase from "./config/connection.js";
import logRequestBody from "./middlewares/requestBodyData.js";
import { authenticateToken } from "./middlewares/auth.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectToDatabase();

// Enable CORS
app.use(cors());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./"));

// Middleware to log request details
app.use(logRequestBody);


// authentication routes
app.use("/api", authRoutes);

// all the other routes
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);