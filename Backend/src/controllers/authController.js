const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      age, 
      phone, 
      location, 
      occupation,
      // Eligibility fields
      bplCardHolder,
      carOwner,
      disability,
      student,
      veteran,
      householdType,
      income 
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with all fields
    const user = await User.create({
      firstName,
      lastName: lastName || "",
      email,
      password: hashedPassword,
      age: age || null,
      phone: phone || "",
      location: location || "",
      occupation: occupation || "",
      bio: "",
      // Eligibility fields with defaults
      bplCardHolder: bplCardHolder || false,
      carOwner: carOwner || false,
      disability: disability || false,
      student: student || false,
      veteran: veteran || false,
      householdType: householdType || "Urban",
      income: income || 0,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        location: user.location,
        occupation: user.occupation,
        bio: user.bio,
        bplCardHolder: user.bplCardHolder,
        carOwner: user.carOwner,
        disability: user.disability,
        student: user.student,
        veteran: user.veteran,
        householdType: user.householdType,
        income: user.income,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        location: user.location,
        occupation: user.occupation,
        bio: user.bio,
        bplCardHolder: user.bplCardHolder,
        carOwner: user.carOwner,
        disability: user.disability,
        student: user.student,
        veteran: user.veteran,
        householdType: user.householdType,
        income: user.income,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET CURRENT USER ================= */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        location: user.location,
        occupation: user.occupation,
        bio: user.bio,
        bplCardHolder: user.bplCardHolder,
        carOwner: user.carOwner,
        disability: user.disability,
        student: user.student,
        veteran: user.veteran,
        householdType: user.householdType,
        income: user.income,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update basic fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName !== undefined ? req.body.lastName : user.lastName;
    user.age = req.body.age !== undefined ? req.body.age : user.age;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.occupation = req.body.occupation !== undefined ? req.body.occupation : user.occupation;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    
    // Update eligibility fields - handle boolean values properly
    if (req.body.bplCardHolder !== undefined) user.bplCardHolder = req.body.bplCardHolder;
    if (req.body.carOwner !== undefined) user.carOwner = req.body.carOwner;
    if (req.body.disability !== undefined) user.disability = req.body.disability;
    if (req.body.student !== undefined) user.student = req.body.student;
    if (req.body.veteran !== undefined) user.veteran = req.body.veteran;
    
    // Update other fields
    if (req.body.householdType !== undefined) user.householdType = req.body.householdType;
    if (req.body.income !== undefined) user.income = req.body.income;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        age: updatedUser.age,
        phone: updatedUser.phone,
        location: updatedUser.location,
        occupation: updatedUser.occupation,
        bio: updatedUser.bio,
        bplCardHolder: updatedUser.bplCardHolder,
        carOwner: updatedUser.carOwner,
        disability: updatedUser.disability,
        student: updatedUser.student,
        veteran: updatedUser.veteran,
        householdType: updatedUser.householdType,
        income: updatedUser.income,
        createdAt: updatedUser.createdAt
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= CHANGE PASSWORD ================= */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if new password is provided
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 6 characters long" 
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LOGOUT ================= */
exports.logout = (req, res) => {
  // Since JWT is stateless, we just send success message
  // Client will remove token from localStorage
  res.json({ 
    success: true, 
    message: "Logged out successfully" 
  });
};

/* ================= DELETE ACCOUNT ================= */
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};