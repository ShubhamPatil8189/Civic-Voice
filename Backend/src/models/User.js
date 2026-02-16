const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Info
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    occupation: { type: String, default: '' },
    bio: { type: String, default: '' },

    // Eligibility / Scheme-related fields
    bplCardHolder: { type: Boolean, default: false },
    carOwner: { type: Boolean, default: false },
    disability: { type: Boolean, default: false },
    student: { type: Boolean, default: false },
    veteran: { type: Boolean, default: false },
    householdType: { type: String, enum: ["Rural", "Urban"], default: "Urban" },
    income: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);