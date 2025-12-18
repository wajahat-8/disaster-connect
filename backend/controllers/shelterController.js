const Shelter = require('../models/Shelter');

/**
 * Helper function to calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// @desc    Get all shelters with optional location-based sorting
// @route   GET /api/shelters?lat=<latitude>&lng=<longitude>&radius=<km>&search=<name>
// @access  Public
exports.getShelters = async (req, res) => {
    try {
        const { lat, lng, radius, search } = req.query;

        let query = {};
        let shelters;

        // Search by name if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Location-based query with geospatial search
        if (lat && lng) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const searchRadius = radius ? parseFloat(radius) : 50; // Default 50km radius

            // Use MongoDB $near for geospatial query
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: searchRadius * 1000 // Convert km to meters
                }
            };

            shelters = await Shelter.find(query);

            // Calculate and add distance to each shelter
            shelters = shelters.map(shelter => {
                const shelterObj = shelter.toObject();
                const [shelterLng, shelterLat] = shelter.location.coordinates;
                const distance = calculateDistance(latitude, longitude, shelterLat, shelterLng);
                return {
                    ...shelterObj,
                    distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
                };
            });
        } else {
            // No location provided, return all shelters
            shelters = await Shelter.find(query);
        }

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
