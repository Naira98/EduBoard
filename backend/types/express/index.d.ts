import * as express from "express";
import { UserRole } from "../../src/models/user";

declare module "express" {
  interface Request {
    user?: {
      userId: string;
      role: UserRole;
    };
  }
}
