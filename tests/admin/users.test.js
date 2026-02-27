/**
 * tests/admin/users.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');
const { User } = require('../../models/User');

let adminToken = '';
let createdUserId = '';
const TEST_EMAIL = `shopowner_${Date.now()}@test.com`;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;
});

afterAll(async () => {
    if (createdUserId) {
        await User.findByIdAndDelete(createdUserId);
    }
});

describe('👥 User Management — Admin', () => {

    test('✅ GET /admin/users → liste des utilisateurs (sans passwords)', async () => {
        const res = await request(app)
            .get('/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        // Aucun password ne doit être exposé
        res.body.forEach(user => {
            expect(user).not.toHaveProperty('password');
            expect(user).toHaveProperty('profile');
        });
    });

    test('✅ POST /admin/users → créer un utilisateur SHOP', async () => {
        const res = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Shop Owner Test',
                email: TEST_EMAIL,
                password: 'shoppass123',
                profile: 'SHOP'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('userId');
        createdUserId = res.body.userId;
    });

    test('❌ POST /admin/users → email déjà existant → 400', async () => {
        const res = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Duplicate',
                email: TEST_EMAIL,
                password: 'anypass',
                profile: 'SHOP'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });

    test('✅ PUT /admin/users/:id/status → suspendre (status: 2)', async () => {
        const res = await request(app)
            .put(`/admin/users/${createdUserId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 2 });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.status).toBe(2);
    });

    test('✅ PUT /admin/users/:id/role → changer rôle en CUSTOMER', async () => {
        const res = await request(app)
            .put(`/admin/users/${createdUserId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ profile: 'CUSTOMER' });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.profile).toBe('CUSTOMER');
    });

    test('❌ PUT /admin/users/:id/role → rôle invalide → 400', async () => {
        const res = await request(app)
            .put(`/admin/users/${createdUserId}/role`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ profile: 'SUPERADMIN' });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/Invalid profile role/i);
    });

    test('❌ PUT /admin/users/fakeId/status → user inexistant → 404', async () => {
        const fakeId = '000000000000000000000000';
        const res = await request(app)
            .put(`/admin/users/${fakeId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 1 });

        expect(res.statusCode).toBe(404);
    });
});
