import { UserRole } from "./Auth";

export interface UserManaged {
  _id: string;
  role: UserRole;
}
export interface CourseOption {
  _id: string;
  name: string;
  semester: { _id: string; name: string } | string;
  professors: string[];
}
export interface CreateNewUserData {
  username: string;
  email: string;
  role: UserRole.manager | UserRole.professor;
  password: string;
  semesterId: null;
  courseIds: string[];
}
