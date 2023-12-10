//Endpoint 3

const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/library', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Book model schema
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String },
  yearPublished: { type: Number },
});

const Book = mongoose.model('Book', BookSchema);

// Create Express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define validation schema for request body
const bookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  yearPublished: Joi.number().integer().min(1000).max(9999),
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;

  // Validate request body
  const { error } = bookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Find the book by ID
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }

    // Update book details
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.yearPublished = req.body.yearPublished || book.yearPublished;

    // Save the updated book to the database
    await book.save();

    // Return successful response
    res.status(200).json({ message: 'Book updated successfully.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Book with this title already exists.' });
    }
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the book.' });
  }
});

// Listen for connections on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});