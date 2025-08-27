import express from "express";
import { requireRole } from "../middlewares/requireRole";
import { UserRole } from "../models/user";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createAnnouncementController,
  deleteAnnouncementController,
  getAllAnnouncementsController,
  getAnnouncementByIdController,
  updateAnnouncementController,
} from "../controllers/announcements";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  createAnnouncementController
);

router.patch(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  updateAnnouncementController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole([UserRole.Manager, UserRole.Professor]),
  deleteAnnouncementController
);

router.get("/", verifyToken, getAllAnnouncementsController);
router.get("/:id", verifyToken, getAnnouncementByIdController);

export default router;
