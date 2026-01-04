const LostFound = require('../models/LostFound');

// @desc    Report a lost item
// @route   POST /api/lost-found/lost
// @access  Private
exports.reportLostItem = async (req, res, next) => {
    try {
        // Extract location - it comes as nested JSON from axios
        const location = req.body.location;

        if (!location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or missing location data'
            });
        }

        // Prepare item data
        const itemData = {
            itemName: req.body.itemName,
            description: req.body.description,
            location: {
                type: 'Point',
                coordinates: location.coordinates,
                address: location.address
            },
            status: 'lost',
            reporterId: req.user.id
        };

        // Add optional contact info if provided
        if (req.body.contactInfo) {
            itemData.contactInfo = req.body.contactInfo;
        }

        // Add image path if uploaded
        if (req.file) {
            itemData.image = `/uploads/${req.file.filename}`;
        }

        const item = await LostFound.create(itemData);

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (err) {
        console.error('Error in reportLostItem:', err);
        res.status(500).json({ success: false, error: 'Server Error', details: err.message });
    }
};

// @desc    Report a found item
// @route   POST /api/lost-found/found
// @access  Private
exports.reportFoundItem = async (req, res, next) => {
    try {
        // Extract location - it comes as nested JSON from axios
        const location = req.body.location;

        if (!location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or missing location data'
            });
        }

        // Prepare item data
        const itemData = {
            itemName: req.body.itemName,
            description: req.body.description,
            location: {
                type: 'Point',
                coordinates: location.coordinates,
                address: location.address
            },
            status: 'found',
            reporterId: req.user.id
        };

        // Add optional contact info if provided
        if (req.body.contactInfo) {
            itemData.contactInfo = req.body.contactInfo;
        }

        // Add image path if uploaded
        if (req.file) {
            itemData.image = `/uploads/${req.file.filename}`;
        }

        const item = await LostFound.create(itemData);

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (err) {
        console.error('Error in reportFoundItem:', err);
        res.status(500).json({ success: false, error: 'Server Error', details: err.message });
    }
};

// @desc    Get all lost/found items (Public Feed)
// @route   GET /api/lost-found/all
// @access  Public
exports.getAllItems = async (req, res, next) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { itemName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const items = await LostFound.find(query).sort({ date: -1 }).populate('reporterId', 'name');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get potential matches
// @route   GET /api/lost-found/matches
// @access  Private
exports.getMatches = async (req, res, next) => {
    try {
        const { itemName, status } = req.query;
        // Simple matching logic: find items with opposite status and similar name
        const matchStatus = status === 'lost' ? 'found' : 'lost';

        const query = {
            status: matchStatus,
            itemName: { $regex: itemName, $options: 'i' }
        };

        const matches = await LostFound.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: matches.length,
            data: matches
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a lost/found item
// @route   DELETE /api/lost-found/:id
// @access  Private (Owner only)
exports.deleteItem = async (req, res, next) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        // Check if user is the owner
        if (item.reporterId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this item'
            });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Error in deleteItem:', err);
        res.status(500).json({ success: false, error: 'Server Error', details: err.message });
    }
};

// @desc    Admin delete any lost/found item
// @route   DELETE /api/lost-found/admin/:id
// @access  Private (Admin only)
exports.adminDeleteItem = async (req, res, next) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found'
            });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error('Error in adminDeleteItem:', err);
        res.status(500).json({ success: false, error: 'Server Error', details: err.message });
    }
};
