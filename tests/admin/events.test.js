/**
 * tests/admin/events.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');
const Event = require('../../models/Event');

let adminToken = '';
let createdEventId = '';

const TEST_EVENT = {
    title: `Soldes Test ${Date.now()}`,
    description: 'Événement créé par Jest',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 172800000).toISOString(),
};

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;
});

afterAll(async () => {
    if (createdEventId) {
        await Event.findByIdAndDelete(createdEventId);
    }
});

describe('🎉 Event Management — Admin', () => {

    test('✅ GET /admin/events → liste des événements', async () => {
        const res = await request(app)
            .get('/admin/events')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('✅ POST /admin/events → créer un événement', async () => {
        const res = await request(app)
            .post('/admin/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(TEST_EVENT);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe(TEST_EVENT.title);
        createdEventId = res.body._id;
    });

    test('✅ PUT /admin/events/:id → modifier l\'événement', async () => {
        const updatedTitle = `Soldes Modifié ${Date.now()}`;
        const res = await request(app)
            .put(`/admin/events/${createdEventId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: updatedTitle });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(updatedTitle);
    });

    test('✅ DELETE /admin/events/:id → supprimer l\'événement', async () => {
        const res = await request(app)
            .delete(`/admin/events/${createdEventId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted successfully/i);

        const deleted = await Event.findById(createdEventId);
        expect(deleted).toBeNull();
        createdEventId = '';
    });
});
