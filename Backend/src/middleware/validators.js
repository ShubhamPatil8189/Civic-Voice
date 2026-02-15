const { body } = require('express-validator');

// Registration validation rules
// Registration validation rules
exports.registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('dateOfBirth').isISO8601().withMessage('Invalid date format (ISO8601)'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120')
];

// Login validation rules (Email only for OTP)
exports.loginValidation = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail()
];

// Verify OTP validation
exports.verifyOTPValidation = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('otp').notEmpty().withMessage('OTP is required')
];

// Mobile OTP validation
exports.mobileOTPValidation = [
    body('phone').matches(/^\d{10}$/).withMessage('Invalid phone number (10 digits required)')
];

// Change password validation
exports.changePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];