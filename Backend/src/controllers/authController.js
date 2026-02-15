const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
    );
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register/Signup User with minimal details
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
            email,
            dateOfBirth,
            age
        } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);

        if (process.env.NODE_ENV === 'development') {
            console.log('DEV OTP:', otp);
        }

        if (!user) {
            // Create new user
            user = new User({
                firstName,
                email,
                dateOfBirth,
                age,
                emailOtp: hashedOTP,
                emailOtpExpires: otpExpires
            });
        } else {
            // Update existing unverified user
            user.firstName = firstName;
            user.dateOfBirth = dateOfBirth;
            user.age = age;
            user.emailOtp = hashedOTP;
            user.emailOtpExpires = otpExpires;
        }

        await user.save();

        // Send OTP via email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Login/Registration OTP',
                message: `Your OTP is ${otp}. It is valid for 10 minutes.`
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Optionally revert user creation or just inform user
            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to email. Please verify to complete registration.',
            email: user.email
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

// Verify Email OTP
exports.verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and OTP'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email'
            });
        }

        if (!user.emailOtp || !user.emailOtpExpires) {
            return res.status(400).json({
                success: false,
                message: 'No OTP requested'
            });
        }

        if (user.emailOtpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new one.'
            });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, user.emailOtp);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Clear OTP fields and verify user
        user.emailOtp = undefined;
        user.emailOtpExpires = undefined;
        user.isVerified = true;
        await user.save();

        // Generate token
        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during verification',
            error: error.message
        });
    }
};

// Login User (Initiate OTP)
exports.login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register.'
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

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        user.emailOtp = await bcrypt.hash(otp, salt);
        user.emailOtpExpires = otpExpires;

        await user.save();

        // Send OTP
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Login OTP',
                message: `Your login OTP is ${otp}. It is valid for 10 minutes.`
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'OTP sent to your email',
            email: user.email
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

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -emailOtp -emailOtpExpires');

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

        // Don't allow updating email, password, role, or otp fields via this endpoint
        delete updates.email;
        delete updates.password;
        delete updates.role;
        delete updates.emailOtp;
        delete updates.emailOtpExpires;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password -emailOtp -emailOtpExpires');

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

// Change password (optional, IF we keep password as secondary auth)
exports.changePassword = async (req, res) => {
    // ... Implementation or Remove if password is fully deprecated
    // Keeping minimal or throwing not implemented for now to save space if not asked
    res.status(501).json({ message: 'Not implemented' });
};

// Logout
exports.logout = async (req, res) => {
    try {
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

// Verify token
exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -emailOtp -emailOtpExpires');

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