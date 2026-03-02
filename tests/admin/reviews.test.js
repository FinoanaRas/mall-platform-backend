/**
 * tests/admin/reviews.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');
const Review = require('../../models/Review');
const { User } = require('../../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

let adminToken = '';
let testReviewId = '';
let testUserId = '';

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;

    // Utilisateur temporaire pour l'avis
    const hashed = await bcrypt.hash('pass123', await bcrypt.genSalt(10));
    const user = new User({
        name: 'Reviewer Test',
        email: `reviewer_${Date.now()}@test.com`,
        password: hashed,
        profile: 'CUSTOMER',
        status: 1
    });
    await user.save();
    testUserId = user._id.toString();

    // Avis de test
    const review = new Review({
        user: testUserId,
        comment: `Super mall ! (avis test Jest ${Date.now()})`,
        rating: 5,
        targetType: 'Shop',
        idTarget: new mongoose.Types.ObjectId(),
    });
    await review.save();
    testReviewId = review._id.toString();
});

afterAll(async () => {
    if (testUserId) await User.findByIdAndDelete(testUserId);
    if (testReviewId) await Review.findByIdAndDelete(testReviewId);
});

describe('💬 Reviews Moderation — Admin', () => {

    test('✅ GET /admin/reviews → liste des avis avec info utilisateur', async () => {
        const res = await request(app)
            .get('/admin/reviews')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const found = res.body.find(r => r._id === testReviewId);
        expect(found).toBeDefined();

        // user populé : name et email présents, pas de password
        if (found && found.user && typeof found.user === 'object') {
            expect(found.user).toHaveProperty('name');
            expect(found.user).toHaveProperty('email');
            expect(found.user).not.toHaveProperty('password');
        }
    });

    test('✅ DELETE /admin/reviews/:id → supprimer un avis', async () => {
        const res = await request(app)
            .delete(`/admin/reviews/${testReviewId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted successfully/i);

        const deleted = await Review.findById(testReviewId);
        expect(deleted).toBeNull();
        testReviewId = '';
    });
});
