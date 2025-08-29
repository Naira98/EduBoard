import express from "express";
import {
  getMeController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth";
import { requireRole } from "../middlewares/requireRole";
import { verifyToken } from "../middlewares/verifyToken";
import { UserRole } from "../models/user";

const router = express.Router();

router.get("/me", verifyToken, getMeController);

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh", refreshController);

router.post("/logout", verifyToken, logoutController);

router.post(
  "/manager/users",
  verifyToken,
  requireRole([UserRole.Manager]),
  registerController
);

export default router;
