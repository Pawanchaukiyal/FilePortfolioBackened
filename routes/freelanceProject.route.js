const express = require('express');
const router = express.Router();
const upload = require("../middlewares/freelance.middleware");
const freelanceController = require('../controllers/freelanceProject.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// POST: Create project (with file upload via Cloudinary) — protected
router.post('/create', authMiddleware, upload.single('file'), freelanceController.createProject);

// GET: Get all projects — public
router.get('/all', freelanceController.getAllProjects);

// GET: Get a specific project by ID — public
router.get('/:id', freelanceController.getProjectById);

// DELETE: Delete a project by ID — protected
router.delete('/:id', authMiddleware, freelanceController.deleteProject);

module.exports = router;
