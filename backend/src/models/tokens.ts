import { Document, model, Schema, Types } from "mongoose";

interface IToken extends Document {
  _id: string;
  token: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Token = model<IToken>("Token", tokenSchema);
