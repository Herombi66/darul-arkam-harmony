const asyncHandler = require('express-async-handler');
const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const submitApplication = asyncHandler(async (req, res) => {
  const {
    studentName,
    dateOfBirth,
    gender,
    parentName,
    parentEmail,
    parentPhone,
    address,
    previousSchool,
    classApplying,
    medicalConditions,
  } = req.body;

  const newApplication = await pool.query(
    'INSERT INTO applications (student_name, date_of_birth, gender, parent_name, parent_email, parent_phone, address, previous_school, class_applying, medical_conditions) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
    [
      studentName,
      dateOfBirth,
      gender,
      parentName,
      parentEmail,
      parentPhone,
      address,
      previousSchool,
      classApplying,
      medicalConditions,
    ]
  );

  res.status(201).json(newApplication.rows[0]);
});

const getAdmissionDashboard = asyncHandler(async (req, res) => {
  const totalInquiriesQuery = await pool.query('SELECT COUNT(*) FROM applications');
  const pendingApplicationsQuery = await pool.query('SELECT COUNT(*) FROM applications WHERE status = $1', ['Pending']);
  const admittedQuery = await pool.query('SELECT COUNT(*) FROM applications WHERE status = $1', ['Admitted']);
  const enrolledQuery = await pool.query('SELECT COUNT(*) FROM applications WHERE status = $1', ['Enrolled']);
  
  const totalInquiries = parseInt(totalInquiriesQuery.rows[0].count);
  const admitted = parseInt(admittedQuery.rows[0].count);
  const enrolled = parseInt(enrolledQuery.rows[0].count);

  const admissionRate = totalInquiries > 0 ? Math.round((admitted / totalInquiries) * 100) : 0;

  const stats = {
    totalInquiries,
    pendingApplications: parseInt(pendingApplicationsQuery.rows[0].count),
    admissionRate,
    seatsFilled: enrolled,
    totalSeats: 200,
  };

  const funnelData = [
    { name: 'Inquiries', value: totalInquiries },
    { name: 'Applied', value: (await pool.query('SELECT COUNT(*) FROM applications WHERE status != $1', ['Inquiry'])).rows[0].count },
    { name: 'Under Review', value: (await pool.query('SELECT COUNT(*) FROM applications WHERE status = $1', ['Under Review'])).rows[0].count },
    { name: 'Admitted', value: admitted },
    { name: 'Enrolled', value: enrolled },
  ];

  const applicationsByGradeQuery = await pool.query('SELECT class_applying as name, COUNT(*) as value FROM applications GROUP BY class_applying');
  const applicationsByGrade = applicationsByGradeQuery.rows;

  const recentApplicationsQuery = await pool.query('SELECT id, student_name as "studentName", class_applying as grade, status, created_at as "dateApplied" FROM applications ORDER BY created_at DESC LIMIT 5');
  const recentApplications = recentApplicationsQuery.rows;

  res.json({
    stats,
    funnelData,
    applicationsByGrade,
    recentApplications,
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const applicationsQuery = await pool.query('SELECT id, student_name as name, class_applying as grade, status, created_at as date FROM applications ORDER BY created_at DESC');
  const applications = applicationsQuery.rows;
  res.json(applications);
});

const acceptApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const applicationQuery = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
  const application = applicationQuery.rows[0];

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    let pdfData = Buffer.concat(buffers);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Darul Arkam" <no-reply@darularkam.com>',
      to: application.parent_email,
      subject: 'Congratulations on your admission to Darul Arkam',
      text: `Congratulations ${application.student_name}, you have been admitted to Darul-Arkam.`,
      attachments: [
        {
          filename: 'admission-letter.pdf',
          content: pdfData,
          contentType: 'application/pdf',
        },
      ],
    });
  });

  doc.fontSize(25).text('Admission Letter', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Dear ${application.parent_name},`);
  doc.moveDown();
  doc.text(`We are pleased to inform you that ${application.student_name} has been admitted to Darul Arkam for the upcoming academic year.`);
  doc.moveDown();
  doc.text('We are excited to have you join our community.');
  doc.end();

  await pool.query('UPDATE applications SET status = $1 WHERE id = $2', ['Admitted', id]);

  res.json({ message: 'Application accepted and email sent' });
});

module.exports = {
  submitApplication,
  getAdmissionDashboard,
  acceptApplication,
  getApplications,
};