export interface Course {
  _id: string;
  name: string;
  professors: { _id: string; username: string }[] | string[];
  semester: { _id: string; name: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  name: string;
  professorIds: string[];
  semesterId: string;
}

export interface UpdateCourseData {
  id: string;
  name?: string;
  professorIds?: string[];
  semesterId?: string;
}

export interface GetAllCoursesParams {
  semesterId?: string;
  professorId?: string;
}
