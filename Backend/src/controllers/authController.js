const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, phone, location, occupation } = req.body;

        console.log('Registration attempt:', email);

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            phone,
            location,
            occupation
        });

        await user.save();

        // Set session (this is the key - NO JWT!)
        req.session.userId = user._id;
        req.session.userEmail = user.email;

        console.log('✅ User registered successfully:', email);
        console.log('Session created:', req.session.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                phone: user.phone,
                location: user.location,
                occupation: user.occupation
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', email);

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Set session (NO JWT!)
        req.session.userId = user._id;
        req.session.userEmail = user.email;

        console.log('✅ User logged in successfully:', email);
        console.log('Session ID:', req.session.id);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                phone: user.phone,
                location: user.location,
                occupation: user.occupation
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get current user (using session)
// @route   GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
    try {
        // Check if user is logged in via session
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not logged in'
            });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                phone: user.phone,
                location: user.location,
                occupation: user.occupation,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: 'Not logged in'
            });
        }

        const updates = req.body;
        delete updates.password; // Don't allow password update here
        delete updates.email; // Don't allow email update

        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                phone: user.phone,
                location: user.location,
                occupation: user.occupation,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Logout (destroy session)
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        
        res.clearCookie('connect.sid');
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
};

// @desc    Check if logged in
// @route   GET /api/auth/check
exports.checkAuth = async (req, res) => {
    if (req.session.userId) {
        res.json({
            success: true,
            loggedIn: true
        });
    } else {
        res.json({
            success: true,
            loggedIn: false
        });
    }
};