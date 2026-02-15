const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // Personal Information
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    
    // Demographic Information
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [120, 'Age must be less than 120']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    nationality: {
        type: String,
        trim: true,
        default: 'Indian'
    },
    
    // Location Information
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    
    // Contact Information
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        sparse: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    
    // Authentication
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters']
    },
    emailOtp: {
        type: String
    },
    emailOtpExpires: {
        type: Date
    },
    
    // Account Information
    role: {
        type: String,
        enum: ['citizen', 'admin', 'officer'],
        default: 'citizen'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // Login History
    lastLogin: {
        type: Date
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    // If password is not set (e.g. OTP login only), skip hashing
    if (!this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update updatedAt timestamp
UserSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
UserSchema.methods.isLocked = function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
UserSchema.methods.incLoginAttempts = async function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    
    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock the account if we've reached max attempts
    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { lockUntil: Date.now() + 60 * 60 * 1000 }; // 1 hour
    }
    
    return await this.updateOne(updates);
};

// Reset login attempts on successful login
UserSchema.methods.resetLoginAttempts = async function() {
    return await this.updateOne({
        $set: { loginAttempts: 0, lastLogin: Date.now() },
        $unset: { lockUntil: 1 }
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;