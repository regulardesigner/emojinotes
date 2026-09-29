import assert from 'node:assert/strict';
import { after, it } from 'node:test';

import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { defineNote, migrate } from '../src/db.js';
import { migrations } from '../src/migrations.js';

const sequelize = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
after(() => sequelize.close());

it('deduplicates v3 tokens before adding the unique index', async () => {
  // Bring the database to its v3 state.
  const queryInterface = sequelize.getQueryInterface();
  await new Umzug({
    migrations,
    context: queryInterface,
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  }).up({ to: '20191209214437-create-emojinotes.js' });

  const now = new Date();
  await queryInterface.bulkInsert('Emojinotes', [
    { emoji: 'love letter', note: 'first', token: 'SAME-TOKEN-1', createdAt: now, updatedAt: now },
    { emoji: 'love letter', note: 'second', token: 'SAME-TOKEN-1', createdAt: now, updatedAt: now },
    { emoji: 'heart eyes', note: 'other', token: 'OTHER-TOKEN', createdAt: now, updatedAt: now },
  ]);

  await migrate(sequelize, { logger: undefined });

  const Note = defineNote(sequelize);
  const kept = await Note.findOne({ where: { token: 'SAME-TOKEN-1' } });
  assert.equal(kept.note, 'first');
  assert.equal(await Note.count({ where: { token: 'OTHER-TOKEN' } }), 1);
  await assert.rejects(Note.create({ emoji: 'love letter', note: 'x', token: 'OTHER-TOKEN' }));
});
