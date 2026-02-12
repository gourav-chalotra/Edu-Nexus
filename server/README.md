# Edu-Nexus Backend API

A comprehensive Node.js/Express backend for a gamified educational platform. This API handles user authentication, curriculum management, quizzes, and gamification features.

## Architecture

```
Routes → Controllers → Models → MongoDB
         ↓
      Middleware (Auth, Validation)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/teachers` - Get all teachers (protected)
- `GET /api/users/students` - Get all students (protected)
- `POST /api/users/teachers` - Create new teacher (admin only)
- `PUT /api/users/:id` - Update user profile (protected)
- `DELETE /api/users/:id` - Delete user (admin only)

### Subjects
- `GET /api/subjects` - Get all subjects (protected)
- `GET /api/subjects/:id` - Get single subject (protected)
- `POST /api/subjects` - Create subject (teacher/admin)
- `PUT /api/subjects/:id` - Update subject (teacher/admin)
- `DELETE /api/subjects/:id` - Delete subject (admin only)
- `POST /api/subjects/:subjectId/assign-teacher/:teacherId` - Assign teacher (admin)
- `DELETE /api/subjects/:subjectId/unassign-teacher/:teacherId` - Unassign teacher (admin)

### Chapters
- `GET /api/chapters/subject/:subjectId` - Get chapters by subject (protected)
- `GET /api/chapters/:id` - Get single chapter (protected)
- `POST /api/chapters` - Create chapter (teacher/admin)
- `PUT /api/chapters/:id` - Update chapter (teacher/admin)
- `POST /api/chapters/:id/add-video` - Add video to chapter (teacher/admin)
- `POST /api/chapters/:id/add-attachment` - Add attachment (teacher/admin)

### Quizzes
- `GET /api/quizzes/chapter/:chapterId` - Get quiz by chapter (protected)
- `POST /api/quizzes` - Create quiz (teacher/admin)
- `POST /api/quizzes/submit` - Submit quiz answers (protected)
- `POST /api/quizzes/record-attempt` - Record quiz attempt (protected)

### Progress
- `GET /api/progress` - Get user progress (protected)
- `GET /api/progress/subject/:subjectId` - Get progress by subject (protected)
- `PUT /api/progress/:chapterId` - Update progress (protected)

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard (protected)
- `GET /api/leaderboard/my-rank` - Get user rank (protected)

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Environment Setup

1. **Create `.env` file** (copy from `.env.example`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/edu-nexus
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

2. **Install dependencies**:
```bash
cd server
npm install
```

3. **Seed database with test data**:
```bash
npm run seed
```

4. **Start development server**:
```bash
npm run dev
```

Server will run on `http://localhost:5001`

## Test Credentials

After seeding, use these credentials:

- **Admin**
  - Email: `admin@edu.nexus`
  - Password: `password123`

- **Teacher**
  - Email: `teacher@demo.com`
  - Password: `password123`

- **Student**
  - Email: `student@demo.com`
  - Password: `password123`

## Database Models

### User
- Personal info (name, email, password)
- Role-based access (student, teacher, admin)
- Gamification fields (xp, level, streak, badges)
- Teacher-specific (assignedSubjects)

### Subject
- Title, description, icon
- Class level
- Publication status

### Chapter
- Belongs to Subject
- Title, description, topics
- Content (text, video URL)
- Attachments
- Teacher notes
- Publication status

### Quiz
- Belongs to Chapter and Subject
- Questions with multiple question types:
  - MCQ (multiple choice)
  - Fill-in (text input)
  - True/False
- Points, passing score, time limit

### Progress
- Tracks user progress per chapter
- Video watched status
- Quiz completion status
- Completion percentage and date

### QuizAttempt
- Records each quiz submission
- Score, XP earned, badges earned
- Timestamp

## Middleware

### Authentication (`protect`)
- Verifies JWT token
- Attaches user to request (req.user)
- Returns 401 if token invalid/missing

### Authorization (`authorize`)
- Checks user role
- Returns 403 if role not authorized
- Usage: `authorize('admin', 'teacher')`

## Error Handling

All endpoints return consistent JSON responses:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Features Implemented

✅ User Authentication & JWT-based authorization
✅ Role-based access control (RBAC)
✅ Curriculum management (Subjects → Chapters)
✅ Quiz system with multiple question types
✅ Student progress tracking
✅ Gamification (XP, levels, badges, streaks)
✅ Global leaderboard
✅ Teacher dashboard (manage chapters, quizzes)
✅ Admin dashboard (manage users, subjects)
✅ Password hashing with bcryptjs
✅ Comprehensive error handling

## Frontend Integration

The frontend connects via these environment variables:
```env
VITE_API_URL=http://localhost:5001/api
```

All API calls are made with JWT token in Authorization header:
```javascript
Authorization: Bearer <token>
```

## Development Tips

1. **Check logs**: The server logs all API calls and errors
2. **Test with Postman**: Import routes and test endpoints
3. **Debug**: Use `console.log()` or Node debugger
4. **Database**: Use MongoDB Compass to inspect data
5. **API Routes**: Check route files in `routes/` folder

## Project Structure

```
server/
├── models/           # MongoDB schemas
├── controllers/      # Route handlers
├── routes/          # API routes
├── middleware/      # Auth, validation
├── utils/           # Helper functions
├── config/          # Database config
├── scripts/         # Seed data
├── server.js        # Main entry point
└── .env.example    # Environment template
```

## Next Steps

1. Start MongoDB locally or connect to Atlas
2. Create `.env` file with credentials
3. Run `npm run seed` to populate database
4. Start backend: `npm run dev`
5. Start frontend: `cd ../Edu-Nexus && npm run dev`

---

Built for Edu-Nexus - A Gamified Learning Platform
