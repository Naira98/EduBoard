import { UserRole } from "../types/Auth";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.student) return "/";
  else if (role === UserRole.professor) return "/professor/courses";
  else return "/";
};
