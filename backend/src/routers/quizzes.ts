import express from "express";
import {
  createQuizController,
  deleteQuizController,
  getAllQuizzesController,
  getQuizByIdController,
  updateQuizController,
} from "../controllers/quizzes";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  createQuizController
);

router.put(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  updateQuizController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  deleteQuizController
);

router.get("/", verifyToken, getAllQuizzesController);
router.get("/:id", verifyToken, getQuizByIdController);

export default router;
