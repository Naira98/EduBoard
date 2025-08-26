import { Document, Schema, Types, model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  semester: Types.ObjectId;
  createAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    semester: { type: Schema.Types.ObjectId, ref: "Semester", required: true },
  },
  { timestamps: true }
);

export const Announcement = model<IAnnouncement>(
  "Announcement",
  announcementSchema
);
