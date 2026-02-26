import { Request, Response } from "express";
import BookServices from "../services/book.service";

export const allBooks = async (req: Request, res: Response) => {
    try {
        const books = await BookServices.getAllBook();
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const book = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        };
        const book = await BookServices.getBook(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addBook = async (req: Request, res: Response) => {
    try {
        const { title, image, caption, rating } = req.body;
        const fileData = req.file;
        const userId = req.user?.id as string;

        if (!title || !image || !rating || !data) {
            return res.status(400).json({
                success: false,
                message: "Title, image and rating are required"
            });
        }

        const newBook = await BookServices.addBook({
            title,
            caption,
            rating,
            userId,
            fileData
        });

        res.status(201).json({
            success: true,
            data: newBook
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateBookDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        };
        const userId = req.user?.id as string;
        const data = req.body;

        const updatedBook = await BookServices.editBookDetails(id, userId, data);

        res.status(200).json({
            success: true,
            data: updatedBook
        });
    } catch (error: any) {
        const status = error.message === "Unauthorized or Book not found" ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

export const removeBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as {
            id: string
        };
        const userId = req.user?.id as string;

        await BookServices.deleteBook(id, userId);

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error: any) {
        const status = error.message === "Unauthorized or Book not found" ? 403 : 500;
        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};