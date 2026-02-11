import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCurriculum } from '../../context/CurriculumContext';
import { userAPI } from '../../services/api';
import { Upload, FileText, CheckCircle, X, Youtube, Plus, Edit3, Trash2, Image as ImageIcon, Users, BookOpen, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const {
        curriculum,
        updateChapterVideo,
        addChapterAttachment,
        updateTeacherNote,
        addChapter,
        updateChapterDetails,
        addQuiz
    } = useCurriculum();

    // Filter subjects assigned to this teacher
    // In a real app, this would be filtered by the backend or context.
    // For this mock, we'll check user.assignedSubjects or show all if none (fallback)
    const allSubjects = Object.values(curriculum);
    const subjects = user.assignedSubjects
        ? allSubjects.filter(s => user.assignedSubjects.includes(s.id))
        : allSubjects;

    const [activeTab, setActiveTab] = useState('content'); // 'content' | 'performance'
    const [students, setStudents] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [modalMode, setModalMode] = useState('notes');

    // Selection States
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');

    // Form States
    const [videoUrl, setVideoUrl] = useState('');
    const [attachmentName, setAttachmentName] = useState('');
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [quizTitle, setQuizTitle] = useState('');
    const [teacherNote, setTeacherNote] = useState('');

    // Quiz Builder State
    const [questions, setQuestions] = useState([]);

    // Chapter Detail States
    const [chapterTitle, setChapterTitle] = useState('');
    const [chapterDesc, setChapterDesc] = useState('');
    const [chapterTopics, setChapterTopics] = useState('');

    const fileInputRef = useRef(null);

    // Initialize selection
    useEffect(() => {
        if (!selectedSubjectId && subjects.length > 0) {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    useEffect(() => {
        if (selectedSubjectId) {
            const subject = curriculum[selectedSubjectId];
            if (subject && subject.chapters.length > 0) {
                const isValid = subject.chapters.some(ch => ch.id === selectedChapterId);
                if (!isValid) {
                    setSelectedChapterId(subject.chapters[0].id);
                }
            } else {
                setSelectedChapterId('');
            }
        }
    }, [selectedSubjectId, curriculum, selectedChapterId]);

    // Fetch students for performance view
    useEffect(() => {
        if (activeTab === 'performance') {
            const fetchStudents = async () => {
                try {
                    const res = await userAPI.getAllStudents();
                    setStudents(res.data.data);
                } catch (error) {
                    console.error("Failed to fetch students", error);
                }
            };
            fetchStudents();
        }
    }, [activeTab]);

    const openModal = (mode) => {
        setModalMode(mode);
        setShowUploadModal(true);

        const chapter = getSelectedChapter();

        if (mode === 'teacher_note') {
            setTeacherNote(chapter?.teacherNote || '');
        } else if (mode === 'edit_chapter') {
            if (chapter) {
                setChapterTitle(chapter.title);
                setChapterDesc(chapter.description);
                setChapterTopics(chapter.topics?.join('\n') || '');
            }
        } else if (mode === 'create_chapter') {
            setChapterTitle('');
            setChapterDesc('');
            setChapterTopics('');
        } else if (mode === 'quiz') {
            setQuizTitle(chapter ? `${chapter.title} Quiz` : '');
            setQuestions([
                { id: 1, type: 'mcq', question: '', options: ['', '', '', ''], correctAnswer: '', points: 100, image: null }
            ]);
        }
    };

    const getSelectedChapter = () => {
        return curriculum[selectedSubjectId]?.chapters.find(ch => ch.id === selectedChapterId);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachmentFile(e.target.files[0]);
            if (!attachmentName) {
                setAttachmentName(e.target.files[0].name);
            }
        }
    };

    // Quiz Builder Functions
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                type: 'mcq',
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                points: 100,
                image: null
            }
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleQuestionImageUpload = async (e, qIndex) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateQuestion(qIndex, 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubjectId) {
            toast.error('Please select a subject');
            return;
        }

        if (modalMode !== 'create_chapter' && !selectedChapterId) {
            toast.error('Please select a chapter');
            return;
        }

        try {
            if (modalMode === 'video') {
                let finalUrl = videoUrl;
                if (videoUrl.includes('watch?v=')) {
                    finalUrl = videoUrl.replace('watch?v=', 'embed/');
                } else if (videoUrl.includes('youtu.be/')) {
                    finalUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
                }
                updateChapterVideo(selectedSubjectId, selectedChapterId, finalUrl);
                toast.success('Video lesson updated!');
            }
            else if (modalMode === 'notes') {
                if (!attachmentFile) {
                    toast.error('Please select a file to upload');
                    return;
                }
                const newAttachment = {
                    id: Date.now().toString(),
                    name: attachmentName,
                    type: attachmentFile.name.split('.').pop().toUpperCase(),
                    url: '#'
                };
                addChapterAttachment(selectedSubjectId, selectedChapterId, newAttachment);
                toast.success('Attachment added!');
                setAttachmentFile(null);
            }
            else if (modalMode === 'teacher_note') {
                updateTeacherNote(selectedSubjectId, selectedChapterId, teacherNote);
                toast.success('Teacher note updated!');
            }
            else if (modalMode === 'create_chapter') {
                const newChapter = {
                    title: chapterTitle,
                    description: chapterDesc,
                    topics: chapterTopics.split('\n').filter(t => t.trim() !== '')
                };
                addChapter(selectedSubjectId, newChapter);
                toast.success('New chapter created!');
            }
            else if (modalMode === 'edit_chapter') {
                const updates = {
                    title: chapterTitle,
                    description: chapterDesc,
                    topics: chapterTopics.split('\n').filter(t => t.trim() !== '')
                };
                updateChapterDetails(selectedSubjectId, selectedChapterId, updates);
                toast.success('Chapter details updated!');
            }
            else if (modalMode === 'quiz') {
                if (questions.length === 0) {
                    toast.error('Please add at least one question');
                    return;
                }

                // Validate questions
                for (let i = 0; i < questions.length; i++) {
                    const q = questions[i];
                    if (!q.question.trim()) {
                        toast.error(`Question ${i + 1} is empty`);
                        return;
                    }
                    if (!q.correctAnswer.trim()) {
                        toast.error(`Question ${i + 1} needs a correct answer`);
                        return;
                    }
                    if (q.type === 'mcq' && q.options.some(o => !o.trim())) {
                        toast.error(`All options for Question ${i + 1} must be filled`);
                        return;
                    }
                }

                const newQuiz = {
                    id: Date.now().toString(),
                    title: quizTitle,
                    questions: questions.map((q, i) => ({
                        id: i + 1,
                        type: q.type,
                        question: q.question,
                        options: q.type === 'mcq' ? q.options : [],
                        correctAnswer: q.correctAnswer,
                        points: parseInt(q.points) || 100,
                        image: q.image
                    }))
                };

                addQuiz(selectedSubjectId, selectedChapterId, newQuiz);
                toast.success('Quiz created successfully!');
                setShowUploadModal(false);
            }

            if (modalMode !== 'quiz') {
                setShowUploadModal(false);
            }
            setVideoUrl('');
            setAttachmentName('');
            setQuizTitle('');

        } catch (error) {
            console.error(error);
            toast.error('Failed to update content');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-bold text-xl">
                            {user?.name?.charAt(0) || 'T'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
                            <p className="text-slate-500 text-sm">Welcome back, {user?.name}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === 'content'
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-slate-600 border-transparent hover:text-slate-800'
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Content Management
                    </button>
                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === 'performance'
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-slate-600 border-transparent hover:text-slate-800'
                            }`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        Student Performance
                    </button>
                </div>

                {/* Content Management Tab */}
                {activeTab === 'content' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">Manage Curriculum</h2>
                                <div className="text-sm text-slate-500">
                                    Assigned Subjects: {subjects.length}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={() => openModal('create_chapter')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group border-dashed border-2 border-slate-300 bg-slate-50">
                                    <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-sm"><Plus className="text-slate-600" /></div>
                                    <h3 className="font-bold text-slate-700">Add New Chapter</h3>
                                    <p className="text-sm text-slate-500 mt-1">Create a new unit for {curriculum[selectedSubjectId]?.name || 'a subject'}</p>
                                </button>

                                <button onClick={() => openModal('edit_chapter')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group">
                                    <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors"><Edit3 className="text-orange-600" /></div>
                                    <h3 className="font-bold text-slate-700">Edit Details</h3>
                                    <p className="text-sm text-slate-500 mt-1">Update title & topics</p>
                                </button>

                                <button onClick={() => openModal('video')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group">
                                    <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors"><Youtube className="text-red-600" /></div>
                                    <h3 className="font-bold text-slate-700">Update Video</h3>
                                    <p className="text-sm text-slate-500 mt-1">Add YouTube links</p>
                                </button>

                                <button onClick={() => openModal('teacher_note')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group">
                                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors"><FileText className="text-blue-600" /></div>
                                    <h3 className="font-bold text-slate-700">Teacher's Note</h3>
                                    <p className="text-sm text-slate-500 mt-1">Add tips for students</p>
                                </button>

                                <button onClick={() => openModal('quiz')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group">
                                    <div className="bg-secondary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary-100 transition-colors"><Upload className="text-secondary-600" /></div>
                                    <h3 className="font-bold text-slate-700">Create Quiz</h3>
                                    <p className="text-sm text-slate-500 mt-1">MCQ & Fill-in Builder</p>
                                </button>

                                <button onClick={() => openModal('notes')} className="card hover:shadow-md transition-all hover:-translate-y-1 text-left group">
                                    <div className="bg-primary-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors"><Upload className="text-primary-600" /></div>
                                    <h3 className="font-bold text-slate-700">Upload Attachment</h3>
                                    <p className="text-sm text-slate-500 mt-1">Share PDFs or docs</p>
                                </button>
                            </div>
                        </div>

                        {/* Context Sidebar */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Current Selection
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                                    <div className="font-medium text-slate-800 mt-1">
                                        {curriculum[selectedSubjectId]?.name || 'Loading...'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Chapter</label>
                                    <div className="font-medium text-slate-800 mt-1">
                                        {getSelectedChapter()?.title || 'No Chapters Created'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                    <div className="mt-1 flex gap-2">
                                        {getSelectedChapter()?.content?.videoUrl ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Video Active</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">No Video</span>
                                        )}
                                        {getSelectedChapter()?.quiz ? (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Quiz Ready</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">No Quiz</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800">Student Progress Report</h2>
                            <p className="text-slate-500 text-sm">Overview of student performance in your subjects</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-600 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">Student</th>
                                        <th className="p-4 font-medium">Level</th>
                                        <th className="p-4 font-medium">Total XP</th>
                                        <th className="p-4 font-medium">Performance (Est.)</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{student.avatar || '🎓'}</span>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                                    Lvl {student.level || 1}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-indigo-600">{student.xp || 0} XP</td>
                                            <td className="p-4">
                                                {/* Mock performance indicator */}
                                                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-green-500 h-full"
                                                        style={{ width: `${Math.min(((student.xp || 0) / 2000) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-indigo-600 hover:underline">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400">
                                                No students found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`bg-white rounded-2xl shadow-2xl w-full ${modalMode === 'quiz' ? 'max-w-4xl' : 'max-w-lg'} overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200`}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800 capitalize">
                                {modalMode === 'quiz' ? 'Create Quiz' : modalMode.replace('_', ' ')}
                            </h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Subject & Chapter Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={selectedSubjectId}
                                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    >
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>{subject.name || subject.title}</option>
                                        ))}
                                    </select>
                                </div>

                                {modalMode !== 'create_chapter' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Chapter</label>
                                        <select
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={selectedChapterId}
                                            onChange={(e) => setSelectedChapterId(e.target.value)}
                                        >
                                            {curriculum[selectedSubjectId]?.chapters.map(chapter => (
                                                <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Standard Modes */}
                            {(modalMode === 'create_chapter' || modalMode === 'edit_chapter') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Title</label>
                                        <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="e.g. Chapter 4: Optics" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" placeholder="Overview..." value={chapterDesc} onChange={(e) => setChapterDesc(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Topics (One per line)</label>
                                        <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" rows="4" placeholder="Topic 1&#10;Topic 2" value={chapterTopics} onChange={(e) => setChapterTopics(e.target.value)} />
                                    </div>
                                </>
                            )}

                            {modalMode === 'teacher_note' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Note for Students</label>
                                    <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50/50" rows="4" placeholder="Add important tips..." value={teacherNote} onChange={(e) => setTeacherNote(e.target.value)} />
                                </div>
                            )}

                            {modalMode === 'video' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">YouTube Video Link</label>
                                    <div className="relative">
                                        <Youtube className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input type="text" className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="YouTube URL..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
                                    </div>
                                </div>
                            )}

                            {modalMode === 'notes' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Attachment Title</label>
                                        <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500" value={attachmentName} onChange={(e) => setAttachmentName(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-500">{attachmentFile ? attachmentFile.name : "Click to select file"}</p>
                                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Quiz Builder UI */}
                            {modalMode === 'quiz' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                                            value={quizTitle}
                                            onChange={(e) => setQuizTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {questions.map((q, qIndex) => (
                                            <div key={qIndex} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Question Type</label>
                                                        <select
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            value={q.type}
                                                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                                        >
                                                            <option value="mcq">Multiple Choice</option>
                                                            <option value="fill-in">Fill in the Blanks</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Points</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                            value={q.points}
                                                            onChange={(e) => updateQuestion(qIndex, 'points', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                                                    <textarea
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                                                        rows="2"
                                                        value={q.question}
                                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                                        placeholder="Enter question here..."
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                                        <ImageIcon size={16} /> Optional Figure (Image)
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100 cursor-pointer"
                                                        onChange={(e) => handleQuestionImageUpload(e, qIndex)}
                                                    />
                                                    {q.image && (
                                                        <img src={q.image} alt="Question Figure" className="mt-2 h-20 object-contain rounded border border-slate-200" />
                                                    )}
                                                </div>

                                                {q.type === 'mcq' && (
                                                    <div className="space-y-2 mb-4">
                                                        <label className="block text-sm font-medium text-slate-700">Options</label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {q.options.map((opt, oIndex) => (
                                                                <input
                                                                    key={oIndex}
                                                                    type="text"
                                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                                                    placeholder={`Option ${oIndex + 1}`}
                                                                    value={opt}
                                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder={q.type === 'mcq' ? "Must match one option exactly" : "Correct word/phrase"}
                                                        value={q.correctAnswer}
                                                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-secondary-500 hover:text-secondary-600 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={20} /> Add Question
                                    </button>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {modalMode === 'quiz' ? 'Create Quiz' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
