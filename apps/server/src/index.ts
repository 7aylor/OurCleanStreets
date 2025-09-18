import { PrismaClient } from '@prisma/client';
import express from 'express';
const app = express();
const port = 5000;

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.OCS_DB } },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/get-route', (req, res) => {
  res.send('Pretend this is mapping route data');
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await prisma.books.findMany();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Add a book
app.post('/books', async (req, res) => {
  const { id, title, author } = req.body;
  try {
    const book = await prisma.books.create({
      data: { id, title, author },
    });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
