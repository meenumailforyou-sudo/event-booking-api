const express = require('express');
const pool = require('../db');
const router = express.Router();

// Column names are renamed so the frontend keeps working unchanged
const COLUMNS = `id, title, location,
  to_char(date, 'YYYY-MM-DD') AS date,
  total_seats AS "totalSeats",
  available_seats AS "availableSeats",
  price::float AS price`;

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM events ORDER BY date, id`);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM events WHERE id = $1`, [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const { title, location, date, totalSeats, price } = req.body;
  if (!title || !date || !totalSeats) {
    return res.status(400).json({ message: 'title, date and totalSeats are required' });
  }
  const { rows } = await pool.query(
    `INSERT INTO events (title, location, date, total_seats, available_seats, price)
     VALUES ($1, $2, $3, $4, $4, $5) RETURNING ${COLUMNS}`,
    [title, location || null, date, totalSeats, price || 0]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { title, location, date, price } = req.body;
  const { rows } = await pool.query(
    `UPDATE events SET
       title = COALESCE($1, title),
       location = COALESCE($2, location),
       date = COALESCE($3, date),
       price = COALESCE($4, price)
     WHERE id = $5 RETURNING ${COLUMNS}`,
    [title ?? null, location ?? null, date ?? null, price ?? null, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM events WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ message: 'Event not found' });
  res.status(204).send();
});

module.exports = router;
