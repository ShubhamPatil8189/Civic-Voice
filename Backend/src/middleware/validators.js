const { body } = require('express-validator');

// Registration validation rules
exports.registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required').trim(),
    body('lastName').notEmpty().withMessage('Last name is required').trim(),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('dateOfBirth').isISO8601().withMessage('Invalid date format'),
    body('nationality').notEmpty().withMessage('Nationality is required').trim(),
    body('state').notEmpty().withMessage('State is required').trim(),
    body('city').notEmpty().withMessage('City is required').trim(),
    body('pincode').matches(/^\d{6}$/).withMessage('Invalid pincode (6 digits required)'),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('phone').optional().matches(/^\d{10}$/).withMessage('Invalid phone number (10 digits required)'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login validation rules
exports.loginValidation = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
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