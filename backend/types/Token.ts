import { UserRole } from "../src/models/user";

export interface ITokenPayload {
  userId: string;
  role: UserRole;
}
