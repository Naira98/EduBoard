import { Document, Schema, Types, model } from "mongoose";

export interface ISubmittedAnswer {
  questionText: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface IGrade extends Document {
  student: Types.ObjectId;
  quiz: Types.ObjectId;
  score: number;
  totalQuestions: number;
  submittedAnswers: ISubmittedAnswer[];
  submittedAt: Date;
}

const submittedAnswerSchema = new Schema<ISubmittedAnswer>(
  {
    questionText: { type: String, required: true },
    selectedOption: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const gradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    submittedAnswers: [submittedAnswerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that a student can only submit a grade once for a specific quiz
gradeSchema.index({ student: 1, quiz: 1 }, { unique: true });

export const Grade = model<IGrade>("Grade", gradeSchema);
