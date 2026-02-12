import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, email, avatar, classLevel } = req.body;
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;
        if (classLevel) user.classLevel = classLevel;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                xp: updatedUser.xp,
                level: updatedUser.level,
                streak: updatedUser.streak,
                classLevel: updatedUser.classLevel,
                badges: updatedUser.badges
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all teachers
// @route   GET /api/users/teachers
// @access  Private
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        
        res.json({
            success: true,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ xp: -1 });
        
        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create teacher (admin only)
// @route   POST /api/users/teachers
// @access  Private/Admin
export const createTeacher = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const teacher = await User.create({
            name,
            email,
            password,
            role: 'teacher',
            avatar: 'Felix'
        });

        res.status(201).json({
            success: true,
            data: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role,
                assignedSubjects: teacher.assignedSubjects
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                xp: user.xp,
                level: user.level,
                streak: user.streak,
                badges: user.badges,
                completedChapters: user.completedChapters
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

