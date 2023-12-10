//Endpoint 1
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const books = [
  { id: 1, title: "The Lord of the Rings", author: "J.R.R. Tolkien" },
  { id: 2, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen" },
];

app.get('/api/books', (req, res) => {
  res.json({ books });
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});

app.listen(3000, () => console.log('Server started on port 3000'));