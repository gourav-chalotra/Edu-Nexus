import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import User from '../models/User.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ isActive: true }).sort({ createdAt: 1 });
        
        res.json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single subject with chapters
// @route   GET /api/subjects/:id
// @access  Private
export const getSubject = async (req, res) => {
    try {
        const subject = await Subject.findOne({ id: req.params.id, isActive: true });
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        // Get all chapters for this subject
        const chapters = await Chapter.find({ 
            subjectId: req.params.id, 
            isPublished: true 
        }).sort({ order: 1 });

        res.json({
            success: true,
            data: {
                ...subject.toObject(),
                chapters
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Teacher/Admin)
export const createSubject = async (req, res) => {
    try {
        const { id, title, description, icon, class: className } = req.body;

        const subject = await Subject.create({
            id,
            title,
            description,
            icon,
            class: className,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Teacher/Admin)
export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { id: req.params.id },
            { isActive: false },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign subject to teacher
// @route   POST /api/subjects/:subjectId/assign-teacher/:teacherId
// @access  Private (Admin)
export const assignTeacher = async (req, res) => {
    try {
        const { subjectId, teacherId } = req.params;

        const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Add subject to teacher's assignedSubjects
        if (!teacher.assignedSubjects.includes(subjectId)) {
            teacher.assignedSubjects.push(subjectId);
            await teacher.save();
        }

        res.json({
            success: true,
            message: 'Subject assigned to teacher',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Unassign subject from teacher
// @route   DELETE /api/subjects/:subjectId/unassign-teacher/:teacherId
// @access  Private (Admin)
export const unassignTeacher = async (req, res) => {
    try {
        const { subjectId, teacherId } = req.params;

        const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Remove subject from teacher's assignedSubjects
        teacher.assignedSubjects = teacher.assignedSubjects.filter(id => id !== subjectId);
        await teacher.save();

        res.json({
            success: true,
            message: 'Subject unassigned from teacher',
            data: teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (Teacher/Admin)
export const createSubject = async (req, res) => {
    try {
        const { id, title, description, icon, class: className } = req.body;

        const subject = await Subject.create({
            id,
            title,
            description,
            icon,
            class: className,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Teacher/Admin)
export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findOneAndUpdate(
            { id: req.params.id },
            { isActive: false },
            { new: true }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

