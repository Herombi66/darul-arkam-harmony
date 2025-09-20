const sequelize = require('./sequelize');

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Result = require('../models/Result');

// Define associations
User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Teacher, { foreignKey: 'userId' });
Teacher.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Parent, { foreignKey: 'userId' });
Parent.belongsTo(User, { foreignKey: 'userId' });

Student.belongsTo(Class, { foreignKey: 'classId' });
Class.hasMany(Student, { foreignKey: 'classId' });

Student.belongsToMany(Subject, { through: 'StudentSubjects', foreignKey: 'studentId' });
Subject.belongsToMany(Student, { through: 'StudentSubjects', foreignKey: 'subjectId' });

Student.belongsTo(Parent, { foreignKey: 'parentId' });
Parent.hasMany(Student, { foreignKey: 'parentId' });

Teacher.belongsToMany(Subject, { through: 'TeacherSubjects', foreignKey: 'teacherId' });
Subject.belongsToMany(Teacher, { through: 'TeacherSubjects', foreignKey: 'subjectId' });

Teacher.belongsToMany(Class, { through: 'TeacherClasses', foreignKey: 'teacherId' });
Class.belongsToMany(Teacher, { through: 'TeacherClasses', foreignKey: 'classId' });

Class.belongsTo(Teacher, { foreignKey: 'classTeacherId', as: 'classTeacher' });
Teacher.hasMany(Class, { foreignKey: 'classTeacherId' });

Class.belongsToMany(Subject, { through: 'ClassSubjects', foreignKey: 'classId' });
Subject.belongsToMany(Class, { through: 'ClassSubjects', foreignKey: 'subjectId' });

Class.hasMany(Student, { foreignKey: 'classId' });
Student.belongsTo(Class, { foreignKey: 'classId' });

Assignment.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Assignment, { foreignKey: 'subjectId' });

Assignment.belongsTo(Class, { foreignKey: 'classId' });
Class.hasMany(Assignment, { foreignKey: 'classId' });

Assignment.belongsTo(Teacher, { foreignKey: 'teacherId' });
Teacher.hasMany(Assignment, { foreignKey: 'teacherId' });

AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId' });

AssignmentSubmission.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(AssignmentSubmission, { foreignKey: 'studentId' });

Attendance.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Attendance, { foreignKey: 'studentId' });

Attendance.belongsTo(Class, { foreignKey: 'classId' });
Class.hasMany(Attendance, { foreignKey: 'classId' });

Attendance.belongsTo(Teacher, { foreignKey: 'markedBy' });
Teacher.hasMany(Attendance, { foreignKey: 'markedBy' });

Payment.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Payment, { foreignKey: 'studentId' });

Payment.belongsTo(Parent, { foreignKey: 'parentId' });
Parent.hasMany(Payment, { foreignKey: 'parentId' });

Result.belongsTo(Student, { foreignKey: 'studentId' });
Student.hasMany(Result, { foreignKey: 'studentId' });

Result.belongsTo(Class, { foreignKey: 'classId' });
Class.hasMany(Result, { foreignKey: 'classId' });

Result.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Result, { foreignKey: 'subjectId' });

Result.belongsTo(Teacher, { foreignKey: 'recordedBy' });
Teacher.hasMany(Result, { foreignKey: 'recordedBy' });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synced');
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };