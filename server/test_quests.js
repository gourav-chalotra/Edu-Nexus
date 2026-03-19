import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testQuests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find a user and give them some daily stats and a badge
        const user = await User.findOne({ role: 'student' });

        if (!user) {
            console.log('No student user found');
            process.exit(1);
        }

        console.log(`Testing user: ${user.name}`);

        // Give some initial state
        user.dailyXP = 550; // Should check the 500 XP quest
        user.dailyQuizzes = 1; // Should check the 1 quiz quest

        if (!user.badges.some(b => b.badgeId === 'first-login')) {
            user.badges.push({
                badgeId: 'first-login',
                name: 'First Blood',
                icon: '🔥'
            });
        }

        await user.save();
        console.log('Updated user stats successfully. Check the dashboard!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testQuests();
