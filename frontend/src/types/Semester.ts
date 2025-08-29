export interface Semester {
  _id: string;
  name: string;
}

export interface CreateSemesterData {
  name: string;
}

export interface UpdateSemesterData {
  id: string;
  name: string;
}
