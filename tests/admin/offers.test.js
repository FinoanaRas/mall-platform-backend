/**
 * tests/admin/offers.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');
const Offer = require('../../models/Offer');
const mongoose = require('mongoose');

let adminToken = '';
let testOfferId = '';

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;

    const offer = new Offer({
        title: `Offre Test ${Date.now()}`,
        description: 'Offre créée par tests Jest',
        targetType: 'Shop',
        idTarget: new mongoose.Types.ObjectId(),
        status: 'PENDING',
    });
    await offer.save();
    testOfferId = offer._id.toString();
});

afterAll(async () => {
    if (testOfferId) {
        await Offer.findByIdAndDelete(testOfferId);
    }
});

describe('🏷️ Offers Moderation — Admin', () => {

    test('✅ GET /admin/offers/pending → offres non validées', async () => {
        const res = await request(app)
            .get('/admin/offers/pending')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        res.body.forEach(offer => {
            expect(offer.status).not.toBe('VALIDATED');
        });
    });

    test('✅ PUT /admin/offers/:id/status → valider une offre', async () => {
        const res = await request(app)
            .put(`/admin/offers/${testOfferId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'VALIDATED' });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('VALIDATED');
    });

    test('✅ PUT /admin/offers/:id/status → rejeter une offre', async () => {
        const res = await request(app)
            .put(`/admin/offers/${testOfferId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'REJECTED' });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('REJECTED');
    });
});
