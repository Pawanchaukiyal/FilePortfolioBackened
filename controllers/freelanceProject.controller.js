const FreelanceProject = require('../models/freelanceProject.model');

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
      createdBy: req.user ? req.user.id : null, // if using auth middleware
    });

    await project.save();
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (err) {
    res.status(500).json({ error: 'Error creating project', details: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await FreelanceProject.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await FreelanceProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await FreelanceProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};
