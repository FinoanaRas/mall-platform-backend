/**
 * tests/admin/dashboard.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');

let adminToken = '';

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;
});

describe('📊 Dashboard Admin — Stats', () => {

    test('✅ GET /admin/dashboard/stats → 200 avec 4 stats', async () => {
        const res = await request(app)
            .get('/admin/dashboard/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('stats');
        expect(Array.isArray(res.body.stats)).toBe(true);
        expect(res.body.stats.length).toBe(4);

        res.body.stats.forEach(stat => {
            expect(stat).toHaveProperty('title');
            expect(stat).toHaveProperty('value');
            expect(stat).toHaveProperty('icon');
            expect(typeof stat.value).toBe('number');
        });
    });

    test('✅ Stats contiennent les bons titres', async () => {
        const res = await request(app)
            .get('/admin/dashboard/stats')
            .set('Authorization', `Bearer ${adminToken}`);

        const titles = res.body.stats.map(s => s.title);
        expect(titles).toContain('Utilisateurs Totaux');
        expect(titles).toContain('Boutiques Actives');
        expect(titles).toContain('Nouveaux Clients');
        expect(titles).toContain('Demandes en Attente');
    });
});
