import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { ITokenPayload } from "../../types/Token";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config";
import { UserRole } from "../models/user";

export const generateAccessToken = (
  id: Types.ObjectId | string,
  role: UserRole
) => {
  const payload: ITokenPayload = {
    userId: id.toString(),
    role,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5m" });
};

export const generateRefreshToken = (id: Types.ObjectId, role: UserRole) => {
  const payload: ITokenPayload = {
    userId: id.toString(),
    role,
  };
  return jwt.sign(payload, REFRESH_SECRET);
};
