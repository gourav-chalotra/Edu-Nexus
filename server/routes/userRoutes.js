import express from 'express';
import { 
    updateProfile, 
    getUserStats, 
    getAllTeachers, 
    getAllStudents,
    createTeacher,
    deleteUser 
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public or authenticated routes
router.get('/teachers', protect, getAllTeachers);
router.get('/students', protect, getAllStudents);
router.put('/:id', protect, updateProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/stats', protect, getUserStats);

// Admin routes
router.post('/teachers', protect, authorize('admin'), createTeacher);

export default router;

