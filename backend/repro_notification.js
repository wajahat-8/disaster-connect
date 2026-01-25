
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

const simulateSend = async (roleName) => {
    console.log(`\nSimulating send to role: ${roleName}`);
    const userRoles = [roleName];

    try {
        const targetUsers = await User.find({
            role: { $in: userRoles },
            isActive: true
        }).select('fcmToken _id role'); // Added role to selection for debug

        console.log(`Found ${targetUsers.length} users.`);
        targetUsers.forEach(u => console.log(` - User ID: ${u._id}, Role: ${u.role}`));

        if (targetUsers.length === 0) {
            console.log("Result: 404 No active users found");
        } else {
            console.log("Result: would save to DB and send push");
            const fcmTokens = targetUsers
                .map(user => user.fcmToken)
                .filter(token => token && token !== '');
            console.log(`FCM Tokens found: ${fcmTokens.length}`);
        }

    } catch (error) {
        console.error('Error finding users:', error);
    }
};

const run = async () => {
    await connectDB();
    await simulateSend('user');
    await simulateSend('volunteer');
    await simulateSend('admin');
    mongoose.disconnect();
};

run();
