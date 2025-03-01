import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import connectDB from "./db/index";
import { app } from "./app";




dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("DB Connection Failed !!!", err);
    process.exit(1); // Exit process if DB connection fails
  });
