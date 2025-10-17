const request = require('supertest');
const app = require('../src/server');
const SupportTicket = require('../src/models/SupportTicket');
const TicketResponse = require('../src/models/TicketResponse');
const User = require('../src/models/User');

describe('Support Tickets API', () => {
  let adminToken;
  let teacherToken;
  let studentToken;
  let testTicketId;

  beforeAll(async () => {
    // Create test users and get tokens
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'Support',
        email: 'admin@support.com',
        password: 'password123',
        role: 'admin'
      });

    adminToken = adminRes.body.token;

    const teacherRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Teacher',
        lastName: 'Support',
        email: 'teacher@support.com',
        password: 'password123',
        role: 'teacher'
      });

    teacherToken = teacherRes.body.token;

    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Student',
        lastName: 'Support',
        email: 'student@support.com',
        password: 'password123',
        role: 'student'
      });

    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await TicketResponse.destroy({ where: {} });
    await SupportTicket.destroy({ where: {} });
    await User.destroy({ where: { email: ['admin@support.com', 'teacher@support.com', 'student@support.com'] } });
  });

  describe('POST /api/support/tickets', () => {
    it('should create a new support ticket', async () => {
      const res = await request(app)
        .post('/api/support/tickets')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Test Support Ticket',
          description: 'This is a test support ticket for testing purposes',
          category: 'technical',
          priority: 'medium'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Test Support Ticket');
      testTicketId = res.body.data.id;
    });

    it('should not create ticket without authentication', async () => {
      const res = await request(app)
        .post('/api/support/tickets')
        .send({
          title: 'Unauthorized Ticket',
          description: 'This should fail',
          category: 'technical'
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/support/tickets', () => {
    it('should get all tickets for authenticated user', async () => {
      const res = await request(app)
        .get('/api/support/tickets')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter tickets by status', async () => {
      const res = await request(app)
        .get('/api/support/tickets?status=open')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('GET /api/support/tickets/:id', () => {
    it('should get single ticket', async () => {
      const res = await request(app)
        .get(`/api/support/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id', testTicketId);
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .get('/api/support/tickets/99999')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/support/tickets/:id/responses', () => {
    it('should add response to ticket', async () => {
      const res = await request(app)
        .post(`/api/support/tickets/${testTicketId}/responses`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          content: 'This is a test response to the support ticket',
          isInternal: false
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('content', 'This is a test response to the support ticket');
    });
  });

  describe('PUT /api/support/tickets/:id', () => {
    it('should update ticket as admin', async () => {
      const res = await request(app)
        .put(`/api/support/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'in_progress',
          priority: 'high'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('status', 'in_progress');
    });

    it('should not update ticket as student', async () => {
      const res = await request(app)
        .put(`/api/support/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'resolved'
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('PUT /api/support/tickets/:id/assign', () => {
    it('should assign ticket to staff', async () => {
      const res = await request(app)
        .put(`/api/support/tickets/${testTicketId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          assignedToId: 2 // Teacher ID
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Ticket assigned successfully');
    });
  });

  describe('GET /api/support/stats', () => {
    it('should get support statistics', async () => {
      const res = await request(app)
        .get('/api/support/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('totalTickets');
      expect(res.body.data).toHaveProperty('openTickets');
    });

    it('should not get stats as student', async () => {
      const res = await request(app)
        .get('/api/support/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('DELETE /api/support/tickets/:id', () => {
    it('should delete ticket as admin', async () => {
      const res = await request(app)
        .delete(`/api/support/tickets/${testTicketId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should not delete ticket as teacher', async () => {
      // Create another ticket first
      const createRes = await request(app)
        .post('/api/support/tickets')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Ticket to Delete',
          description: 'This will be deleted',
          category: 'technical'
        });

      const ticketId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/support/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });
});