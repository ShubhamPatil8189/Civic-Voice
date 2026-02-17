const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Info
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Profile Fields - ALL OPTIONAL with proper defaults
    dateOfBirth: { type: Date, default: null },
    age: { type: Number, default: null },
    gender: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    numberOfChildren: { type: Number, default: 0 },
    childrenAges: { type: String, default: '' },
    
    // Location
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    location: { type: String, default: '' },
    ruralUrban: { type: String, default: '' },
    ownHouse: { type: String, default: '' },
    
    // Family Details
    parentsAlive: { type: String, default: '' },
    spouseAlive: { type: String, default: '' },
    numberOfDependents: { type: Number, default: 0 },
    
    // Education & Career
    educationLevel: { type: String, default: '' },
    currentlyStudying: { type: String, default: '' },
    occupation: { type: String, default: '' },
    annualIncome: { type: Number, default: 0 },
    
    // Life Goals
    planToBuyLand: { type: String, default: '' },
    landPurchaseTiming: { type: String, default: '' },
    planToStartBusiness: { type: String, default: '' },
    businessTiming: { type: String, default: '' },
    wantToStudyFurther: { type: String, default: '' },
    studyTiming: { type: String, default: '' },
    planMarriage: { type: String, default: '' },
    marriageTiming: { type: String, default: '' },
    
    // Disability Status
    hasDisability: { type: String, default: 'no' },
    disabilityType: { type: String, default: '' },
    
    // Contact
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: null },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);