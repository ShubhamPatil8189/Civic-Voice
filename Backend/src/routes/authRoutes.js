const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with ALL form data
        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        await user.save();

        // Return COMPLETE user data
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            age: user.age || '',
            gender: user.gender || '',
            maritalStatus: user.maritalStatus || '',
            numberOfChildren: user.numberOfChildren || 0,
            childrenAges: user.childrenAges || '',
            dateOfBirth: user.dateOfBirth || '',
            parentsAlive: user.parentsAlive || '',
            spouseAlive: user.spouseAlive || '',
            numberOfDependents: user.numberOfDependents || 0,
            educationLevel: user.educationLevel || '',
            currentlyStudying: user.currentlyStudying || '',
            occupation: user.occupation || '',
            annualIncome: user.annualIncome || 0,
            planToBuyLand: user.planToBuyLand || '',
            landPurchaseTiming: user.landPurchaseTiming || '',
            planToStartBusiness: user.planToStartBusiness || '',
            businessTiming: user.businessTiming || '',
            wantToStudyFurther: user.wantToStudyFurther || '',
            studyTiming: user.studyTiming || '',
            planMarriage: user.planMarriage || '',
            marriageTiming: user.marriageTiming || '',
            hasDisability: user.hasDisability || '',
            disabilityType: user.disabilityType || '',
            state: user.state || '',
            district: user.district || '',
            ruralUrban: user.ruralUrban || '',
            ownHouse: user.ownHouse || '',
            location: user.location || '',
            bio: user.bio || '',
            profilePicture: user.profilePicture || null,
            updatedAt: user.updatedAt
        };

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

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

        // Return COMPLETE user data
        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            age: user.age || '',
            gender: user.gender || '',
            maritalStatus: user.maritalStatus || '',
            numberOfChildren: user.numberOfChildren || 0,
            childrenAges: user.childrenAges || '',
            dateOfBirth: user.dateOfBirth || '',
            parentsAlive: user.parentsAlive || '',
            spouseAlive: user.spouseAlive || '',
            numberOfDependents: user.numberOfDependents || 0,
            educationLevel: user.educationLevel || '',
            currentlyStudying: user.currentlyStudying || '',
            occupation: user.occupation || '',
            annualIncome: user.annualIncome || 0,
            planToBuyLand: user.planToBuyLand || '',
            landPurchaseTiming: user.landPurchaseTiming || '',
            planToStartBusiness: user.planToStartBusiness || '',
            businessTiming: user.businessTiming || '',
            wantToStudyFurther: user.wantToStudyFurther || '',
            studyTiming: user.studyTiming || '',
            planMarriage: user.planMarriage || '',
            marriageTiming: user.marriageTiming || '',
            hasDisability: user.hasDisability || '',
            disabilityType: user.disabilityType || '',
            state: user.state || '',
            district: user.district || '',
            ruralUrban: user.ruralUrban || '',
            ownHouse: user.ownHouse || '',
            location: user.location || '',
            bio: user.bio || '',
            profilePicture: user.profilePicture || null,
            updatedAt: user.updatedAt
        };

        res.json({
            success: true,
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Server error' 
        });
    }
});

module.exports = router;