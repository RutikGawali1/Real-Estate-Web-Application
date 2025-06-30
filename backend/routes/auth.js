const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// If using bcrypt
const bcrypt = require('bcrypt');

// OR if using bcryptjs instead
// const bcrypt = require('bcryptjs');


// Register
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Login
// routes/auth.js
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Check if it's an email or username
    const isEmail = identifier.includes('@');
    const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
