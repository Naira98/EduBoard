import express from "express";
import {
  createSemesterController,
  getSemestersController,
  updateSemesterController,
} from "../controllers/semester";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.get("/", getSemestersController);

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Manager]),
  createSemesterController
);

router.put(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager]),
  updateSemesterController
);

export default router;
