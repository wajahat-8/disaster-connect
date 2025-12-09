const Shelter = require('../models/Shelter');

// @desc    Get all shelters
// @route   GET /api/shelters
// @access  Public
exports.getShelters = async (req, res) => {
    try {
        const shelters = await Shelter.find();

        res.status(200).json({
            success: true,
            count: shelters.length,
            data: shelters
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single shelter
// @route   GET /api/shelters/:id
// @access  Public
exports.getShelter = async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({ success: false, message: 'Shelter not found' });
        }

        res.status(200).json({ success: true, data: shelter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new shelter
// @route   POST /api/shelters
// @access  Private (Admin)
exports.createShelter = async (req, res) => {
    try {
        // Add user verification here if needed, or rely on route middleware
        const shelter = await Shelter.create(req.body);

        res.status(201).json({
            success: true,
            data: shelter
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Shelter already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update shelter
// @route   PUT /api/shelters/:id
// @access  Private (Admin)
exports.updateShelter = async (req, res) => {
    try {
        let shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({ success: false, message: 'Shelter not found' });
        }

        shelter = await Shelter.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: shelter });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete shelter
// @route   DELETE /api/shelters/:id
// @access  Private (Admin)
exports.deleteShelter = async (req, res) => {
    try {
        const shelter = await Shelter.findById(req.params.id);

        if (!shelter) {
            return res.status(404).json({ success: false, message: 'Shelter not found' });
        }

        await shelter.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
