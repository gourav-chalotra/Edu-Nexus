import axios from 'axios';
import { db } from './mockDatabase';

// Initialize the database seeded data
db.init();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// --- MOCK IMPLEMENTATION ---
const MOCK_DELAY = 600;

const mockResponse = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: { success: true, data } });
        }, MOCK_DELAY);
    });
};

const mockError = (message, status = 400) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject({ response: { status, data: { message } } });
        }, MOCK_DELAY);
    });
};

// Auth APIs
export const authAPI = {
    register: (userData) => {
        try {
            const newUser = db.users.create({ ...userData, role: 'student', xp: 0, level: 1, avatar: '🎓' });
            return mockResponse(newUser);
        } catch (e) {
            return mockError(e.message);
        }
    },
    login: (credentials) => {
        const { email, password } = credentials;
        const user = db.users.findByEmail(email);

        if (user && user.password === password) {
            return mockResponse({
                ...user,
                token: 'mock_token_' + user.id
            });
        }
        return mockError('Invalid credentials');
    },
    getMe: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return mockError('Unauthorized', 401);
        const freshUser = db.users.getById(user.id);
        return freshUser ? mockResponse(freshUser) : mockError('User not found', 404);
    }
};

// Subject APIs
export const subjectAPI = {
    getAll: () => mockResponse(db.subjects.getAll()),
    getOne: (subjectId) => mockResponse(db.subjects.getById(subjectId)),
    create: (data) => mockResponse({ ...data, id: Date.now().toString() }), // Not implemented fully in DB as subjects are static mostly
    update: (subjectId, data) => mockResponse(data),
    delete: (subjectId) => mockResponse({ id: subjectId }),
    // Admin ops
    assignTeacher: (teacherId, subjectId) => {
        db.subjects.assignToTeacher(teacherId, subjectId);
        return mockResponse({ success: true });
    },
    unassignTeacher: (teacherId, subjectId) => {
        db.subjects.unassignFromTeacher(teacherId, subjectId);
        return mockResponse({ success: true });
    }
};

// Chapter APIs
export const chapterAPI = {
    getBySubject: (subjectId) => {
        return mockResponse(db.chapters.getBySubject(subjectId));
    },
    getOne: (subjectId, chapterId) => {
        const chapter = db.chapters.getById(chapterId);
        return chapter ? mockResponse(chapter) : mockError('Chapter not found');
    },
    create: (data) => mockResponse(db.chapters.create(data)),
    update: (subjectId, chapterId, data) => mockResponse(db.chapters.update(chapterId, data)),
    addVideo: (subjectId, chapterId, videoUrl) => {
        const chapter = db.chapters.getById(chapterId);
        if (chapter) {
            return mockResponse(db.chapters.update(chapterId, { videoUrl }));
        }
        return mockError('Chapter not found');
    },
    addAttachment: (subjectId, chapterId, attachment) => {
        const chapter = db.chapters.getById(chapterId);
        if (chapter) {
            const newAttachments = [...(chapter.attachments || []), attachment];
            return mockResponse(db.chapters.update(chapterId, { attachments: newAttachments }));
        }
        return mockError('Chapter not found');
    }
};

// Quiz APIs
export const quizAPI = {
    get: (subjectId, chapterId) => mockResponse(db.quizzes.getByChapter(chapterId)),
    create: (data) => mockResponse(db.quizzes.create(data)),
    submit: (subjectId, chapterId, answers) => {
        const quiz = db.quizzes.getByChapter(chapterId)[0]; // Assuming one quiz per chapter for now
        if (!quiz) return mockError('Quiz not found');

        let totalXP = 0;
        let correctCount = 0;
        let streak = 0; // Current streak in this quiz submission (or overall? user has streak too)

        // Validate answers
        answers.forEach(ans => {
            const question = quiz.questions.find(q => q.id === ans.questionId);
            if (!question) return;

            const isCorrect = question.type === 'mcq'
                ? ans.userAnswer === question.correctAnswer
                : ans.userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

            if (isCorrect) {
                correctCount++;
                // XP Calculation: 10 * remaining seconds (assuming 30s limit)
                const timeLeft = Math.max(0, 30 - ans.timeTaken);
                totalXP += timeLeft * 10;
            }
        });

        // Add Streak Bonus (mock logic: +50 for perfect score)
        let streakBonus = 0;
        if (correctCount === quiz.questions.length && quiz.questions.length > 0) {
            streakBonus = 100;
            totalXP += streakBonus;
        }

        // Update User Process
        const user = JSON.parse(localStorage.getItem('user'));
        const currentUser = db.users.getById(user.id);

        // Update User Streak (global daily streak)
        // For simple mock, just increment if they engaged
        const today = new Date().toDateString();
        // (Real streak logic would check last login date, etc. We'll simplified increment for "activity")

        // Badge Logic
        const newBadges = [];
        if (totalXP > 500) newBadges.push({ name: 'High Scorer', icon: '🏆' });
        if (correctCount === quiz.questions.length) newBadges.push({ name: 'Perfectionist', icon: '✨' });

        // Update DB
        db.users.update(user.id, {
            xp: (currentUser.xp || 0) + totalXP,
            // streak: currentUser.streak + 1 // handled elsewhere usually or here
        });

        // Record Attempt
        const result = {
            score: correctCount,
            totalQuestions: quiz.questions.length,
            xp: totalXP,
            completed: true
        };
        db.progress.update(user.id, chapterId, result);

        return mockResponse({
            xpEarned: totalXP,
            streakBonus,
            newBadges,
            userStats: db.users.getById(user.id) // Return fresh user stats
        });
    },
    recordAttempt: (subjectId, chapterId, result) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const progress = db.progress.update(user.id, chapterId, result);
        return mockResponse(progress);
    }
};

// Progress APIs
export const progressAPI = {
    getAll: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return mockResponse(db.progress.getByUser(user.id));
    },
    getBySubject: (subjectId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        // Filter implicitly by subject via chapters... a bit complex for NoSQL flat structure
        // returning all for now, frontend can filter
        return mockResponse(db.progress.getByUser(user.id));
    },
    update: (subjectId, chapterId, data) => {
        const user = JSON.parse(localStorage.getItem('user'));
        return mockResponse(db.progress.update(user.id, chapterId, data));
    }
};

// Leaderboard APIs
export const leaderboardAPI = {
    get: (limit = 50) => {
        const users = db.users.getAll().filter(u => u.role === 'student');
        users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        return mockResponse(users.slice(0, limit));
    },
    getMyRank: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const users = db.users.getAll().filter(u => u.role === 'student');
        users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        const rank = users.findIndex(u => u.id === user.id) + 1;
        return mockResponse({ rank, totalRequired: users[0]?.xp * 1.5 || 1000 });
    }
};

// User APIs
export const userAPI = {
    updateProfile: (data) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const updated = db.users.update(user.id, data);
        localStorage.setItem('user', JSON.stringify(updated)); // Update local session
        return mockResponse(updated);
    },
    getAllTeachers: () => {
        return mockResponse(db.users.getAll().filter(u => u.role === 'teacher'));
    },
    createTeacher: (data) => {
        try {
            return mockResponse(db.users.create({ ...data, role: 'teacher' }));
        } catch (e) {
            return mockError(e.message);
        }
    },
    deleteUser: (id) => {
        db.users.delete(id);
        return mockResponse({ success: true });
    },
    getAllStudents: () => {
        return mockResponse(db.users.getAll().filter(u => u.role === 'student'));
    }
};

export default api;

