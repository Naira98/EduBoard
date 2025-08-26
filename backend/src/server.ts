import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MONGO_URI, PORT } from "./config/config";

const app = express();

app.use(express.json());
app.use(cors());

startServer();

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
