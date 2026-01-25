require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Student = require('../models/student.model');
const Course = require('../models/course.model');

(async () => {
  try {
    await connectDB();

    // Create or update a test student
    const email = 'student@example.com';
    let student = await Student.findOne({ email });

    if (!student) {
      student = new Student({
        studentId: 'STU001',
        name: 'John Doe',
        email,
        password: 'cands123',
        grade: '10',
        section: 'A',
        dateOfBirth: new Date('2008-05-15'),
        gender: 'male',
        contactNumber: '1234567890',
        address: '123 Main St, City',
        profileImage: 'default-profile.jpg'
      });
      await student.save();
      console.log('Seeded test student:', student.email);
    } else {
      console.log('Test student already exists:', student.email);
    }

    // Create a sample course if none exists
    const existingCourse = await Course.findOne({ courseCode: 'MATH101' });
    if (!existingCourse) {
      const course = new Course({
        courseCode: 'MATH101',
        name: 'Mathematics 101',
        description: 'Basic mathematics course',
        grade: '10',
        teacher: new mongoose.Types.ObjectId(), // Placeholder teacher ID
        schedule: [
          { day: 'monday', startTime: '09:00', endTime: '10:00', room: 'A1' },
          { day: 'wednesday', startTime: '09:00', endTime: '10:00', room: 'A1' }
        ]
      });
      await course.save();
      console.log('Seeded sample course:', course.courseCode);

      // Enroll the student in the sample course
      student.enrolledCourses.push(course._id);
      await student.save();
      course.students.push(student._id);
      await course.save();
      console.log('Enrolled student in course:', course.courseCode);
    }

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();