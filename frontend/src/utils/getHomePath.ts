import { UserRole } from "../types/Auth";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.student) return "/";
  else if (role === UserRole.professor) return "/professor/courses";
  else if (role === UserRole.manager) return "/manager/add-users";
  else return "/";
};
