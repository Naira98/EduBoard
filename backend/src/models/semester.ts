import { Document, Schema, model } from "mongoose";

interface ISemester extends Document {
  name: string;
}

const semesterSchema = new Schema<ISemester>({
  name: { type: String, required: true, unique: true },
});

export const Semester = model<ISemester>("Semester", semesterSchema);
