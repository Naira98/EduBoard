import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user";

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
    }
  };
};
