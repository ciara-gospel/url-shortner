import { test } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

const request = supertest(app);

// Génère un token JWT valide à utiliser dans les requêtes de test
const userPayload = {
  id: 'user123',
  email: 'test@example.com',
};

const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

test('POST /api/shorten - should shorten a valid URL', async () => {
  const response = await request
    .post('/api/shorten')
    .set('Authorization', `Bearer ${token}`)
    .send({ originalUrl: 'https://example.com' });

  assert.equal(response.statusCode, 201);
  assert.ok(response.body.shortUrl, 'shortUrl should be returned');
});

test('POST /api/shorten - should fail if originalUrl is missing', async () => {
  const response = await request
    .post('/api/shorten')
    .set('Authorization', `Bearer ${token}`)
    .send({});

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, 'Original URL is required');
});
