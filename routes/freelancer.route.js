const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const freelancerController = require('../controllers/freelancer.controller');

// Create or update freelancer profile
router.post('/profile', authMiddleware, freelancerController.createOrUpdateProfile);

// Get freelancer profile by user ID
router.get('/profile/:userId', freelancerController.getProfileByUserId);
router.get('/all', freelancerController.getAllFreelancers);
router.get('/search', freelancerController.searchFreelancers);

module.exports = router;
