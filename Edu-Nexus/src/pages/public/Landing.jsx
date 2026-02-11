import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Users, BookOpen, Star, ArrowRight, CheckCircle } from 'lucide-react';

// Static Data & Variants extracted outside component to prevent re-creation on render
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const STATS_DATA = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Quizzes Taken', value: '500k+' },
    { label: 'Teachers', value: '1,200+' },
    { label: 'Avg. Grade Boost', value: '35%' },
];

const FEATURES_DATA = [
    {
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        title: 'Gamified Learning',
        desc: 'Earn XP, unlock badges, and maintain streaks. Learning feels like playing your favorite game.'
    },
    {
        icon: <Target className="w-8 h-8 text-red-500" />,
        title: 'Personalized Goals',
        desc: 'Set your own pace. Our AI adapts questions to your level to ensure you are always challenged.'
    },
    {
        icon: <Users className="w-8 h-8 text-blue-500" />,
        title: 'Community & Compete',
        desc: 'Challenge friends to quizzes, climb the global leaderboard, and study in groups.'
    },
    {
        icon: <BookOpen className="w-8 h-8 text-green-500" />,
        title: 'Interactive Content',
        desc: 'No more boring PDFs. Engage with interactive simulations, videos, and bite-sized lessons.'
    },
    {
        icon: <Star className="w-8 h-8 text-purple-500" />,
        title: 'Rewards Store',
        desc: 'Redeem your hard-earned XP for exclusive profile frames, themes, and real-world discounts.'
    },
    {
        icon: <Trophy className="w-8 h-8 text-orange-500" />,
        title: 'Weekly Tournaments',
        desc: 'Participate in subject-specific tournaments every weekend to win massive XP prizes.'
    },
];

const Landing = memo(() => {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 will-change-transform">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">E</div>
                        <span className="font-display font-bold text-xl text-slate-800">Edu Nexus</span>
                    </div>
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'How it Works', 'Stories'].map(item => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium hidden sm:block">Login</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 -z-10"></div>

                {/* CSS Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                    backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}></div>

                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100/20 to-transparent -z-10 skew-x-12 transform origin-top"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            viewport={{ once: true }}
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span className="text-sm font-medium text-slate-600">Now available for all classes</span>
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-tight mb-6">
                                Make Learning <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Addictive</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
                                The ultimate gamified platform where students level up their knowledge, compete on leaderboards, and master subjects through interactive challenges.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 group">
                                    Start Learning Free
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>
                                <Link to="/about" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center">
                                    View Demo
                                </Link>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-8 text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span>Free for Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-500" />
                                    <span>Gamified Quizzes</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative hidden lg:block will-change-transform"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-20 blur-2xl animate-pulse"></div>
                            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                                {/* Mock UI Card */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Physics Master</h3>
                                        <p className="text-slate-500 text-sm">Chapter 4: Thermodynamics</p>
                                    </div>
                                    <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">
                                        Level 5
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-24 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                                        Interactive Simulation
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-10 bg-primary-600 rounded-lg"></div>
                                        <div className="flex-1 h-10 bg-slate-100 rounded-lg"></div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-slate-500">+124 Students learning</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center"
                            >
                                <Trophy className="text-yellow-500 w-8 h-8 mb-1" />
                                <span className="font-bold text-xs">Top 1%</span>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {STATS_DATA.map((stat, idx) => (
                            <div key={idx}>
                                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
                                <div className="text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Students Love Edu Nexus</h2>
                        <p className="text-lg text-slate-600">We've combined the best learning techniques with game mechanics to keep you engaged and motivated.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURES_DATA.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                            >
                                <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        {/* CSS Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                        }}></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
                            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Join thousands of students who are already mastering their subjects with Edu Nexus.</p>
                            <Link to="/register" className="inline-block bg-white text-primary-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold">E</div>
                            <span className="font-display font-bold text-xl text-slate-800">Edu Nexus</span>
                        </div>
                        <div className="flex gap-8 text-slate-500 text-sm">
                            <a href="#" className="hover:text-primary-600">Privacy Policy</a>
                            <a href="#" className="hover:text-primary-600">Terms of Service</a>
                            <a href="#" className="hover:text-primary-600">Contact Support</a>
                        </div>
                        <div className="mt-4 md:mt-0 text-slate-400 text-sm">
                            © 2026 Edu Nexus. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
});

export default Landing;
