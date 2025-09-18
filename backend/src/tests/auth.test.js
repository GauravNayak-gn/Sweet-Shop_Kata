const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Clean the users table before each test
beforeEach(async () => {
    await db.query('DELETE FROM users');
});

// Close the database connection after all tests
afterAll(async () => {
    await db.pool.end();
});

const setupTestUser = async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES ('testuser', 'test@example.com', $1)",
        [passwordHash]
    );
};

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

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        // We need a user to exist before we can test logging in
        await setupTestUser();
    });

    it('should log in a user and return a JWT', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
        expect(res.statusCode).toEqual(401);
    });

    it('should return 404 for non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nouser@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(404);
    });
});