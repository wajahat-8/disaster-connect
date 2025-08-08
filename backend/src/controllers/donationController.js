const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const { amount, currency, supplies, targetRegion, transactionId } = req.body;
    if (!amount && !supplies) return res.status(400).json({ message: 'Donation amount or supplies required' });
    const donation = await Donation.create({
      donor: req.user ? req.user._id : undefined,
      amount,
      currency,
      supplies: supplies || [],
      targetRegion,
      transactionId
    });
    res.status(201).json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listDonations = async (req, res) => {
  const donations = await Donation.find().populate('donor', 'name email');
  res.json(donations);
};
