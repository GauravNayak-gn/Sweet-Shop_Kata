const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

// Clean the users table before each test
beforeEach(async () => {
    await db.query('DELETE FROM users');
});

// Close the database connection after all tests
afterAll(async () => {
    await db.pool.end();
});

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 400 for missing fields', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
            });
        expect(res.statusCode).toEqual(400);
    });
});