// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Property = require('../models/Property');

// Get properties only for the logged-in user
router.get('/my-properties', verifyToken, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
