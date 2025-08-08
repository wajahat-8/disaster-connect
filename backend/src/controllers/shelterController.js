const Shelter = require('../models/Shelter');

exports.createShelter = async (req, res) => {
  try {
    const { name, address, capacity, facilities, coords } = req.body;
    if (!name || !coords) return res.status(400).json({ message: 'name and coords required' });
    const shelter = await Shelter.create({
      name,
      address,
      capacity,
      facilities: facilities || [],
      location: { type: 'Point', coordinates: coords },
      verifiedBy: req.user.role === 'admin' ? req.user._id : undefined,
      isVerified: req.user.role === 'admin' ? true : false
    });
    res.status(201).json(shelter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listShelters = async (req, res) => {
  try {
    const filters = {};
    if (req.query.isVerified) filters.isVerified = req.query.isVerified === 'true';
    const shelters = await Shelter.find(filters);
    res.json(shelters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.findNearest = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 20000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ message: 'lng and lat required' });
    const shelters = await Shelter.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance, 10)
        }
      }
    }).limit(20);
    res.json(shelters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!shelter) return res.status(404).json({ message: 'Not found' });
    res.json(shelter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
