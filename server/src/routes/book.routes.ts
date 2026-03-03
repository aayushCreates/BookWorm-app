import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { addBook, allBooks, bookDetail, removeBook, updateBookDetails } from "../controllers/book.controller";
import upload from "../middlewares/upload.middleware";

const bookRouter = Router();

bookRouter.get('/', isUserLoggedIn, allBooks);
bookRouter.post('/', isUserLoggedIn, upload.single("image"), addBook);
bookRouter.get('/:id', isUserLoggedIn, bookDetail);
bookRouter.patch('/:id', isUserLoggedIn, updateBookDetails);
bookRouter.delete('/:id', isUserLoggedIn, removeBook);



export default bookRouter;