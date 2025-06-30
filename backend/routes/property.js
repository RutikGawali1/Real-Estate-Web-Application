const router = require('express').Router();
const Property = require('../models/Property');
const verifyToken = require('../middleware/auth');

// Add property
router.post('/', verifyToken, async (req, res) => {
  try {
    const newProperty = new Property({ ...req.body, owner: req.user.id });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


// Get properties of logged-in user

/* router.get('/my', verifyToken, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); */


// Get all or filtered properties
router.get('/', async (req, res) => {
  try {
    const { title, location } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete property (owner only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    // Check if the property exists
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the property has an owner and matches the logged-in user
    if (!property.owner || property.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
