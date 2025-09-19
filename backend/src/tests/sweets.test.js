const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

let userToken;
let adminToken;

beforeAll(async () => {
    // Clean tables before all tests run
    await db.query('DELETE FROM sweets');
    await db.query('DELETE FROM users');
    
    // Create a regular user and an admin user
    const passwordHash = await require('bcryptjs').hash('password123', 10);
    await db.query("INSERT INTO users (username, email, password_hash, role) VALUES ('testuser', 'user@example.com', $1, 'customer')", [passwordHash]);
    await db.query("INSERT INTO users (username, email, password_hash, role) VALUES ('adminuser', 'admin@example.com', $1, 'admin')", [passwordHash]);
    
    // Generate tokens for them
    const user = { id: 1, email: 'user@example.com', role: 'customer' };
    const admin = { id: 2, email: 'admin@example.com', role: 'admin' };
    userToken = jwt.sign(user, process.env.JWT_SECRET);
    adminToken = jwt.sign(admin, process.env.JWT_SECRET);
});

afterAll(async () => {
    await db.pool.end();
});

beforeEach(async () => {
    // Clean sweets table before each test in this suite
    await db.query('DELETE FROM sweets');
});


describe('Sweets API', () => {
    // GET /api/sweets
    describe('GET /api/sweets', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app).get('/api/sweets');
            expect(res.statusCode).toEqual(401);
        });

        it('should return a list of sweets for an authenticated user', async () => {
            await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Gummy Bear', 'Candy', 1.99, 100)");
            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Gummy Bear');
        });
    });

    // POST /api/sweets
    describe('POST /api/sweets', () => {
        it('should add a new sweet if user is an admin', async () => {
             const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Bar',
                    category: 'Chocolate',
                    price: 2.50,
                    quantity: 50
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('name', 'Chocolate Bar');
        });

        it('should return 403 if user is not an admin', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Forbidden Candy', category: 'N/A', price: 99, quantity: 1 });
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('PUT /api/sweets/:id', () => {
        let sweetId;

        beforeEach(async () => {
            const result = await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Old Candy', 'Vintage', 5.00, 10) RETURNING id");
            sweetId = result.rows[0].id;
        });
        
        it('should return 403 if a regular user tries to update', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'New Name', price: 6.00 });
            
            expect(res.statusCode).toEqual(403);
        });

        it('should update a sweet if user is an admin', async () => {
            const updatedData = {
                name: 'Updated Candy',
                category: 'Modern',
                price: 5.50,
                quantity: 15
            };

            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updatedData);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.name).toBe('Updated Candy');
            expect(res.body.price).toBe('5.50'); // Note: pg returns decimal as string
            expect(res.body.quantity).toBe(15);
        });

        it('should return 404 if sweet ID does not exist', async () => {
            const nonExistentId = 9999;
            const res = await request(app)
                .put(`/api/sweets/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Ghost Candy' });
            
            expect(res.statusCode).toEqual(404);
        });
    });
});