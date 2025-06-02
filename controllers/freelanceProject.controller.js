const FreelanceProject = require('../models/freelanceProject.model');

// 🎯 Create a freelance project
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, budget, email } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    const project = new FreelanceProject({
      title,
      description,
      category,
      budget,
      email,
      fileUrl,
      createdBy: req.user ? req.user.id : null
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ error: 'Error creating project', details: err.message });
  }
};

// 🎯 Get all projects (optional category filter)
exports.getAllProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};

    const projects = await FreelanceProject.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('takenBy', 'name email');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// 🎯 Get one project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('takenBy', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

// 🎯 Delete a project (admin/owner)
exports.deleteProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

// 🎯 Take (Accept) a project
exports.takeProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.status !== 'Open')
      return res.status(400).json({ message: 'Project is already taken or completed' });

    project.status = 'In Progress';
    project.takenBy = req.user.id;
    await project.save();

    res.json({ message: 'Project taken successfully', project });
  } catch (err) {
    res.status(500).json({ error: 'Error taking project' });
  }
};

// 🎯 Mark project as completed
exports.completeProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.takenBy?.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to complete this project' });

    project.status = 'Done';
    await project.save();

    res.json({ message: 'Project marked as completed' });
  } catch (err) {
    res.status(500).json({ error: 'Error completing project' });
  }
};

// 🎯 View all projects taken by freelancer
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await FreelanceProject.find({ takenBy: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your projects' });
  }
};
