import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

import request from 'supertest';

import { createApp } from '../src/app.js';
import { Sequelize } from 'sequelize';

import { defineNote, migrate } from '../src/db.js';

const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
const Note = defineNote(sequelize);
const app = createApp({ Note, rateLimits: false, clientDist: '/nonexistent' });

before(() => migrate(sequelize, { logger: undefined }));
after(() => sequelize.close());

const createNote = (body) => request(app).post('/api/notes').send(body);

describe('POST /api/notes', () => {
  it('creates a note and returns a server-generated token', async () => {
    const res = await createNote({ emoji: 'love letter', note: 'Hello friend' });
    assert.equal(res.status, 201);
    assert.match(res.body.token, /^[A-Za-z0-9_-]{22}$/);
  });

  it('ignores a token provided by the client', async () => {
    const res = await createNote({ emoji: 'heart eyes', note: 'Hi', token: 'CHOSEN-BY-ATTACKER' });
    assert.equal(res.status, 201);
    assert.notEqual(res.body.token, 'CHOSEN-BY-ATTACKER');
  });

  it('generates unique tokens', async () => {
    const tokens = await Promise.all(
      Array.from({ length: 20 }, () => createNote({ emoji: 'tears of joy', note: 'x' })),
    );
    assert.equal(new Set(tokens.map((r) => r.body.token)).size, 20);
  });

  const invalidBodies = {
    'an unknown emoji': { emoji: 'skull', note: 'Hello' },
    'a missing note': { emoji: 'love letter' },
    'a blank note': { emoji: 'love letter', note: '   ' },
    'a non-string note': { emoji: 'love letter', note: { $gt: '' } },
    'a note over 150 characters': { emoji: 'love letter', note: 'a'.repeat(151) },
    'a note with a NUL byte': { emoji: 'love letter', note: 'a\u0000b' },
  };
  for (const [label, body] of Object.entries(invalidBodies)) {
    it(`rejects ${label} with 400`, async () => {
      const res = await createNote(body);
      assert.equal(res.status, 400);
      assert.ok(res.body.error);
    });
  }

  it('keeps line breaks in the note', async () => {
    const res = await createNote({ emoji: 'love letter', note: 'Dear friend,\nSee you soon!' });
    assert.equal(res.status, 201);
  });

  it('counts emoji as single characters', async () => {
    const res = await createNote({ emoji: 'love letter', note: '💌'.repeat(150) });
    assert.equal(res.status, 201);
  });

  it('rejects malformed JSON with 400 without leaking internals', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Content-Type', 'application/json')
      .send('{"emoji":');
    assert.equal(res.status, 400);
    assert.doesNotMatch(JSON.stringify(res.body), /at .*\.js/);
  });

  it('rejects oversized payloads with 413', async () => {
    const res = await createNote({ emoji: 'love letter', note: 'a'.repeat(10_000) });
    assert.equal(res.status, 413);
  });
});

describe('GET /api/notes/:token', () => {
  it('returns only the emoji and the note', async () => {
    const { body } = await createNote({ emoji: 'christmas tree', note: '  Merry Xmas  ' });
    const res = await request(app).get(`/api/notes/${body.token}`);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { emoji: 'christmas tree', note: 'Merry Xmas' });
    assert.equal(res.headers['cache-control'], 'no-store');
  });

  it('still reads notes created with v3 tokens', async () => {
    await Note.create({ emoji: 'heart eyes', note: 'legacy', token: 'TOBINR3T-M0MW1395-ABCDEFGH' });
    const res = await request(app).get('/api/notes/TOBINR3T-M0MW1395-ABCDEFGH');
    assert.equal(res.status, 200);
    assert.equal(res.body.note, 'legacy');
  });

  it('returns 404 for an unknown token', async () => {
    const res = await request(app).get('/api/notes/doesNotExist123');
    assert.equal(res.status, 404);
  });

  it('returns 400 for a malformed token', async () => {
    const res = await request(app).get(`/api/notes/${encodeURIComponent("' OR 1=1 --")}`);
    assert.equal(res.status, 400);
  });
});

describe('API hardening', () => {
  it('does not expose a route listing every note', async () => {
    await createNote({ emoji: 'love letter', note: 'secret' });
    const res = await request(app).get('/api/notes');
    assert.equal(res.status, 404);
    assert.doesNotMatch(res.text, /secret/);
  });

  it('sends security headers', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.ok(res.headers['content-security-policy']);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-powered-by'], undefined);
  });

  it('rate limits note creation', async () => {
    const limitedApp = createApp({ Note, clientDist: '/nonexistent' });
    const responses = [];
    for (let i = 0; i < 31; i++) {
      responses.push(
        await request(limitedApp)
          .post('/api/notes')
          .send({ emoji: 'love letter', note: `n${i}` }),
      );
    }
    assert.equal(responses.at(-2).status, 201);
    assert.equal(responses.at(-1).status, 429);
  });
});

describe('static client', () => {
  const dist = mkdtempSync(path.join(tmpdir(), 'emojinotes-dist-'));
  mkdirSync(path.join(dist, 'assets'));
  writeFileSync(path.join(dist, 'index.html'), '<!doctype html><div id="root"></div>');
  writeFileSync(path.join(dist, 'assets', 'app.js'), 'console.log(1)');
  const staticApp = createApp({ Note, rateLimits: false, clientDist: dist });

  it('serves fingerprinted assets with a long cache', async () => {
    const res = await request(staticApp).get('/assets/app.js');
    assert.equal(res.status, 200);
    assert.match(res.headers['cache-control'], /immutable/);
  });

  it('returns 404 for a missing asset instead of the HTML page', async () => {
    const res = await request(staticApp).get('/assets/old-chunk.js');
    assert.equal(res.status, 404);
  });

  it('serves the SPA on note routes, marked noindex', async () => {
    const res = await request(staticApp).get('/n/abc123XYZ');
    assert.equal(res.status, 200);
    assert.match(res.text, /id="root"/);
    assert.equal(res.headers['x-robots-tag'], 'noindex');
  });

  it('does not force HTTPS upgrades in the CSP', async () => {
    const res = await request(staticApp).get('/');
    assert.doesNotMatch(res.headers['content-security-policy'], /upgrade-insecure-requests/);
  });
});
