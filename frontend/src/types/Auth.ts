export enum UserRole {
  student = "student",
  professor = "professor",
  manager = "manager",
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  semesterId: string;
}
export interface TokenPayload {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}
