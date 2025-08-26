import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../../types/Token";
import { ACCESS_SECRET } from "../config/config";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("VERIFYING TOKEN STARTED");
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    if (token.startsWith("Bearer ")) token = token.split(" ")[1];
    console.log("VERIFYING TOKEN DONE");

    const payload = jwt.verify(token, ACCESS_SECRET) as ITokenPayload;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
