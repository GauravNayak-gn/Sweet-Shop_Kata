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

    // PUT /api/sweets/:id
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

    // DELETE /api/sweets/:id
    describe('DELETE /api/sweets/:id', () => {
        let sweetId;

        beforeEach(async () => {
            const result = await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Temporary Candy', 'Ephemeral', 1.00, 1) RETURNING id");
            sweetId = result.rows[0].id;
        });

        it('should return 403 if a regular user tries to delete', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(403);
        });

        it('should delete a sweet if user is an admin', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Sweet deleted successfully');

            // Verify it's actually gone from the DB
            const verifyRes = await db.query('SELECT * FROM sweets WHERE id = $1', [sweetId]);
            expect(verifyRes.rows.length).toBe(0);
        });

        it('should return 404 if sweet ID to delete does not exist', async () => {
            const nonExistentId = 9999;
            const res = await request(app)
                .delete(`/api/sweets/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(404);
        });
    });

    // GET /api/sweets/search
    describe('GET /api/sweets/search', () => {
        beforeEach(async () => {
            // Seed the database with some sweets for searching
            await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Gummy Bear', 'Candy', 1.99, 100)");
            await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Milk Chocolate', 'Chocolate', 3.50, 50)");
            await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Dark Chocolate', 'Chocolate', 4.00, 30)");
            await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Lollipop', 'Candy', 0.99, 200)");
        });

        it('should find sweets by name (case-insensitive)', async () => {
            const res = await request(app)
                .get('/api/sweets/search?name=chocolate')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].name).toBe('Dark Chocolate'); // Assuming default order
            expect(res.body[1].name).toBe('Milk Chocolate');
        });

        it('should find sweets by category', async () => {
            const res = await request(app)
                .get('/api/sweets/search?category=Candy')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
        });

        it('should find sweets within a price range', async () => {
            const res = await request(app)
                .get('/api/sweets/search?minPrice=1.00&maxPrice=3.50')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2); // Gummy Bear and Milk Chocolate
        });

        it('should combine search filters', async () => {
            const res = await request(app)
                .get('/api/sweets/search?category=Chocolate&maxPrice=3.50')
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Milk Chocolate');
        });
    });

    // POST /api/sweets/:id/purchase
    describe('POST /api/sweets/:id/purchase', () => {
        let sweetId;
        beforeEach(async () => {
            const result = await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Lollipop', 'Candy', 0.99, 10) RETURNING id");
            sweetId = result.rows[0].id;
        });

        it('should decrease the quantity of a sweet on purchase', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toBe(9);
        });

        it('should return 400 if trying to purchase an out-of-stock sweet', async () => {
            // Set quantity to 0
            await db.query('UPDATE sweets SET quantity = 0 WHERE id = $1', [sweetId]);

            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Sweet is out of stock');
        });
    });

    // POST /api/sweets/:id/restock
    describe('POST /api/sweets/:id/restock', () => {
        let sweetId;
        beforeEach(async () => {
            const result = await db.query("INSERT INTO sweets (name, category, price, quantity) VALUES ('Gummy Worm', 'Candy', 1.50, 5) RETURNING id");
            sweetId = result.rows[0].id;
        });

        it('should increase the quantity of a sweet (admin only)', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ amount: 20 });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toBe(25);
        });

        it('should return 403 if a regular user tries to restock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ amount: 20 });

            expect(res.statusCode).toEqual(403);
        });
    });

});