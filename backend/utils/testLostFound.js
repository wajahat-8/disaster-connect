const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LostFound = require('../models/LostFound');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const testLostFound = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Test findAll
        console.log('Testing LostFound.find()...');
        const items = await LostFound.find({}).sort({ date: -1 }).populate('reporterId', 'name');
        console.log(`Found ${items.length} items`);

        console.log('Items:', JSON.stringify(items, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testLostFound();
