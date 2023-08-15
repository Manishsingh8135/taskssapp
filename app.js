// app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Task = require('./models');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notes-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Middleware
app.use(express.json());

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.put('/api/tasks/:id/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
