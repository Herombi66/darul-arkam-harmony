const Payment = require('../models/Payment');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin/Finance
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('student', 'rollNumber')
      .populate('parent', 'user')
      .populate({
        path: 'parent',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private/Admin/Finance/Parent
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate('parent', 'user');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    // Check if user is authorized to view this payment
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user.id });
      if (payment.parent.toString() !== parent._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to access this payment'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Initialize payment
// @route   POST /api/payments/initialize
// @access  Private/Parent/Admin/Finance
exports.initializePayment = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      paymentType,
      description,
      academicYear,
      term
    } = req.body;
    
    // Validate required fields
    if (!studentId || !amount || !paymentType || !academicYear || !term) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Get student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    // Get parent
    let parent;
    if (req.user.role === 'parent') {
      parent = await Parent.findOne({ user: req.user.id });
      
      // Check if student belongs to parent
      if (!parent.children.includes(student._id)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to make payment for this student'
        });
      }
    } else {
      // If admin or finance officer is making payment, get student's parent
      if (!student.parent) {
        return res.status(400).json({
          success: false,
          error: 'Student has no associated parent'
        });
      }
      parent = await Parent.findById(student.parent);
    }
    
    // Get user details for payment
    const user = await User.findById(parent.user);
    
    // Generate reference
    const reference = `SMS-${uuidv4()}`;
    
    // Initialize Paystack transaction
    const paystackResponse = await paystack.transaction.initialize({
      email: user.email,
      amount: amount * 100, // Paystack amount in kobo (multiply by 100)
      reference,
      callback_url: `${req.protocol}://${req.get('host')}/api/payments/verify`,
      metadata: {
        studentId: student._id,
        parentId: parent._id,
        paymentType,
        description,
        academicYear,
        term
      }
    });
    
    if (!paystackResponse.status) {
      return res.status(400).json({
        success: false,
        error: 'Payment initialization failed'
      });
    }
    
    // Create payment record with pending status
    const payment = await Payment.create({
      student: student._id,
      parent: parent._id,
      amount,
      paymentType,
      description,
      academicYear,
      term,
      paymentMethod: 'paystack',
      transactionReference: reference,
      paymentStatus: 'pending'
    });
    
    res.status(200).json({
      success: true,
      data: {
        payment,
        authorization_url: paystackResponse.data.authorization_url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        error: 'No reference provided'
      });
    }
    
    // Verify payment with Paystack
    const paystackResponse = await paystack.transaction.verify(reference);
    
    if (!paystackResponse.status || paystackResponse.data.status !== 'success') {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { transactionReference: reference },
        { paymentStatus: 'failed' }
      );
      
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
    
    // Update payment status to completed
    const payment = await Payment.findOneAndUpdate(
      { transactionReference: reference },
      { 
        paymentStatus: 'completed',
        paymentDate: Date.now()
      },
      { new: true }
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get payment receipt
// @route   GET /api/payments/:id/receipt
// @access  Private/Admin/Finance/Parent
exports.getPaymentReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'rollNumber')
      .populate({
        path: 'student',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .populate({
        path: 'parent',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    
    // Check if payment is completed
    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot generate receipt for incomplete payment'
      });
    }
    
    // Check if user is authorized to view this receipt
    if (req.user.role === 'parent') {
      const parent = await Parent.findOne({ user: req.user.id });
      if (payment.parent.toString() !== parent._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to access this receipt'
        });
      }
    }
    
    // Generate receipt data
    const receiptData = {
      receiptNumber: `SMS-RCP-${payment._id.toString().substr(-6)}`,
      paymentDate: payment.paymentDate,
      student: {
        name: `${payment.student.user.firstName} ${payment.student.user.lastName}`,
        rollNumber: payment.student.rollNumber
      },
      parent: {
        name: `${payment.parent.user.firstName} ${payment.parent.user.lastName}`,
        email: payment.parent.user.email
      },
      amount: payment.amount,
      paymentType: payment.paymentType,
      description: payment.description,
      academicYear: payment.academicYear,
      term: payment.term,
      transactionReference: payment.transactionReference
    };
    
    res.status(200).json({
      success: true,
      data: receiptData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};