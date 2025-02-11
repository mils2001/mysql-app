const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
 // Load environment variables from .env file

const app = express();
const PORT = 3010;

// Middleware to parse JSON data
app.use(express.json());

// MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'NewPassword',
  database: process.env.DB_NAME || 'moondb',
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CRUD API Endpoints for 'users' table

// Create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(sql, [name, email], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error creating user');
    }
    res.status(201).send({ message: 'User created', userId: results.insertId });
  });
});

// Get all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    res.status(200).json(results);
  });
});

// Get a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Error fetching user');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(results[0]);
  });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(sql, [name, email, id], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Error updating user');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully');
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
