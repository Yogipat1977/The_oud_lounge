// controllers/authController.js
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
// bcrypt is used implicitly by user.matchPassword(), so explicit require here is optional for login.

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const { name, email, password, phoneNumber, address, role } = req.body; // Added phoneNumber, address

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password,
      phoneNumber, // Save phone number
      address,     // Save address object { street, city, state, postalCode, country }
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    // Provide more specific error messages if possible, e.g., validation errors
    let message = 'Server error during registration';
    if (error.name === 'ValidationError') {
        message = Object.values(error.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, message });
    }
    res.status(500).json({ success: false, message, error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // req.user comes from protect middleware

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: { // Renamed to 'data' for consistency, but 'user' is also fine
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user details (profile update)
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields that are provided in the request body
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) { // Handle email change carefully, may require re-verification
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            user.email = req.body.email;
        }
        if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
        if (req.body.address) { // Expecting address as an object
            user.address = { ...user.address, ...req.body.address };
        }
        // Password update should be a separate endpoint for better security practices

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                address: updatedUser.address,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error('Update User Details Error:', error);
        let message = 'Server error during profile update';
        if (error.name === 'ValidationError') {
            message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, message });
        }
        res.status(500).json({ success: false, message, error: error.message });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        // Set new password and save (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        // Generate a new token as good practice, though not strictly necessary for password change only
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token, // Optionally send new token
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update Password Error:', error);
        let message = 'Server error during password update';
        if (error.name === 'ValidationError') { // e.g. if new password is too short
            message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ success: false, message });
        }
        res.status(500).json({ success: false, message, error: error.message });
    }
};