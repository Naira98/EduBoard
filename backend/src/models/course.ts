import { Document, model, Schema, Types } from "mongoose";

interface ICourse extends Document {
  name: string;
  professor: Types.ObjectId;
  semester: Types.ObjectId;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  professor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
});

export const Course = model<ICourse>("Course", courseSchema);
