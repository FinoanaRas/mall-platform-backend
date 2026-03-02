/**
 * tests/admin/categories.test.js
 */

require('../setup');
const request = require('supertest');
const app = require('../app');
const Category = require('../../models/Category');

let adminToken = '';
let createdCategoryId = '';
const TEST_CATEGORY_NAME = `TestCat_${Date.now()}`;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@mall.com', password: 'admin123' });
    adminToken = res.body.token;
});

afterAll(async () => {
    if (createdCategoryId) {
        await Category.findByIdAndDelete(createdCategoryId);
    }
});

describe('🏷️ Category Management — Admin', () => {

    test('✅ GET /admin/categories → liste des catégories', async () => {
        const res = await request(app)
            .get('/admin/categories')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('✅ POST /admin/categories → créer une catégorie', async () => {
        const res = await request(app)
            .post('/admin/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: TEST_CATEGORY_NAME });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(TEST_CATEGORY_NAME);
        createdCategoryId = res.body._id;
    });

    test('✅ DELETE /admin/categories/:id → supprimer la catégorie', async () => {
        const res = await request(app)
            .delete(`/admin/categories/${createdCategoryId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted successfully/i);

        const deleted = await Category.findById(createdCategoryId);
        expect(deleted).toBeNull();
        createdCategoryId = '';
    });
});
