import express from "express";
import {
  createCourseController,
  deleteCourseController,
  getAllCoursesController,
  updateCourseController,
} from "../controllers/courses";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Manager]),
  createCourseController
);
router.put(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager]),
  updateCourseController
);
router.delete(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager]),
  deleteCourseController
);

router.get("/", verifyToken, getAllCoursesController);

export default router;
