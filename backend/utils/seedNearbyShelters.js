const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Shelter = require('../models/Shelter');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedNearbyShelters = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Lahore, Pakistan
        const lat = 31.5204;
        const lng = 74.3587;

        const shelter = {
            name: "Lahore Central Relief Camp",
            location: {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON is [lng, lat]
                formattedAddress: "Gulberg III, Lahore, Pakistan"
            },
            capacity: 500,
            availableBeds: 250,
            verified: true,
            facilities: ["Medical Aid", "Food", "Water", "Shelter"],
            contactInfo: {
                phone: "+92 42 12345678",
                email: "relief@lahore.gov.pk"
            }
        };

        await Shelter.create(shelter);
        console.log('✅ Seeded Lahore Central Relief Camp');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedNearbyShelters();
