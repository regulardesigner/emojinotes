import path from 'node:path';

import { DataTypes, Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { config } from './config.js';
import { migrations } from './migrations.js';

export function createSequelize(url = config.databaseUrl) {
  if (url) {
    return new Sequelize(url, {
      logging: false,
      dialectOptions:
        config.databaseSsl === 'false'
          ? {}
          : { ssl: { require: true, rejectUnauthorized: config.databaseSsl === 'true' } },
    });
  }
  if (config.isProduction) {
    throw new Error('DATABASE_URL must be set in production');
  }
  return new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(import.meta.dirname, '../emojinotes.dev.sqlite'),
    logging: false,
  });
}

export function defineNote(sequelize) {
  // Table name kept from v3 so existing production data stays readable.
  return sequelize.define(
    'Note',
    {
      emoji: { type: DataTypes.STRING, allowNull: false },
      note: { type: DataTypes.STRING, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { tableName: 'Emojinotes' },
  );
}

export async function migrate(sequelize, { logger = console } = {}) {
  const umzug = new Umzug({
    migrations,
    context: sequelize.getQueryInterface(),
    // Same storage table as sequelize-cli, so databases migrated by v3 are recognised.
    storage: new SequelizeStorage({ sequelize }),
    logger,
  });
  await umzug.up();
}
