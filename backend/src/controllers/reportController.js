const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { title, description, type, severity, coords, images } = req.body;
    if (!type || !coords) return res.status(400).json({ message: 'type and coords required' });
    const report = await Report.create({
      title,
      description,
      type,
      severity,
      images: images || [],
      location: { type: 'Point', coordinates: coords },
      reporter: req.user._id
    });
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listReports = async (req, res) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.severity) filters.severity = req.query.severity;
    if (req.query.status) filters.status = req.query.status;
    const reports = await Report.find(filters).populate('reporter', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('reporter', 'name email');
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    report.status = req.body.status || 'verified';
    report.verifiedBy = req.user._id;
    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// optional: geo query for reports near a point
exports.reportsNear = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 20000 } = req.query;
    if (!lng || !lat) return res.status(400).json({ message: 'lng and lat required' });
    const reports = await Report.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance, 10)
        }
      }
    }).limit(100);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
