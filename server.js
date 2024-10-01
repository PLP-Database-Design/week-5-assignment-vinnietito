const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.render('patients', { patients: results }); // Render patients.ejs with patient data
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.render('providers', { providers: results }); // Render providers.ejs with provider data
  });
});

// 3. Filter patients by First Name
app.get('/patients/filter', (req, res) => {
  const firstName = req.query.firstName; // Get first name from query parameter
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.render('patients', { patients: results }); // Render patients.ejs with filtered patient data
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
  const specialty = req.query.specialty; // Get specialty from query parameter
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.render('providers', { providers: results }); // Render providers.ejs with filtered provider data
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
