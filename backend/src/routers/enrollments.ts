import express from "express";
import { enrollStudentController } from "../controllers/enrollments";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Student]),
  enrollStudentController
);

export default router;
