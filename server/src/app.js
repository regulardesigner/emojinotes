import { existsSync } from 'node:fs';
import path from 'node:path';

import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { notesRouter } from './routes/notes.js';

const CLIENT_DIST = path.resolve(import.meta.dirname, '../../client/dist');

const noLimit = (req, res, next) => next();

export function createApp({ Note, trustProxy = 0, rateLimits = true, clientDist = CLIENT_DIST }) {
  const app = express();

  app.set('trust proxy', trustProxy);
  app.use(
    helmet({
      // HTTPS is enforced by the hosting platform and HSTS. Upgrading requests here would
      // break plain-HTTP setups such as opening `docker compose` from a phone on the LAN.
      contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
    }),
  );
  app.use(express.json({ limit: '4kb' }));

  const limiter = (limit) =>
    rateLimits
      ? rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: 'draft-8', legacyHeaders: false })
      : noLimit;

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', limiter(300));
  app.use('/api/notes', notesRouter({ Note, createLimiter: limiter(30) }));
  app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }));

  if (existsSync(clientDist)) {
    // Vite fingerprints asset filenames, so they can be cached forever.
    app.use(
      '/assets',
      express.static(path.join(clientDist, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }),
    );
    app.use(express.static(clientDist, { index: false }));
    // Private notes should not show up in search engines.
    app.use(['/n', '/share'], (req, res, next) => {
      res.set('X-Robots-Tag', 'noindex');
      next();
    });
    // Let the React router handle every other route.
    app.get('/{*splat}', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  // eslint-disable-next-line no-unused-vars -- Express needs the 4-argument signature.
  app.use((err, req, res, next) => {
    // Client errors raised by middleware: malformed JSON, payload too large, missing asset…
    if (err.status >= 400 && err.status < 500) {
      return res.status(err.status).json({ error: err.expose ? err.message : 'request error' });
    }
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}
