import { createApp } from './app.js';
import { config } from './config.js';
import { createSequelize, defineNote, migrate } from './db.js';

const sequelize = createSequelize();
const Note = defineNote(sequelize);

await migrate(sequelize);

if (config.isProduction && config.trustProxy === 0) {
  console.warn(
    'TRUST_PROXY is 0: behind a reverse proxy, every client shares the same rate limit. Set TRUST_PROXY=1 on a PaaS.',
  );
}

const app = createApp({ Note, trustProxy: config.trustProxy });
const server = app.listen(config.port, () => {
  console.log(`Emojinotes API listening on http://localhost:${config.port} (${config.env})`);
});
server.on('error', (error) => {
  console.error(
    error.code === 'EADDRINUSE'
      ? `Port ${config.port} is already in use. Set another one with PORT=…`
      : error,
  );
  process.exit(1);
});

// Let in-flight requests finish when the platform stops the container.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  });
}
