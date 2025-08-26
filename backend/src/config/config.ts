import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI || "";
export const PORT = process.env.PORT || 3000;

export const ACCESS_SECRET = process.env.ACCESS_SECRET || "accessSecretKey";
export const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshSecretKey";
