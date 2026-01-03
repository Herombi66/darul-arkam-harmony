# Student Dashboard API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | /auth/login | Login with email and password | No |
| GET | /auth/profile | Get current user profile | Yes |
| POST | /auth/change-password | Change password | Yes |

### Student Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /students/profile | Get student profile | Yes |
| PUT | /students/profile | Update student profile | Yes |
| GET | /students/courses | Get enrolled courses | Yes |
| GET | /students/attendance | Get attendance records | Yes |

### Courses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /courses/available | Get available courses for enrollment | Yes |
| POST | /courses/enroll | Enroll in a course | Yes |
| GET | /courses/:courseId | Get course details | Yes |

### Grades
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /grades | Get all grades | Yes |
| GET | /grades/analysis | Get grade analysis and statistics | Yes |
| GET | /grades/course/:courseId | Get grades for specific course | Yes |

### Assignments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | /assignments | Get all assignments | Yes |
| GET | /assignments/:assignmentId | Get assignment details | Yes |
| POST | /assignments/:assignmentId/submit | Submit assignment | Yes |

## Request/Response Examples

### Login
**Request:**
```json
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "student@example.com",
    "studentId": "STU001",
    "grade": "10",
    "section": "A",
    "profileImage": "profile.jpg"
  }
}
```

### Get Student Profile
**Request:**
```
GET /api/students/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "student@example.com",
    "studentId": "STU001",
    "grade": "10",
    "section": "A",
    "contactNumber": "1234567890",
    "address": "123 Main St",
    "enrolledCourses": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "courseCode": "MATH101",
        "name": "Mathematics",
        "description": "Basic mathematics course"
      }
    ]
  }
}
```

### Get Assignments
**Request:**
```
GET /api/assignments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "title": "Math Assignment 1",
      "description": "Solve the following problems...",
      "course": {
        "_id": "60d0fe4f5311236168a109cb",
        "courseCode": "MATH101",
        "name": "Mathematics"
      },
      "dueDate": "2023-06-30T00:00:00.000Z",
      "maxScore": 100,
      "submissionStatus": "not_submitted"
    }
  ]
}
```

## Error Responses
All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information (only in development)"
}
```

## Real-time Notifications
Connect to WebSocket for real-time notifications:

```javascript
// Client-side code
const socket = io('http://localhost:5000');

// Join student-specific room
socket.emit('join', studentId);

// Listen for notifications
socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```