const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireLogin } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authController.checkAuth);

// Protected routes (require login)
router.get('/me', requireLogin, authController.getCurrentUser);
router.put('/profile', requireLogin, authController.updateProfile);
router.post('/logout', requireLogin, authController.logout);

module.exports = router;