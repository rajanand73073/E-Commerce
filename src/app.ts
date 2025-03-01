
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { DB_NAME } from "../constants";
import connectDB from "./db/index";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes"
import orderRoutes from "./routes/Order.routes"


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/orders", orderRoutes);




export { app };
