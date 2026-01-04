const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Shelter = require('../models/Shelter');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkShelters = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const count = await Shelter.countDocuments();
        console.log(`Total Shelters in DB: ${count}`);

        if (count > 0) {
            const shelters = await Shelter.find().sort({ createdAt: -1 }).limit(5).select('name location createdAt');
            console.log('Last 5 Shelters Added:');
            shelters.forEach(s => {
                console.log(`- ${s.name} (${s.createdAt}): [${s.location.coordinates[0]}, ${s.location.coordinates[1]}]`);
            });

            // Check indexes
            const indexes = await Shelter.collection.getIndexes();
            console.log('Indexes:', JSON.stringify(indexes, null, 2));
        } else {
            console.log('No shelters found. You may need to seed data.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkShelters();
