//Endpoint 2

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
  title: Joi.string().required(),
  author: Joi.string(),
  yearPublished: Joi.number().integer().min(1000).max(9999),
});

// POST /api/books
app.post('/api/books', async (req, res) => {
  // Validate request body
  const { error } = bookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Create a new book object
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      yearPublished: req.body.yearPublished,
    });

    // Save the new book to the database
    await newBook.save();

    // Return successful response
    res.status(201).json({ message: 'Book added successfully.' });
  } catch (error) {
    // Handle error
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Book with this title already exists.' });
    }
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the book.' });
  }
});

// Listen for connections on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});