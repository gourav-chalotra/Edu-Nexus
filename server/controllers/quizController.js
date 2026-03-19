import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

// @desc    Get quiz for a chapter
// @route   GET /api/quizzes/:subjectId/:chapterId
// @access  Private
export const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findOne({
            subjectId: req.params.subjectId,
            chapterId: req.params.chapterId,
            isActive: true
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found for this chapter'
            });
        }

        // Remove correct answers from response (students shouldn't see them)
        // MOFDIFIED: Sending correct answers for Client-side game validation
        const quizData = quiz.toObject();
        quizData.questions = quizData.questions.map(q => ({
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options,
            points: q.points,
            correctAnswer: q.correctAnswer // Required for Shooter Game
        }));

        res.json({
            success: true,
            data: quizData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create or update quiz
// @route   POST /api/quizzes
// @access  Private (Teacher/Admin)
export const createQuiz = async (req, res) => {
    try {
        const { subjectId, chapterId } = req.body;

        // Check if quiz already exists
        let quiz = await Quiz.findOne({ subjectId, chapterId });

        if (quiz) {
            // Update existing quiz
            quiz = await Quiz.findOneAndUpdate(
                { subjectId, chapterId },
                { ...req.body, createdBy: req.user._id },
                { new: true, runValidators: true }
            );
        } else {
            // Create new quiz
            quiz = await Quiz.create({
                ...req.body,
                createdBy: req.user._id
            });
        }

        res.status(201).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:subjectId/:chapterId/submit
// @access  Private (Student)
export const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, userAnswer, timeTaken }

        const quiz = await Quiz.findOne({
            subjectId: req.params.subjectId,
            chapterId: req.params.chapterId,
            isActive: true
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Calculate score
        let score = 0;
        let totalPoints = 0;
        const gradedAnswers = [];

        quiz.questions.forEach(question => {
            totalPoints += question.points;
            const userAnswer = answers.find(a => a.questionId === question.id);

            if (userAnswer) {
                const isCorrect = userAnswer.userAnswer.toLowerCase().trim() ===
                    question.correctAnswer.toLowerCase().trim();

                const pointsEarned = isCorrect ? question.points : 0;
                score += pointsEarned;

                gradedAnswers.push({
                    questionId: question.id,
                    userAnswer: userAnswer.userAnswer,
                    isCorrect,
                    pointsEarned,
                    timeTaken: userAnswer.timeTaken || 0
                });
            }
        });

        const percentage = (score / totalPoints) * 100;
        const passed = percentage >= (quiz.passingScore || 60);

        // Calculate XP and streak bonus
        const user = await User.findById(req.user._id);
        let xpEarned = score;
        let streakBonus = 0;

        if (user.streak >= 3) {
            streakBonus = Math.floor(score * 0.5); // 50% bonus for 3+ day streak
            xpEarned += streakBonus;
        }

        // Save quiz attempt
        const attempt = await QuizAttempt.create({
            userId: req.user._id,
            quizId: quiz._id,
            subjectId: req.params.subjectId,
            chapterId: req.params.chapterId,
            answers: gradedAnswers,
            score,
            totalPoints,
            percentage,
            xpEarned,
            streakBonus,
            passed
        });

        // Update user XP, level, and daily stats
        user.addXP(xpEarned);

        // Ensure daily stats are initialized (just in case)
        if (typeof user.dailyXP !== 'number') user.dailyXP = 0;
        if (typeof user.dailyQuizzes !== 'number') user.dailyQuizzes = 0;

        user.dailyXP += xpEarned;
        user.dailyQuizzes += 1;

        // Award badges
        const newBadges = [];

        if (percentage === 100 && !user.badges.some(b => b.badgeId === 'perfect-score')) {
            newBadges.push({
                badgeId: 'perfect-score',
                name: 'Perfect Score',
                icon: '🎯'
            });
        }

        if (user.streak >= 7 && !user.badges.some(b => b.badgeId === 'week-warrior')) {
            newBadges.push({
                badgeId: 'week-warrior',
                name: 'Week Warrior',
                icon: '🔥'
            });
        }

        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();

        // Update progress
        await Progress.findOneAndUpdate(
            {
                userId: req.user._id,
                subjectId: req.params.subjectId,
                chapterId: req.params.chapterId
            },
            {
                quizCompleted: true,
                status: 'completed',
                progress: 100,
                completedAt: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            data: {
                attempt,
                xpEarned,
                streakBonus,
                newBadges,
                userStats: {
                    xp: user.xp,
                    dailyXP: user.dailyXP,
                    dailyQuizzes: user.dailyQuizzes,
                    level: user.level,
                    streak: user.streak
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quiz attempts for user
// @route   GET /api/quizzes/attempts
// @access  Private
export const getMyAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ userId: req.user._id })
            .sort({ completedAt: -1 });

        res.json({
            success: true,
            count: attempts.length,
            data: attempts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get quiz attempt details
// @route   GET /api/quizzes/attempts/:attemptId
// @access  Private
export const getAttemptDetails = async (req, res) => {
    try {
        const attempt = await QuizAttempt.findById(req.params.attemptId)
            .populate('quizId');

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: 'Attempt not found'
            });
        }

        // Ensure user can only see their own attempts
        if (attempt.userId.toString() !== req.user._id.toString() && req.user.role !== 'teacher' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this attempt'
            });
        }

        res.json({
            success: true,
            data: attempt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

