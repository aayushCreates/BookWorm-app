import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { addBook, allBooks, book, removeBook, updateBookDetails } from "../controllers/book.controller";

const bookRouter = Router();

bookRouter.get('/', isUserLoggedIn, allBooks);
bookRouter.post('/', isUserLoggedIn, addBook);
bookRouter.get('/:id', isUserLoggedIn, book);
bookRouter.patch('/:id', isUserLoggedIn, updateBookDetails);
bookRouter.delete('/:id', isUserLoggedIn, removeBook);



export default bookRouter;