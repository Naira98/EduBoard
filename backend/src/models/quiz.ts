import { Document, Schema, Types, model } from "mongoose";

interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface IQuiz extends Document {
  title: string;
  dueDate: Date;
  questions: IQuestion[];
  course: Types.ObjectId;
  semester: Types.ObjectId;
  createAt: Date;
  updateAt: Date;
}

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questions: [{ type: questionSchema, required: true }],
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
  },
  {
    timestamps: true,
  }
);

export const Quiz = model<IQuiz>("Quiz", quizSchema);
