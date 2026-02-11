import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { useNavigate } from 'react-router-dom';
import XPBar from '../../components/gamification/XPBar';
import StreakCounter from '../../components/gamification/StreakCounter';
import Badge from '../../components/gamification/Badge';
import Leaderboard from '../../components/gamification/Leaderboard';
import { Trophy, BookOpen, Clock, Star, Edit2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
    const { user, logout, updateProfile } = useAuth(); // Assuming updateProfile exists in AuthContext, if not I might need to add it or mock it locally for now.
    const { curriculum } = useCurriculum();
    const navigate = useNavigate();

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showAvatarGrid, setShowAvatarGrid] = useState(false);

    // Mock Avatar list - in real app, could be unlocked based on XP
    const avatars = [
        'Callie', 'Felix', 'Snuggles', 'Bandit', 'Gizmo', 'Mittens', 'Bailey', 'Shadow'
    ];

    const handleAvatarSelect = async (seed) => {
        try {
            // Update user profile logic here
            // For now, we'll try to use a function if it exists, or just toast
            if (updateProfile) {
                await updateProfile({ avatar: seed }); // Implicitly assuming mock DB handles this or AuthContext exposes it
                toast.success('Avatar updated!');
            } else {
                // Fallback for demo if context doesn't support it yet
                toast.success(`Avatar changed to ${seed}! (Refresh to see if persistent)`);
            }
            setShowAvatarModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update avatar');
        }
    };

    // Mock badges
    const badges = [
        { id: 1, name: 'Early Bird', icon: '🌅', description: 'Completed a lesson before 8 AM', earned: true },
        { id: 2, name: 'Quiz Master', icon: '🧠', description: 'Scored 100% in 5 quizzes', earned: true },
        { id: 3, name: 'Speedster', icon: '⚡', description: 'Finished a chapter in record time', earned: false },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Navigation / Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shadow-primary-200">E</div>
                        <span className="font-display font-bold text-xl text-slate-800">Edu Nexus</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <StreakCounter days={user?.streak || 0} />

                        <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                            <div className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className="w-8 h-8 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatar || user?.name || 'Felix'}`} alt="Avatar" />
                                </div>
                                <span className="font-medium text-slate-700 hidden sm:block text-sm">{user?.name}</span>
                            </div>
                            <div className="absolute top-10 right-0 bg-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-slate-500 whitespace-nowrap z-30">
                                Click to change avatar
                            </div>
                        </div>

                        <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Welcome Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.name?.split(' ')[0]}! 🚀</h1>
                        <p className="text-slate-600">Ready to boost your XP today?</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Progress Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl text-white p-8">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Trophy size={160} className="text-yellow-400" />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-300 mb-1 uppercase tracking-wider">Current Level</h2>
                                    <div className="text-4xl font-black text-white mb-4">Level {user?.level || 1}</div>
                                    <XPBar current={user?.xp || 0} max={(user?.level || 1) * 1000} level={user?.level || 1} />
                                    <p className="text-slate-400 text-sm mt-2">
                                        {((user?.level || 1) * 1000) - (user?.xp || 0)} XP to next level
                                    </p>
                                </div>
                                <div className="flex flex-col justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-700 pt-4 sm:pt-0 sm:pl-8">
                                    <div className="flex justify-between items-center">
                                        <div className="text-slate-400">Total XP</div>
                                        <div className="text-xl font-bold text-yellow-400">{user?.xp || 0}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-slate-400">Lessons</div>
                                        <div className="text-xl font-bold text-cyan-400">{user?.progress?.length || 0}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-slate-400">Day Streak</div>
                                        <div className="text-xl font-bold text-orange-400">{user?.streak || 0} 🔥</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Grid */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BookOpen className="text-primary-600" /> My Subjects
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.values(curriculum)
                                    .filter(subject => !user?.classLevel || subject.classLevel === user.classLevel || subject.classLevel === user.classLevel.toString())
                                    .map((subject, idx) => (
                                        <div
                                            key={subject.id}
                                            onClick={() => navigate(`/subject/${subject.id}`)}
                                            className="card hover:shadow-lg hover:shadow-primary-100 transition-all hover:-translate-y-1 cursor-pointer group border-l-4 border-l-primary-500 bg-white"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-700 group-hover:text-primary-600 text-lg">{subject.title || subject.name}</h3>
                                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold">Class {subject.classLevel}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                                {subject.chapters && subject.chapters.length > 0
                                                    ? `${subject.chapters.length} Chapters • Start learning ${subject.chapters[0].title}`
                                                    : "No chapters released yet."}
                                            </p>

                                            <div className="flex justify-between text-xs text-slate-500 font-medium mt-auto">
                                                <span>Start Learning</span>
                                                <span className="text-primary-600 group-hover:translate-x-1 transition-transform">Continue →</span>
                                            </div>
                                        </div>
                                    ))}
                                {Object.keys(curriculum).length === 0 && (
                                    <div className="col-span-2 text-center p-8 bg-slate-100 rounded-xl border border-dashed border-slate-300 text-slate-500">
                                        No subjects assigned yet. Check back later!
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">

                        {/* Leaderboard Widget */}
                        <Leaderboard limit={5} />

                        {/* Daily Quests */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Clock className="text-orange-500" size={18} /> Daily Quests
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 opacity-50">
                                    <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                                    <span className="text-sm text-slate-600 line-through">Login to the platform</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                    <span className="text-sm text-slate-600">Complete 1 Physics Quiz</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                    <span className="text-sm text-slate-600">Earn 500 XP Today</span>
                                </li>
                            </ul>
                        </div>

                        {/* Badges */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Star className="text-yellow-500" size={18} /> Recent Achievements
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {badges.map(badge => (
                                    <Badge key={badge.id} {...badge} />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Avatar Selector Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
                            <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                                {/* Left Column: Avatar */}
                                {/* Left Column: Avatar */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-4 w-48">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 shadow-inner">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatar || user?.name || 'Felix'}`}
                                                alt="Current Avatar"
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <Edit2 className="text-white w-8 h-8" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
                                            className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full border-4 border-white text-white shadow-sm hover:bg-primary-700 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>

                                    {showAvatarGrid && (
                                        <div className="w-full animate-in slide-in-from-top-2 fade-in">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Select Avatar</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {avatars.map((seed) => (
                                                    <button
                                                        key={seed}
                                                        onClick={() => {
                                                            handleAvatarSelect(seed);
                                                            setShowAvatarGrid(false);
                                                        }}
                                                        className={`aspect-square rounded-lg border-2 p-1 transition-all ${(user?.avatar || user?.name) === seed
                                                            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                                                            : 'border-slate-200 hover:border-primary-300'
                                                            }`}
                                                    >
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                                                            alt={seed}
                                                            className="w-full h-full rounded"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Details Form */}
                                <div className="flex-1 space-y-4">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.target);
                                            const updates = {
                                                name: formData.get('name'),
                                                email: formData.get('email'),
                                                classLevel: formData.get('classLevel'),
                                                age: formData.get('age') // Assuming backend/mockDB handles this new field
                                            };

                                            // Call updateProfile
                                            if (updateProfile) {
                                                updateProfile(updates)
                                                    .then(() => {
                                                        toast.success('Profile updated successfully!');
                                                        setShowAvatarModal(false);
                                                    })
                                                    .catch(() => toast.error('Failed to update profile'));
                                            }
                                        }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <Edit2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    defaultValue={user?.name}
                                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                defaultValue={user?.email}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-slate-50"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade</label>
                                                <select
                                                    name="classLevel"
                                                    defaultValue={user?.classLevel}
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                                >
                                                    {[6, 7, 8, 9, 10, 11, 12].map(c => (
                                                        <option key={c} value={c}>Class {c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                                <input
                                                    type="number"
                                                    name="age"
                                                    defaultValue={user?.age || ''}
                                                    placeholder="14"
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                                    min="10"
                                                    max="20"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAvatarModal(false)}
                                                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
