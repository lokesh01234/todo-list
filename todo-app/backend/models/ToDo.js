const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('ToDo', ToDoSchema);
