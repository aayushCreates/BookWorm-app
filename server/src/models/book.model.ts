import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  image: string;
  caption?: string;
  rating: number;
  userId: Types.ObjectId;
  likedBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: [0, "Minimum rating is 0"],
      max: [5, "Rating at most value is 5"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
