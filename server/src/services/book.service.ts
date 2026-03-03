import Book from "../models/book.model";
import uploadToCloudinary from "../utils/cloudinary.utils";

export default class BookServices {
  static async getAllBook() {
    return await Book.find().populate("userId", "_id name avatar").exec();
  }

  static async getBook(id: string) {
    return await Book.findById(id)
      .populate("userId", "_id name avatar")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "_id name avatar",
        },
      })
      .exec();
  }

  static async addBook(data: {
    title: string;
    caption?: string;
    rating: number;
    userId: any;
    fileData: any;
  }) {
    const result = await uploadToCloudinary(data.fileData.buffer);
    const imageUrl = result.secure_url;

    return await Book.create({
      title: data.title as string,
      image: imageUrl as string,
      caption: data.caption as string,
      rating: data.rating,
      userId: data.userId,
    });
  }

  static async editBookDetails(
    id: string,
    userId: any,
    data: { title?: string; image?: string; caption?: string; rating?: number }
  ) {
    const book = await Book.findById(id);
    if (!book || book.userId.toString() !== userId) {
      throw new Error("Unauthorized or Book not found");
    }

    return await Book.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteBook(id: string, userId: string) {
    const book = await Book.findById(id);
    if (!book || book.userId.toString() !== userId) {
      throw new Error("Unauthorized or Book not found");
    }

    return await Book.findByIdAndDelete(id);
  }
}
