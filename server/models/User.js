import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    school: {
        type: String,
        trim: true,
        default: ''
    },
    classLevel: {
        type: Number,
        default: null
    },
    age: {
        type: Number,
        default: null
    },
    stream: {
        type: String,
        enum: ['Science', 'Commerce', 'Arts', null],
        default: null
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    // Teacher-specific fields
    assignedSubjects: [{
        subjectId: String,
        classLevel: String,
        assignedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Gamification fields
    xp: {
        type: Number,
        default: 0
    },
    dailyXP: {
        type: Number,
        default: 0
    },
    dailyQuizzes: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date
    },
    lastActiveAt: {
        type: Date
    },
    badges: [{
        badgeId: String,
        name: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    completedChapters: [{
        subjectId: String,
        chapterId: String,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    avatar: {
        type: String,
        default: ''
    },

}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate level from XP
userSchema.methods.calculateLevel = function () {
    this.level = Math.floor(this.xp / 1000) + 1;
    return this.level;
};

// Add XP and update level
userSchema.methods.addXP = function (xpAmount) {
    this.xp += xpAmount;
    this.calculateLevel();
    return this.xp;
};

const User = mongoose.model('User', userSchema);

export default User;

