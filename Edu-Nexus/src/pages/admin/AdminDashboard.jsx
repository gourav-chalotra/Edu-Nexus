import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, subjectAPI } from '../../services/api';
import {
    Users,
    GraduationCap,
    BookOpen,
    Trash2,
    Plus,
    Search,
    BarChart2,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterClass, setFilterClass] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterSearch, setFilterSearch] = useState('');

    // Add Teacher Form State
    const [showAddTeacher, setShowAddTeacher] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: 'password123' });

    // Assign Subject Modal
    const [assigningTeacher, setAssigningTeacher] = useState(null);

    // Performance Modal
    const [viewingStudent, setViewingStudent] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [teachersRes, studentsRes, subjectsRes] = await Promise.all([
                userAPI.getAllTeachers(),
                userAPI.getAllStudents(),
                subjectAPI.getAll()
            ]);
            setTeachers(teachersRes.data.data);
            setStudents(studentsRes.data.data);
            setSubjects(subjectsRes.data.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await userAPI.createTeacher(newTeacher);
            toast.success('Teacher created successfully');
            setShowAddTeacher(false);
            setNewTeacher({ name: '', email: '', password: 'password123' });
            fetchData();
        } catch (error) {
            toast.error('Failed to create teacher');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userAPI.deleteUser(id);
            toast.success('User deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const toggleSubjectAssignment = async (teacherId, subjectId, isAssigned) => {
        try {
            if (isAssigned) {
                await subjectAPI.unassignTeacher(teacherId, subjectId);
                toast.success('Subject unassigned');
            } else {
                await subjectAPI.assignTeacher(teacherId, subjectId);
                toast.success('Subject assigned');
            }
            fetchData(); // Refresh to show updated assignments
        } catch (error) {
            toast.error('Failed to update assignment');
        }
    };

    const getFilteredStudents = () => {
        return students.filter(student => {
            const matchesClass = filterClass ? (student.classLevel && student.classLevel.toString() === filterClass.toString()) : true;
            const matchesSearch = student.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
                student.email.toLowerCase().includes(filterSearch.toLowerCase());
            // Note: Subject filter currently just checks if the student is in a class that would take this subject, 
            // since we don't track individual subject enrollments in this simple mock.
            // But we can filter by the implicit class of the subject if needed.
            // For now, let's keep it simple: matchesClass && matchesSearch.
            // If the user selects "Physics", we assume they want to see students who study Physics.
            // In our system, all students study all subjects of their class. 
            // So if a subject is from Class 10, technically only Class 10 students study it.
            // We can check if the subject exists for the student's class.

            let matchesSubject = true;
            if (filterSubject) {
                // Find which classes have this subject
                const relevantSubjects = subjects.filter(s => s.name === filterSubject);
                const relevantClasses = relevantSubjects.map(s => s.classLevel);
                if (relevantClasses.length > 0) {
                    matchesSubject = relevantClasses.includes(student.classLevel);
                }
            }

            return matchesClass && matchesSearch && matchesSubject;
        });
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading Admin Console...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Users className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
                        <p className="text-sm text-slate-500">Manage your institution</p>
                    </div>
                </div>
                <button onClick={logout} className="text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                    Logout
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-medium text-sm">Total Students</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{students.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-medium text-sm">Total Teachers</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{teachers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-medium text-sm">Active Subjects</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{subjects.length}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'teachers'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Manage Teachers
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'students'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Student Performance
                    </button>
                </div>

                <div className="p-6">
                    {/* TEACHERS TAB */}
                    {activeTab === 'teachers' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Teacher Directory</h2>
                                <button
                                    onClick={() => setShowAddTeacher(true)}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Teacher
                                </button>
                            </div>

                            {showAddTeacher && (
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4">
                                    <form onSubmit={handleCreateTeacher} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={newTeacher.name}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={newTeacher.email}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                            <input
                                                type="text"
                                                required
                                                value={newTeacher.password}
                                                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                                className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="btn-primary">Create</button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddTeacher(false)}
                                                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 font-medium">Name</th>
                                            <th className="p-4 font-medium">Email</th>
                                            <th className="p-4 font-medium">Assigned Subjects</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-100">
                                        {teachers.map(teacher => (
                                            <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">{teacher.name}</td>
                                                <td className="p-4 text-slate-600">{teacher.email}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {teacher.assignedSubjects?.length > 0 ? (
                                                            teacher.assignedSubjects.map(sid => {
                                                                const sub = subjects.find(s => s.id === sid);
                                                                return (
                                                                    <span key={sid} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                                                                        {sub ? sub.name : sid}
                                                                    </span>
                                                                );
                                                            })
                                                        ) : (
                                                            <span className="text-slate-400 italic">No subjects assigned</span>
                                                        )}
                                                        <button
                                                            onClick={() => setAssigningTeacher(teacher)}
                                                            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium underline ml-2"
                                                        >
                                                            Manage
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(teacher.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors p-2"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* STUDENTS TAB */}
                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <h2 className="text-lg font-bold text-slate-800">Student Performance</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Class Filter */}
                                    <select
                                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        onChange={(e) => setFilterClass(e.target.value)}
                                    >
                                        <option value="">All Classes</option>
                                        {[6, 7, 8, 9, 10, 11, 12].map(c => (
                                            <option key={c} value={c}>Class {c}</option>
                                        ))}
                                    </select>

                                    {/* Subject Filter (Dynamic based on available subjects) */}
                                    <select
                                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                    >
                                        <option value="">All Subjects</option>
                                        {/* Unique subjects from loaded subjects list */}
                                        {[...new Set(subjects.map(s => s.name))].map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>

                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            className="pl-9 pr-4 py-2 rounded-lg border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none"
                                            onChange={(e) => setFilterSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 font-medium">Student</th>
                                            <th className="p-4 font-medium">Class</th>
                                            <th className="p-4 font-medium">Level</th>
                                            <th className="p-4 font-medium">
                                                {filterSubject ? `${filterSubject} XP` : 'Total XP'}
                                            </th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-100">
                                        {getFilteredStudents().map(student => (
                                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar || student.name}`} alt="avatar" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900">{student.name}</div>
                                                            <div className="text-xs text-slate-500">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600">
                                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">
                                                        Class {student.classLevel || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                                        Lvl {student.level || 1}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-indigo-600">
                                                    {student.xp || 0} XP
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => setViewingStudent(student)}
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                                                    >
                                                        <BarChart2 className="w-4 h-4" />
                                                        Stats
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {getFilteredStudents().length === 0 && (
                                            <tr>
                                                <td colspan="5" className="p-8 text-center text-slate-400 italic">
                                                    No students found matching filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}

            {/* Assign Subject Modal */}
            {assigningTeacher && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Assign Subjects</h3>
                            <button onClick={() => setAssigningTeacher(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <p className="text-sm text-slate-600 mb-4">Select subjects for <span className="font-bold text-slate-900">{assigningTeacher.name}</span>:</p>
                            <div className="space-y-2">
                                {subjects.map(subject => {
                                    const isAssigned = assigningTeacher.assignedSubjects?.includes(subject.id);
                                    return (
                                        <div
                                            key={subject.id}
                                            onClick={() => toggleSubjectAssignment(assigningTeacher.id, subject.id, isAssigned)}
                                            className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${isAssigned
                                                ? 'bg-indigo-50 border-indigo-200'
                                                : 'bg-white border-slate-200 hover:border-indigo-300'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${isAssigned ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                                                }`}>
                                                {isAssigned && <Users className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className={`font-medium ${isAssigned ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                {subject.name}
                                            </span>
                                            <span className="ml-auto text-xs text-slate-400 uppercase tracking-wider">
                                                {subject.classLevel ? `Class ${subject.classLevel}` : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setAssigningTeacher(null)} className="btn-primary">Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Student Details Modal */}
            {viewingStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">{viewingStudent.avatar || '🎓'}</div>
                                <div>
                                    <h3 className="font-bold text-xl">{viewingStudent.name}</h3>
                                    <p className="text-indigo-200 text-sm">{viewingStudent.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingStudent(null)} className="text-white/80 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-3 gap-4 bg-indigo-50 border-b border-indigo-100">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-indigo-700">{viewingStudent.xp || 0}</div>
                                <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide">Total XP</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-amber-600">{viewingStudent.level || 1}</div>
                                <div className="text-xs text-amber-600 font-bold uppercase tracking-wide">Level</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-600">{viewingStudent.streak || 0} 🔥</div>
                                <div className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Current Streak</div>
                            </div>
                        </div>

                        <div className="p-6 max-h-[50vh] overflow-y-auto">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-600" />
                                Recent Activity
                            </h4>
                            {/* This would be populated by real progress data in a full implementation */}
                            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                Detailed activity logs coming soon via Progress API integration.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
