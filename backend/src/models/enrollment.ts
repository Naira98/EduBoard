import { Document, Schema, Types, model } from "mongoose";

interface IEnrollment extends Document {
  student: Types.ObjectId;
  semester: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
  },
  { timestamps: true }
);

export const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);
