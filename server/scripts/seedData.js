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
        await mongoose.connect(mongoURI);
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
                email: 'admin@demo.com',
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
                classLevel: 10,
                school: 'Springfield High',
                xp: 1500,
                level: 2,
                streak: 5
            }
        ]);
        console.log('✅ Created users');

        // Create Subjects
        // Create Subjects based on ICSE/ISC Curriculum

        const subjectsData = [
            // --- Classes 6-8 (Middle School) ---
            { title: 'English', icon: '🇬🇧', id: 'eng_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Hindi', icon: '🇮🇳', id: 'hin_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'History, Civics & Geography', icon: '🌍', id: 'sst_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Mathematics', icon: '📐', id: 'math_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Science (Phy, Chem, Bio)', icon: '🔬', id: 'sci_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Computer Applications', icon: '💻', id: 'comp_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Environmental Education', icon: '🌱', id: 'evs_mid', classes: ['6', '7', '8'], stream: null },
            { title: 'Art', icon: '🎨', id: 'art_mid', classes: ['6', '7', '8'], stream: null },

            // --- Classes 9-10 (ICSE Board) ---
            { title: 'English', icon: '🇬🇧', id: 'eng_icse', classes: ['9', '10'], stream: null },
            { title: 'Hindi', icon: '🇮🇳', id: 'hin_icse', classes: ['9', '10'], stream: null },
            { title: 'Social Science', icon: '🌍', id: 'sst_icse', classes: ['9', '10'], stream: null },
            { title: 'Mathematics', icon: '📐', id: 'math_icse', classes: ['9', '10'], stream: null },
            { title: 'Science', icon: '🔬', id: 'sci_icse', classes: ['9', '10'], stream: null }
        ];

        const subjects = await Subject.create(subjectsData.map(s => ({
            ...s,
            description: `Study material and quizzes for ${s.title}`,
        })));
        console.log('✅ Created subjects');

        // Class 10 English Chapters (First Flight & Footprints Without Feet)
        const englishChaptersData = [
            // First Flight
            { id: 'ch_eng_10_1', title: '1. A Letter to God', description: 'Story of Lencho\'s faith in God.', topics: ['Lencho\'s Faith', 'Postmaster\'s Help'], order: 1, videoUrl: 'https://www.youtube.com/embed/2w6r4mWykIE' },
            { id: 'ch_eng_10_2', title: '2. Nelson Mandela: Long Walk to Freedom', description: 'Excerpts from Mandela\'s autobiography.', topics: ['Apartheid', 'Freedom', 'Equality'], order: 2, videoUrl: 'https://www.youtube.com/embed/UXpLYES-n3o' },
            { id: 'ch_eng_10_3', title: 'Poem: A Tiger in the Zoo', description: 'Contrast between tiger in cage and wild.', topics: ['Captivity', 'Freedom'], order: 3, videoUrl: 'https://www.youtube.com/embed/1uiadsWxsXo' },
            { id: 'ch_eng_10_4', title: '3. Two Stories About Flying', description: 'His First Flight & Black Aeroplane.', topics: ['Courage', 'Self-confidence'], order: 4, videoUrl: 'https://www.youtube.com/embed/DCqd00umZ0g' },
            { id: 'ch_eng_10_5', title: 'Poem: How to Tell Wild Animals', description: 'Humorous way to identify wild animals.', topics: ['Wildlife', 'Humour'], order: 5, videoUrl: 'https://www.youtube.com/embed/8YTgFlQ6hKE' },
            { id: 'ch_eng_10_6', title: 'Poem: The Ball Poem', description: 'Understanding the nature of loss.', topics: ['Loss', 'Responsibility'], order: 6, videoUrl: 'https://www.youtube.com/embed/0a9koAPHvoM' },
            { id: 'ch_eng_10_7', title: '4. From the Diary of Anne Frank', description: 'Insights into Anne Frank\'s life.', topics: ['Anne Frank', 'Diary Expression'], order: 7, videoUrl: 'https://www.youtube.com/embed/dN8T8bO-CnI' },
            { id: 'ch_eng_10_8', title: 'Poem: Amanda!', description: 'A child\'s desire for freedom.', topics: ['Parenting', 'Freedom'], order: 8, videoUrl: 'https://www.youtube.com/embed/IE32QU_Lrz8' },
            { id: 'ch_eng_10_9', title: '5. Glimpses of India', description: 'Baker from Goa, Coorg, Tea from Assam.', topics: ['Culture', 'Travel', 'Diversity'], order: 9, videoUrl: 'https://www.youtube.com/embed/Gnyz1754SZ0' },
            { id: 'ch_eng_10_10', title: 'Poem: The Trees', description: 'Symbolism of nature\'s freedom.', topics: ['Nature', 'Growth'], order: 10, videoUrl: 'https://www.youtube.com/embed/VuVEqovwCIA' },
            { id: 'ch_eng_10_11', title: '6. Mijbil the Otter', description: 'Story of a pet otter.', topics: ['Pets', 'Otters'], order: 11, videoUrl: 'https://www.youtube.com/embed/_xY1T-1GYMQ' },
            { id: 'ch_eng_10_12', title: 'Poem: Fog', description: 'Metaphorical description of fog.', topics: ['Nature', 'Metaphor'], order: 12, videoUrl: 'https://www.youtube.com/embed/rM_aPk5G470' },
            { id: 'ch_eng_10_13', title: '7. Madam Rides the Bus', description: 'Valli\'s first bus journey.', topics: ['Curiosity', 'Experience'], order: 13, videoUrl: 'https://www.youtube.com/embed/CXKVT_8z_IA' },
            { id: 'ch_eng_10_14', title: 'Poem: The Tale of Custard the Dragon', description: 'Humorous poem about a dragon.', topics: ['Courage', 'Boasting'], order: 14, videoUrl: 'https://www.youtube.com/embed/h_QwDoVkFtg' },
            { id: 'ch_eng_10_15', title: '8. The Sermon at Benares', description: 'Buddha\'s teaching on death.', topics: ['Buddha', 'Loss', 'Reality'], order: 15, videoUrl: 'https://www.youtube.com/embed/5Np1mMJ_MZk' },
            { id: 'ch_eng_10_16', title: 'Poem: For Anne Gregory', description: 'Inward vs outward beauty.', topics: ['Beauty', 'Love'], order: 16, videoUrl: 'https://www.youtube.com/embed/RTEXF-jq9pY' },
            { id: 'ch_eng_10_17', title: '9. The Proposal', description: 'A one-act play by Chekhov.', topics: ['Marriage', 'Property', 'Comedy'], order: 17, videoUrl: 'https://www.youtube.com/embed/3_B9T9Y5c9c' },
            // Footprints Without Feet
            { id: 'ch_eng_10_18', title: 'FWW 1. A Triumph of Surgery', description: 'Tricki the dog\'s recovery.', topics: ['Pets', 'Overcare'], order: 18, videoUrl: 'https://www.youtube.com/embed/No__c9QTeq8' },
            { id: 'ch_eng_10_19', title: 'FWW 2. The Thief’s Story', description: 'Transformation of a thief.', topics: ['Trust', 'Morality'], order: 19, videoUrl: 'https://www.youtube.com/embed/4sZl3KPBD_A' },
            { id: 'ch_eng_10_20', title: 'FWW 3. The Midnight Visitor', description: 'Ausable the secret agent.', topics: ['Intelligence', 'Espionage'], order: 20, videoUrl: 'https://www.youtube.com/embed/NtND5TsNvQ0' },
            { id: 'ch_eng_10_21', title: 'FWW 4. A Question of Trust', description: 'Horace Danby\'s robbery.', topics: ['Crime', 'Deception'], order: 21, videoUrl: 'https://www.youtube.com/embed/g68_SHwGC-o' },
            { id: 'ch_eng_10_22', title: 'FWW 5. Footprints without Feet', description: 'Griffin the invisible scientist.', topics: ['Science', 'Misuse of Power'], order: 22, videoUrl: 'https://www.youtube.com/embed/oszdnvwDfTQ' },
            { id: 'ch_eng_10_23', title: 'FWW 6. The Making of a Scientist', description: 'Richard Ebright\'s journey.', topics: ['Curiosity', 'Science'], order: 23, videoUrl: 'https://www.youtube.com/embed/q1FbLY15evg' },
            { id: 'ch_eng_10_24', title: 'FWW 7. The Necklace', description: 'Matilda\'s tragic mistake.', topics: ['Greed', 'Illusion', 'Reality'], order: 24, videoUrl: 'https://www.youtube.com/embed/TtZMjKuuF4Q' },
            { id: 'ch_eng_10_25', title: 'FWW 8. Bholi', description: 'Sulekha\'s transformation through education.', topics: ['Education', 'Empowerment'], order: 25, videoUrl: 'https://www.youtube.com/embed/Ekje8q1tk1k' },
            { id: 'ch_eng_10_26', title: 'FWW 9. The Book That Saved the Earth', description: 'Martian invasion and nursery rhymes.', topics: ['Humour', 'Books'], order: 26, videoUrl: 'https://www.youtube.com/embed/Si8uiDGqSrw' }
        ];

        await Promise.all(englishChaptersData.map(ch =>
            Chapter.create({
                ...ch,
                subjectId: 'eng_icse',
                isPublished: true,
                content: {
                    type: ch.videoUrl ? 'video' : 'text',
                    body: ch.description,
                    videoUrl: ch.videoUrl || ''
                }
            })
        ));
        console.log('✅ Created English chapters');

        // Class 10 Maths Chapters
        const mathChaptersData = [
            // ... (keep existing maths data)
            {
                id: 'ch_math_10_1',
                title: 'Unit I: Number Systems - Real Numbers',
                description: 'Fundamental Theorem of Arithmetic, Irrational Numbers.',
                topics: ['Euclid Division Lemma', 'Fundamental Theorem of Arithmetic', 'Irrational Numbers'],
                content: {
                    type: 'video',
                    body: 'Introduction to Real Numbers and their properties.',
                    videoUrl: 'https://www.youtube.com/embed/3KnwD1dolBo'
                },
                order: 1
            },
            {
                id: 'ch_math_10_2',
                title: 'Unit II: Algebra - Polynomials',
                description: 'Zeros of a polynomial, Relationship between zeros and coefficients.',
                topics: ['Geometrical Meaning of Zeros', 'Zeros and Coefficients', 'Division Algorithm'],
                content: {
                    type: 'video',
                    body: 'Zeros of a polynomial. Relationship between zeros and coefficients of quadratic polynomials.',
                    videoUrl: 'https://www.youtube.com/embed/21H8oo3nxP0'
                },
                order: 2
            },
            {
                id: 'ch_math_10_3',
                title: 'Unit II: Algebra - Linear Equations',
                description: 'Pair of Linear Equations in Two Variables.',
                topics: ['Graphical Method', 'Substitution Method', 'Elimination Method', 'Cross-Multiplication'],
                content: {
                    type: 'video',
                    body: 'Solving pairs of linear equations.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 3
            },
            {
                id: 'ch_math_10_4',
                title: 'Unit II: Algebra - Quadratic Equations',
                description: 'Standard form, Roots, Solution by factorization and quadratic formula.',
                topics: ['Standard Form', 'Factorization', 'Quadratic Formula', 'Nature of Roots'],
                content: {
                    type: 'video',
                    body: 'Mastering Quadratic Equations.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 4
            },
            {
                id: 'ch_math_10_5',
                title: 'Unit II: Algebra - Arithmetic Progressions',
                description: 'nth term and sum of first n terms of AP.',
                topics: ['AP Introduction', 'nth Term', 'Sum of n Terms'],
                content: {
                    type: 'video',
                    body: 'Arithmetic Progressions explained.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 5
            },
            {
                id: 'ch_math_10_6',
                title: 'Unit III: Coordinate Geometry',
                description: 'Distance formula, Section formula.',
                topics: ['Distance Formula', 'Section Formula', 'Area of Triangle'],
                content: {
                    type: 'video',
                    body: 'Coordinate Geometry basics.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 6
            },
            {
                id: 'ch_math_10_7',
                title: 'Unit IV: Geometry - Triangles',
                description: 'Similar triangles, BPT, Pythagoras Theorem.',
                topics: ['Similarity', 'BPT', 'Criteria for Similarity', 'Areas of Similar Triangles', 'Pythagoras Theorem'],
                content: {
                    type: 'video',
                    body: 'Understanding Triangles theorems.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 7
            },
            {
                id: 'ch_math_10_8',
                title: 'Unit IV: Geometry - Circles',
                description: 'Tangent to a circle, Number of tangents from a point.',
                topics: ['Tangent to a Circle', 'Properties of Tangents'],
                content: {
                    type: 'video',
                    body: 'Geometry of Circles.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 8
            },
            {
                id: 'ch_math_10_9',
                title: 'Unit V: Trigonometry',
                description: 'Trigonometric ratios, Identities, Heights and Distances.',
                topics: ['Trigonometric Ratios', 'Values of Ratios', 'Identities', 'Heights and Distances'],
                content: {
                    type: 'video',
                    body: 'Introduction to Trigonometry.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 9
            },
            {
                id: 'ch_math_10_10',
                title: 'Unit VI: Mensuration',
                description: 'Areas related to Circles, Surface Areas and Volumes.',
                topics: ['Area of Sector/Segment', 'Surface Area Combinations', 'Volume Combinations'],
                content: {
                    type: 'video',
                    body: 'Mensuration: Areas and Volumes.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 10
            },
            {
                id: 'ch_math_10_11',
                title: 'Unit VII: Statistics & Probability',
                description: 'Mean, Median, Mode of grouped data; Probability.',
                topics: ['Mean', 'Median', 'Mode', 'Probability'],
                content: {
                    type: 'video',
                    body: 'Statistics and Probability concepts.',
                    videoUrl: 'https://www.youtube.com/embed/ExampleVideoID'
                },
                order: 11
            }
        ];

        const chapters = await Promise.all(mathChaptersData.map(ch =>
            Chapter.create({
                ...ch,
                subjectId: 'math_icse',
                isPublished: true
            })
        ));
        console.log('✅ Created Maths chapters');

        // Navigation for Quizzes
        // We will add quizzes for at least the first few chapters
        const englishQuizzes = [
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_1', title: 'Quiz: A Letter to God', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Lencho lived in a —', options: ['City', 'Valley', 'Hill', 'Desert'], correctAnswer: 'Valley', points: 100 },
                { id: 2, type: 'mcq', question: 'The storm turned into —', options: ['Rain', 'Snow', 'Hailstorm', 'Wind'], correctAnswer: 'Hailstorm', points: 100 },
                { id: 3, type: 'mcq', question: 'Lencho needed money for —', options: ['House', 'Seeds', 'Food', 'Clothes'], correctAnswer: 'Seeds', points: 100 },
                { id: 4, type: 'mcq', question: 'He wrote a letter to —', options: ['Mayor', 'Friend', 'God', 'Bank'], correctAnswer: 'God', points: 100 },
                { id: 5, type: 'mcq', question: 'Postmaster helped by —', options: ['Ignoring', 'Laughing', 'Collecting money', 'Returning letter'], correctAnswer: 'Collecting money', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_2', title: 'Quiz: Nelson Mandela', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Freedom day —', options: ['1992', '1994', '1990', '1995'], correctAnswer: '1994', points: 100 },
                { id: 2, type: 'mcq', question: 'Apartheid means —', options: ['Peace', 'Equality', 'Racism', 'Democracy'], correctAnswer: 'Racism', points: 100 },
                { id: 3, type: 'mcq', question: 'Courage is —', options: ['No fear', 'Anger', 'Victory over fear', 'Power'], correctAnswer: 'Victory over fear', points: 100 },
                { id: 4, type: 'mcq', question: 'Mandela became —', options: ['PM', 'President', 'Judge', 'King'], correctAnswer: 'President', points: 100 },
                { id: 5, type: 'mcq', question: 'Twin obligations refer to —', options: ['Work & play', 'Family & country', 'Money & job', 'Law & order'], correctAnswer: 'Family & country', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_3', title: 'Quiz: A Tiger in the Zoo', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Tiger is in —', options: ['Jungle', 'Zoo', 'Home', 'Field'], correctAnswer: 'Zoo', points: 100 },
                { id: 2, type: 'mcq', question: 'He is —', options: ['Happy', 'Sad', 'Excited', 'Lazy'], correctAnswer: 'Sad', points: 100 },
                { id: 3, type: 'mcq', question: 'Wants —', options: ['Food', 'Freedom', 'Sleep', 'Water'], correctAnswer: 'Freedom', points: 100 },
                { id: 4, type: 'mcq', question: 'Ignoring —', options: ['Visitors', 'Keeper', 'Noise', 'Food'], correctAnswer: 'Visitors', points: 100 },
                { id: 5, type: 'mcq', question: 'Jungle symbolises —', options: ['Fear', 'Freedom', 'Danger', 'Hunger'], correctAnswer: 'Freedom', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_4', title: 'Quiz: Two Stories About Flying', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Young seagull was —', options: ['Brave', 'Lazy', 'Afraid', 'Angry'], correctAnswer: 'Afraid', points: 100 },
                { id: 2, type: 'mcq', question: 'He flew when —', options: ['Hungry', 'Forced', 'Alone', 'Angry'], correctAnswer: 'Hungry', points: 100 },
                { id: 3, type: 'mcq', question: 'Black aeroplane pilot saw —', options: ['Storm', 'Clouds', 'Black plane', 'Bird'], correctAnswer: 'Black plane', points: 100 },
                { id: 4, type: 'mcq', question: 'Guide disappeared —', options: ['In clouds', 'At airport', 'In storm', 'Nowhere'], correctAnswer: 'Nowhere', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Fear', 'Courage', 'Faith', 'Both B & C'], correctAnswer: 'Both B & C', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_5', title: 'Quiz: How to Tell Wild Animals', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Lion eats —', options: ['Grass', 'Leaves', 'You', 'Fruits'], correctAnswer: 'You', points: 100 },
                { id: 2, type: 'mcq', question: 'Hyena laughs —', options: ['Sadly', 'Loudly', 'Softly', 'Slowly'], correctAnswer: 'Loudly', points: 100 },
                { id: 3, type: 'mcq', question: 'Leopard attacks —', options: ['Politely', 'Suddenly', 'Slowly', 'Calmly'], correctAnswer: 'Suddenly', points: 100 },
                { id: 4, type: 'mcq', question: 'Poem tone —', options: ['Serious', 'Humorous', 'Sad', 'Angry'], correctAnswer: 'Humorous', points: 100 },
                { id: 5, type: 'mcq', question: 'Purpose —', options: ['Teach', 'Entertain', 'Warn', 'Describe'], correctAnswer: 'Entertain', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_6', title: 'Quiz: The Ball Poem', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Boy lost —', options: ['Bat', 'Ball', 'Toy', 'Book'], correctAnswer: 'Ball', points: 100 },
                { id: 2, type: 'mcq', question: 'Theme —', options: ['Joy', 'Loss', 'Anger', 'Fear'], correctAnswer: 'Loss', points: 100 },
                { id: 3, type: 'mcq', question: 'Poet —', options: ['Frost', 'Berryman', 'Keats', 'Blake'], correctAnswer: 'Berryman', points: 100 },
                { id: 4, type: 'mcq', question: 'Loss teaches —', options: ['Money', 'Responsibility', 'Anger', 'Fear'], correctAnswer: 'Responsibility', points: 100 },
                { id: 5, type: 'mcq', question: 'Boy feels —', options: ['Happy', 'Sad', 'Angry', 'Calm'], correctAnswer: 'Sad', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_7', title: 'Quiz: Anne Frank', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Diary name —', options: ['Kitty', 'Lucy', 'Anna', 'Book'], correctAnswer: 'Kitty', points: 100 },
                { id: 2, type: 'mcq', question: 'Anne hid in —', options: ['School', 'Office', 'Annex', 'House'], correctAnswer: 'Annex', points: 100 },
                { id: 3, type: 'mcq', question: 'She was —', options: ['Silent', 'Talkative', 'Lazy', 'Rude'], correctAnswer: 'Talkative', points: 100 },
                { id: 4, type: 'mcq', question: 'Teacher was —', options: ['Angry', 'Funny', 'Strict', 'Kind'], correctAnswer: 'Strict', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['War', 'Childhood', 'Expression', 'All'], correctAnswer: 'All', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_8', title: 'Quiz: Amanda!', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Amanda is —', options: ['Adult', 'Child', 'Teacher', 'Mother'], correctAnswer: 'Child', points: 100 },
                { id: 2, type: 'mcq', question: 'She wants —', options: ['Freedom', 'Study', 'Work', 'Sleep'], correctAnswer: 'Freedom', points: 100 },
                { id: 3, type: 'mcq', question: 'Tone —', options: ['Angry', 'Repetitive', 'Calm', 'Sad'], correctAnswer: 'Repetitive', points: 100 },
                { id: 4, type: 'mcq', question: 'Mermaid shows —', options: ['Fear', 'Freedom', 'Sadness', 'Power'], correctAnswer: 'Freedom', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Discipline', 'Freedom vs control', 'Fear', 'Joy'], correctAnswer: 'Freedom vs control', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_9', title: 'Quiz: Glimpses of India', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Tea from —', options: ['Goa', 'Assam', 'Kerala', 'Delhi'], correctAnswer: 'Assam', points: 100 },
                { id: 2, type: 'mcq', question: 'Coorg known for —', options: ['Tea', 'Coffee', 'Rice', 'Oil'], correctAnswer: 'Coffee', points: 100 },
                { id: 3, type: 'mcq', question: 'Goa story about —', options: ['Tea', 'Baker', 'Farmer', 'Driver'], correctAnswer: 'Baker', points: 100 },
                { id: 4, type: 'mcq', question: 'Tea drunk first in —', options: ['India', 'China', 'Japan', 'UK'], correctAnswer: 'China', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Travel', 'Culture', 'Diversity', 'All'], correctAnswer: 'All', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_10', title: 'Quiz: The Trees', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Trees symbolize —', options: ['Freedom', 'Fear', 'Growth', 'Life'], correctAnswer: 'Freedom', points: 100 },
                { id: 2, type: 'mcq', question: 'Trees move —', options: ['Inside', 'Outside', 'Slowly', 'Fast'], correctAnswer: 'Outside', points: 100 },
                { id: 3, type: 'mcq', question: 'Forest empty because —', options: ['Trees gone', 'Animals gone', 'Humans cut', 'Fire'], correctAnswer: 'Trees gone', points: 100 },
                { id: 4, type: 'mcq', question: 'Tone —', options: ['Sad', 'Hopeful', 'Angry', 'Calm'], correctAnswer: 'Hopeful', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Nature freedom', 'Fear', 'War', 'Anger'], correctAnswer: 'Nature freedom', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_11', title: 'Quiz: Mijbil the Otter', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Mij was —', options: ['Cat', 'Dog', 'Otter', 'Bird'], correctAnswer: 'Otter', points: 100 },
                { id: 2, type: 'mcq', question: 'Owner —', options: ['Maxwell', 'Lencho', 'Anne', 'Mandela'], correctAnswer: 'Maxwell', points: 100 },
                { id: 3, type: 'mcq', question: 'Mij loved —', options: ['Water', 'Food', 'Sleep', 'Jumping'], correctAnswer: 'Water', points: 100 },
                { id: 4, type: 'mcq', question: 'Mij travelled by —', options: ['Train', 'Bus', 'Plane', 'Ship'], correctAnswer: 'Plane', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Love for animals', 'Fear', 'Loss', 'Anger'], correctAnswer: 'Love for animals', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_12', title: 'Quiz: Fog', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Fog compared to —', options: ['Dog', 'Cat', 'Lion', 'Bird'], correctAnswer: 'Cat', points: 100 },
                { id: 2, type: 'mcq', question: 'Moves —', options: ['Slowly', 'Fast', 'Loudly', 'Quietly'], correctAnswer: 'Quietly', points: 100 },
                { id: 3, type: 'mcq', question: 'Stays —', options: ['Forever', 'Short time', 'Long', 'Never'], correctAnswer: 'Short time', points: 100 },
                { id: 4, type: 'mcq', question: 'Tone —', options: ['Calm', 'Angry', 'Sad', 'Happy'], correctAnswer: 'Calm', points: 100 },
                { id: 5, type: 'mcq', question: 'Poet —', options: ['Sandburg', 'Frost', 'Blake', 'Eliot'], correctAnswer: 'Sandburg', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_13', title: 'Quiz: Madam Rides the Bus', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Valli’s age —', options: ['6', '7', '8', '9'], correctAnswer: '8', points: 100 },
                { id: 2, type: 'mcq', question: 'She saved money for —', options: ['Toy', 'Bus ride', 'Food', 'Book'], correctAnswer: 'Bus ride', points: 100 },
                { id: 3, type: 'mcq', question: 'She didn’t take —', options: ['Food', 'Help', 'Ticket', 'Seat'], correctAnswer: 'Food', points: 100 },
                { id: 4, type: 'mcq', question: 'She saw —', options: ['Dead cow', 'Dog', 'Cat', 'Bird'], correctAnswer: 'Dead cow', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Curiosity', 'Fear', 'Anger', 'Sadness'], correctAnswer: 'Curiosity', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_14', title: 'Quiz: Custard the Dragon', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Custard was —', options: ['Brave', 'Coward', 'Strong', 'Smart'], correctAnswer: 'Coward', points: 100 },
                { id: 2, type: 'mcq', question: 'Pirate attacked —', options: ['House', 'Ship', 'Garden', 'Castle'], correctAnswer: 'House', points: 100 },
                { id: 3, type: 'mcq', question: 'Who killed pirate —', options: ['Belinda', 'Custard', 'Dog', 'Cat'], correctAnswer: 'Custard', points: 100 },
                { id: 4, type: 'mcq', question: 'Others were —', options: ['Brave', 'Boastful', 'Cowards', 'Silent'], correctAnswer: 'Boastful', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['True courage', 'Fear', 'Anger', 'Pride'], correctAnswer: 'True courage', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_15', title: 'Quiz: Sermon at Benares', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Kisa lost —', options: ['Husband', 'Son', 'Father', 'Friend'], correctAnswer: 'Son', points: 100 },
                { id: 2, type: 'mcq', question: 'Buddha taught —', options: ['Death', 'Life', 'Peace', 'War'], correctAnswer: 'Death', points: 100 },
                { id: 3, type: 'mcq', question: 'Mustard seeds from —', options: ['Rich house', 'Poor house', 'Death-free house', 'Temple'], correctAnswer: 'Death-free house', points: 100 },
                { id: 4, type: 'mcq', question: 'Theme —', options: ['Loss', 'Death truth', 'Pain', 'Fear'], correctAnswer: 'Death truth', points: 100 },
                { id: 5, type: 'mcq', question: 'Kisa learned —', options: ['Happiness', 'Reality', 'Anger', 'Joy'], correctAnswer: 'Reality', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_16', title: 'Quiz: For Anne Gregory', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Anne’s beauty —', options: ['Hair', 'Eyes', 'Face', 'Smile'], correctAnswer: 'Hair', points: 100 },
                { id: 2, type: 'mcq', question: 'Poet says love should be —', options: ['Outer', 'Inner', 'Fake', 'Weak'], correctAnswer: 'Inner', points: 100 },
                { id: 3, type: 'mcq', question: 'Theme —', options: ['Beauty vs love', 'Fear', 'Anger', 'Power'], correctAnswer: 'Beauty vs love', points: 100 },
                { id: 4, type: 'mcq', question: 'Tone —', options: ['Serious', 'Light', 'Sad', 'Angry'], correctAnswer: 'Light', points: 100 },
                { id: 5, type: 'mcq', question: 'Poet —', options: ['Yeats', 'Frost', 'Blake', 'Eliot'], correctAnswer: 'Yeats', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_17', title: 'Quiz: The Proposal', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Lomov came to —', options: ['Fight', 'Propose', 'Work', 'Visit'], correctAnswer: 'Propose', points: 100 },
                { id: 2, type: 'mcq', question: 'Conflict about —', options: ['Money', 'Land', 'Marriage', 'House'], correctAnswer: 'Land', points: 100 },
                { id: 3, type: 'mcq', question: 'Natalya was —', options: ['Calm', 'Angry', 'Polite', 'Silent'], correctAnswer: 'Angry', points: 100 },
                { id: 4, type: 'mcq', question: 'Theme —', options: ['Love', 'Comedy', 'Fight', 'Power'], correctAnswer: 'Comedy', points: 100 },
                { id: 5, type: 'mcq', question: 'End —', options: ['Fight', 'Marriage', 'Death', 'Sad'], correctAnswer: 'Marriage', points: 100 }
            ]},
            // Footprints Without Feet Quizzes
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_18', title: 'Quiz: Triumph of Surgery', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Tricki was —', options: ['Thin', 'Fat', 'Weak', 'Strong'], correctAnswer: 'Fat', points: 100 },
                { id: 2, type: 'mcq', question: 'Doctor —', options: ['Herriot', 'Maxwell', 'Griffin', 'Lomov'], correctAnswer: 'Herriot', points: 100 },
                { id: 3, type: 'mcq', question: 'Cure —', options: ['Medicine', 'Exercise', 'Diet', 'Rest'], correctAnswer: 'Diet', points: 100 },
                { id: 4, type: 'mcq', question: 'Owner —', options: ['Rich', 'Poor', 'Farmer', 'Teacher'], correctAnswer: 'Rich', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Overcare', 'Love', 'Fear', 'Anger'], correctAnswer: 'Overcare', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_19', title: 'Quiz: Thief’s Story', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Thief name —', options: ['Hari', 'Anil', 'Griffin', 'James'], correctAnswer: 'Hari', points: 100 },
                { id: 2, type: 'mcq', question: 'Anil was —', options: ['Rich', 'Poor writer', 'Doctor', 'Farmer'], correctAnswer: 'Poor writer', points: 100 },
                { id: 3, type: 'mcq', question: 'Money stolen —', options: ['100', '200', '600', '500'], correctAnswer: '600', points: 100 },
                { id: 4, type: 'mcq', question: 'Hari returned because —', options: ['Fear', 'Guilt', 'Hunger', 'Police'], correctAnswer: 'Guilt', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Trust', 'Greed', 'Anger', 'Fear'], correctAnswer: 'Trust', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_20', title: 'Quiz: Midnight Visitor', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Ausable was —', options: ['Spy', 'Doctor', 'Teacher', 'Pilot'], correctAnswer: 'Spy', points: 100 },
                { id: 2, type: 'mcq', question: 'Max was —', options: ['Friend', 'Enemy', 'Police', 'Writer'], correctAnswer: 'Enemy', points: 100 },
                { id: 3, type: 'mcq', question: 'Balcony was —', options: ['Real', 'Fake', 'Broken', 'Closed'], correctAnswer: 'Fake', points: 100 },
                { id: 4, type: 'mcq', question: 'Max died by —', options: ['Jump', 'Shot', 'Fall', 'Fight'], correctAnswer: 'Fall', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Intelligence', 'Fear', 'Action', 'Anger'], correctAnswer: 'Intelligence', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_21', title: 'Quiz: Question of Trust', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Horace was —', options: ['Thief', 'Doctor', 'Writer', 'Farmer'], correctAnswer: 'Thief', points: 100 },
                { id: 2, type: 'mcq', question: 'He loved —', options: ['Money', 'Books', 'Dogs', 'Theft'], correctAnswer: 'Dogs', points: 100 },
                { id: 3, type: 'mcq', question: 'Woman was —', options: ['Owner', 'Police', 'Thief', 'Friend'], correctAnswer: 'Thief', points: 100 },
                { id: 4, type: 'mcq', question: 'Horace got caught due to —', options: ['Fingerprints', 'Police', 'Mistake', 'Fight'], correctAnswer: 'Fingerprints', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Crime', 'Trust', 'Greed', 'Trickery'], correctAnswer: 'Trickery', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_22', title: 'Quiz: Footprints without Feet', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Griffin was —', options: ['Scientist', 'Doctor', 'Teacher', 'Farmer'], correctAnswer: 'Scientist', points: 100 },
                { id: 2, type: 'mcq', question: 'He became —', options: ['Rich', 'Invisible', 'Powerful', 'Famous'], correctAnswer: 'Invisible', points: 100 },
                { id: 3, type: 'mcq', question: 'He misused —', options: ['Science', 'Power', 'Money', 'Law'], correctAnswer: 'Science', points: 100 },
                { id: 4, type: 'mcq', question: 'Landlady was —', options: ['Kind', 'Angry', 'Helpful', 'Silent'], correctAnswer: 'Angry', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Science misuse', 'Fear', 'Greed', 'Power'], correctAnswer: 'Science misuse', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_23', title: 'Quiz: Making of a Scientist', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Richard loved —', options: ['Maths', 'Nature', 'Sports', 'Music'], correctAnswer: 'Nature', points: 100 },
                { id: 2, type: 'mcq', question: 'Mother encouraged —', options: ['Study', 'Curiosity', 'Work', 'Play'], correctAnswer: 'Curiosity', points: 100 },
                { id: 3, type: 'mcq', question: 'He studied —', options: ['Birds', 'Snakes', 'Fish', 'Trees'], correctAnswer: 'Birds', points: 100 },
                { id: 4, type: 'mcq', question: 'He became —', options: ['Teacher', 'Scientist', 'Doctor', 'Farmer'], correctAnswer: 'Scientist', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Curiosity', 'Fear', 'Anger', 'Greed'], correctAnswer: 'Curiosity', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_24', title: 'Quiz: The Necklace', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Mathilde wanted —', options: ['Beauty', 'Wealth', 'Fame', 'Power'], correctAnswer: 'Wealth', points: 100 },
                { id: 2, type: 'mcq', question: 'Necklace was —', options: ['Real', 'Fake', 'Gold', 'Silver'], correctAnswer: 'Fake', points: 100 },
                { id: 3, type: 'mcq', question: 'Lost at —', options: ['Party', 'Home', 'Market', 'Road'], correctAnswer: 'Party', points: 100 },
                { id: 4, type: 'mcq', question: 'Debt took —', options: ['1 yr', '5 yrs', '10 yrs', '20 yrs'], correctAnswer: '10 yrs', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Greed', 'Pride', 'Illusion', 'All'], correctAnswer: 'All', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_25', title: 'Quiz: Bholi', gameType: 'shooter', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Bholi was —', options: ['Smart', 'Dumb', 'Weak', 'Rich'], correctAnswer: 'Dumb', points: 100 },
                { id: 2, type: 'mcq', question: 'Teacher was —', options: ['Harsh', 'Kind', 'Angry', 'Strict'], correctAnswer: 'Kind', points: 100 },
                { id: 3, type: 'mcq', question: 'Groom demanded —', options: ['Love', 'Money', 'Dowry', 'Respect'], correctAnswer: 'Dowry', points: 100 },
                { id: 4, type: 'mcq', question: 'Bholi refused because —', options: ['Fear', 'Courage', 'Anger', 'Pride'], correctAnswer: 'Courage', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Education', 'Empowerment', 'Courage', 'All'], correctAnswer: 'All', points: 100 }
            ]},
            { subjectId: 'eng_icse', chapterId: 'ch_eng_10_26', title: 'Quiz: Book Saved the Earth', gameType: 'memory', timeLimit: 30, passingScore: 50, isActive: true, questions: [
                { id: 1, type: 'mcq', question: 'Setting —', options: ['Past', 'Future', 'Present', 'War'], correctAnswer: 'Future', points: 100 },
                { id: 2, type: 'mcq', question: 'Martians thought —', options: ['Book dangerous', 'Book useless', 'Book funny', 'Book old'], correctAnswer: 'Book dangerous', points: 100 },
                { id: 3, type: 'mcq', question: 'Book saved —', options: ['Mars', 'Earth', 'Humans', 'Aliens'], correctAnswer: 'Earth', points: 100 },
                { id: 4, type: 'mcq', question: 'Noodle was —', options: ['Leader', 'Scientist', 'Captain', 'Enemy'], correctAnswer: 'Leader', points: 100 },
                { id: 5, type: 'mcq', question: 'Theme —', options: ['Power of books', 'War', 'Fear', 'Science'], correctAnswer: 'Power of books', points: 100 }
            ]}
        ];

        // Combine with existing math quizzes array or create separately
        await Quiz.create([...englishQuizzes,
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_1',
                title: 'Quiz: Real Numbers',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'Which of the following is an irrational number?', options: ['2.5', '√9', '√2', '0.333...'], correctAnswer: '√2', points: 100 },
                    { id: 2, type: 'mcq', question: 'HCF of 96 and 404 is?', options: ['4', '2', '8', '12'], correctAnswer: '4', points: 100 },
                    { id: 3, type: 'mcq', question: 'The decimal expansion of 13/3125 terminates after?', options: ['1 decimal place', '2 decimal places', '5 decimal places', '4 decimal places'], correctAnswer: '5 decimal places', points: 100 },
                    { id: 4, type: 'mcq', question: 'Fundamental Theorem of Arithmetic states every composite number can be expressed as product of?', options: ['Primes', 'Integers', 'Naturals', 'Evens'], correctAnswer: 'Primes', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_2',
                title: 'Quiz: Polynomials',
                gameType: 'memory',
                questions: [
                    { id: 1, type: 'mcq', question: 'If α, β are zeros of 2x² - 8x + 6, then α+β is?', options: ['4', '-4', '3', '8'], correctAnswer: '4', points: 100 },
                    { id: 2, type: 'mcq', question: 'Degree of a quadratic polynomial is?', options: ['0', '1', '2', '3'], correctAnswer: '2', points: 100 },
                    { id: 3, type: 'mcq', question: 'Graph of quadratic polynomial is a?', options: ['Straight line', 'Circle', 'Parabola', 'Ellipse'], correctAnswer: 'Parabola', points: 100 },
                    { id: 4, type: 'mcq', question: 'Sum of zeros of ax² + bx + c is?', options: ['c/a', '-b/a', 'b/a', '-c/a'], correctAnswer: '-b/a', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_3',
                title: 'Quiz: Linear Equations',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'The pair of equations x=a and y=b graphically represents lines which are?', options: ['Parallel', 'Intersecting at (b,a)', 'Coincident', 'Intersecting at (a,b)'], correctAnswer: 'Intersecting at (a,b)', points: 100 },
                    { id: 2, type: 'mcq', question: 'If lines are parallel, the system has?', options: ['Unique Solution', 'No Solution', 'Infinite Solutions', 'Function'], correctAnswer: 'No Solution', points: 100 },
                    { id: 3, type: 'mcq', question: 'Value of k for which x + 2y = 3 and 5x + ky = 7 has unique solution?', options: ['k=10', 'k≠10', 'k=5', 'k≠5'], correctAnswer: 'k≠10', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_4',
                title: 'Quiz: Quadratic Equations',
                gameType: 'memory',
                questions: [
                    { id: 1, type: 'mcq', question: 'Discriminant of ax² + bx + c = 0 is?', options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', 'b - 4ac'], correctAnswer: 'b² - 4ac', points: 100 },
                    { id: 2, type: 'mcq', question: 'If discriminant is greater than 0, roots are?', options: ['Real & Equal', 'Real & Distinct', 'No Real Roots', 'Imaginary'], correctAnswer: 'Real & Distinct', points: 100 },
                    { id: 3, type: 'mcq', question: 'Roots of x² - 9 = 0 are?', options: ['3', '-3', '±3', '9'], correctAnswer: '±3', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_5',
                title: 'Quiz: Arithmetic Progressions',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'In AP: 2, 7, 12..., common difference is?', options: ['2', '7', '5', '12'], correctAnswer: '5', points: 100 },
                    { id: 2, type: 'mcq', question: 'Formula for nth term of AP?', options: ['a+(n-1)d', 'a+nd', 'a+(n+1)d', 'n/2[2a+(n-1)d]'], correctAnswer: 'a+(n-1)d', points: 100 },
                    { id: 3, type: 'mcq', question: 'What is the next term in AP: 5, 8, 11...?', options: ['13', '14', '15', '16'], correctAnswer: '14', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_6',
                title: 'Quiz: Coordinate Geometry',
                gameType: 'memory',
                questions: [
                    { id: 1, type: 'mcq', question: 'Distance of point (x, y) from origin is?', options: ['√(x+y)', '√(x²+y²)', 'x+y', 'x²+y²'], correctAnswer: '√(x²+y²)', points: 100 },
                    { id: 2, type: 'mcq', question: 'Coordinates of origin are?', options: ['(0,1)', '(1,0)', '(0,0)', '(1,1)'], correctAnswer: '(0,0)', points: 100 },
                    { id: 3, type: 'mcq', question: 'Section formula divides a line segment in ratio?', options: ['m:1', 'm:n', '1:1', 'k:1'], correctAnswer: 'm:n', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_7',
                title: 'Quiz: Triangles',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'All circles are?', options: ['Congruent', 'Similar', 'Both', 'None'], correctAnswer: 'Similar', points: 100 },
                    { id: 2, type: 'mcq', question: 'Sides of two similar triangles are in ratio 4:9. Areas are in ratio?', options: ['2:3', '4:9', '81:16', '16:81'], correctAnswer: '16:81', points: 100 },
                    { id: 3, type: 'mcq', question: 'Pythagoras theorem applies to?', options: ['Equilateral', 'Isosceles', 'Right-angled', 'All'], correctAnswer: 'Right-angled', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_8',
                title: 'Quiz: Circles',
                gameType: 'memory',
                questions: [
                    { id: 1, type: 'mcq', question: 'Line touching a circle at one point is called?', options: ['Secant', 'Chord', 'Tangent', 'Diameter'], correctAnswer: 'Tangent', points: 100 },
                    { id: 2, type: 'mcq', question: 'Number of tangents from a point inside a circle?', options: ['One', 'Two', 'Zero', 'Infinite'], correctAnswer: 'Zero', points: 100 },
                    { id: 3, type: 'mcq', question: 'Angle between tangent and radius at point of contact?', options: ['45°', '60°', '90°', '180°'], correctAnswer: '90°', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_9',
                title: 'Quiz: Trigonometry',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'Value of sin 30° is?', options: ['1/2', '1/√2', '√3/2', '1'], correctAnswer: '1/2', points: 100 },
                    { id: 2, type: 'mcq', question: 'tan 45° is equal to?', options: ['0', '1', '∞', '√3'], correctAnswer: '1', points: 100 },
                    { id: 3, type: 'mcq', question: 'Identitiy: sin²θ + cos²θ = ?', options: ['0', '1', '-1', '2'], correctAnswer: '1', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_10',
                title: 'Quiz: Mensuration',
                gameType: 'memory',
                questions: [
                    { id: 1, type: 'mcq', question: 'Volume of cylinder is?', options: ['πr²h', '1/3πr²h', '2πrh', 'πrl'], correctAnswer: 'πr²h', points: 100 },
                    { id: 2, type: 'mcq', question: 'TSA of sphere is?', options: ['2πr²', '3πr²', '4πr²', 'πr²'], correctAnswer: '4πr²', points: 100 },
                    { id: 3, type: 'mcq', question: 'Volume of cone is?', options: ['πr²h', '1/3πr²h', '2πrh', '4/3πr³'], correctAnswer: '1/3πr²h', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            },
            {
                subjectId: 'math_icse',
                chapterId: 'ch_math_10_11',
                title: 'Quiz: Statistics & Probability',
                gameType: 'shooter',
                questions: [
                    { id: 1, type: 'mcq', question: 'Probability of sure event is?', options: ['0', '0.5', '1', '-1'], correctAnswer: '1', points: 100 },
                    { id: 2, type: 'mcq', question: 'Mode is the?', options: ['Middle value', 'Most frequent', 'Average', 'Range'], correctAnswer: 'Most frequent', points: 100 },
                    { id: 3, type: 'mcq', question: 'Probability of an event E + Probability of not E is?', options: ['0', '1', '-1', '0.5'], correctAnswer: '1', points: 100 }
                ],
                timeLimit: 30,
                passingScore: 50,
                isActive: true
            }
        ]);
        console.log('✅ Created quizzes');

        console.log('🎉 Database seeded successfully!');
        console.log('\n📧 Test Credentials:');
        console.log('Admin: admin@demo.com / password123');
        console.log('Teacher: teacher@demo.com / password123');
        console.log('Student: student@demo.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDatabase();
