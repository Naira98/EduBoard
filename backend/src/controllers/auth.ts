import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ITokenPayload } from "../../types/Token";
import { REFRESH_SECRET } from "../config/config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Token } from "../models/tokens";
import { User } from "../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateJWT";

export const getMeController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    username: user.username,
    email: user.email,
    role: user.role,
  });
});

export const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const user = await User.findOne({ email });
  if (user) return res.status(409).json({ message: "Email already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: "student",
  });
  await newUser.save();

  res
    .status(201)
    .json({ message: "User created successfully", id: newUser._id });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid password" });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  const existingToken = await Token.findOne({ userId: user._id });

  if (existingToken) {
    existingToken.token = refreshToken;
    await existingToken.save();
  } else {
    const newToken = new Token({
      token: refreshToken,
      userId: user._id,
    });
    await newToken.save();
  }

  res.status(200).json({
    accessToken,
    refreshToken,
    user: { id: user._id, username: user.username, role: user.role },
  });
});

export const refreshController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const tokenInDB = await Token.findOne({ token: refreshToken });
  if (!tokenInDB) return res.status(401).json({ message: "Invalid token" });

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as ITokenPayload;
    const newAccessToken = generateAccessToken(payload.userId, payload.role);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export const logoutController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const token = await Token.findOneAndDelete({ token: refreshToken });
  if (!token) return res.status(401).json({ message: "Invalid token" });

  res.status(200).json({ message: "Logged out successfully" });
});
