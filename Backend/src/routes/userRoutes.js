const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile by email
router.get('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log('Fetching profile for email:', email);
        
        const user = await User.findOne({ email }).select('-password');
        
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
        console.error('Error fetching user:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Update user profile by email
router.put('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const updates = req.body;
        
        console.log('Updating profile for email:', email);
        console.log('Update data:', updates);
        
        // Remove fields that shouldn't be updated
        delete updates.password;
        delete updates._id;
        delete updates.id;
        delete updates.__v;
        delete updates.createdAt;
        delete updates.email;
        
        // Calculate age from dateOfBirth if provided
        if (updates.dateOfBirth) {
            const dob = new Date(updates.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            updates.age = age;
        }
        
        // Ensure proper data types
        if (updates.annualIncome !== undefined) updates.annualIncome = Number(updates.annualIncome) || 0;
        if (updates.numberOfChildren !== undefined) updates.numberOfChildren = Number(updates.numberOfChildren) || 0;
        if (updates.numberOfDependents !== undefined) updates.numberOfDependents = Number(updates.numberOfDependents) || 0;
        
        // Convert empty strings to empty strings (not null)
        Object.keys(updates).forEach(key => {
            if (updates[key] === null || updates[key] === undefined) {
                updates[key] = '';
            }
        });
        
        // Find user by email and update
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        console.log('User updated successfully:', user.email);
        
        res.json({ 
            success: true,
            message: 'Profile updated successfully', 
            user 
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

module.exports = router;