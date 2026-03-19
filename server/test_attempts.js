import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import User from './models/User.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ role: 'student' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const res = await fetch('http://localhost:5001/api/quizzes/attempts', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("Attempts count:", data.count);
        if (data.count > 0) {
            console.log("Sample attempt:", JSON.stringify(data.data[0], null, 2));
        }
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
test();
