# School Management System API

A comprehensive backend API for school management, handling students, teachers, parents, classes, assignments, attendance, results, and payments.

## Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Student Management**: Complete student lifecycle management
- **Teacher Management**: Teacher profiles, subject assignments, and class management
- **Parent Portal**: Parent accounts linked to students with access to relevant information
- **Payment Integration**: Fee payment system with Paystack integration
- **Academic Records**: Assignments, attendance tracking, and result management

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Paystack Payment Gateway
- Jest & Supertest for testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Paystack account (for payment integration)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd school-backend
```

2. Install dependencies
```
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRE=30d
EMAIL_HOST=<smtp-host>
EMAIL_PORT=<smtp-port>
EMAIL_USER=<smtp-username>
EMAIL_PASS=<smtp-password>
FROM_EMAIL=<sender-email>
FROM_NAME=<sender-name>
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
```

4. Start the server
```
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `PUT /auth/reset-password/:resettoken` - Reset password
- `GET /auth/me` - Get current user

### User Management
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Student Management
- `GET /students` - Get all students
- `POST /students` - Create new student
- `GET /students/:id` - Get single student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Teacher Management
- `GET /teachers` - Get all teachers
- `POST /teachers` - Create new teacher
- `GET /teachers/:id` - Get single teacher
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher

### Parent Management
- `GET /parents` - Get all parents
- `POST /parents` - Create new parent
- `GET /parents/:id` - Get single parent
- `PUT /parents/:id` - Update parent
- `DELETE /parents/:id` - Delete parent

### Payment Management
- `GET /payments` - Get all payments
- `GET /payments/:id` - Get single payment
- `POST /payments/initialize` - Initialize payment
- `GET /payments/verify` - Verify payment
- `GET /payments/:id/receipt` - Generate payment receipt

## Testing

Run the test suite with:
```
npm test
```

## License

This project is licensed under the MIT License.