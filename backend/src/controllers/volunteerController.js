const VolunteerProfile = require('../models/VolunteerProfile');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { skills, availability, coords } = req.body;
    const data = {
      skills: skills || [],
      availability: availability || 'available'
    };
    if (coords) data.location = { type: 'Point', coordinates: coords };
    let profile = await VolunteerProfile.findOne({ user: req.user._id });
    if (profile) {
      profile = await VolunteerProfile.findOneAndUpdate({ user: req.user._id }, data, { new: true, upsert: true });
    } else {
      profile = await VolunteerProfile.create({ user: req.user._id, ...data });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  const profile = await VolunteerProfile.findOne({ user: req.user._id }).populate('user', 'name email');
  res.json(profile);
};
