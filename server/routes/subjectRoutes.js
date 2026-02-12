import express from 'express';
import {
    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    assignTeacher,
    unassignTeacher
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getSubjects)
    .post(protect, authorize('teacher', 'admin'), createSubject);

router.route('/:id')
    .get(protect, getSubject)
    .put(protect, authorize('teacher', 'admin'), updateSubject)
    .delete(protect, authorize('admin'), deleteSubject);

// Teacher assignment routes
router.post('/:subjectId/assign-teacher/:teacherId', protect, authorize('admin'), assignTeacher);
router.delete('/:subjectId/unassign-teacher/:teacherId', protect, authorize('admin'), unassignTeacher);

export default router;

