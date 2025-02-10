const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 3005;

// Middleware to parse JSON data
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Check database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User added successfully!', userId: result.insertId });
  });
});

// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(sql, [name, email, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User updated successfully!' });
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'User deleted successfully!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
