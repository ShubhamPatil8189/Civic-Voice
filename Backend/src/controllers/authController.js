const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config();

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
    );
};

// Register/Signup User
exports.register = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const {
            firstName,
            middleName,
            lastName,
            gender,
            age,
            dateOfBirth,
            nationality,
            state,
            city,
            pincode,
            email,
            phone,
            password
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Create new user
        const user = new User({
            firstName,
            middleName,
            lastName,
            gender,
            age,
            dateOfBirth,
            nationality,
            state,
            city,
            pincode,
            email,
            phone,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(423).json({
                success: false,
                message: 'Account is locked. Try again later.'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Generate token
        const token = generateToken(user._id, user.role);

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// Login with Mobile OTP (simplified version)
exports.loginWithMobileOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        // In real app, you would verify OTP here
        // For now, we'll just find/create user

        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                phone,
                firstName: 'User',
                lastName: 'Mobile',
                gender: 'Other',
                age: 25,
                dateOfBirth: new Date('1998-01-01'),
                nationality: 'Indian',
                state: 'Maharashtra',
                city: 'Pune',
                pincode: '411001',
                email: `${phone}@mobile.user`,
                password: Math.random().toString(36).slice(-8) // Random password
            });
            await user.save();
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            message: 'Mobile OTP login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Mobile OTP login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during mobile OTP login',
            error: error.message
        });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const userId = req.user.userId;

        // Don't allow updating email, password, or role via this endpoint
        delete updates.email;
        delete updates.password;
        delete updates.role;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Logout (client-side only, but we can invalidate token if needed)
exports.logout = async (req, res) => {
    try {
        // In a real app, you might want to:
        // 1. Add token to blacklist
        // 2. Update user's last logout time
        // For now, we'll just respond successfully
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Verify token (for checking if user is logged in)
exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user,
            isValid: true
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token invalid or expired',
            isValid: false
        });
    }
};