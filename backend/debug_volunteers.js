
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const checkVolunteers = async () => {
    await connectDB();

    try {
        const volunteers = await User.find({ role: 'volunteer' });
        console.log(`Found ${volunteers.length} volunteers.`);

        volunteers.forEach(v => {
            console.log(`ID: ${v._id}, Name: ${v.name}, Role: ${v.role}, Active: ${v.isActive}, HasFCM: ${!!v.fcmToken}`);
        });

        const activeVolunteers = await User.find({ role: 'volunteer', isActive: true });
        console.log(`Active volunteers query count: ${activeVolunteers.length}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
};

checkVolunteers();
