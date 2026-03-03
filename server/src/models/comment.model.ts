import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  content: string;
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  createdAt: Date;
}

const commentSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;