const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const ToDo = require('../models/ToDo');
const router = express.Router();

// Get All Todos for Logged-in User
router.get('/', auth, async (req, res) => {
  try {
    const todos = await ToDo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a Todo
router.post('/', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text } = req.body;

  try {
    const newToDo = new ToDo({
      text,
      userId: req.user.id
    });

    const todo = await newToDo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a Todo
router.put('/:id', auth, async (req, res) => {
  const { text, completed } = req.body;

  try {
    let todo = await ToDo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    if (todo.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    todo.text = text || todo.text;
    todo.completed = completed !== undefined ? completed : todo.completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a Todo
router.delete('/:id', auth, async (req, res) => {
  try {
    let todo = await ToDo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    if (todo.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await todo.remove();
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
