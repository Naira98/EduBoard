import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { MONGO_URI, PORT } from "./config/config";
import announcementsRouter from "./routers/announcements";
import authRouter from "./routers/auth";
import coursesRouter from "./routers/courses";
import gradesRouter from "./routers/grades";
import quizzesRouter from "./routers/quizzes";
import semesterRouter from "./routers/semester";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/semester", semesterRouter);
app.use("/api/announcements", announcementsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/grades", gradesRouter);

startServer();

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}
