import express from "express";
import {
  getMyGradesController,
  getQuizGradesController,
  submitQuizController,
} from "../controllers/grades";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Student]),
  submitQuizController
);
router.get(
  "/my-grades",
  verifyToken,
  requireRole([UserRole.Student]),
  getMyGradesController
);

router.get(
  "/:quizId",
  verifyToken,
  requireRole([UserRole.Professor, UserRole.Manager]),
  getQuizGradesController
);

export default router;
