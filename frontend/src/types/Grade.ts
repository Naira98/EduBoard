import type { Quiz } from "./Quiz";

interface ISubmittedAnswer {
  questionText: string;
  selectedOption: string;
  isCorrect?: boolean;
}

export interface Grade {
  _id: string;
  student: string;
  quiz: string | Quiz;
  score: number;
  totalQuestions: number;
  submittedAnswers: ISubmittedAnswer[];
  submittedAt: string;
}

export interface GradeSubmission {
  _id: string;
  student: { username: string; email: string };
  quiz: string;
  score: number;
  totalQuestions: number;
  submittedAnswers: ISubmittedAnswer[];
  submittedAt: string;
}

interface IStudentQuizSubmission {
  questionText: string;
  selectedOption: string;
}
export interface SubmitQuizData {
  quizId: string;
  answers: IStudentQuizSubmission[];
}

export interface GetMyGradesParams {
  quizId?: string;
}
