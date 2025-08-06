const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ Username not found:', username);
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', username);
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Check JWT_SECRET
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server misconfigured' });
    }

    // Sign token
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1d' });
    console.log('✅ Login successful for:', username);

    res.json({ token });
  } catch (err) {
    console.error('💥 Unexpected login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
