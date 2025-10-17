const request = require('supertest');
const app = require('../src/server');
const Event = require('../src/models/Event');
const User = require('../src/models/User');

describe('Events API', () => {
  let adminToken;
  let teacherToken;
  let studentToken;
  let testEventId;

  beforeAll(async () => {
    // Create test users and get tokens
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Admin',
        lastName: 'Test',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    adminToken = adminRes.body.token;

    const teacherRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Teacher',
        lastName: 'Test',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher'
      });

    teacherToken = teacherRes.body.token;

    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Student',
        lastName: 'Test',
        email: 'student@test.com',
        password: 'password123',
        role: 'student'
      });

    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await Event.destroy({ where: {} });
    await User.destroy({ where: { email: ['admin@test.com', 'teacher@test.com', 'student@test.com'] } });
  });

  describe('POST /api/events', () => {
    it('should create a new event as admin', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Event',
          description: 'This is a test event',
          date: '2024-12-25',
          startTime: '10:00',
          endTime: '12:00',
          location: 'School Hall',
          type: 'academic',
          maxAttendees: 100,
          priority: 'high'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Test Event');
      testEventId = res.body.data.id;
    });

    it('should create a new event as teacher', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Teacher Event',
          description: 'Event created by teacher',
          date: '2024-12-26',
          startTime: '14:00',
          endTime: '16:00',
          location: 'Classroom A',
          type: 'academic',
          priority: 'medium'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should not create event without authentication', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'Unauthorized Event',
          description: 'This should fail',
          date: '2024-12-27',
          startTime: '10:00',
          endTime: '12:00',
          location: 'School Hall',
          type: 'academic'
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should not create event as student', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Student Event',
          description: 'This should fail',
          date: '2024-12-27',
          startTime: '10:00',
          endTime: '12:00',
          location: 'School Hall',
          type: 'academic'
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/events', () => {
    it('should get all events', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should filter events by type', async () => {
      const res = await request(app)
        .get('/api/events?type=academic')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should get single event', async () => {
      const res = await request(app)
        .get(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id', testEventId);
    });

    it('should return 404 for non-existent event', async () => {
      const res = await request(app)
        .get('/api/events/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update event as admin', async () => {
      const res = await request(app)
        .put(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Test Event',
          description: 'This event has been updated'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title', 'Updated Test Event');
    });

    it('should not update event as student', async () => {
      const res = await request(app)
        .put(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Update'
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /api/events/:id/register', () => {
    it('should register for event', async () => {
      const res = await request(app)
        .post(`/api/events/${testEventId}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Successfully registered for event');
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event as admin', async () => {
      const res = await request(app)
        .delete(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should not delete event as student', async () => {
      // Create another event first
      const createRes = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Event to Delete',
          description: 'This will be deleted',
          date: '2024-12-28',
          startTime: '10:00',
          endTime: '12:00',
          location: 'Test Location',
          type: 'academic'
        });

      const eventId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });
});