const env = process.env.NODE_ENV ?? 'development';

function parseTrustProxy(value = '0') {
  const hops = Number(value);
  if (!Number.isInteger(hops) || hops < 0) {
    throw new Error(`TRUST_PROXY must be a number of proxies (0, 1, 2…), got "${value}"`);
  }
  return hops;
}

function parseDatabaseSsl(value = 'false') {
  if (!['true', 'false', 'no-verify'].includes(value)) {
    throw new Error(`DATABASE_SSL must be true, false or no-verify, got "${value}"`);
  }
  return value;
}

export const config = {
  env,
  isProduction: env === 'production',
  // Not 5000: macOS uses it for AirPlay Receiver.
  port: Number(process.env.PORT ?? 3000),
  // Postgres in production. Falls back to a local SQLite file in development
  // so the project runs with zero setup.
  databaseUrl: process.env.DATABASE_URL,
  // "no-verify" encrypts without checking the certificate, for providers with self-signed certs.
  databaseSsl: parseDatabaseSsl(process.env.DATABASE_SSL),
  // Number of reverse proxies in front of the app (1 on most PaaS), needed so
  // rate limiting sees the real client IP.
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
};
