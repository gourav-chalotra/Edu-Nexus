import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-nexus';
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Subject.deleteMany({});
        await Chapter.deleteMany({});
        await Quiz.deleteMany({});
        await Progress.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create Users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@edu.nexus',
                password: 'password123',
                role: 'admin',
                avatar: 'Felix',
                xp: 0,
                level: 1
            },
            {
                name: 'Demo Teacher',
                email: 'teacher@demo.com',
                password: 'password123',
                role: 'teacher',
                avatar: 'Felix'
            },
            {
                name: 'Demo Student',
                email: 'student@demo.com',
                password: 'password123',
                role: 'student',
                avatar: 'Felix',
                classLevel: '10',
                xp: 1500,
                level: 2,
                streak: 5
            },
            {
                name: 'John Doe',
                email: 'john@demo.com',
                password: 'password123',
                role: 'student',
                avatar: 'Callie',
                classLevel: '10',
                xp: 3200,
                level: 4,
                streak: 8
            },
            {
                name: 'Jane Smith',
                email: 'jane@demo.com',
                password: 'password123',
                role: 'student',
                avatar: 'Snuggles',
                classLevel: '11',
                xp: 2800,
                level: 3,
                streak: 3
            },
            {
                name: 'Mike Johnson',
                email: 'mike@demo.com',
                password: 'password123',
                role: 'student',
                avatar: 'Bandit',
                classLevel: '9',
                xp: 2200,
                level: 3,
                streak: 2
            }
        ]);
        console.log('✅ Created users');

        // Create Subjects
        const subjects = await Subject.create([
            {
                id: 'math_10',
                title: 'Mathematics',
                description: 'High school mathematics covering algebra, geometry, and trigonometry',
                icon: '📐',
                class: 'Class 10'
            },
            {
                id: 'phy_10',
                title: 'Physics',
                description: 'Classical mechanics, thermodynamics, and waves',
                icon: '⚛️',
                class: 'Class 10'
            },
            {
                id: 'chem_10',
                title: 'Chemistry',
                description: 'Atomic structure, chemical bonds, and reactions',
                icon: '🧪',
                class: 'Class 10'
            },
            {
                id: 'bio_10',
                title: 'Biology',
                description: 'Cell biology, genetics, and ecology',
                icon: '🧬',
                class: 'Class 10'
            },
            {
                id: 'eng_10',
                title: 'English',
                description: 'Literature, grammar, and communication',
                icon: '📚',
                class: 'Class 10'
            }
        ]);
        console.log('✅ Created subjects');

        // Create Chapters
        const chapters = await Chapter.create([
            {
                id: 'ch_math_10_1',
                subjectId: 'math_10',
                title: 'Chapter 1: Real Numbers',
                description: 'Understanding real numbers, their properties, and operations',
                topics: ['Natural Numbers', 'Whole Numbers', 'Integers', 'Rational Numbers', 'Irrational Numbers'],
                content: {
                    type: 'text',
                    body: '## Real Numbers\n\nReal numbers consist of rational and irrational numbers.\n\n### Key Concepts\n- **Rational Numbers**: Numbers that can be expressed as p/q\n- **Irrational Numbers**: Numbers that cannot be expressed as fractions\n- **Properties**: Closure, Commutativity, Associativity, Distributivity'
                },
                teacherNote: 'Make sure students understand the difference between rational and irrational numbers.',
                order: 1,
                isPublished: true
            },
            {
                id: 'ch_phy_10_1',
                subjectId: 'phy_10',
                title: 'Chapter 1: Motion in One Dimension',
                description: 'Understanding kinematics and equations of motion',
                topics: ['Displacement', 'Velocity', 'Acceleration', 'Equations of Motion'],
                content: {
                    type: 'text',
                    body: '## Motion in One Dimension\n\n### Definitions\n- **Displacement**: Change in position\n- **Velocity**: Rate of change of displacement\n- **Acceleration**: Rate of change of velocity'
                },
                teacherNote: 'Emphasize the difference between scalar and vector quantities.',
                order: 1,
                isPublished: true
            },
            {
                id: 'ch_chem_10_1',
                subjectId: 'chem_10',
                title: 'Chapter 1: Atomic Structure',
                description: 'Exploring atoms, electrons, and atomic models',
                topics: ['Rutherford Model', 'Bohr Model', 'Electron Configuration', 'Quantum Numbers'],
                content: {
                    type: 'text',
                    body: '## Atomic Structure\n\n### Key Models\n- **Rutherford Model**: Nucleus at center with electrons orbiting\n- **Bohr Model**: Electrons in fixed energy levels\n- **Quantum Model**: Modern understanding'
                },
                order: 1,
                isPublished: true
            },
            {
                id: 'ch_bio_10_1',
                subjectId: 'bio_10',
                title: 'Chapter 1: Cell - The Unit of Life',
                description: 'Understanding cell structure and function',
                topics: ['Prokaryotic Cells', 'Eukaryotic Cells', 'Cell Organelles', 'Cell Membrane'],
                content: {
                    type: 'text',
                    body: '## Cell - The Unit of Life\n\n### Types of Cells\n- **Prokaryotic**: No membrane-bound nucleus\n- **Eukaryotic**: Has membrane-bound nucleus'
                },
                order: 1,
                isPublished: true
            },
            {
                id: 'ch_eng_10_1',
                subjectId: 'eng_10',
                title: 'Chapter 1: The First Flight',
                description: 'Short story about triumph and determination',
                topics: ['Character Analysis', 'Plot Development', 'Themes', 'Literary Devices'],
                content: {
                    type: 'text',
                    body: '## The First Flight\n\n### Summary\nA story about overcoming fear and self-doubt.\n\n### Main Themes\n- Fear and courage\n- Self-belief\n- Practice and determination'
                },
                order: 1,
                isPublished: true
            }
        ]);
        console.log('✅ Created chapters');

        // Create Quizzes
        await Quiz.create([
            {
                subjectId: 'math_10',
                chapterId: 'ch_math_10_1',
                title: 'Quiz: Real Numbers',
                questions: [
                    { id: 1, type: 'mcq', question: 'Which is irrational?', options: ['2/3', 'π', '5', '0.5'], correctAnswer: 'π', points: 100 },
                    { id: 2, type: 'mcq', question: 'Commutative property?', options: ['Associative', 'Commutative', 'Distributive', 'Closure'], correctAnswer: 'Commutative', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 60,
                isActive: true
            },
            {
                subjectId: 'phy_10',
                chapterId: 'ch_phy_10_1',
                title: 'Quiz: Motion',
                questions: [
                    { id: 1, type: 'mcq', question: 'Vector quantity?', options: ['Speed', 'Distance', 'Displacement', 'Mass'], correctAnswer: 'Displacement', points: 100 },
                    { id: 2, type: 'mcq', question: 'Velocity-time graph slope?', options: ['Displacement', 'Acceleration', 'Speed', 'Distance'], correctAnswer: 'Acceleration', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 60,
                isActive: true
            },
            {
                subjectId: 'chem_10',
                chapterId: 'ch_chem_10_1',
                title: 'Quiz: Atomic Structure',
                questions: [
                    { id: 1, type: 'mcq', question: 'Rutherford model proposer?', options: ['Bohr', 'Rutherford', 'Thomson', 'Dalton'], correctAnswer: 'Rutherford', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 60,
                isActive: true
            },
            {
                subjectId: 'bio_10',
                chapterId: 'ch_bio_10_1',
                title: 'Quiz: Cell Structure',
                questions: [
                    { id: 1, type: 'mcq', question: 'Powerhouse of cell?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'ER'], correctAnswer: 'Mitochondria', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 60,
                isActive: true
            }
        ]);
        console.log('✅ Created quizzes');

        // Assign subjects to teacher
        users[1].assignedSubjects = [subjects[0]._id, subjects[1]._id];
        await users[1].save();

        // Create progress for students
        await Progress.create([
            {
                userId: users[2]._id,
                subjectId: 'math_10',
                chapterId: 'ch_math_10_1',
                status: 'completed',
                progress: 100,
                videoWatched: true,
                quizCompleted: true
            },
            {
                userId: users[3]._id,
                subjectId: 'phy_10',
                chapterId: 'ch_phy_10_1',
                status: 'completed',
                progress: 100,
                videoWatched: true,
                quizCompleted: true
            }
        ]);
        console.log('✅ Created progress');

        console.log('🎉 Database seeded successfully!');
        console.log('\n📧 Test Credentials:');
        console.log('Admin: admin@edu.nexus / password123');
        console.log('Teacher: teacher@demo.com / password123');
        console.log('Student: student@demo.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
            await User.create({
                name: 'Demo Admin',
                email: 'admin@demo.com',
                password: 'password123',
                role: 'admin'
            });
            console.log('✅ Created demo admin');
        }

        // Create subjects
        const subjects = [
            { id: 'physics', title: 'Physics', description: 'Explore the fundamental laws of the universe.', icon: '⚛️' },
            { id: 'mathematics', title: 'Mathematics', description: 'The language of numbers, structure, space, and change.', icon: '📐' },
            { id: 'chemistry', title: 'Chemistry', description: 'The study of matter and its interactions.', icon: '🧪' },
            { id: 'biology', title: 'Biology', description: 'The study of life and living organisms.', icon: '🧬' },
            { id: 'computer', title: 'Computer Science', description: 'Computation, information, and automation.', icon: '💻' },
            { id: 'english', title: 'English', description: 'Literature, grammar, and communication skills.', icon: '📚' }
        ];

        await Subject.insertMany(subjects);
        console.log('✅ Created subjects');

        // Create chapters for Physics
        const physicsChapters = [
            {
                id: 'kinematics',
                subjectId: 'physics',
                title: 'Chapter 1: Kinematics',
                description: 'Motion in a straight line, vectors, and projectile motion.',
                topics: ['Velocity & Speed', 'Acceleration', 'Projectile Motion'],
                content: {
                    type: 'text',
                    body: `## Introduction to Kinematics\n\nKinematics is the branch of mechanics that describes the motion of points, bodies (objects), and systems of bodies (groups of objects) without considering the forces that cause them to move.\n\n### Key Concepts\n\n- **Displacement**: Change in position of an object.\n- **Velocity**: Rate of change of displacement.\n- **Acceleration**: Rate of change of velocity.\n\n### Equations of Motion\n\n1. v = u + at\n2. s = ut + (1/2)at²\n3. v² = u² + 2as\n\nWhere:\n- u = initial velocity\n- v = final velocity\n- a = acceleration\n- t = time\n- s = displacement`
                },
                teacherNote: 'Focus on the equations of motion. They are crucial for solving projectile motion problems!',
                order: 1
            },
            {
                id: 'laws-of-motion',
                subjectId: 'physics',
                title: 'Chapter 2: Laws of Motion',
                description: 'Newton\'s three laws and their applications.',
                topics: ['First Law', 'Second Law', 'Third Law', 'Free Body Diagrams'],
                content: {
                    type: 'text',
                    body: `## Newton's Laws of Motion\n\n### First Law (Law of Inertia)\nAn object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.\n\n### Second Law\nF = ma\nThe acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n\n### Third Law\nFor every action, there is an equal and opposite reaction.`
                },
                teacherNote: 'Practice drawing free body diagrams for different scenarios.',
                order: 2
            }
        ];

        await Chapter.insertMany(physicsChapters);
        console.log('✅ Created Physics chapters');

        // Create quiz for Kinematics
        const kinematicsQuiz = {
            subjectId: 'physics',
            chapterId: 'kinematics',
            title: 'Kinematics Basics Quiz',
            description: 'Test your understanding of motion and kinematics',
            questions: [
                {
                    id: 1,
                    type: 'mcq',
                    question: 'Which of the following is a vector quantity?',
                    options: ['Speed', 'Distance', 'Displacement', 'Mass'],
                    correctAnswer: 'Displacement',
                    points: 100,
                    explanation: 'Displacement has both magnitude and direction, making it a vector quantity.'
                },
                {
                    id: 2,
                    type: 'mcq',
                    question: 'The slope of a velocity-time graph represents:',
                    options: ['Displacement', 'Acceleration', 'Speed', 'Distance'],
                    correctAnswer: 'Acceleration',
                    points: 100,
                    explanation: 'The rate of change of velocity is acceleration.'
                },
                {
                    id: 3,
                    type: 'fill-in',
                    question: 'The rate of change of displacement is called ______.',
                    correctAnswer: 'velocity',
                    points: 150,
                    explanation: 'Velocity is defined as the rate of change of displacement with respect to time.'
                },
                {
                    id: 4,
                    type: 'mcq',
                    question: 'A car accelerates from rest to 20 m/s in 4 seconds. What is its acceleration?',
                    options: ['5 m/s²', '10 m/s²', '20 m/s²', '80 m/s²'],
                    correctAnswer: '5 m/s²',
                    points: 150,
                    explanation: 'Using v = u + at, where u=0, v=20, t=4: a = (v-u)/t = 20/4 = 5 m/s²'
                }
            ],
            timeLimit: 30,
            passingScore: 60
        };

        await Quiz.create(kinematicsQuiz);
        console.log('✅ Created Kinematics quiz');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Demo Credentials:');
        console.log('Student: student@demo.com / password123');
        console.log('Teacher: teacher@demo.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

