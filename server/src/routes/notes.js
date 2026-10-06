import { randomBytes } from 'node:crypto';

import express from 'express';

import { EMOJI_KEYS, NOTE_MAX_LENGTH } from '../emojis.js';

// Accepts both new tokens (22 chars base64url) and v3 tokens (XXXXXXXX-XXXXXXXX-XXXXXXXX).
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

// Control characters other than tabs and line breaks (Postgres also rejects NUL bytes).
// eslint-disable-next-line no-control-regex -- matching control characters is the point.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// 128 bits of entropy: links can't be guessed or enumerated.
const generateToken = () => randomBytes(16).toString('base64url');

function validateNote(body) {
  const { emoji, note } = body ?? {};
  if (!EMOJI_KEYS.includes(emoji)) {
    return { error: 'emoji must be one of: ' + EMOJI_KEYS.join(', ') };
  }
  if (typeof note !== 'string' || note.trim() === '') {
    return { error: 'note must be a non-empty string' };
  }
  if (CONTROL_CHARS.test(note)) {
    return { error: 'note contains invalid characters' };
  }
  if ([...note].length > NOTE_MAX_LENGTH) {
    return { error: `note must be at most ${NOTE_MAX_LENGTH} characters` };
  }
  return { value: { emoji, note: note.trim() } };
}

export function notesRouter({ Note, createLimiter }) {
  const router = express.Router();

  router.post('/', createLimiter, async (req, res) => {
    const { error, value } = validateNote(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    // The token is always generated server-side; any client-provided token is ignored.
    const created = await Note.create({ ...value, token: generateToken() });
    res.status(201).json({ token: created.token });
  });

  router.get('/:token', async (req, res) => {
    // Secret notes must never be stored by shared caches or the browser history cache.
    res.set('Cache-Control', 'no-store');
    if (!TOKEN_PATTERN.test(req.params.token)) {
      return res.status(400).json({ error: 'invalid token' });
    }
    const found = await Note.findOne({
      where: { token: req.params.token },
      attributes: ['emoji', 'note'],
    });
    if (!found) {
      return res.status(404).json({ error: 'note not found' });
    }
    res.json(found);
  });

  return router;
}
