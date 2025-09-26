import { getPrismaClient } from '../utils/prisma';
import { Request, Response } from 'express';

// Get all books
export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await getPrismaClient().books.findMany();
    console.log('hit getBooks');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
