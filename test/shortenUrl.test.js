// test/shortenUrl.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import app from '../app.js'; // Assure-toi que ton serveur exporte `app`

const request = supertest(app);

test('POST /shorten - should shorten a valid URL', async () => {
  const response = await request.post('/shorten').send({
    originalUrl: 'https://example.com',
  });

  assert.equal(response.statusCode, 201);
  assert.ok(response.body.shortUrl);
});

test('POST /shorten - should fail if originalUrl is missing', async () => {
  const response = await request.post('/shorten').send({});

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, 'Original URL is required');
});
