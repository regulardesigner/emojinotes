import { DataTypes } from 'sequelize';

// Names match the files sequelize-cli recorded in v3.
export const migrations = [
  {
    name: '20191209214437-create-emojinotes.js',
    up: ({ context: queryInterface }) =>
      queryInterface.createTable('Emojinotes', {
        id: { allowNull: false, autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
        emoji: { type: DataTypes.STRING },
        note: { type: DataTypes.STRING },
        token: { type: DataTypes.STRING },
        createdAt: { allowNull: false, type: DataTypes.DATE },
        updatedAt: { allowNull: false, type: DataTypes.DATE },
      }),
    down: ({ context: queryInterface }) => queryInterface.dropTable('Emojinotes'),
  },
  {
    name: '20260929000000-unique-token.js',
    up: async ({ context: queryInterface }) => {
      // v3 let clients choose their token, so duplicates may exist. Only the oldest note of
      // each token was ever reachable: keep it, and rename the others so the index can be built.
      const [duplicates] = await queryInterface.sequelize.query(
        `SELECT id, token FROM "Emojinotes"
         WHERE token IN (SELECT token FROM "Emojinotes" GROUP BY token HAVING COUNT(*) > 1)
         ORDER BY id`,
      );
      const seen = new Set();
      for (const { id, token } of duplicates) {
        if (seen.has(token)) {
          await queryInterface.bulkUpdate('Emojinotes', { token: `${token}~dup${id}` }, { id });
        }
        seen.add(token);
      }
      await queryInterface.addIndex('Emojinotes', ['token'], {
        unique: true,
        name: 'emojinotes_token_unique',
      });
    },
    down: ({ context: queryInterface }) =>
      queryInterface.removeIndex('Emojinotes', 'emojinotes_token_unique'),
  },
];
