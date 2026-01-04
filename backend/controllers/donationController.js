const Donation = require('../models/Donation');

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res, next) => {
    try {
        const { type, amount, itemDescription, location } = req.body;

        if (type === 'money' && (!amount || amount <= 0)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid amount for monetary donation'
            });
        }

        if (type === 'supplies' && !itemDescription) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a description for the supplies'
            });
        }

        const donationData = {
            donorId: req.user.id,
            type,
            amount: amount || 0,
            itemDescription,
            status: 'completed' // Simulate success
        };

        // Add location if provided
        if (location && location.coordinates) {
            donationData.location = {
                type: 'Point',
                coordinates: location.coordinates,
                address: location.address
            };
        }

        const donation = await Donation.create(donationData);

        res.status(201).json({
            success: true,
            data: donation
        });
    } catch (err) {
        console.error('Error creating donation:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all donations (Admin)
// @route   GET /api/donations
// @access  Private (Admin)
exports.getDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find()
            .populate('donorId', 'name email')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        console.error('Error fetching donations:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current user's donations
// @route   GET /api/donations/my-donations
// @access  Private
exports.getUserDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ donorId: req.user.id })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        console.error('Error fetching user donations:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get donation summary stats
// @route   GET /api/donations/summary
// @access  Private (Admin)
exports.getDonationSummary = async (req, res, next) => {
    try {
        const totalMoney = await Donation.aggregate([
            { $match: { type: 'money', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalSupplies = await Donation.countDocuments({ type: 'supplies' });
        const totalDonations = await Donation.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalMoney: totalMoney[0] ? totalMoney[0].total : 0,
                totalSupplies,
                totalDonations
            }
        });
    } catch (err) {
        console.error('Error fetching donation summary:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
