import { Document, model, Schema, Types } from "mongoose";

interface ICourse extends Document {
  name: string;
  professors: Types.ObjectId[];
  semester: Types.ObjectId;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  professors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
});

export const Course = model<ICourse>("Course", courseSchema);
