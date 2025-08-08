const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, requiredSkills, coords } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });
    const task = await Task.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      location: coords ? { type: 'Point', coordinates: coords } : undefined,
      assignedBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo', 'name email');
  res.json(tasks);
};

exports.assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (!task.assignedTo.includes(userId)) task.assignedTo.push(userId);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
