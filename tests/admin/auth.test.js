/**
 * tests/admin/auth.test.js
 * Tests d'authentification et des middlewares (authMiddleware + adminMiddleware)
 */

require('../setup');
const request = require('supertest');
const app = require('../app');

const ADMIN_EMAIL = 'admin@mall.com';
const ADMIN_PASSWORD = 'admin123';

describe('🔐 Authentification — Admin', () => {

    test('✅ Login admin → reçoit un JWT valide', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body.token.length).toBeGreaterThan(10);
    });

    test('❌ Login avec mauvais mot de passe → erreur', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: ADMIN_EMAIL, password: 'wrong_pass' });

        expect(res.statusCode).not.toBe(200);
        expect(res.body).toHaveProperty('message');
    });

    test('❌ Accès route protégée sans token → 401', async () => {
        const res = await request(app)
            .get('/admin/dashboard/stats');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/No token provided/i);
    });

    test('❌ Accès route admin avec token CUSTOMER → 403', async () => {
        const bcrypt = require('bcryptjs');
        const { User } = require('../../models/User');
        const AuthService = require('../../services/authService');

        const email = `testcustomer_auth_${Date.now()}@test.com`;
        const hashed = await bcrypt.hash('pass123', await bcrypt.genSalt(10));
        const customer = new User({ name: 'Test Customer', email, password: hashed, profile: 'CUSTOMER', status: 1 });
        await customer.save();

        const customerToken = await AuthService.authenticate(email, 'pass123');

        const res = await request(app)
            .get('/admin/dashboard/stats')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/Admin access required/i);

        await User.findByIdAndDelete(customer._id);
    });
});
