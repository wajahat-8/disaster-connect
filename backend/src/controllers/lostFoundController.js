const LostFound = require('../models/LostFound');

exports.createEntry = async (req, res) => {
  try {
    const { type, title, description, image, coords } = req.body;
    if (!type || !coords) return res.status(400).json({ message: 'type and coords required' });
    const entry = await LostFound.create({
      type,
      title,
      description,
      image,
      location: { type: 'Point', coordinates: coords },
      reporter: req.user._id
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listEntries = async (req, res) => {
  const { type } = req.query;
  const filters = {};
  if (type) filters.type = type;
  const entries = await LostFound.find(filters).populate('reporter', 'name email');
  res.json(entries);
};

exports.matchEntries = async (req, res) => {
  // simple naive match: find opposite-type entries near same location and similar title
  try {
    const { id } = req.params;
    const base = await LostFound.findById(id);
    if (!base) return res.status(404).json({ message: 'Not found' });

    const matches = await LostFound.find({
      _id: { $ne: base._id },
      type: base.type === 'lost' ? 'found' : 'lost',
      status: 'open',
      location: {
        $near: {
          $geometry: base.location,
          $maxDistance: 2000
        }
      }
    }).limit(10);

    // naive string match on title
    const filtered = matches.filter(m => {
      if (!base.title || !m.title) return true;
      return m.title.toLowerCase().includes(base.title.toLowerCase()) || base.title.toLowerCase().includes(m.title.toLowerCase());
    });

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
