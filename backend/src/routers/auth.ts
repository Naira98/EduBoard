import express from "express";
import {
  getMeController,
  loginController,
  logoutController,
  refreshController,
  registerController,
} from "../controllers/auth";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/me", verifyToken, getMeController);

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/refresh", refreshController);

router.post("/logout", verifyToken, logoutController);

export default router;
