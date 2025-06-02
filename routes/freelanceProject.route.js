const express = require('express');
const router = express.Router();
const upload = require('../middlewares/freelance.middleware');
const auth = require('../middlewares/auth.middleware');
const controller = require('../controllers/freelanceProject.controller');

// Create project
router.post('/create', auth, upload.single('file'), controller.createProject);

// All projects
router.get('/all', controller.getAllProjects);

// One project
router.get('/:id', controller.getProjectById);

// Delete project
router.delete('/:id', auth, controller.deleteProject);

// Freelancer takes a project
router.patch('/:id/take', auth, controller.takeProject);

// Freelancer completes a project
router.patch('/:id/complete', auth, controller.completeProject);

// My taken projects
router.get('/my/projects', auth, controller.getMyProjects);

module.exports = router;
