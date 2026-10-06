require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.query('SELECT 1')
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.error('MySQL connection failed:', err.message));
  const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CampusConnect running on port ${PORT}`);
});