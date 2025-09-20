const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const { Op } = require('sequelize');

// @desc    Get data processing consent status
// @route   GET /api/privacy/consent
// @access  Private
exports.getConsentStatus = async (req, res) => {
  try {
    // In a real implementation, this would check a consent log table
    const consentStatus = {
      dataProcessing: true,
      marketing: false,
      thirdPartySharing: false,
      lastUpdated: new Date().toISOString(),
      consentVersion: "1.0"
    };

    res.status(200).json({
      success: true,
      data: consentStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update data processing consent
// @route   PUT /api/privacy/consent
// @access  Private
exports.updateConsent = async (req, res) => {
  try {
    const { dataProcessing, marketing, thirdPartySharing } = req.body;

    // In a real implementation, this would update a consent log table
    const updatedConsent = {
      dataProcessing: dataProcessing !== undefined ? dataProcessing : true,
      marketing: marketing || false,
      thirdPartySharing: thirdPartySharing || false,
      lastUpdated: new Date().toISOString(),
      consentVersion: "1.0"
    };

    res.status(200).json({
      success: true,
      message: "Consent preferences updated successfully",
      data: updatedConsent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Request data export (GDPR Article 20)
// @route   POST /api/privacy/export
// @access  Private
exports.requestDataExport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Gather all user data
    const user = await User.findByPk(userId);
    const studentProfile = await Student.findOne({ where: { userId } });
    const attendanceRecords = await Attendance.findAll({
      where: { studentId: studentProfile?.id },
      include: [{ model: User, as: 'markedBy', attributes: ['firstName', 'lastName'] }]
    });
    const notifications = await Notification.findAll({
      where: { recipientId: userId },
      include: [{ model: User, as: 'sender', attributes: ['firstName', 'lastName'] }]
    });

    const exportData = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        createdAt: user.createdAt,
        lastLogin: user.updatedAt // Approximation
      },
      studentProfile: studentProfile ? {
        id: studentProfile.id,
        rollNumber: studentProfile.rollNumber,
        dateOfBirth: studentProfile.dateOfBirth,
        gender: studentProfile.gender,
        bloodGroup: studentProfile.bloodGroup,
        admissionDate: studentProfile.admissionDate
      } : null,
      attendanceRecords: attendanceRecords.map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        remarks: record.remarks,
        markedBy: record.markedBy ? `${record.markedBy.firstName} ${record.markedBy.lastName}` : null,
        createdAt: record.createdAt
      })),
      notifications: notifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        isRead: notification.isRead,
        readAt: notification.readAt,
        sender: notification.sender ? `${notification.sender.firstName} ${notification.sender.lastName}` : null,
        createdAt: notification.createdAt
      })),
      exportDate: new Date().toISOString(),
      dataRetention: "Data retained for 7 years from last activity"
    };

    res.status(200).json({
      success: true,
      message: "Data export prepared successfully",
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Request data deletion (Right to be forgotten - GDPR Article 17)
// @route   DELETE /api/privacy/delete
// @access  Private
exports.requestDataDeletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const confirmDeletion = req.body.confirmDeletion;

    if (!confirmDeletion) {
      return res.status(400).json({
        success: false,
        error: "Please confirm deletion by setting confirmDeletion to true"
      });
    }

    // Start transaction for data deletion
    const transaction = await sequelize.transaction();

    try {
      // Find student profile
      const studentProfile = await Student.findOne({
        where: { userId },
        transaction
      });

      if (studentProfile) {
        // Delete attendance records
        await Attendance.destroy({
          where: { studentId: studentProfile.id },
          transaction
        });

        // Delete student profile
        await Student.destroy({
          where: { id: studentProfile.id },
          transaction
        });
      }

      // Delete notifications
      await Notification.destroy({
        where: { recipientId: userId },
        transaction
      });

      // Anonymize user data instead of deleting (for audit purposes)
      await User.update({
        firstName: 'Deleted',
        lastName: 'User',
        email: `deleted_${userId}@anonymous.local`,
        phoneNumber: null,
        address: null,
        resetPasswordToken: null,
        resetPasswordExpire: null
      }, {
        where: { id: userId },
        transaction
      });

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: "Data deletion request processed successfully. Your personal data has been anonymized.",
        deletionDate: new Date().toISOString()
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get data retention policy
// @route   GET /api/privacy/retention
// @access  Public
exports.getRetentionPolicy = async (req, res) => {
  try {
    const retentionPolicy = {
      studentRecords: "7 years from graduation or last activity",
      attendanceRecords: "7 years from record date",
      notificationRecords: "2 years from creation date",
      userAccountData: "Indefinite (anonymized after account deletion)",
      auditLogs: "7 years from event date",
      lastUpdated: "2024-01-15T00:00:00Z"
    };

    res.status(200).json({
      success: true,
      data: retentionPolicy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Report data breach (GDPR Article 33-34)
// @route   POST /api/privacy/breach
// @access  Private/Admin
exports.reportDataBreach = async (req, res) => {
  try {
    const { breachDescription, affectedUsers, breachDate, dataTypes } = req.body;

    // In a real implementation, this would:
    // 1. Log the breach in a secure audit system
    // 2. Notify affected users within 72 hours
    // 3. Report to supervisory authority if needed
    // 4. Implement remediation measures

    const breachReport = {
      id: `breach_${Date.now()}`,
      description: breachDescription,
      affectedUsers: affectedUsers,
      breachDate: breachDate,
      dataTypes: dataTypes,
      reportedBy: req.user.id,
      reportedAt: new Date().toISOString(),
      status: "investigating"
    };

    // Log breach (in production, this would go to a secure logging system)
    console.error('DATA BREACH REPORTED:', JSON.stringify(breachReport, null, 2));

    res.status(201).json({
      success: true,
      message: "Data breach reported successfully. Investigation will begin immediately.",
      data: breachReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get privacy dashboard
// @route   GET /api/privacy/dashboard
// @access  Private
exports.getPrivacyDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's data summary
    const user = await User.findByPk(userId);
    const studentProfile = await Student.findOne({ where: { userId } });
    const attendanceCount = studentProfile ?
      await Attendance.count({ where: { studentId: studentProfile.id } }) : 0;
    const notificationCount = await Notification.count({ where: { recipientId: userId } });

    const dashboard = {
      accountInfo: {
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastActivity: user.updatedAt
      },
      dataSummary: {
        studentProfile: !!studentProfile,
        attendanceRecords: attendanceCount,
        notifications: notificationCount,
        totalDataPoints: attendanceCount + notificationCount + (studentProfile ? 1 : 0)
      },
      privacySettings: {
        dataProcessingConsent: true,
        marketingConsent: false,
        thirdPartySharing: false,
        lastUpdated: user.updatedAt
      },
      rights: {
        accessRight: true,
        rectificationRight: true,
        erasureRight: true,
        restrictionRight: true,
        portabilityRight: true,
        objectionRight: true
      }
    };

    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};