const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Sync student records
// @route   POST /api/sync/students
// @access  Private/Admin
exports.syncStudents = async (req, res) => {
  try {
    const { students, lastSyncTimestamp } = req.body;
    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const studentData of students) {
      try {
        // Check if student exists by roll number or external ID
        let student = await Student.findOne({
          where: {
            [Op.or]: [
              { rollNumber: studentData.rollNumber },
              { id: studentData.externalId }
            ]
          }
        });

        if (student) {
          // Update existing student
          await student.update({
            dateOfBirth: studentData.dateOfBirth,
            gender: studentData.gender,
            bloodGroup: studentData.bloodGroup,
            admissionDate: studentData.admissionDate
          });
          results.updated++;
        } else {
          // Create new student - first create user account
          const user = await User.create({
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            email: studentData.email,
            password: Math.random().toString(36), // Generate random password
            role: 'student',
            phoneNumber: studentData.phoneNumber,
            address: studentData.address
          });

          await Student.create({
            userId: user.id,
            rollNumber: studentData.rollNumber,
            dateOfBirth: studentData.dateOfBirth,
            gender: studentData.gender,
            bloodGroup: studentData.bloodGroup,
            admissionDate: studentData.admissionDate
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          student: studentData.rollNumber || studentData.externalId,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Sync attendance records
// @route   POST /api/sync/attendance
// @access  Private/Admin/Teacher
exports.syncAttendance = async (req, res) => {
  try {
    const { attendanceRecords, lastSyncTimestamp } = req.body;
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const record of attendanceRecords) {
      try {
        // Find student by roll number
        const student = await Student.findOne({
          where: { rollNumber: record.studentRollNumber }
        });

        if (!student) {
          results.errors.push({
            record: `${record.studentRollNumber} - ${record.date}`,
            error: 'Student not found'
          });
          continue;
        }

        // Check if attendance record already exists
        let attendance = await Attendance.findOne({
          where: {
            studentId: student.id,
            date: record.date
          }
        });

        if (attendance) {
          // Update existing record
          await attendance.update({
            status: record.status,
            remarks: record.remarks,
            markedById: req.user.id
          });
          results.updated++;
        } else {
          // Create new record
          await Attendance.create({
            studentId: student.id,
            markedById: req.user.id,
            date: record.date,
            status: record.status,
            remarks: record.remarks
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          record: `${record.studentRollNumber} - ${record.date}`,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Sync notifications
// @route   POST /api/sync/notifications
// @access  Private/Admin
exports.syncNotifications = async (req, res) => {
  try {
    const { notifications, lastSyncTimestamp } = req.body;
    const results = {
      created: 0,
      errors: []
    };

    for (const notificationData of notifications) {
      try {
        // Find recipient by email or external ID
        const recipient = await User.findOne({
          where: {
            [Op.or]: [
              { email: notificationData.recipientEmail },
              { id: notificationData.recipientId }
            ]
          }
        });

        if (!recipient) {
          results.errors.push({
            notification: notificationData.title,
            error: 'Recipient not found'
          });
          continue;
        }

        await Notification.create({
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'info',
          priority: notificationData.priority || 'medium',
          recipientId: recipient.id,
          senderId: req.user.id,
          expiresAt: notificationData.expiresAt,
          metadata: notificationData.metadata
        });
        results.created++;
      } catch (error) {
        results.errors.push({
          notification: notificationData.title,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get sync status and last sync timestamps
// @route   GET /api/sync/status
// @access  Private
exports.getSyncStatus = async (req, res) => {
  try {
    // Get counts for different entities
    const studentCount = await Student.count();
    const attendanceCount = await Attendance.count();
    const notificationCount = await Notification.count({
      where: { recipientId: req.user.id }
    });

    // Get last sync timestamps (this would typically be stored in a sync log table)
    const lastSync = {
      students: new Date(), // Placeholder
      attendance: new Date(), // Placeholder
      notifications: new Date() // Placeholder
    };

    res.status(200).json({
      success: true,
      data: {
        counts: {
          students: studentCount,
          attendance: attendanceCount,
          notifications: notificationCount
        },
        lastSync
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Bulk delete records for sync
// @route   DELETE /api/sync/cleanup
// @access  Private/Admin
exports.cleanupSyncData = async (req, res) => {
  try {
    const { entityType, beforeDate } = req.body;

    let deletedCount = 0;

    switch (entityType) {
      case 'attendance':
        deletedCount = await Attendance.destroy({
          where: {
            createdAt: { [Op.lt]: beforeDate }
          }
        });
        break;
      case 'notifications':
        deletedCount = await Notification.destroy({
          where: {
            createdAt: { [Op.lt]: beforeDate },
            isRead: true
          }
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid entity type'
        });
    }

    res.status(200).json({
      success: true,
      data: {
        deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};