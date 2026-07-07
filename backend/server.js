 


 

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authroutes.js";


import { errorHandler } from "./middleware/errorMiddleware.js";

import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();


// SECURITY HEADERS
app.use(helmet());


// CORS
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);


// BODY PARSING
app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
  })
);


// LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// RATE LIMITER
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  message: {
    success: false,
    message:
      "Too many attempts. Please try again in 15 minutes.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});


// ROUTES
app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);


// EXPENSE ROUTES
app.use(
  "/api/expenses",  expenseRoutes
);


// DASHBOARD ROUTES
app.use("/api/dashboard", dashboardRoutes

);

//goal routes 
app.use("/api/goals", goalRoutes);


//habit routes
app.use("/api/habits", habitRoutes);


//analytics routes 

app.use("/api/analytics", analyticsRoutes);


// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,

    message:
      "Financial Habit Builder API is running 🚀",

    env:
      process.env.NODE_ENV ||
      "development",
  });
});


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: `Route ${req.originalUrl} not found`,
  });
});


// GLOBAL ERROR HANDLER
app.use(errorHandler);


const PORT =
  process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});