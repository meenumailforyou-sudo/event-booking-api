const express = require('express');
const router = express.Router();

let events = [];
let nextId = 1;

router.get('/', (req, res) => res.json(events));

router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

router.post('/', (req, res) => {
  const { title, location, date, totalSeats, price } = req.body;
  if (!title || !date || !totalSeats) {
    return res.status(400).json({ message: 'title, date and totalSeats are required' });
  }
  const event = { id: nextId++, title, location, date, totalSeats, availableSeats: totalSeats, price };
  events.push(event);
  res.status(201).json(event);
});

router.put('/:id', (req, res) => {
  const event = events.find(e => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  Object.assign(event, req.body);
  res.json(event);
});

router.delete('/:id', (req, res) => {
  const index = events.findIndex(e => e.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Event not found' });
  events.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
