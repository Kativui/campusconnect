require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.query('SELECT 1')
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.error('MySQL connection failed:', err.message));
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please log in.' });
  }
}
function requireLecturer(req, res, next) {
  if (req.user.role !== 'lecturer') {
    return res.status(403).json({ error: 'Only lecturers can book rooms.' });
  }
  next();
}



app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !email.toLowerCase().endsWith('@pwani.co.ke')) {
    return res.status(400).json({ error: 'Use your @pwani.co.ke email.' });
  }
  if (!name || !password || password.length < 8) {
    return res.status(400).json({ error: 'Enter your name and a password of at least 8 characters.' });
  }
  const allowedRoles = ['student', 'class_rep', 'lecturer'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email.toLowerCase(), passwordHash, role]
    );
    res.status(201).json({ message: 'Account created.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That email is already registered.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Enter your email and password.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id, name, password_hash, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    const user = rows[0];
    const ok = user && await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: 'Wrong email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/bookings', requireAuth, requireLecturer, async (req, res) => {
  const { room, day, slot, week, reason } = req.body;
    if (!room || !day || !slot || !week || !reason) {
    return res.status(400).json({ error: 'Fill in room, day, slot, week and reason.' });
  }
    try {
    await db.query(
      'INSERT INTO bookings (room, day, slot, week, reason, booked_by) VALUES (?, ?, ?, ?, ?, ?)',
      [room, day, slot, week, reason, req.user.id]
    );
    res.status(201).json({ message: 'Room booked.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That room is already booked for this slot.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});


app.get('/api/bookings', async (req, res) => {
    const { day, week } = req.query;
  if (!day || !week) {
    return res.status(400).json({ error: 'Choose a day and week.' });
  }
    try {
    const [rows] = await db.query(
      'SELECT id, room, slot, booked_by FROM bookings WHERE day = ? AND week = ?',
      [day, week]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }

});
app.delete('/api/bookings/:id', requireAuth, requireLecturer, async (req, res) => {
  const id = req.params.id;
    try {
    const [result] = await db.query(
      'DELETE FROM bookings WHERE id = ? AND booked_by = ?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found, or it is not yours.' });
    }
    res.json({ message: 'Booking cancelled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CampusConnect running on port ${PORT}`);
});