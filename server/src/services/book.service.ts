import { PrismaClient } from "@prisma/client";
import uploadToCloudinary from "../utils/cloudinary.utils";

const prisma = new PrismaClient();

export default class BookServices {
    static async getAllBook() {
        return await prisma.book.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                _count: {
                    select: {
                        likedBy: true,
                        comments: true
                    }
                }
            }
        });
    }

    static async getBook(id: string) {
        return await prisma.book.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likedBy: true
                    }
                }
            }
        });
    }

    static async addBook(data: { title: string, caption?: string, rating: number, userId: string, fileData: any }) {
        const result = await uploadToCloudinary(data.fileData.buffer);
        const imageUrl = result.secure_url;

        return await prisma.book.create({
            data: {
                title: data.title,
                image: imageUrl,
                caption: data.caption,
                rating: data.rating,
                userId: data.userId
            }
        });
    }

    static async editBookDetails(id: string, userId: string, data: { title?: string, image?: string, caption?: string, rating?: number }) {
        // Check if the book belongs to the user
        const book = await prisma.book.findUnique({ where: { id } });
        if (!book || book.userId !== userId) {
            throw new Error("Unauthorized or Book not found");
        }

        return await prisma.book.update({
            where: { id },
            data
        });
    }

    static async deleteBook(id: string, userId: string) {
        // Check if the book belongs to the user
        const book = await prisma.book.findUnique({ where: { id } });
        if (!book || book.userId !== userId) {
            throw new Error("Unauthorized or Book not found");
        }

        return await prisma.book.delete({
            where: { id }
        });
    }
}