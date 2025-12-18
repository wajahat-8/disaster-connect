const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Shelter = require('../models/Shelter');

const MONGODB_URI = 'mongodb+srv://wajahat:102128@cluster0.icfwzoo.mongodb.net/disaster_connect?retryWrites=true&w=majority&appName=Cluster0';

const sampleShelters = [
    {
        name: 'School Verified Shelter',
        location: {
            type: 'Point',
            coordinates: [73.0479, 33.6844], // [lng, lat]
            formattedAddress: 'Islamabad, Pakistan',
            city: 'Islamabad',
            country: 'Pakistan'
        },
        capacity: 500,
        availableBeds: 250,
        verified: true,
        facilities: ['Water', 'Medical', 'Food', 'Electricity', 'Blankets'],
        contactInfo: {
            phone: '+92-51-1234567',
            email: 'shelter1@example.com'
        }
    },
    {
        name: 'Community Center Safe Haven',
        location: {
            type: 'Point',
            coordinates: [73.0569, 33.6944],
            formattedAddress: 'F-6, Islamabad, Pakistan',
            city: 'Islamabad',
            country: 'Pakistan'
        },
        capacity: 300,
        availableBeds: 180,
        verified: true,
        facilities: ['Water', 'Medical', 'Food', 'Security'],
        contactInfo: {
            phone: '+92-51-2345678',
            email: 'shelter2@example.com'
        }
    },
    {
        name: 'Emergency Relief Center',
        location: {
            type: 'Point',
            coordinates: [73.0369, 33.6744],
            formattedAddress: 'G-7, Islamabad, Pakistan',
            city: 'Islamabad',
            country: 'Pakistan'
        },
        capacity: 400,
        availableBeds: 320,
        verified: false,
        facilities: ['Water', 'Food', 'Blankets'],
        contactInfo: {
            phone: '+92-51-3456789',
            email: 'shelter3@example.com'
        }
    },
    {
        name: 'City Hall Evacuation Point',
        location: {
            type: 'Point',
            coordinates: [73.0669, 33.7044],
            formattedAddress: 'Blue Area, Islamabad, Pakistan',
            city: 'Islamabad',
            country: 'Pakistan'
        },
        capacity: 600,
        availableBeds: 450,
        verified: true,
        facilities: ['Water', 'Medical', 'Food', 'Electricity', 'Toilets', 'Blankets'],
        contactInfo: {
            phone: '+92-51-4567890',
            email: 'shelter4@example.com'
        }
    },
    {
        name: 'Sports Complex Shelter',
        location: {
            type: 'Point',
            coordinates: [73.0269, 33.6644],
            formattedAddress: 'F-9 Park, Islamabad, Pakistan',
            city: 'Islamabad',
            country: 'Pakistan'
        },
        capacity: 800,
        availableBeds: 600,
        verified: true,
        facilities: ['Water', 'Medical', 'Food', 'Electricity', 'Toilets', 'Blankets', 'Security'],
        contactInfo: {
            phone: '+92-51-5678901',
            email: 'shelter5@example.com'
        }
    }
];

async function seedShelters() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ MongoDB Connected');

        await Shelter.deleteMany({});
        console.log('✓ Existing shelters cleared');

        const created = await Shelter.insertMany(sampleShelters);
        console.log(`✓ ${created.length} shelters created:`);

        created.forEach(s => {
            console.log(`  - ${s.name} (${s.availableBeds}/${s.capacity} beds)`);
        });

        await mongoose.connection.close();
        console.log('\n✓ Done!');
        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
}

seedShelters();
