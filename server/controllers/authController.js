import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role, classLevel } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            classLevel,
            avatar: 'Felix',
            xp: 0,
            level: 1,
            streak: 0
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                classLevel: user.classLevel,
                stream: user.stream,
                school: user.school,
                age: user.age,
                badges: user.badges
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update streak logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (user.lastActiveAt) {
            const lastActive = new Date(user.lastActiveAt);
            const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

            const diffTime = today - lastActiveDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak += 1;
            } else if (diffDays > 1) {
                user.streak = 1;
            }
        } else {
            user.streak = 1; // First time logging in or no previous record
        }

        user.lastActiveAt = now;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                classLevel: user.classLevel,
                stream: user.stream,
                school: user.school,
                age: user.age,
                badges: user.badges,
                assignedSubjects: user.assignedSubjects
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update streak logic on fetch profile too
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // We only save if the streak was actually updated or if lastActiveAt needs to jump to today.
        // It's technically fine to always save, but we can avoid it if lastActiveAt is already today.
        let needsSave = false;

        if (user.lastActiveAt) {
            const lastActive = new Date(user.lastActiveAt);
            const lastActiveDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

            const diffTime = today - lastActiveDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak += 1;
                user.lastActiveAt = now;
                needsSave = true;
            } else if (diffDays > 1) {
                user.streak = 1;
                user.lastActiveAt = now;
                needsSave = true;
            } else {
                // diffDays === 0
                // User is active again today, we could just update lastActiveAt
                user.lastActiveAt = now;
                needsSave = true;
            }
        } else {
            user.streak = 1; // First time
            user.lastActiveAt = now;
            needsSave = true;
        }

        if (needsSave) {
            await user.save();
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                classLevel: user.classLevel,
                stream: user.stream,
                school: user.school,
                age: user.age,
                badges: user.badges,
                assignedSubjects: user.assignedSubjects
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
