export interface Question {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  title: string;
  dueDate: string; // ISO date string
  questions: Question[];
  course: { _id: string; name: string; professor?: string };
  semester: { _id: string; name: string };
  creator: { _id: string; username: string; email?: string; role?: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizData {
  title: string;
  dueDate: string;
  questions: Omit<Question, "_id">[];
  courseId: string;
  semesterId: string;
}

export interface UpdateQuizData {
  id: string;
  title?: string;
  dueDate?: string;
  questions?: Omit<Question, "_id">[];
  courseId?: string;
  semesterId?: string;
}

export interface GetAllQuizzesParams {
  semesterId?: string;
  courseId?: string;
}

export interface IStudentQuizSubmission {
  questionText: string;
  selectedOption: string;
}
