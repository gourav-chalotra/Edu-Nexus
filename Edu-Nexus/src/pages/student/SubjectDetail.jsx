import { useParams, useNavigate, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useCurriculum } from '../../context/CurriculumContext';
import { ArrowLeft, BookOpen, PlayCircle } from 'lucide-react';

const SubjectDetail = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const { curriculum } = useCurriculum();
    const subject = curriculum[subjectId];

    if (!subject) {
        return <div className="p-8 text-center">Subject not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span>{subject.icon}</span> {subject.title}
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <p className="text-slate-600 text-lg">{subject.description}</p>
                </div>

                <h2 className="text-lg font-bold text-slate-800 mb-4">Chapters & Topics</h2>

                <div className="space-y-4">
                    {subject.chapters.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{chapter.title}</h3>
                                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{chapter.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-slate-600">{chapter.progress}%</div>
                                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${chapter.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {chapter.topics.map(topic => (
                                        <span key={topic} className="bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded border border-slate-200">
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 border-t border-slate-100 pt-4">
                                    <Link
                                        to={`/learn/${subjectId}/${chapter.id}`}
                                        className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                                    >
                                        <BookOpen size={18} />
                                        Start Learning
                                    </Link>
                                    <Link
                                        to={`/quiz/${subjectId}/${chapter.id}`}
                                        className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-lg flex items-center justify-center gap-2 py-2.5 font-medium text-sm transition-colors"
                                    >
                                        <PlayCircle size={18} className="text-secondary-500" />
                                        Take Test
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SubjectDetail;
