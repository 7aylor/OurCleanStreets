import { Router } from 'express';
import { getBooks } from '../controllers/booksController';

const booksRouter = Router();

booksRouter.get('/get-books', getBooks);

export default booksRouter;
