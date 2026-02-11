import { useParams, Link } from 'react-router-dom';
import { useCurriculum } from '../../context/CurriculumContext';
import { ArrowLeft, CheckCircle, PlayCircle, Download, FileText } from 'lucide-react';

const LearningView = () => {
    const { subjectId, chapterId } = useParams();
    // const navigate = useNavigate();
    const { curriculum } = useCurriculum();

    const subject = curriculum[subjectId];
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    if (!chapter) return <div className="p-8 text-center text-slate-500">Chapter not found</div>;

    const hasVideo = chapter.content?.videoUrl && chapter.content.videoUrl !== '';
    const attachments = chapter.attachments || [];

    const getEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link to={`/subject/${subjectId}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-slate-800 text-sm md:text-base">{chapter.title}</h1>
                        <p className="text-xs text-slate-500">{subject.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to={`/quiz/${subjectId}/${chapterId}`}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 font-medium text-sm transition-colors"
                    >
                        <PlayCircle size={16} />
                        Take Quiz
                    </Link>
                    <button className="btn-primary text-sm px-4 py-2">
                        Mark Complete
                    </button>
                </div>
            </header>

            <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden group shadow-lg">
                        {hasVideo ? (
                            <iframe
                                src={getEmbedUrl(chapter.content.videoUrl)}
                                title={chapter.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500">
                                <PlayCircle size={64} className="opacity-50 mb-4" />
                                <span className="text-white font-medium">No Video Lesson Available</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-slate-700 leading-relaxed">{chapter.description}</p>
                    </div>

                    {/* Text Content */}
                    <div className="prose prose-slate max-w-none">
                        {chapter.content.body.split('\n').map((line, i) => {
                            if (line.trim().startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                            if (line.trim().startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                            if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                            return <p key={i} className="mb-4 text-slate-700 leading-relaxed">{line}</p>;
                        })}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Attachments Section - NEW */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Download size={18} className="text-primary-500" />
                            Resources
                        </h3>
                        {attachments.length > 0 ? (
                            <ul className="space-y-3">
                                {attachments.map((file, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={file.url}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                                        >
                                            <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white text-slate-500 group-hover:text-primary-500 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700">{file.name}</p>
                                                <p className="text-[10px] text-slate-400 upper">{file.type || 'PDF'}</p>
                                            </div>
                                            <Download size={16} className="text-slate-400 group-hover:text-primary-600" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No attachments for this chapter.</p>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">Topics Covered</h3>
                        <ul className="space-y-3">
                            {chapter.topics.map((topic, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                    <CheckCircle size={16} className="text-green-500" />
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Teacher's Note</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            "Remember to watch the video carefully before attempting the quiz!"
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                            <span className="text-xs font-bold text-blue-900">Mr. Sharma</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningView;
