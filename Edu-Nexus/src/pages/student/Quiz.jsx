import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { quizAPI } from '../../services/api';
import RewardPopup from '../../components/gamification/RewardPopup';
import { Timer, ArrowRight, CheckCircle, XCircle, AlertCircle, Flame, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

const Quiz = () => {
    const { subjectId, chapterId } = useParams();
    const navigate = useNavigate();
    const { updateUserProgress } = useAuth();

    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isFinished, setIsFinished] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [streak, setStreak] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [quizResults, setQuizResults] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizAPI.get(subjectId, chapterId);
                setQuizData(response.data.data);
                setQuestionStartTime(Date.now());
            } catch (error) {
                console.error('Failed to fetch quiz:', error);
                toast.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [subjectId, chapterId]);

    const currentQuestion = quizData?.questions[currentQuestionIndex];
    const totalQuestions = quizData?.questions.length || 0;

    useEffect(() => {
        if (isAnswered || isFinished || !quizData) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestionIndex, isAnswered, isFinished, quizData]);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setFeedback('incorrect');
        setStreak(0);
    };

    const handleOptionSelect = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (isAnswered) {
            handleNext();
            return;
        }

        const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
        const answer = currentQuestion.type === 'mcq' ? selectedOption : textAnswer;

        // Store the answer
        setUserAnswers(prev => [...prev, {
            questionId: currentQuestion.id,
            userAnswer: answer,
            timeTaken
        }]);

        setIsAnswered(true);

        // Show visual feedback (we don't know if it's correct yet)
        if (currentQuestion.type === 'mcq' && selectedOption) {
            setFeedback('answered');
        } else if (currentQuestion.type === 'fill-in' && textAnswer.trim()) {
            setFeedback('answered');
        }

        // Increment streak for answering (actual correctness will be determined by backend)
        setStreak(prev => prev + 1);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setTextAnswer('');
            setIsAnswered(false);
            setFeedback(null);
            setTimeLeft(30);
            setQuestionStartTime(Date.now());
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setIsFinished(true);

        try {
            // Submit all answers to backend
            const response = await quizAPI.submit(subjectId, chapterId, userAnswers);
            const { xpEarned, streakBonus, newBadges, userStats } = response.data.data;

            // Store results for display
            setQuizResults({ xpEarned, streakBonus, newBadges });

            // Update user progress with backend data
            updateUserProgress(userStats);

            // Show confetti
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });

            // Show reward popup with actual XP earned
            setShowReward(true);

            // Show badges earned
            if (newBadges && newBadges.length > 0) {
                setTimeout(() => {
                    newBadges.forEach(badge => {
                        toast.success(`🎉 New Badge: ${badge.name}!`, { duration: 4000 });
                    });
                }, 1000);
            }

        } catch (error) {
            console.error('Failed to submit quiz:', error);
            toast.error('Failed to submit quiz. Please try again.');
        }
    };

    const handleCloseReward = () => {
        setShowReward(false);
        navigate('/dashboard');
    };

    // Animation Variants
    const cardVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
        shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } },
        bounce: { scale: [1, 1.05, 1], transition: { duration: 0.3 } }
    };

    if (loading) return <div className="p-10 text-center">Loading quiz...</div>;

    if (!quizData) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Quiz Not Available</h2>
                    <p className="text-slate-500 mb-6">The teacher hasn't created a quiz for this chapter yet.</p>
                    <button onClick={() => navigate(-1)} className="btn-primary w-full">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 bg-pattern">
            <div className="w-full max-w-3xl">
                {/* Header with Stats */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{quizData.title}</h2>
                        <p className="text-slate-500 font-medium">{quizData.subject}</p>
                    </div>

                    <div className="flex gap-4">
                        {streak > 1 && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-orange-200"
                            >
                                <Flame size={20} className="fill-orange-600 animate-pulse" />
                                {streak} Streak!
                            </motion.div>
                        )}

                        <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                            <Timer className={`w-5 h-5 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                            <span className={`font-mono font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                {timeLeft}s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
                    <motion.div
                        className="bg-gradient-to-r from-primary-500 to-indigo-500 h-full rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </motion.div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestionIndex}
                        variants={cardVariants}
                        initial="hidden"
                        animate={feedback === 'incorrect' ? 'shake' : feedback === 'correct' ? 'bounce' : 'visible'}
                        exit="exit"
                        className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden"
                    >
                        {/* Decorative background blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <span className="text-sm font-bold text-primary-700 bg-primary-100 px-4 py-1.5 rounded-full flex items-center gap-2">
                                <Zap size={14} className="fill-primary-700" />
                                Question {currentQuestionIndex + 1}/{totalQuestions}
                            </span>
                            <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                {currentQuestion.points} XP
                            </span>
                        </div>

                        {currentQuestion.image && (
                            <div className="mb-6 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                <img src={currentQuestion.image} alt="Question Figure" className="w-full h-64 object-contain bg-slate-50" />
                            </div>
                        )}

                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-10 leading-snug">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-4 relative z-10">
                            {currentQuestion.type === 'mcq' ? (
                                currentQuestion.options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        disabled={isAnswered}
                                        className={`w-full p-5 rounded-2xl text-left font-semibold text-lg transition-all border-2
                                            ${selectedOption === option
                                                ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-md transform scale-[1.02]'
                                                : 'bg-white border-slate-100 hover:border-primary-200 hover:bg-slate-50 text-slate-600 hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{option}</span>
                                            {selectedOption === option && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle className="text-primary-500 fill-primary-100" size={24} />
                                                </motion.div>
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <input
                                    type="text"
                                    value={textAnswer}
                                    onChange={(e) => setTextAnswer(e.target.value)}
                                    disabled={isAnswered}
                                    placeholder="Type your answer here..."
                                    className={`w-full p-5 rounded-2xl border-2 outline-none text-xl font-medium transition-all
                                        ${isAnswered
                                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                                            : 'bg-white border-slate-200 focus:border-primary-500 focus:shadow-md'
                                        }
                                    `}
                                />
                            )}
                        </div>

                        {/* Feedback & Next Button */}
                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                            <div className="min-h-[24px]">
                                {feedback === 'answered' && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="text-primary-600 font-bold flex items-center gap-2 text-lg"
                                    >
                                        <CheckCircle size={24} /> Answer recorded!
                                    </motion.span>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!isAnswered && !selectedOption && !textAnswer}
                                className={`btn-primary flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all hover:scale-105 active:scale-95
                                    ${(!isAnswered && !selectedOption && !textAnswer) ? 'opacity-50 cursor-not-allowed shadow-none' : ''}
                                `}
                            >
                                {isAnswered ? (currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz') : 'Submit Answer'}
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <RewardPopup
                isOpen={showReward}
                onClose={handleCloseReward}
                title="Quiz Completed!"
                xp={quizResults?.xpEarned || 0}
                message={`You earned ${quizResults?.xpEarned || 0} XP${quizResults?.streakBonus ? ` (including ${quizResults.streakBonus} streak bonus)` : ''}! Amazing work!`}
            />
        </div>
    );
};

export default Quiz;
