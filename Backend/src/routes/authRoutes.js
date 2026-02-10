// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation
} = require('../middleware/validators');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/login/mobile-otp', authController.loginWithMobileOTP);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/logout', auth, authController.logout);
router.get('/verify', auth, authController.verifyToken);

module.exports = router;